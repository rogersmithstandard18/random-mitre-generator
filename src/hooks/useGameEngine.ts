/* ═══════════════════════════════════════════════════════════
   GAME ENGINE — useReducer-based 3-round campaign logic
   Ported from CyberSecurityGame: game_logic.py + system_manager.py
═══════════════════════════════════════════════════════════ */

import { useReducer, useCallback, useMemo } from 'react';
import type {
  GameState, GameAction, GamePhase, ThreatType, ToolId,
  ActiveThreat, RootCauseOption, LogEntry, RoundResult, GameScore, Grade,
} from '@/types/GameState';
import type { CaseFileScenario } from '@/types/CaseFile';
import {
  SYSTEM_HP_MAX, SP_PER_TURN, GUESS_DAMAGE, TOOL_BASE_DAMAGE,
  CAUSES_SHOWN, EVIDENCE_SP_COST, TOTAL_ROUNDS,
  TOOLS_DEF, ALL_TOOL_IDS, CORRECT_TOOL, TOOL_MISMATCH_LESSONS, PARTIAL_LESSON,
  CAUSE_POOLS, THREAT_TYPES, EVIDENCE_HINTS, ROUND_WEIGHTS,
  CORRECT_CAUSE_WEIGHTS, toolSpCost, weightedRoll, shuffle,
  mapTechniqueToThreatType,
} from '@/constants/gameData';

/* ── Serializable state (Sets → arrays) ── */
interface SerializableGameState extends Omit<GameState, 'unlockedTools' | 'startingTools'> {
  unlockedTools: ToolId[];
  startingTools: ToolId[];
}

function toSets(s: SerializableGameState): GameState {
  return { ...s, unlockedTools: new Set(s.unlockedTools), startingTools: new Set(s.startingTools) };
}

/* ── Helpers ── */

function buildInitialTools(): Record<ToolId, typeof TOOLS_DEF[ToolId] & { currentCooldown: number }> {
  const tools: any = {};
  for (const id of ALL_TOOL_IDS) {
    tools[id] = { ...TOOLS_DEF[id], currentCooldown: 0 };
  }
  return tools;
}

function pickTier(round: number): 1 | 2 | 3 {
  const weights = ROUND_WEIGHTS[Math.min(round - 1, 2)];
  return weightedRoll(weights) as 1 | 2 | 3;
}

function generateRootCauses(threatType: ThreatType): RootCauseOption[] {
  const numCorrect = weightedRoll(CORRECT_CAUSE_WEIGHTS);
  const numFake = CAUSES_SHOWN - numCorrect;
  const pool = CAUSE_POOLS[threatType];
  const reals = shuffle(pool.real).slice(0, numCorrect);
  const fakes = shuffle(pool.fake).slice(0, numFake);
  const options: RootCauseOption[] = [
    ...reals.map(text => ({ text, isReal: true, selected: false, correct: null })),
    ...fakes.map(text => ({ text, isReal: false, selected: false, correct: null })),
  ];
  return shuffle(options);
}

function buildThreat(
  scenario: { scenarioId: string; scenarioTitle: string; threatType: ThreatType; tier: 1 | 2 | 3 },
): ActiveThreat {
  const def = THREAT_TYPES[scenario.threatType];
  const tierDef = def.tiers[scenario.tier];
  return {
    type: scenario.threatType,
    tier: scenario.tier,
    hp: tierDef.hp,
    maxHp: tierDef.hp,
    attackDamage: tierDef.attackDamage,
    label: tierDef.label,
    intro: def.introByTier[scenario.tier],
    scenarioTitle: scenario.scenarioTitle,
    scenarioId: scenario.scenarioId,
  };
}

function addLog(state: SerializableGameState, text: string, type: LogEntry['type']): LogEntry[] {
  return [...state.log, { text, type, turn: state.turn }];
}

function getEffectiveness(state: SerializableGameState, toolId: ToolId, threatType: ThreatType): number {
  const tool = TOOLS_DEF[toolId];
  const pair = tool.effectiveness[threatType];
  return state.unlockedTools.includes(toolId) ? pair[1] : pair[0];
}

function calcGrade(defeated: number): Grade {
  if (defeated >= 3) return 'OUTSTANDING';
  if (defeated >= 2) return 'GOOD';
  if (defeated >= 1) return 'PARTIAL';
  return 'COMPROMISED';
}

function buildGameOverScore(state: SerializableGameState): GameScore {
  const defeated = state.roundResults.filter(r => r.defeated).length;
  return {
    threatsDefeated: defeated,
    hpRemaining: state.systemHp,
    totalTurns: state.roundResults.reduce((sum, r) => sum + r.turnsUsed, 0) + state.roundTurnCount,
    grade: calcGrade(defeated),
    roundResults: state.roundResults,
  };
}

function getLockedTools(state: SerializableGameState): ToolId[] {
  const available = new Set([...state.startingTools, ...state.unlockedTools]);
  return ALL_TOOL_IDS.filter(id => !available.has(id));
}

/* ── Build campaign scenarios from filtered pool ── */
function buildCampaign(scenarios: CaseFileScenario[]): { scenarioId: string; scenarioTitle: string; threatType: ThreatType; tier: 1 | 2 | 3 }[] {
  const pool = shuffle(scenarios);
  const campaign: { scenarioId: string; scenarioTitle: string; threatType: ThreatType; tier: 1 | 2 | 3 }[] = [];

  for (let round = 1; round <= TOTAL_ROUNDS; round++) {
    const idx = (round - 1) % pool.length;
    const s = pool[idx];
    const threatType = (s as any).threat_type ?? mapTechniqueToThreatType(
      (s.subtitle?.split(' · ')[0] as any) ?? 'Initial Access'
    );
    const tier = pickTier(round);
    campaign.push({ scenarioId: s.id, scenarioTitle: s.title, threatType, tier });
  }

  return campaign;
}

/* ── Initial state ── */
function createInitialState(scenarios: CaseFileScenario[]): SerializableGameState {
  const campaign = buildCampaign(scenarios);
  return {
    phase: 'loadout',
    round: 1,
    turn: 0,
    systemHp: SYSTEM_HP_MAX,
    maxHp: SYSTEM_HP_MAX,
    sp: SP_PER_TURN,
    maxSp: SP_PER_TURN,
    tools: buildInitialTools(),
    unlockedTools: [],
    startingTools: [],
    activeThreat: null,
    rootCauseOptions: [],
    evidenceHintsRevealed: [],
    log: [],
    roundResults: [],
    score: null,
    verdictChoice: '',
    verdictSummary: '',
    verdictSeverity: '',
    toolPickOptions: [],
    campaignScenarios: campaign,
    roundTurnCount: 0,
  };
}

/* ── Reducer ── */
function gameReducer(state: SerializableGameState, action: GameAction): SerializableGameState {
  switch (action.type) {
    case 'SELECT_LOADOUT': {
      if (action.toolIds.length !== 2) return state;
      return {
        ...state,
        startingTools: [...action.toolIds],
        log: addLog(state, `Loadout: ${action.toolIds.map(id => TOOLS_DEF[id].name).join(' + ')}`, 'system'),
      };
    }

    case 'START_ROUND': {
      const scenario = state.campaignScenarios[state.round - 1];
      if (!scenario) return state;
      const threat = buildThreat(scenario);
      const causes = generateRootCauses(scenario.threatType);
      return {
        ...state,
        phase: 'encounter',
        activeThreat: threat,
        rootCauseOptions: causes,
        evidenceHintsRevealed: [],
        turn: 1,
        sp: SP_PER_TURN,
        roundTurnCount: 0,
        verdictChoice: '',
        verdictSummary: '',
        verdictSeverity: '',
        log: addLog(state, `── ROUND ${state.round} ── ${threat.scenarioTitle}`, 'system'),
      };
    }

    case 'GUESS_ROOT_CAUSE': {
      if (!state.activeThreat || state.phase !== 'playing') return state;
      const opt = state.rootCauseOptions[action.index];
      if (!opt || opt.selected) return state;

      const newOptions = state.rootCauseOptions.map((o, i) =>
        i === action.index ? { ...o, selected: true, correct: o.isReal } : o
      );

      let log = state.log;
      let hp = state.systemHp;
      let threatHp = state.activeThreat.hp;

      if (opt.isReal) {
        threatHp = Math.max(0, threatHp - GUESS_DAMAGE);
        log = [...log, { text: `Correct! "${opt.text}" — Threat takes ${GUESS_DAMAGE} damage.`, type: 'success' as const, turn: state.turn }];
      } else {
        const dmg = state.activeThreat.attackDamage;
        hp = Math.max(0, hp - dmg);
        log = [...log, { text: `Wrong! "${opt.text}" is a red herring. System takes ${dmg} damage.`, type: 'danger' as const, turn: state.turn }];
      }

      // Check victory/defeat
      let phase: GamePhase = state.phase;
      if (threatHp <= 0) {
        log = [...log, { text: `Threat neutralized! File your verdict.`, type: 'success' as const, turn: state.turn }];
        phase = 'verdict';
      } else if (hp <= 0) {
        log = [...log, { text: `SYSTEM COMPROMISED — integrity at 0%.`, type: 'danger' as const, turn: state.turn }];
        phase = 'gameover';
      }

      // End turn — regen SP, tick cooldowns, new causes
      const newTools = { ...state.tools };
      for (const id of ALL_TOOL_IDS) {
        if (newTools[id].currentCooldown > 0) {
          newTools[id] = { ...newTools[id], currentCooldown: newTools[id].currentCooldown - 1 };
        }
      }

      const nextTurn = phase === 'playing' ? state.turn + 1 : state.turn;
      const nextCauses = phase === 'playing'
        ? generateRootCauses(state.activeThreat.type)
        : newOptions;

      const updatedState = {
        ...state,
        phase,
        systemHp: hp,
        activeThreat: { ...state.activeThreat, hp: threatHp },
        rootCauseOptions: phase === 'playing' ? nextCauses : newOptions,
        log,
        turn: nextTurn,
        sp: phase === 'playing' ? SP_PER_TURN : state.sp,
        tools: newTools,
        roundTurnCount: state.roundTurnCount + 1,
      };
      if (phase === 'gameover') updatedState.score = buildGameOverScore(updatedState);
      return updatedState;
    }

    case 'DEPLOY_TOOL': {
      if (!state.activeThreat || state.phase !== 'playing') return state;
      const tool = state.tools[action.toolId];
      if (!tool) return state;

      // Check availability
      const available = new Set([...state.startingTools, ...state.unlockedTools]);
      if (!available.has(action.toolId)) {
        return { ...state, log: addLog(state, `${tool.name} is locked. Defeat a threat to unlock new tools.`, 'warn') };
      }
      if (tool.currentCooldown > 0) {
        return { ...state, log: addLog(state, `${tool.name} is on cooldown (${tool.currentCooldown} turns remaining).`, 'warn') };
      }

      const eff = getEffectiveness(state, action.toolId, state.activeThreat.type);
      const cost = toolSpCost(eff);
      if (state.sp < cost) {
        return { ...state, log: addLog(state, `Not enough SP (need ${cost}, have ${state.sp}).`, 'warn') };
      }

      // Apply tool
      const damage = Math.round(TOOL_BASE_DAMAGE * eff);
      let hp = state.systemHp;
      let threatHp = Math.max(0, state.activeThreat.hp - damage);
      let log = state.log;

      log = [...log, { text: `Deployed ${tool.name} — ${Math.round(eff * 100)}% effective, dealing ${damage} damage.`, type: eff >= 0.8 ? 'success' as const : eff > 0 ? 'info' as const : 'warn' as const, turn: state.turn }];

      // Counter-attack for suboptimal tools
      if (eff < 0.8) {
        const counterDmg = Math.round(state.activeThreat.attackDamage * (1 - eff) * state.activeThreat.tier);
        hp = Math.max(0, hp - counterDmg);
        log = [...log, { text: `Counter-attack! System takes ${counterDmg} damage.`, type: 'danger' as const, turn: state.turn }];

        // Add lesson
        const lessonKey = `${action.toolId}:${state.activeThreat.type}`;
        const lesson = TOOL_MISMATCH_LESSONS[lessonKey] || (eff > 0 ? PARTIAL_LESSON : '');
        if (lesson) {
          log = [...log, { text: lesson, type: 'info' as const, turn: state.turn }];
        }
      }

      // Update tool cooldown
      const newTools = { ...state.tools };
      newTools[action.toolId] = { ...tool, currentCooldown: tool.baseCooldown };

      // Tick all cooldowns (other tools)
      for (const id of ALL_TOOL_IDS) {
        if (id !== action.toolId && newTools[id].currentCooldown > 0) {
          newTools[id] = { ...newTools[id], currentCooldown: newTools[id].currentCooldown - 1 };
        }
      }

      // Check victory/defeat
      let phase: GamePhase = state.phase;
      if (threatHp <= 0) {
        log = [...log, { text: `Threat neutralized! File your verdict.`, type: 'success' as const, turn: state.turn }];
        phase = 'verdict';
      } else if (hp <= 0) {
        log = [...log, { text: `SYSTEM COMPROMISED — integrity at 0%.`, type: 'danger' as const, turn: state.turn }];
        phase = 'gameover';
      }

      const nextTurn = phase === 'playing' ? state.turn + 1 : state.turn;

      const deployResult = {
        ...state,
        phase,
        systemHp: hp,
        sp: phase === 'playing' ? SP_PER_TURN : state.sp - cost,
        activeThreat: { ...state.activeThreat, hp: threatHp },
        tools: newTools,
        log,
        turn: nextTurn,
        rootCauseOptions: phase === 'playing' ? generateRootCauses(state.activeThreat.type) : state.rootCauseOptions,
        roundTurnCount: state.roundTurnCount + 1,
      };
      if (phase === 'gameover') deployResult.score = buildGameOverScore(deployResult);
      return deployResult;
    }

    case 'INVESTIGATE_EVIDENCE': {
      if (!state.activeThreat || state.phase !== 'playing') return state;
      if (state.sp < EVIDENCE_SP_COST) {
        return { ...state, log: addLog(state, `Not enough SP to investigate (need ${EVIDENCE_SP_COST}).`, 'warn') };
      }

      const hints = EVIDENCE_HINTS[state.activeThreat.type];
      const revealed = state.evidenceHintsRevealed;
      const available = hints.filter(h => !revealed.includes(h));
      if (available.length === 0) {
        return { ...state, log: addLog(state, `All evidence for this threat has been reviewed.`, 'info') };
      }

      const hint = available[Math.floor(Math.random() * available.length)];
      return {
        ...state,
        sp: state.sp - EVIDENCE_SP_COST,
        evidenceHintsRevealed: [...revealed, hint],
        log: addLog(state, `Evidence: ${hint}`, 'info'),
      };
    }

    case 'SET_VERDICT':
      return { ...state, verdictChoice: action.verdict };

    case 'SET_VERDICT_SUMMARY':
      return { ...state, verdictSummary: action.summary };

    case 'SET_VERDICT_SEVERITY':
      return { ...state, verdictSeverity: action.severity };

    case 'SUBMIT_VERDICT': {
      if (!state.activeThreat || !state.verdictChoice) return state;

      const expected = 'likely_real'; // All MITRE technique scenarios are real threats
      const correct = state.verdictChoice === expected;
      const result: RoundResult = {
        round: state.round,
        threatType: state.activeThreat.type,
        threatLabel: `${THREAT_TYPES[state.activeThreat.type].name} — ${state.activeThreat.label}`,
        tier: state.activeThreat.tier,
        defeated: true,
        verdict: state.verdictChoice,
        verdictCorrect: correct,
        turnsUsed: state.roundTurnCount,
      };

      const newResults = [...state.roundResults, result];

      // If last round or game over, go to debrief
      if (state.round >= TOTAL_ROUNDS) {
        const defeated = newResults.filter(r => r.defeated).length;
        const score: GameScore = {
          threatsDefeated: defeated,
          hpRemaining: state.systemHp,
          totalTurns: newResults.reduce((sum, r) => sum + r.turnsUsed, 0),
          grade: calcGrade(defeated),
          roundResults: newResults,
        };
        return {
          ...state,
          phase: 'debrief',
          roundResults: newResults,
          score,
          log: addLog(state, `Campaign complete! Grade: ${score.grade}`, 'system'),
        };
      }

      // Show tool unlock picker
      const locked = getLockedTools(state);
      return {
        ...state,
        phase: 'roundEnd',
        roundResults: newResults,
        toolPickOptions: locked,
        log: addLog(state, `Round ${state.round} complete! Pick a tool to unlock.`, 'success'),
      };
    }

    case 'PICK_TOOL_UNLOCK': {
      const locked = getLockedTools(state);
      if (!locked.includes(action.toolId)) return state;
      return {
        ...state,
        unlockedTools: [...state.unlockedTools, action.toolId],
        log: addLog(state, `Unlocked: ${TOOLS_DEF[action.toolId].name}!`, 'success'),
      };
    }

    case 'NEXT_ROUND': {
      const nextRound = state.round + 1;
      const scenario = state.campaignScenarios[nextRound - 1];
      if (!scenario) return state;
      const threat = buildThreat(scenario);
      const causes = generateRootCauses(scenario.threatType);
      return {
        ...state,
        round: nextRound,
        phase: 'encounter' as GamePhase,
        activeThreat: threat,
        rootCauseOptions: causes,
        evidenceHintsRevealed: [],
        turn: 0,
        roundTurnCount: 0,
        verdictChoice: '',
        verdictSummary: '',
        verdictSeverity: '',
        log: addLog(state, `── ROUND ${nextRound} ── ${threat.scenarioTitle}`, 'system'),
      };
    }

    case 'BEGIN_PLAYING': {
      if (state.phase !== 'encounter') return state;
      return {
        ...state,
        phase: 'playing' as GamePhase,
        sp: SP_PER_TURN,
        log: addLog(state, 'Engagement started. Analyse the threat and respond.', 'system'),
      };
    }

    case 'END_TURN': {
      return state;
    }

    default:
      return state;
  }
}

/* ── Hook ── */
export function useGameEngine(scenarios: CaseFileScenario[]) {
  const initialState = useMemo(() => createInitialState(scenarios), [scenarios]);
  const [rawState, dispatch] = useReducer(gameReducer, initialState);

  // Convert arrays back to Sets for consumer convenience
  const state = useMemo(() => toSets(rawState), [rawState]);

  const selectLoadout = useCallback((toolIds: ToolId[]) => {
    dispatch({ type: 'SELECT_LOADOUT', toolIds });
  }, []);

  const startRound = useCallback(() => {
    dispatch({ type: 'START_ROUND' });
  }, []);

  const beginPlaying = useCallback(() => {
    // Transition from encounter to playing phase
    dispatch({ type: 'START_ROUND' });
  }, []);

  const guessRootCause = useCallback((index: number) => {
    dispatch({ type: 'GUESS_ROOT_CAUSE', index });
  }, []);

  const deployTool = useCallback((toolId: ToolId) => {
    dispatch({ type: 'DEPLOY_TOOL', toolId });
  }, []);

  const investigateEvidence = useCallback(() => {
    dispatch({ type: 'INVESTIGATE_EVIDENCE', index: 0 });
  }, []);

  const setVerdict = useCallback((verdict: 'likely_real' | 'likely_noise' | 'unsure') => {
    dispatch({ type: 'SET_VERDICT', verdict });
  }, []);

  const setVerdictSummary = useCallback((summary: string) => {
    dispatch({ type: 'SET_VERDICT_SUMMARY', summary });
  }, []);

  const setVerdictSeverity = useCallback((severity: 'low' | 'medium' | 'high') => {
    dispatch({ type: 'SET_VERDICT_SEVERITY', severity });
  }, []);

  const submitVerdict = useCallback(() => {
    dispatch({ type: 'SUBMIT_VERDICT' });
  }, []);

  const pickToolUnlock = useCallback((toolId: ToolId) => {
    dispatch({ type: 'PICK_TOOL_UNLOCK', toolId });
  }, []);

  const nextRound = useCallback(() => {
    dispatch({ type: 'NEXT_ROUND' });
  }, []);

  return {
    state,
    dispatch,
    actions: {
      selectLoadout, startRound, beginPlaying,
      guessRootCause, deployTool, investigateEvidence,
      setVerdict, setVerdictSummary, setVerdictSeverity,
      submitVerdict, pickToolUnlock, nextRound,
    },
  };
}

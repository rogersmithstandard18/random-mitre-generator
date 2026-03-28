/* ═══════════════════════════════════════════════════════════
   GAME STATE TYPES
   Ported from CyberSecurityGame Python data model
═══════════════════════════════════════════════════════════ */

export type GamePhase =
  | 'loadout'
  | 'encounter'
  | 'playing'
  | 'verdict'
  | 'roundEnd'
  | 'debrief'
  | 'gameover';

export type ThreatType = 'phishing' | 'ransomware' | 'apt';

export type ToolId =
  | 'firewall'
  | 'antivirus'
  | 'ids'
  | 'encryption'
  | 'patch_manager'
  | 'honeypot';

export interface GameTool {
  id: ToolId;
  name: string;
  description: string;
  baseCooldown: number;
  currentCooldown: number;
  /** [startingEffectiveness, unlockedEffectiveness] per threat type */
  effectiveness: Record<ThreatType, [number, number]>;
}

export interface ThreatTier {
  hp: number;
  attackDamage: number;
  label: string;
}

export interface ThreatDef {
  name: string;
  tiers: Record<1 | 2 | 3, ThreatTier>;
  introByTier: Record<1 | 2 | 3, string>;
  debrief: string[];
}

export interface ActiveThreat {
  type: ThreatType;
  tier: 1 | 2 | 3;
  hp: number;
  maxHp: number;
  attackDamage: number;
  label: string;
  intro: string;
  scenarioTitle: string;
  scenarioId: string;
}

export interface RootCauseOption {
  text: string;
  isReal: boolean;
  selected: boolean;
  correct: boolean | null;
}

export type LogType = 'success' | 'danger' | 'warn' | 'info' | 'system';

export interface LogEntry {
  text: string;
  type: LogType;
  turn: number;
}

export interface RoundResult {
  round: number;
  threatType: ThreatType;
  threatLabel: string;
  tier: 1 | 2 | 3;
  defeated: boolean;
  verdict: 'likely_real' | 'likely_noise' | 'unsure' | '';
  verdictCorrect: boolean | null;
  turnsUsed: number;
}

export type Grade = 'OUTSTANDING' | 'GOOD' | 'PARTIAL' | 'COMPROMISED';

export interface GameScore {
  threatsDefeated: number;
  hpRemaining: number;
  totalTurns: number;
  grade: Grade;
  roundResults: RoundResult[];
}

export interface GameState {
  phase: GamePhase;
  round: number;          // 1-3
  turn: number;
  systemHp: number;
  maxHp: number;
  sp: number;
  maxSp: number;
  tools: Record<ToolId, GameTool>;
  unlockedTools: Set<ToolId>;
  startingTools: Set<ToolId>;
  activeThreat: ActiveThreat | null;
  rootCauseOptions: RootCauseOption[];
  evidenceHintsRevealed: string[];
  log: LogEntry[];
  roundResults: RoundResult[];
  score: GameScore | null;
  // Simplified ticket fields for verdict phase
  verdictChoice: 'likely_real' | 'likely_noise' | 'unsure' | '';
  verdictSummary: string;
  verdictSeverity: 'low' | 'medium' | 'high' | '';
  // Round-end tool pick
  toolPickOptions: ToolId[];
  // Scenarios queued for this campaign
  campaignScenarios: { scenarioId: string; scenarioTitle: string; threatType: ThreatType; tier: 1 | 2 | 3 }[];
  // Track current round's turn count
  roundTurnCount: number;
}

/* ── Action types ── */

export type GameAction =
  | { type: 'SELECT_LOADOUT'; toolIds: ToolId[] }
  | { type: 'START_ROUND' }
  | { type: 'GUESS_ROOT_CAUSE'; index: number }
  | { type: 'DEPLOY_TOOL'; toolId: ToolId }
  | { type: 'INVESTIGATE_EVIDENCE'; index: number }
  | { type: 'SET_VERDICT'; verdict: 'likely_real' | 'likely_noise' | 'unsure' }
  | { type: 'SET_VERDICT_SUMMARY'; summary: string }
  | { type: 'SET_VERDICT_SEVERITY'; severity: 'low' | 'medium' | 'high' }
  | { type: 'SUBMIT_VERDICT' }
  | { type: 'PICK_TOOL_UNLOCK'; toolId: ToolId }
  | { type: 'NEXT_ROUND' }
  | { type: 'END_TURN' }
  | { type: 'BEGIN_PLAYING' };

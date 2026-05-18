import inlineTechniques from './techniques';
import type { CaseFileScenario } from '@/types/CaseFile';
import type { Difficulty, LearningPath, MitreTactic, TranslationCard } from '@/types/TranslationCard';
import { mapTechniqueToThreatType } from './gameData';

// Metadata used for filtering — keyed by case file id (e.g. "cf-T1566")
export interface CaseFileFilterMeta {
  difficulty: Difficulty;
  tactic: MitreTactic;
  learningPaths: LearningPath[];
}

function difficultyToLevel(d: Difficulty): 1 | 2 | 3 {
  if (d === 'Beginner') return 1;
  if (d === 'Intermediate') return 2;
  return 3;
}

export function buildCaseFiles(techniques: TranslationCard[]): {
  scenarios: CaseFileScenario[];
  filterMeta: Record<string, CaseFileFilterMeta>;
} {
  const filterMeta: Record<string, CaseFileFilterMeta> = {};
  const scenarios = techniques.map((t, idx) => {
    const id = `cf-${t.techniqueId}`;
    filterMeta[id] = {
      difficulty: t.difficulty,
      tactic: t.tactic,
      learningPaths: t.learningPaths,
    };
    return {
      id,
      onetsoc_code: '15-1212.00',
      scenario_number: idx + 1,
      level: difficultyToLevel(t.difficulty),
      level_label: t.difficulty,
      title: t.techniqueName,
      subtitle: `${t.tactic} · ${t.tacticId}`,
      scenario_text: t.spotTheRisk,
      real_or_noise_default: 'likely_real' as const,
      mission_steps: t.detectionHints,
      scope_options: [
        `Review MITRE tactic: ${t.tactic}`,
        `Technique reference: ${t.techniqueId} — ${t.techniqueName}`,
        `Risk category: ${t.riskCategory}`,
      ],
      evidence_locker: t.industryImpacts.map(i => ({
        item: i.industry,
        category: 'context' as const,
        content: i.description,
      })),
      decision_options: t.mitigations.map(m => ({
        action: m,
        condition: `IF ${t.tactic} activity confirmed`,
      })),
      escalation_options: t.mitigations,
      learning_bridge: {
        beginner_rules: [t.plainExplanation, t.riskDescription],
        close_loop_questions: [t.reflectionQuestion],
      },
      pause_prompt: t.reflectionQuestion,
      is_active: true,
      is_pro_only: false,
      threat_type: mapTechniqueToThreatType(t.tactic),
    } as CaseFileScenario;
  });
  return { scenarios, filterMeta };
}

const { scenarios: localCaseFileScenarios, filterMeta } = buildCaseFiles(inlineTechniques);
export const caseFileFilterMeta: Record<string, CaseFileFilterMeta> = filterMeta;
export default localCaseFileScenarios;

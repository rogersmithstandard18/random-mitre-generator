export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type LearningPath = 'Blue Team' | 'Red Team' | 'Purple Team' | 'GRC Focus';
export type RiskCategory =
  | 'Direct Financial Loss'
  | 'Regulatory Action'
  | 'Legal Liability'
  | 'Audit Failure'
  | 'Loss of Confidence'
  | 'Market Misconduct'
  | 'Business Interruption';

export type MitreTactic =
  | 'Reconnaissance'
  | 'Resource Development'
  | 'Initial Access'
  | 'Execution'
  | 'Persistence'
  | 'Privilege Escalation'
  | 'Defense Evasion'
  | 'Credential Access'
  | 'Discovery'
  | 'Lateral Movement'
  | 'Collection'
  | 'Command and Control'
  | 'Exfiltration'
  | 'Impact';

export interface IndustryImpact {
  industry: string;
  description: string;
}

export interface TranslationCard {
  techniqueId: string;
  techniqueName: string;
  tactic: MitreTactic;
  tacticId: string;
  difficulty: Difficulty;
  learningPaths: LearningPath[];
  plainExplanation: string;
  riskCategory: RiskCategory;
  riskDescription: string;
  boardroomPitch: string;
  industryImpacts: IndustryImpact[];
  detectionHints: string[];
  mitigations: string[];
  reflectionQuestion: string;
  spotTheRisk: string;
}

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
  // Technical Term
  techniqueId: string;
  techniqueName: string;
  tactic: MitreTactic;
  tacticId: string;
  difficulty: Difficulty;
  learningPaths: LearningPath[];

  // Plain Technical Explanation
  plainExplanation: string;

  // Corporate Risk Translation
  riskCategory: RiskCategory;
  riskDescription: string;

  // Boardroom Pitch
  boardroomPitch: string;

  // Industry Impact Mapping
  industryImpacts: IndustryImpact[];

  // Detection & Mitigation (Advanced)
  detectionHints: string[];
  mitigations: string[];

  // Micro-assessment (optional)
  reflectionQuestion: string;
  spotTheRisk: string;
}

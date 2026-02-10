import type { Difficulty, LearningPath } from './TranslationCard';

export interface ScenarioProtagonist {
  name: string;
  role: string;
  experience: string;
}

export interface ScenarioSituation {
  time: string;
  shift: string;
  alert_type: string;
  severity: string;
  description: string;
}

export interface MitreTechnique {
  id: string;
  name: string;
  description: string;
}

export interface ScenarioMitreAttack {
  tactics: string[];
  techniques: MitreTechnique[];
}

export interface ScenarioChoice {
  id: string;
  text: string;
  score: number;
  max_score: number;
  outcome_type: 'excellent' | 'good' | 'mixed' | 'poor' | 'critical_failure';
  outcome: string;
  lessons: string[];
  consequences: string;
}

export interface ScenarioFactCheck {
  fiction: string;
  reality: string;
}

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  difficulty: Difficulty;
  learning_paths: LearningPath[];
  estimated_time: string;
  protagonist: ScenarioProtagonist;
  situation: ScenarioSituation;
  mitre_attack: ScenarioMitreAttack;
  security_plus_objectives: string[];
  owasp_mapping: string[];
  key_concepts: string[];
  choices: ScenarioChoice[];
  fact_check: ScenarioFactCheck;
}

export interface ScenarioProgress {
  scenarioId: string;
  choiceId: string;
  score: number;
  maxScore: number;
  outcomeType: string;
  completedAt: string;
}

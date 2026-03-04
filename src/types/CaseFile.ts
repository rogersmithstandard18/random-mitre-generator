export interface EvidenceItem {
  item: string;
  category: string;
  content?: string;
}

export interface DecisionOption {
  action: string;
  condition: string;
}

export interface EvidencePattern {
  pattern: string;
  response: string;
}

export interface InvestigationStep {
  check: string;
  where: string;
  confirm: string;
}

export interface InvestigationLadderStep {
  step: number;
  label: string;
  description: string;
}

export interface LearningBridge {
  beginner_rules?: string[];
  evidence_patterns?: EvidencePattern[];
  investigation_map?: InvestigationStep[];
  close_loop_questions?: string[];
  investigation_ladder?: InvestigationLadderStep[];
}

export interface CaseFileScenario {
  id: string;
  onetsoc_code: string;
  scenario_number: number;
  level: number;
  level_label: string;
  title: string;
  subtitle: string | null;
  scenario_text: string;
  real_or_noise_default: 'likely_real' | 'likely_noise' | 'unsure' | null;
  mission_steps: string[];
  scope_options: string[];
  evidence_locker: EvidenceItem[];
  decision_options: DecisionOption[];
  escalation_options: string[];
  learning_bridge: LearningBridge | null;
  pause_prompt: string | null;
  is_active: boolean;
  is_pro_only: boolean;
}

export interface TicketDraft {
  alert_summary: string;
  evidence_collected: string;
  scope_notes: string;
  actions_taken: string;
  containment_decision: string;
  escalation_notes: string;
  open_questions: string;
  severity: 'low' | 'medium' | 'high' | '';
  confidence: 'low' | 'medium' | 'high' | '';
  real_or_noise: 'likely_real' | 'likely_noise' | 'unsure' | '';
  escalated: boolean;
}

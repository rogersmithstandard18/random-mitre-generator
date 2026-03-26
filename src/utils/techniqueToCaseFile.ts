import type { TranslationCard } from '@/types/TranslationCard';
import type { CaseFileScenario } from '@/types/CaseFile';

const DIFFICULTY_LEVEL: Record<string, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

const TACTIC_CATEGORY: Record<string, string> = {
  'Initial Access': 'network',
  'Credential Access': 'identity',
  'Execution': 'endpoint',
  'Exfiltration': 'network',
  'Persistence': 'endpoint',
  'Defense Evasion': 'forensics',
  'Command and Control': 'network',
  'Impact': 'context',
  'Lateral Movement': 'network',
  'Collection': 'endpoint',
  'Discovery': 'network',
  'Privilege Escalation': 'endpoint',
  'Reconnaissance': 'context',
  'Resource Development': 'context',
};

const TACTIC_SCOPE: Record<string, string[]> = {
  'Initial Access': ['Email system', 'Perimeter network', 'Affected endpoints', 'User accounts'],
  'Execution': ['Affected endpoints', 'Script execution logs', 'Process telemetry'],
  'Persistence': ['Affected endpoints', 'Registry / startup locations', 'Scheduled tasks'],
  'Privilege Escalation': ['Affected endpoints', 'Active Directory', 'Privileged accounts'],
  'Defense Evasion': ['Affected endpoints', 'Log storage', 'Security tooling'],
  'Credential Access': ['Identity provider', 'Affected endpoints', 'Active Directory'],
  'Discovery': ['Internal network', 'Affected endpoints', 'Directory services'],
  'Lateral Movement': ['Internal network', 'Remote access logs', 'Affected systems'],
  'Collection': ['Affected endpoints', 'Email system', 'Cloud storage'],
  'Exfiltration': ['Network egress', 'Cloud services', 'Affected endpoints'],
  'Command and Control': ['Network egress', 'DNS logs', 'Affected endpoints'],
  'Impact': ['Affected systems', 'Backup infrastructure', 'Business-critical services'],
  'Reconnaissance': ['Public-facing assets', 'External threat intelligence'],
  'Resource Development': ['Threat intelligence feeds', 'Dark web monitoring'],
};

const STANDARD_ESCALATION = [
  'Notify SOC Team Lead',
  'Escalate to Incident Response Team',
  'File formal incident report',
  'Engage vendor / legal counsel',
];

export function techniqueToCaseFile(
  technique: TranslationCard,
  index: number,
): CaseFileScenario {
  const level = DIFFICULTY_LEVEL[technique.difficulty] ?? 2;
  const evidenceCategory = TACTIC_CATEGORY[technique.tactic] ?? 'context';
  const scopeOptions = TACTIC_SCOPE[technique.tactic] ?? [
    'Affected endpoints',
    'User accounts',
    'Network traffic',
    'Cloud services',
  ];

  return {
    id: `local_${technique.techniqueId}`,
    onetsoc_code: '15-1212.00',
    scenario_number: index + 1,
    level,
    level_label: technique.difficulty,
    title: technique.techniqueName,
    subtitle: `${technique.tactic} · ${technique.techniqueId}`,
    scenario_text: technique.spotTheRisk,
    real_or_noise_default: 'likely_real',
    mission_steps: [
      'Confirm alert context — review timeframe and affected assets',
      `Examine evidence locker for indicators of ${technique.tactic}`,
      'Determine blast radius — how many systems or accounts are involved?',
      'Cross-reference detection hints against available telemetry',
      'Assess severity and set confidence level',
      'Document recommended actions and escalation decision',
    ],
    scope_options: scopeOptions,
    evidence_locker: technique.detectionHints.map((hint) => ({
      item: hint,
      category: evidenceCategory,
    })),
    decision_options: technique.mitigations.map((m) => ({
      action: m,
      condition: 'If attack confirmed — implement immediately',
    })),
    escalation_options: STANDARD_ESCALATION,
    learning_bridge: {
      beginner_rules: [
        technique.plainExplanation,
        `Business risk: ${technique.riskDescription}`,
      ],
      investigation_map: technique.detectionHints.map((hint) => ({
        check: hint,
        where: `SIEM / EDR / ${evidenceCategory} telemetry`,
        confirm: `Correlate with additional indicators of ${technique.tactic} activity`,
      })),
      close_loop_questions: [technique.reflectionQuestion],
    },
    pause_prompt: technique.reflectionQuestion,
    is_active: true,
    is_pro_only: false,
  };
}

export function techniquesToCaseFiles(techniques: TranslationCard[]): CaseFileScenario[] {
  return techniques.map((t, i) => techniqueToCaseFile(t, i));
}

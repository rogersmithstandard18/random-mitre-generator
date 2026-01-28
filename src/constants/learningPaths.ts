import { LearningPath, MitreTactic, Difficulty } from '@/types/TranslationCard';

export interface LearningPathConfig {
  id: string;
  name: LearningPath;
  description: string;
  color: string;
  icon: string;
  recommendedTactics: MitreTactic[];
}

export const learningPathConfigs: LearningPathConfig[] = [
  {
    id: 'blue',
    name: 'Blue Team',
    description: 'Defend and detect \u2014 learn to identify and respond to attacks.',
    color: '#2196F3',
    icon: 'shield',
    recommendedTactics: ['Defense Evasion', 'Credential Access', 'Discovery', 'Lateral Movement', 'Collection', 'Exfiltration', 'Command and Control', 'Impact'],
  },
  {
    id: 'red',
    name: 'Red Team',
    description: 'Think like an attacker \u2014 understand offensive techniques and tradecraft.',
    color: '#F44336',
    icon: 'target',
    recommendedTactics: ['Reconnaissance', 'Resource Development', 'Initial Access', 'Execution', 'Persistence', 'Privilege Escalation', 'Lateral Movement', 'Exfiltration'],
  },
  {
    id: 'purple',
    name: 'Purple Team',
    description: 'Bridge offense and defense \u2014 simulate and validate detection capabilities.',
    color: '#9C27B0',
    icon: 'layers',
    recommendedTactics: ['Initial Access', 'Execution', 'Persistence', 'Privilege Escalation', 'Defense Evasion', 'Credential Access', 'Lateral Movement', 'Command and Control'],
  },
  {
    id: 'grc',
    name: 'GRC Focus',
    description: 'Translate technical risks into business language for governance and compliance.',
    color: '#FF9800',
    icon: 'briefcase',
    recommendedTactics: ['Initial Access', 'Credential Access', 'Exfiltration', 'Impact', 'Reconnaissance', 'Collection'],
  },
];

export const difficultyConfigs: { level: Difficulty; label: string; color: string }[] = [
  { level: 'Beginner', label: 'Beginner', color: '#4CAF50' },
  { level: 'Intermediate', label: 'Intermediate', color: '#FF9800' },
  { level: 'Advanced', label: 'Advanced', color: '#F44336' },
];

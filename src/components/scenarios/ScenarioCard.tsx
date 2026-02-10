import { Clock, Lock } from 'lucide-react';
import type { Scenario } from '@/types/Scenario';
import { learningPathConfigs, difficultyConfigs } from '@/constants/learningPaths';

interface ScenarioCardProps {
  scenario: Scenario;
  canPlay: boolean;
  bestScore: number;
  isCompleted: boolean;
  onPlay: (id: string) => void;
}

export function ScenarioCard({ scenario, canPlay, bestScore, isCompleted, onPlay }: ScenarioCardProps) {
  const diffConfig = difficultyConfigs.find(d => d.level === scenario.difficulty);

  return (
    <div
      className={`scenario-card ${!canPlay ? 'scenario-card-locked' : ''}`}
      onClick={() => canPlay && onPlay(scenario.id)}
      style={{ borderLeftColor: diffConfig?.color || '#999' }}
    >
      <div className="scenario-card-header">
        <span
          className="difficulty-badge"
          style={{ background: diffConfig?.color || '#999' }}
        >
          {scenario.difficulty}
        </span>
        <span className="scenario-card-time">
          <Clock size={12} />
          {scenario.estimated_time}
        </span>
        {isCompleted && (
          <span className="scenario-card-score">
            {bestScore}/8
          </span>
        )}
      </div>

      <h3 className="scenario-card-title">{scenario.title}</h3>
      <p className="scenario-card-subtitle">{scenario.subtitle}</p>

      <div className="scenario-card-paths">
        {scenario.learning_paths.map(path => {
          const config = learningPathConfigs.find(lp => lp.name === path);
          return (
            <span
              key={path}
              className="path-pill"
              style={{ background: config?.color || '#999' }}
            >
              {path}
            </span>
          );
        })}
      </div>

      <div className="scenario-card-meta">
        <span className="scenario-card-alert">{scenario.situation.alert_type}</span>
        <span className={`scenario-card-severity scenario-card-severity-${scenario.situation.severity.toLowerCase().replace(/[^a-z]/g, '')}`}>
          {scenario.situation.severity}
        </span>
      </div>

      {!canPlay && (
        <div className="scenario-card-overlay">
          <Lock size={20} />
          <span>Upgrade to Starter to play</span>
        </div>
      )}
    </div>
  );
}

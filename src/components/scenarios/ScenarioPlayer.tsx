import { useState } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { Scenario, ScenarioChoice } from '@/types/Scenario';
import { useScenarioStore } from '@/store/scenarioStore';
import { useAuthStore } from '@/store/authStore';
import { learningPathConfigs, difficultyConfigs } from '@/constants/learningPaths';

interface ScenarioPlayerProps {
  scenario: Scenario;
  onBack: () => void;
}

export function ScenarioPlayer({ scenario, onBack }: ScenarioPlayerProps) {
  const [currentChoice, setCurrentChoice] = useState<ScenarioChoice | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const recordProgress = useScenarioStore(s => s.recordProgress);
  const canTrack = useAuthStore(s => s.getTierFeatures().canTrackScenarioProgress);
  const diffConfig = difficultyConfigs.find(d => d.level === scenario.difficulty);

  const handleChoiceSelect = (choice: ScenarioChoice) => {
    setCurrentChoice(choice);
    setShowOutcome(true);

    if (canTrack) {
      recordProgress({
        scenarioId: scenario.id,
        choiceId: choice.id,
        score: choice.score,
        maxScore: choice.max_score,
        outcomeType: choice.outcome_type,
        completedAt: new Date().toISOString(),
      });
    }
  };

  const resetScenario = () => {
    setCurrentChoice(null);
    setShowOutcome(false);
  };

  const getOutcomeLabel = (type: string) => {
    switch (type) {
      case 'excellent': return 'Excellent Decision';
      case 'good': return 'Good Decision';
      case 'mixed': return 'Mixed Results';
      case 'poor': return 'Poor Decision';
      case 'critical_failure': return 'Critical Failure';
      default: return type;
    }
  };

  return (
    <div className="scenario-player">
      <button className="scenario-back-btn" onClick={onBack}>
        <ArrowLeft size={16} />
        Back to Scenarios
      </button>

      {/* Header */}
      <div className="scenario-player-header">
        <div>
          <h1 className="scenario-player-title">{scenario.title}</h1>
          <p className="scenario-player-subtitle">{scenario.subtitle}</p>
        </div>
        <div className="scenario-player-badges">
          <span className="difficulty-badge" style={{ background: diffConfig?.color || '#999' }}>
            {scenario.difficulty}
          </span>
          <span className="scenario-time-badge">{scenario.estimated_time}</span>
        </div>
      </div>

      {/* Learning path & tags */}
      <div className="scenario-player-tags">
        {scenario.learning_paths.map(path => {
          const config = learningPathConfigs.find(lp => lp.name === path);
          return (
            <span key={path} className="path-pill" style={{ background: config?.color || '#999' }}>
              {path}
            </span>
          );
        })}
      </div>

      {/* Protagonist */}
      <div className="scenario-protagonist">
        <div className="scenario-protagonist-avatar">
          {scenario.protagonist.name.charAt(0)}
        </div>
        <div>
          <strong>You are {scenario.protagonist.name}</strong>
          <p>{scenario.protagonist.role} &middot; {scenario.protagonist.experience}</p>
        </div>
      </div>

      {/* Situation */}
      <div className="scenario-situation">
        <div className="scenario-situation-header">
          <h2>The Situation</h2>
          <div className="scenario-situation-meta">
            <span>{scenario.situation.time}</span>
            <span>{scenario.situation.shift}</span>
            <span className={`scenario-severity scenario-severity-${scenario.situation.severity.toLowerCase().replace(/[^a-z]/g, '')}`}>
              {scenario.situation.severity}
            </span>
          </div>
        </div>
        <div className="scenario-alert-badge">
          {scenario.situation.alert_type}
        </div>
        <p className="scenario-situation-desc">{scenario.situation.description}</p>
      </div>

      {/* Key Concepts */}
      <div className="scenario-concepts">
        <h3>Key Concepts</h3>
        <div className="scenario-concepts-list">
          {scenario.key_concepts.map((concept) => (
            <span key={concept} className="scenario-concept-chip">{concept}</span>
          ))}
        </div>
      </div>

      {/* MITRE Techniques */}
      <div className="scenario-mitre">
        <h3>MITRE ATT&CK Techniques</h3>
        <div className="scenario-mitre-grid">
          {scenario.mitre_attack.techniques.map(tech => (
            <div key={tech.id} className="scenario-mitre-card">
              <div className="scenario-mitre-card-header">
                <span className="technique-id">{tech.id}</span>
                <span className="scenario-mitre-name">{tech.name}</span>
              </div>
              <p>{tech.description}</p>
              <a
                href={`https://attack.mitre.org/techniques/${tech.id.replace('.', '/')}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="scenario-mitre-link"
              >
                View on MITRE ATT&CK <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Choices */}
      {!showOutcome && (
        <div className="scenario-choices">
          <h2>What do you do?</h2>
          <p className="scenario-choices-instruction">
            Choose your response carefully. Each decision has different outcomes
            based on technical correctness and professional protocols.
          </p>
          <div className="scenario-choices-grid">
            {scenario.choices.map((choice, index) => (
              <button
                key={choice.id}
                className="scenario-choice-card"
                onClick={() => handleChoiceSelect(choice)}
              >
                <span className="scenario-choice-label">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="scenario-choice-text">{choice.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Outcome */}
      {showOutcome && currentChoice && (
        <div className="scenario-outcome">
          <div className={`scenario-outcome-header scenario-outcome-${currentChoice.outcome_type}`}>
            <div className="scenario-outcome-score">
              <span className="scenario-score-value">{currentChoice.score}</span>
              <span className="scenario-score-max">/ {currentChoice.max_score}</span>
            </div>
            <div className="scenario-outcome-badge">
              {getOutcomeLabel(currentChoice.outcome_type)}
            </div>
          </div>

          <div className="scenario-outcome-section">
            <h3>What Happened</h3>
            <p>{currentChoice.outcome}</p>
          </div>

          <div className="scenario-outcome-section">
            <h3>Key Lessons</h3>
            <ul>
              {currentChoice.lessons.map((lesson) => (
                <li key={lesson}>{lesson}</li>
              ))}
            </ul>
          </div>

          <div className="scenario-outcome-section">
            <h3>Consequences</h3>
            <p className={`scenario-consequence scenario-consequence-${currentChoice.outcome_type}`}>
              {currentChoice.consequences}
            </p>
          </div>

          <div className="scenario-outcome-actions">
            <button className="generate-btn" onClick={resetScenario}>
              Try Different Choice
            </button>
            <button className="scenario-secondary-btn" onClick={onBack}>
              Back to Scenarios
            </button>
          </div>
        </div>
      )}

      {/* Fact Check */}
      <div className="scenario-factcheck">
        <h3>Fact Check: Fiction vs. Reality</h3>
        <div className="scenario-factcheck-grid">
          <div className="scenario-factcheck-item scenario-factcheck-fiction">
            <strong>Fiction</strong>
            <p>{scenario.fact_check.fiction}</p>
          </div>
          <div className="scenario-factcheck-item scenario-factcheck-reality">
            <strong>Reality</strong>
            <p>{scenario.fact_check.reality}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useScenarioStore } from '@/store/scenarioStore';
import { ScenarioCard } from '@/components/scenarios/ScenarioCard';
import { ScenarioPlayer } from '@/components/scenarios/ScenarioPlayer';
import { ScenarioFilterBar } from '@/components/scenarios/ScenarioFilterBar';

export default function ScenariosPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const features = useAuthStore(s => s.getTierFeatures());
  const getFilteredScenarios = useScenarioStore(s => s.getFilteredScenarios);
  const getScenarioById = useScenarioStore(s => s.getScenarioById);
  const getBestScore = useScenarioStore(s => s.getBestScore);
  const getProgressForScenario = useScenarioStore(s => s.getProgressForScenario);
  const getCompletedCount = useScenarioStore(s => s.getCompletedCount);
  const getTotalScore = useScenarioStore(s => s.getTotalScore);

  const filteredScenarios = getFilteredScenarios();
  const activeScenario = activeId ? getScenarioById(activeId) : null;

  if (activeScenario) {
    return (
      <ScenarioPlayer
        scenario={activeScenario}
        onBack={() => setActiveId(null)}
      />
    );
  }

  const completedCount = getCompletedCount();
  const totalScore = getTotalScore();

  return (
    <div>
      <div className="scenarios-hero">
        <BookOpen size={32} className="scenarios-hero-icon" />
        <h1>SOC Scenarios</h1>
        <p>
          Interactive incident response scenarios. Test your technical knowledge,
          decision-making, and social navigation skills in a SOC environment.
        </p>
        {features.canTrackScenarioProgress && completedCount > 0 && (
          <div className="scenarios-stats">
            <div className="scenarios-stat">
              <span className="scenarios-stat-value">{completedCount}</span>
              <span className="scenarios-stat-label">Completed</span>
            </div>
            <div className="scenarios-stat">
              <span className="scenarios-stat-value">
                {totalScore.possible > 0
                  ? Math.round((totalScore.earned / totalScore.possible) * 100)
                  : 0}%
              </span>
              <span className="scenarios-stat-label">Avg Score</span>
            </div>
            <div className="scenarios-stat">
              <span className="scenarios-stat-value">{totalScore.earned}/{totalScore.possible}</span>
              <span className="scenarios-stat-label">Total Points</span>
            </div>
          </div>
        )}
      </div>

      <ScenarioFilterBar />

      {filteredScenarios.length === 0 ? (
        <div className="empty-state">
          <p>No scenarios match your filters.</p>
        </div>
      ) : (
        <div className="scenarios-grid">
          {filteredScenarios.map(scenario => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              canPlay={features.canPlayScenarios}
              bestScore={getBestScore(scenario.id)}
              isCompleted={!!getProgressForScenario(scenario.id)}
              onPlay={setActiveId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

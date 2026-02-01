import { useState } from 'react';
import { Filter, Lock } from 'lucide-react';
import { useTopicStore } from '@/store/topicStore';
import { useAuthStore } from '@/store/authStore';
import { learningPathConfigs, difficultyConfigs } from '@/constants/learningPaths';
import { MitreTactic } from '@/types/TranslationCard';

const allTactics: MitreTactic[] = [
  'Reconnaissance', 'Resource Development', 'Initial Access', 'Execution',
  'Persistence', 'Privilege Escalation', 'Defense Evasion', 'Credential Access',
  'Discovery', 'Lateral Movement', 'Collection', 'Command and Control',
  'Exfiltration', 'Impact',
];

export default function FilterBar() {
  const [open, setOpen] = useState(false);
  const filters = useTopicStore(s => s.filters);
  const setFilter = useTopicStore(s => s.setFilter);
  const clearFilters = useTopicStore(s => s.clearFilters);
  const getTierFeatures = useAuthStore(s => s.getTierFeatures);

  const features = getTierFeatures();
  const canUseFilters = features.canUseFilters;
  const canUseLearningPathFilter = features.canUseLearningPathFilter;

  const hasFilters = filters.difficulty || filters.learningPath || filters.tactic;

  // Don't show filter bar at all for free tier
  if (!canUseFilters) {
    return (
      <div className="filter-locked">
        <Lock size={14} />
        <span>Upgrade to unlock filters</span>
      </div>
    );
  }

  return (
    <div>
      <div className="filter-toggle">
        <button onClick={() => setOpen(!open)}>
          <Filter size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          {open ? 'Hide Filters' : 'Show Filters'}
          {hasFilters ? ' (active)' : ''}
        </button>
      </div>

      {open && (
        <div className="filter-bar">
          {/* Learning Path - only for Professional tier and above */}
          <div className="filter-section">
            <label>
              Learning Path
              {!canUseLearningPathFilter && <Lock size={12} style={{ marginLeft: 6 }} />}
            </label>
            <div className="filter-chips">
              {learningPathConfigs.map(lp => (
                <span
                  key={lp.id}
                  className={`chip ${filters.learningPath === lp.name ? 'active' : ''} ${!canUseLearningPathFilter ? 'disabled' : ''}`}
                  style={filters.learningPath === lp.name ? { background: lp.color } : {}}
                  onClick={() => {
                    if (canUseLearningPathFilter) {
                      setFilter('learningPath', filters.learningPath === lp.name ? null : lp.name);
                    }
                  }}
                  title={!canUseLearningPathFilter ? 'Upgrade to Professional to unlock' : undefined}
                >
                  {lp.name}
                </span>
              ))}
            </div>
          </div>

          {/* Difficulty - available for Starter and above */}
          <div className="filter-section">
            <label>Difficulty</label>
            <div className="filter-chips">
              {difficultyConfigs.map(d => (
                <span
                  key={d.level}
                  className={`chip ${filters.difficulty === d.level ? 'active' : ''}`}
                  style={filters.difficulty === d.level ? { background: d.color } : {}}
                  onClick={() => setFilter('difficulty', filters.difficulty === d.level ? null : d.level)}
                >
                  {d.label}
                </span>
              ))}
            </div>
          </div>

          {/* Tactic - available for Starter and above */}
          <div className="filter-section">
            <label>Tactic</label>
            <div className="filter-chips">
              {allTactics.map(t => (
                <span
                  key={t}
                  className={`chip ${filters.tactic === t ? 'active' : ''}`}
                  style={filters.tactic === t ? { background: '#1565C0' } : {}}
                  onClick={() => setFilter('tactic', filters.tactic === t ? null : t)}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {hasFilters && (
            <button className="clear-filters" onClick={clearFilters}>
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

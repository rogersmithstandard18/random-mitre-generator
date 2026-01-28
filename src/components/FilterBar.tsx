import { useState } from 'react';
import { Filter } from 'lucide-react';
import { useTopicStore } from '@/store/topicStore';
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

  const hasFilters = filters.difficulty || filters.learningPath || filters.tactic;

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
          <div className="filter-section">
            <label>Learning Path</label>
            <div className="filter-chips">
              {learningPathConfigs.map(lp => (
                <span
                  key={lp.id}
                  className={`chip ${filters.learningPath === lp.name ? 'active' : ''}`}
                  style={filters.learningPath === lp.name ? { background: lp.color } : {}}
                  onClick={() => setFilter('learningPath', filters.learningPath === lp.name ? null : lp.name)}
                >
                  {lp.name}
                </span>
              ))}
            </div>
          </div>

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

import { useState } from 'react';
import { Filter, Lock } from 'lucide-react';
import { useScenarioStore } from '@/store/scenarioStore';
import { useAuthStore } from '@/store/authStore';
import { difficultyConfigs, learningPathConfigs } from '@/constants/learningPaths';

const securityPlusOptions = [
  { value: '1.2', label: '1.2 - Threat vectors' },
  { value: '1.4', label: '1.4 - Malicious activity' },
  { value: '1.5', label: '1.5 - Mitigation techniques' },
  { value: '4.1', label: '4.1 - Security tools' },
  { value: '4.2', label: '4.2 - Policies & procedures' },
  { value: '4.3', label: '4.3 - IAM' },
  { value: '4.4', label: '4.4 - Auth solutions' },
  { value: '4.5', label: '4.5 - Cyber resilience' },
  { value: '5.1', label: '5.1 - Security governance' },
  { value: '5.2', label: '5.2 - Risk management' },
  { value: '5.6', label: '5.6 - Security awareness' },
];

const owaspOptions = [
  { value: 'A01:2025', label: 'A01 - Broken Access Control' },
  { value: 'A02:2025', label: 'A02 - Security Misconfiguration' },
  { value: 'A06:2025', label: 'A06 - Insecure Design' },
  { value: 'A07:2025', label: 'A07 - Authentication Failures' },
  { value: 'A08:2025', label: 'A08 - Integrity Failures' },
  { value: 'A09:2025', label: 'A09 - Logging & Alerting Failures' },
];

export function ScenarioFilterBar() {
  const [open, setOpen] = useState(false);
  const filters = useScenarioStore(s => s.filters);
  const setFilter = useScenarioStore(s => s.setFilter);
  const clearFilters = useScenarioStore(s => s.clearFilters);
  const canUseFilters = useAuthStore(s => s.getTierFeatures().canUseScenarioFilters);

  const hasFilters = filters.difficulty || filters.learningPath || filters.securityPlus || filters.owasp;

  if (!canUseFilters) {
    return (
      <div className="filter-locked">
        <Lock size={14} />
        <span>Upgrade to Professional to filter scenarios</span>
      </div>
    );
  }

  return (
    <div>
      <div className="filter-toggle">
        <button onClick={() => setOpen(!open)}>
          <Filter size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          {open ? 'Hide Filters' : 'Filter Scenarios'}
          {hasFilters ? ' (active)' : ''}
        </button>
      </div>

      {open && (
        <div className="filter-bar">
          {/* Difficulty */}
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

          {/* Learning Path */}
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

          {/* Security+ Objectives */}
          <div className="filter-section">
            <label>Security+ Objectives</label>
            <div className="filter-chips">
              {securityPlusOptions.map(o => (
                <span
                  key={o.value}
                  className={`chip ${filters.securityPlus === o.value ? 'active' : ''}`}
                  style={filters.securityPlus === o.value ? { background: '#4CAF50' } : {}}
                  onClick={() => setFilter('securityPlus', filters.securityPlus === o.value ? null : o.value)}
                >
                  {o.label}
                </span>
              ))}
            </div>
          </div>

          {/* OWASP Top 10 */}
          <div className="filter-section">
            <label>OWASP Top 10:2025</label>
            <div className="filter-chips">
              {owaspOptions.map(o => (
                <span
                  key={o.value}
                  className={`chip ${filters.owasp === o.value ? 'active' : ''}`}
                  style={filters.owasp === o.value ? { background: '#FF9800' } : {}}
                  onClick={() => setFilter('owasp', filters.owasp === o.value ? null : o.value)}
                >
                  {o.label}
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

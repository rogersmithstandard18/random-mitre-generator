import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Star, Eye, EyeOff, Lock } from 'lucide-react';
import { TranslationCard } from '@/types/TranslationCard';
import { useTopicStore } from '@/store/topicStore';
import { difficultyConfigs, learningPathConfigs } from '@/constants/learningPaths';

interface Props {
  card: TranslationCard;
  demoMode?: boolean;
}

function Section({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="section">
      <div className="section-header" onClick={() => setOpen(!open)}>
        <h3>{title}</h3>
        <ChevronDown size={18} className={`section-chevron ${open ? 'open' : ''}`} />
      </div>
      {open && <div className="section-body">{children}</div>}
    </div>
  );
}

export default function TranslationCardView({ card, demoMode }: Props) {
  const navigate = useNavigate();
  const storeFavorites = useTopicStore(s => s.favorites);
  const toggleFavorite = useTopicStore(s => s.toggleFavorite);
  const storeShowAdvanced = useTopicStore(s => s.showAdvanced);
  const toggleAdvanced = useTopicStore(s => s.toggleAdvanced);

  const favorites = demoMode ? [] : storeFavorites;
  const showAdvanced = demoMode ? false : storeShowAdvanced;
  const isFav = favorites.includes(card.techniqueId);
  const diffColor = difficultyConfigs.find(d => d.level === card.difficulty)?.color || '#999';

  const getPathColor = (name: string) =>
    learningPathConfigs.find(lp => lp.name === name)?.color || '#666';

  return (
    <div className="card">
      <div className="card-header">
        <span className="technique-id">{card.techniqueId}</span>
        <span className="difficulty-badge" style={{ background: diffColor }}>
          {card.difficulty}
        </span>
        {!demoMode && (
          <button
            className={`favorite-btn ${isFav ? 'active' : ''}`}
            onClick={() => toggleFavorite(card.techniqueId)}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star size={20} fill={isFav ? '#FF5252' : 'none'} />
          </button>
        )}
      </div>

      <h2 className="card-title">{card.techniqueName}</h2>

      <div className="card-tactic">
        {card.tactic} <span>{card.tacticId}</span>
      </div>

      <div className="learning-paths">
        {card.learningPaths.map(lp => (
          <span key={lp} className="path-pill" style={{ background: getPathColor(lp) }}>
            {lp}
          </span>
        ))}
      </div>

      <Section title="Plain Explanation" defaultOpen>
        <p>{card.plainExplanation}</p>
      </Section>

      <Section title="Corporate Risk Translation" defaultOpen>
        <span className="risk-badge">{card.riskCategory}</span>
        <p>{card.riskDescription}</p>
      </Section>

      <Section title="Boardroom Pitch" defaultOpen>
        <p className="boardroom-text">{card.boardroomPitch}</p>
      </Section>

      <Section title="Industry Impact">
        {card.industryImpacts.map((imp, i) => (
          <div key={i} className="impact-item">
            <strong>{imp.industry}</strong>
            <p>{imp.description}</p>
          </div>
        ))}
      </Section>

      {demoMode ? (
        <button className="advanced-toggle demo-locked" onClick={() => navigate('/')}>
          <Lock size={16} />
          Sign up to unlock Detection & Mitigation
        </button>
      ) : (
        <>
          <button className="advanced-toggle" onClick={toggleAdvanced}>
            {showAdvanced ? <EyeOff size={16} /> : <Eye size={16} />}
            {showAdvanced ? 'Hide' : 'Show'} Detection & Mitigation
          </button>

          {showAdvanced && (
            <>
              <Section title="Detection Hints" defaultOpen>
                <ul className="hint-list">
                  {card.detectionHints.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </Section>

              <Section title="Mitigations" defaultOpen>
                <ul className="mitigation-list">
                  {card.mitigations.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </Section>
            </>
          )}
        </>
      )}

      <Section title="Reflect">
        <div className="reflect-box">
          <h4>Reflection Question</h4>
          <p>{card.reflectionQuestion}</p>
          <div className="spot-risk">
            <h4>Spot the Risk</h4>
            <p>{card.spotTheRisk}</p>
          </div>
        </div>
      </Section>
    </div>
  );
}

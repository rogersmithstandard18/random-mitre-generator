import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTopicStore } from '@/store/topicStore';
import { difficultyConfigs } from '@/constants/learningPaths';
import techniques from '@/constants/techniques';

export default function HistoryPage() {
  const [tab, setTab] = useState<'history' | 'favorites'>('history');
  const navigate = useNavigate();
  const cardHistory = useTopicStore(s => s.cardHistory);
  const favorites = useTopicStore(s => s.favorites);
  const store = useTopicStore();

  const favoriteCards = techniques.filter(t => favorites.includes(t.techniqueId));
  const items = tab === 'history' ? cardHistory : favoriteCards;

  const handleClick = (techniqueId: string) => {
    const card = techniques.find(t => t.techniqueId === techniqueId);
    if (card) {
      useTopicStore.setState({ currentCard: card });
      navigate('/learn');
    }
  };

  const getDifficultyColor = (d: string) =>
    difficultyConfigs.find(c => c.level === d)?.color || '#999';

  return (
    <div>
      <div className="tabs">
        <button
          className={`tab-btn ${tab === 'history' ? 'active' : ''}`}
          onClick={() => setTab('history')}
        >
          History ({cardHistory.length})
        </button>
        <button
          className={`tab-btn ${tab === 'favorites' ? 'active' : ''}`}
          onClick={() => setTab('favorites')}
        >
          Favorites ({favorites.length})
        </button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>{tab === 'history' ? 'No concepts viewed yet.' : 'No favorites saved yet.'}</p>
        </div>
      ) : (
        items.map((card, i) => (
          <div
            key={`${card.techniqueId}-${i}`}
            className="history-item"
            onClick={() => handleClick(card.techniqueId)}
          >
            <span className="history-id">{card.techniqueId}</span>
            <div className="history-info">
              <h3>{card.techniqueName}</h3>
              <div className="history-meta">
                <span
                  className="difficulty-dot"
                  style={{ background: getDifficultyColor(card.difficulty) }}
                />
                {card.difficulty} &middot; {card.tactic}
              </div>
              <p>{card.plainExplanation}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTopicStore } from '@/store/topicStore';
import { useAuthStore } from '@/store/authStore';
import TranslationCardView from '@/components/TranslationCardView';
import FilterBar from '@/components/FilterBar';

export default function CardPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const currentCard = useTopicStore(s => s.currentCard);
  const generateRandomCard = useTopicStore(s => s.generateRandomCard);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/demo', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!currentCard) {
      generateRandomCard();
    }
  }, [currentCard, generateRandomCard]);

  if (!currentCard) {
    return (
      <div className="empty-state">
        <p>Generating your first concept...</p>
      </div>
    );
  }

  return (
    <div>
      <FilterBar />
      <TranslationCardView card={currentCard} />
      <button className="next-btn" onClick={generateRandomCard}>
        NEXT CONCEPT
      </button>
    </div>
  );
}

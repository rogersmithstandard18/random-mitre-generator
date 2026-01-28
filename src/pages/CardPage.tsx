import { useEffect } from 'react';
import { useTopicStore } from '@/store/topicStore';
import TranslationCardView from '@/components/TranslationCardView';

export default function CardPage() {
  const currentCard = useTopicStore(s => s.currentCard);
  const generateRandomCard = useTopicStore(s => s.generateRandomCard);

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
      <TranslationCardView card={currentCard} />
      <button className="next-btn" onClick={generateRandomCard}>
        NEXT CONCEPT
      </button>
    </div>
  );
}

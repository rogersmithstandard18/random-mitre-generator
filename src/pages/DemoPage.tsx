import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import techniques from '@/constants/techniques';
import { TranslationCard } from '@/types/TranslationCard';
import TranslationCardView from '@/components/TranslationCardView';
import DemoLimitReached from '@/components/DemoLimitReached';

const DEMO_LIMIT = 3;
const STORAGE_KEY = 'demo-generation-count';

function getStoredCount(): number {
  return parseInt(sessionStorage.getItem(STORAGE_KEY) || '0', 10);
}

function setStoredCount(count: number) {
  sessionStorage.setItem(STORAGE_KEY, String(count));
}

export default function DemoPage() {
  const navigate = useNavigate();
  const [genCount, setGenCount] = useState(getStoredCount);
  const [currentCard, setCurrentCard] = useState<TranslationCard | null>(null);
  const [limitReached, setLimitReached] = useState(() => getStoredCount() >= DEMO_LIMIT);

  const generateCard = useCallback(() => {
    const count = getStoredCount();
    if (count >= DEMO_LIMIT) {
      setLimitReached(true);
      return;
    }
    const newCount = count + 1;
    const card = techniques[Math.floor(Math.random() * techniques.length)];
    setCurrentCard(card);
    setStoredCount(newCount);
    setGenCount(newCount);
  }, []);

  useEffect(() => {
    if (!currentCard && !limitReached) {
      generateCard();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (limitReached) {
    return <DemoLimitReached />;
  }

  return (
    <div>
      <div className="demo-banner">
        <span className="demo-counter">Sample {genCount} of {DEMO_LIMIT}</span>
        <button className="demo-signup-link" onClick={() => navigate('/')}>
          Sign up for full access
        </button>
      </div>
      {currentCard && <TranslationCardView card={currentCard} demoMode />}
      <button className="next-btn" onClick={generateCard}>
        {genCount >= DEMO_LIMIT ? 'SIGN UP TO CONTINUE' : 'NEXT CONCEPT'}
      </button>
    </div>
  );
}

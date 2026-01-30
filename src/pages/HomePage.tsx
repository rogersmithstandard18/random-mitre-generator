import { useNavigate } from 'react-router-dom';
import { Shuffle } from 'lucide-react';
import { useTopicStore } from '@/store/topicStore';
import FilterBar from '@/components/FilterBar';

export default function HomePage() {
  const navigate = useNavigate();
  const generateRandomCard = useTopicStore(s => s.generateRandomCard);

  const handleGenerate = () => {
    generateRandomCard();
    navigate('/learn');
  };

  return (
    <div>
      <div className="home-hero">
        <h1>CyberSecurity Learning Tool</h1>
        <p>
          Master cyberSecurity techniques through plain-language translation cards.
          Learn one concept at a time.
        </p>
        <button className="generate-btn" onClick={handleGenerate}>
          <Shuffle size={22} />
          Learn a Random Concept
        </button>
      </div>
      <FilterBar />
    </div>
  );
}

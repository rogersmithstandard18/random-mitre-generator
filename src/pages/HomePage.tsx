import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shuffle, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTopicStore } from '@/store/topicStore';
import { useAuthStore } from '@/store/authStore';
import FilterBar from '@/components/FilterBar';
import localCaseFileScenarios from '@/constants/caseFileScenarios';
import { getWeeklyCaseFileId, getNextWeekReset } from '@/constants/weeklyCaseFiles';

function WeeklyCaseBanner() {
  const token = useAuthStore(s => s.token);
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const weeklyCaseFileId = getWeeklyCaseFileId();
  const weeklyScenario = localCaseFileScenarios.find(s => s.id === weeklyCaseFileId);
  const nextReset = useMemo(() => getNextWeekReset(), []);

  // Check weekly status
  useEffect(() => {
    if (!token) { setLoaded(true); return; }
    fetch('/api/case-files/weekly', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setAlreadyUsed(data.alreadyUsed ?? false); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [token]);

  if (!loaded || !weeklyScenario) return null;

  // Calculate days until next reset
  const daysLeft = Math.ceil((nextReset.getTime() - Date.now()) / 86400000);

  return (
    <Link to="/case-files" style={{ textDecoration: 'none', display: 'block', marginBottom: 24 }}>
      <div style={{
        background: alreadyUsed
          ? 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(20,184,166,0.06))'
          : 'linear-gradient(135deg, rgba(8,145,178,0.08), rgba(37,99,235,0.08))',
        borderRadius: 12,
        border: `1px solid ${alreadyUsed ? 'rgba(34,197,94,0.15)' : 'rgba(20,184,166,0.2)'}`,
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: alreadyUsed ? 'rgba(34,197,94,0.1)' : 'rgba(20,184,166,0.1)',
            border: `1px solid ${alreadyUsed ? 'rgba(34,197,94,0.2)' : 'rgba(20,184,166,0.2)'}`,
          }}>
            {alreadyUsed ? <CheckCircle2 size={20} color="#22c55e" /> : <Shield size={20} color="#14b8a6" />}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff' }}>
              {alreadyUsed ? 'Weekly Case Completed' : 'Weekly Case File Ready'}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
              {alreadyUsed
                ? `Next case in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`
                : weeklyScenario.title}
            </p>
          </div>
        </div>
        <ArrowRight size={16} color="rgba(255,255,255,0.3)" />
      </div>
    </Link>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const generateRandomCard = useTopicStore(s => s.generateRandomCard);
  const features = useAuthStore(s => s.getTierFeatures());
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  // Show weekly case banner for free users who are logged in
  const showWeeklyBanner = isAuthenticated && features.canAccessWeeklyCaseFile && !features.canAccessCaseFiles;

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
        {showWeeklyBanner && <WeeklyCaseBanner />}
        <button className="generate-btn" onClick={handleGenerate}>
          <Shuffle size={22} />
          Learn a Random Concept
        </button>
      </div>
      <FilterBar />
    </div>
  );
}

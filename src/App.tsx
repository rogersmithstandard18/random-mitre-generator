import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Shield } from 'lucide-react';
import CardPage from './pages/CardPage';
import DemoPage from './pages/DemoPage';
import HistoryPage from './pages/HistoryPage';
import ScenariosPage from './pages/ScenariosPage';
import CaseFilesPage from './pages/CaseFilesPage';
import SecOpsSimPage from './pages/SecOpsSimPage';
import { SalesPage } from './pages/SalesPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { PaymentCancelPage } from './pages/PaymentCancelPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AboutPage } from './pages/AboutPage';
import { UserMenu } from './components/auth/UserMenu';
import { GoogleLoginButton } from './components/auth/GoogleLoginButton';
import { useAuthStore } from './store/authStore';
import { useTopicStore } from './store/topicStore';

function AppContent() {
  const location = useLocation();
  const loadTechniques = useTopicStore(s => s.loadTechniques);

  useEffect(() => {
    loadTechniques();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isSalesPage = location.pathname === '/';
  const isDemoPage = location.pathname === '/demo';
  const isCaseFilesPage = location.pathname === '/case-files';
  const isSecOpsSimPage = location.pathname === '/secops-sim';
  const isTermsPage = location.pathname === '/terms';
  const isPrivacyPage = location.pathname === '/privacy';
  const isAboutPage = location.pathname === '/about';
  const isPaymentPage = location.pathname.startsWith('/payment');
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="app">
      <nav className="navbar">
        <NavLink to="/" className="navbar-brand">
          <Shield size={20} />
          CyberSecurity Learner
        </NavLink>
        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <div className="navbar-links">
                <NavLink to="/learn">Learn</NavLink>
                <NavLink to="/scenarios">Scenarios</NavLink>
                <NavLink to="/case-files">Case Files</NavLink>
                <NavLink to="/secops-sim">SecOps Sim</NavLink>
                <NavLink to="/history">History</NavLink>
              </div>
              <UserMenu />
            </>
          ) : (
            <div className="navbar-login">
              <GoogleLoginButton useOneTap={false} />
            </div>
          )}
        </div>
      </nav>
      {isSalesPage ? (
        <Routes>
          <Route path="/" element={<SalesPage />} />
        </Routes>
      ) : isDemoPage ? (
        <div className="page">
          <Routes>
            <Route path="/demo" element={<DemoPage />} />
          </Routes>
        </div>
      ) : isCaseFilesPage ? (
        <Routes>
          <Route path="/case-files" element={<CaseFilesPage />} />
        </Routes>
      ) : isSecOpsSimPage ? (
        <Routes>
          <Route path="/secops-sim" element={<SecOpsSimPage />} />
        </Routes>
      ) : isTermsPage ? (
        <Routes>
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      ) : isPrivacyPage ? (
        <Routes>
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      ) : isAboutPage ? (
        <Routes>
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      ) : isPaymentPage ? (
        <div className="page">
          <Routes>
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/cancel" element={<PaymentCancelPage />} />
          </Routes>
        </div>
      ) : (
        <div className="page">
          <Routes>
            <Route path="/learn" element={<CardPage />} />
            <Route path="/scenarios" element={<ScenariosPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error('VITE_GOOGLE_CLIENT_ID is not defined in environment variables');
  }

  return (
    <GoogleOAuthProvider clientId={clientId || ''}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;

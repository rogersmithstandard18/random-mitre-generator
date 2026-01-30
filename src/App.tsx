import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import CardPage from './pages/CardPage';
import HistoryPage from './pages/HistoryPage';
import { SalesPage } from './pages/SalesPage';

function AppContent() {
  const location = useLocation();
  const isSalesPage = location.pathname === '/';

  return (
    <div className="app">
      <nav className="navbar">
        <NavLink to="/" className="navbar-brand">
          <Shield size={20} />
          MITRE ATT&CK Learner
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/learn">Learn</NavLink>
          <NavLink to="/history">History</NavLink>
        </div>
      </nav>
      {isSalesPage ? (
        <Routes>
          <Route path="/" element={<SalesPage />} />
        </Routes>
      ) : (
        <div className="page">
          <Routes>
            <Route path="/learn" element={<CardPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

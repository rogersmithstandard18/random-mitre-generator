import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Shield } from 'lucide-react';
import HomePage from './pages/HomePage';
import CardPage from './pages/CardPage';
import HistoryPage from './pages/HistoryPage';
import { SalesPage } from './pages/SalesPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-brand">
            <Shield size={20} />
            MITRE ATT&CK Learner
          </div>
          <div className="navbar-links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/sales">Sales</NavLink>
            <NavLink to="/learn">Learn</NavLink>
            <NavLink to="/history">History</NavLink>
          </div>
        </nav>
        <div className="page">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/learn" element={<CardPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

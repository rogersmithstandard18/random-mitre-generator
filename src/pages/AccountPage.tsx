import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Bell, BellOff, Trash2, ShieldCheck, CreditCard, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const TIER_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  free:         { label: 'Free',         color: 'rgba(255,255,255,0.5)',  bg: 'rgba(255,255,255,0.06)' },
  starter:      { label: 'Starter',      color: '#60a5fa',                bg: 'rgba(96,165,250,0.1)'  },
  professional: { label: 'Professional', color: '#14b8a6',                bg: 'rgba(20,184,166,0.1)'  },
  team:         { label: 'Team',         color: '#a78bfa',                bg: 'rgba(167,139,250,0.1)' },
};

const EMAIL_PREFS_KEY = 'cf_email_prefs';

function getEmailPrefs(): boolean {
  try { return JSON.parse(localStorage.getItem(EMAIL_PREFS_KEY) ?? 'true'); }
  catch { return true; }
}

export function AccountPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [emailUpdates, setEmailUpdates] = useState<boolean>(getEmailPrefs);
  const [savedMsg, setSavedMsg] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const token = useAuthStore(s => s.token);

  if (!user) {
    return (
      <div style={{ background: '#0a0c10', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>You are not signed in.</p>
          <Link to="/" style={{ color: '#14b8a6', fontSize: 14 }}>Go to Home</Link>
        </div>
      </div>
    );
  }

  const tier = user.tier ?? 'free';
  const tierStyle = TIER_LABELS[tier] ?? TIER_LABELS.free;

  const handleSavePrefs = () => {
    localStorage.setItem(EMAIL_PREFS_KEY, JSON.stringify(emailUpdates));
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== user.email) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await fetch('/api/account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Even if the API call fails, clear local data
    }
    localStorage.clear();
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div style={{ background: '#0a0c10', minHeight: '100vh', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none', marginBottom: 40 }}>
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 4 }}>Account Settings</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 40 }}>Manage your profile, notifications, and account data.</p>

        {/* Profile */}
        <Card icon={<User size={16} color="#14b8a6" />} title="Profile">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {user.picture ? (
              <img src={user.picture} alt={user.name} style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} />
            ) : (
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#0891b2,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={22} color="#fff" />
              </div>
            )}
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0 }}>{user.name}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>{user.email}</p>
            </div>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 14, marginBottom: 0 }}>
            Profile information is managed through your Google account.
          </p>
        </Card>

        {/* Plan */}
        <Card icon={<CreditCard size={16} color="#14b8a6" />} title="Subscription">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ padding: '4px 12px', background: tierStyle.bg, color: tierStyle.color, fontWeight: 800, fontSize: 12, borderRadius: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {tierStyle.label}
            </span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              {tier === 'free' ? 'Limited access' : 'Full access'}
            </span>
          </div>
          {tier === 'free' ? (
            <Link to="/#pricing" style={{ display: 'inline-block', marginTop: 14, padding: '9px 18px', background: 'linear-gradient(135deg,#0891b2,#2563eb)', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
              Upgrade Plan
            </Link>
          ) : (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 12, marginBottom: 0 }}>
              To manage billing or cancel your subscription, email <a href="mailto:billing@cybersecuritytranslator.com" style={{ color: '#14b8a6' }}>billing@cybersecuritytranslator.com</a>.
            </p>
          )}
        </Card>

        {/* Email preferences */}
        <Card icon={emailUpdates ? <Bell size={16} color="#14b8a6" /> : <BellOff size={16} color="rgba(255,255,255,0.3)" />} title="Email Preferences">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>Product updates &amp; learning tips</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3, marginBottom: 0 }}>New scenarios, features, and SOC training tips</p>
            </div>
            <button
              onClick={() => setEmailUpdates(v => !v)}
              style={{ width: 44, height: 24, borderRadius: 12, background: emailUpdates ? '#14b8a6' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
              <span style={{ position: 'absolute', top: 3, left: emailUpdates ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', display: 'block' }} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={handleSavePrefs}
              style={{ padding: '8px 16px', background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.25)', borderRadius: 8, color: '#14b8a6', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              Save Preference
            </button>
            {savedMsg && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#22c55e' }}>
                <CheckCircle2 size={13} /> Saved
              </span>
            )}
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 12, marginBottom: 0 }}>
            Transactional emails (receipts, security alerts) are always sent regardless of this setting. You can also unsubscribe via the link in any marketing email.
          </p>
        </Card>

        {/* Legal links */}
        <Card icon={<ShieldCheck size={16} color="#14b8a6" />} title="Legal">
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link to="/terms" style={{ fontSize: 13, color: '#14b8a6', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/privacy" style={{ fontSize: 13, color: '#14b8a6', textDecoration: 'none' }}>Privacy Policy</Link>
          </div>
        </Card>

        {/* Danger zone */}
        <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: 24, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <AlertTriangle size={16} color="#ef4444" />
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#ef4444', margin: 0 }}>Danger Zone</h3>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 16, lineHeight: 1.6 }}>
            Deleting your account is permanent and cannot be undone. All your progress, history, and data will be removed within 30 days.
          </p>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            style={{ padding: '9px 18px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
            <Trash2 size={13} /> Delete My Account
          </button>
        </div>

      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 24 }}>
          <div style={{ background: '#141721', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 16, padding: 32, maxWidth: 440, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertTriangle size={20} color="#ef4444" />
                <h2 style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: 0 }}>Delete Account</h2>
              </div>
              <button onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); setDeleteError(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 24 }}>
              This will permanently delete your account, all progress, history, and data. This action <strong style={{ color: '#fff' }}>cannot be undone</strong>.
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
              Type your email address to confirm: <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{user.email}</strong>
            </p>
            <input
              type="email"
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              placeholder={user.email}
              style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, marginBottom: 16, boxSizing: 'border-box', outline: 'none' }}
            />
            {deleteError && <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 12 }}>{deleteError}</p>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); setDeleteError(''); }}
                style={{ flex: 1, padding: '10px 0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteInput !== user.email || deleting}
                style={{ flex: 1, padding: '10px 0', background: deleteInput === user.email ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${deleteInput === user.email ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 8, color: deleteInput === user.email ? '#ef4444' : 'rgba(255,255,255,0.2)', fontSize: 13, fontWeight: 700, cursor: deleteInput === user.email ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                <Trash2 size={13} /> {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 24, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        {icon}
        <h3 style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const EFFECTIVE_DATE = 'March 1, 2026';
const COMPANY_NAME = 'Cybersecurity Translator';
const CONTACT_EMAIL = 'privacy@cybersecuritytranslator.com';

export function PrivacyPage() {
  return (
    <div style={{ background: '#0a0c10', minHeight: '100vh', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none', marginBottom: 40 }}>
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 48 }}>Effective: {EFFECTIVE_DATE}</p>

        <LegalSection title="1. Overview">
          <p>{COMPANY_NAME} ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains what data we collect, how we use it, and your rights regarding that data. By using the Service, you consent to the practices described here.</p>
        </LegalSection>

        <LegalSection title="2. Information We Collect">
          <p><strong style={{ color: 'rgba(255,255,255,0.8)' }}>Account Information</strong> — When you sign in with Google, we receive your name, email address, and profile picture from Google's OAuth service.</p>
          <p style={{ marginTop: 10 }}><strong style={{ color: 'rgba(255,255,255,0.8)' }}>Usage Data</strong> — We collect data about how you use the platform: scenarios completed, scores, case file submissions, mission step progress, and session activity.</p>
          <p style={{ marginTop: 10 }}><strong style={{ color: 'rgba(255,255,255,0.8)' }}>Payment Information</strong> — Subscription payments are processed by a third-party payment processor (e.g., Stripe). We do not store full payment card details.</p>
          <p style={{ marginTop: 10 }}><strong style={{ color: 'rgba(255,255,255,0.8)' }}>Technical Data</strong> — Standard server logs including IP address, browser type, device type, and page visits.</p>
        </LegalSection>

        <LegalSection title="3. How We Use Your Data">
          <p>We use your data to:</p>
          <ul>
            <li>Provide and improve the Service</li>
            <li>Track your learning progress and generate AI debriefs</li>
            <li>Process subscription payments and send billing communications</li>
            <li>Send product updates and educational content (you can opt out at any time)</li>
            <li>Respond to support requests</li>
            <li>Detect and prevent fraud or abuse</li>
          </ul>
          <p style={{ marginTop: 10 }}>We do not sell your personal data to third parties.</p>
        </LegalSection>

        <LegalSection title="4. Data Sharing">
          <p>We may share your data with:</p>
          <ul>
            <li><strong style={{ color: 'rgba(255,255,255,0.8)' }}>Service providers</strong> — Payment processors, hosting providers, and analytics services operating under confidentiality agreements</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.8)' }}>AI providers</strong> — Debrief and feedback features may send anonymized scenario responses to AI API providers</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.8)' }}>Legal requirements</strong> — If required by law, court order, or to protect our rights</li>
          </ul>
        </LegalSection>

        <LegalSection title="5. Cookies and Local Storage">
          <p>We use browser localStorage to maintain your login session and save preferences (such as email notification settings). We may use minimal cookies for session management. We do not use advertising or cross-site tracking cookies.</p>
        </LegalSection>

        <LegalSection title="6. Data Retention">
          <p>We retain your account data for as long as your account is active. After account deletion, we delete or anonymize your personal data within 30 days, except where retention is required by law (e.g., billing records may be retained for up to 7 years).</p>
        </LegalSection>

        <LegalSection title="7. Your Rights">
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li><strong style={{ color: 'rgba(255,255,255,0.8)' }}>Access</strong> — Request a copy of the data we hold about you</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.8)' }}>Correction</strong> — Request correction of inaccurate data</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.8)' }}>Deletion</strong> — Request deletion of your account and personal data (available in <Link to="/account" style={{ color: '#14b8a6' }}>Account Settings</Link>)</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.8)' }}>Portability</strong> — Request an export of your data</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.8)' }}>Opt-out</strong> — Unsubscribe from marketing emails at any time in <Link to="/account" style={{ color: '#14b8a6' }}>Account Settings</Link> or via the unsubscribe link in any email</li>
          </ul>
          <p style={{ marginTop: 10 }}>To exercise these rights, email <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#14b8a6' }}>{CONTACT_EMAIL}</a>.</p>
        </LegalSection>

        <LegalSection title="8. Security">
          <p>We use industry-standard security measures including HTTPS encryption, secure token authentication, and access controls. No system is 100% secure; we encourage you to use a strong, unique password for your Google account.</p>
        </LegalSection>

        <LegalSection title="9. Children's Privacy">
          <p>The Service is not directed to children under 16. We do not knowingly collect personal data from children. If you believe a child has provided us with data, contact us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#14b8a6' }}>{CONTACT_EMAIL}</a>.</p>
        </LegalSection>

        <LegalSection title="10. Changes to this Policy">
          <p>We may update this Privacy Policy from time to time. Material changes will be communicated via email or in-app notice. Continued use after the effective date constitutes acceptance.</p>
        </LegalSection>

        <LegalSection title="11. Contact">
          <p>Privacy questions or requests? Contact our privacy team at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#14b8a6' }}>{CONTACT_EMAIL}</a>.</p>
        </LegalSection>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Link to="/terms" style={{ fontSize: 13, color: '#14b8a6', textDecoration: 'none' }}>Terms of Service</Link>
          <Link to="/account" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Account Settings</Link>
          <Link to="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Home</Link>
        </div>
      </div>
    </div>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 10 }}>{title}</h2>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.85 }}>{children}</div>
    </div>
  );
}

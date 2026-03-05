import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const EFFECTIVE_DATE = 'March 1, 2026';
const COMPANY_NAME = 'Cybersecurity Translator';
const CONTACT_EMAIL = 'legal@cybersecuritytranslator.com';

export function TermsPage() {
  return (
    <div style={{ background: '#0a0c10', minHeight: '100vh', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none', marginBottom: 40 }}>
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 48 }}>Effective: {EFFECTIVE_DATE}</p>

        <LegalSection title="1. Acceptance of Terms">
          <p>By accessing or using {COMPANY_NAME} ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service. Your continued use constitutes acceptance of any updates.</p>
        </LegalSection>

        <LegalSection title="2. Description of Service">
          <p>{COMPANY_NAME} provides an interactive cybersecurity training platform including flashcard learning, scenario-based exercises, case file workbooks, and AI-assisted debriefs. Content is for educational and professional development purposes only and does not constitute professional security, legal, or compliance advice.</p>
        </LegalSection>

        <LegalSection title="3. User Accounts">
          <p>You are responsible for maintaining the confidentiality of your account credentials and all activity under your account. Notify us immediately at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#14b8a6' }}>{CONTACT_EMAIL}</a> of any unauthorized use. We reserve the right to terminate accounts that violate these terms.</p>
        </LegalSection>

        <LegalSection title="4. Subscriptions and Billing">
          <p>Paid subscriptions auto-renew unless cancelled before the renewal date. You may cancel at any time from Account Settings; cancellation takes effect at the end of the current billing period. We do not offer refunds for partial periods unless required by law. Prices may change with 30 days' notice.</p>
        </LegalSection>

        <LegalSection title="5. Acceptable Use">
          <p>You agree not to: use the Service unlawfully; share, resell, or redistribute platform content without written permission; reverse-engineer or systematically scrape the platform; use content to train competing AI models; misrepresent your identity; or interfere with the Service's security or availability.</p>
        </LegalSection>

        <LegalSection title="6. Intellectual Property">
          <p>All content — including scenario text, case files, learning materials, UI design, and AI-generated feedback — is the intellectual property of {COMPANY_NAME} or its licensors. You receive a limited, non-exclusive, non-transferable license for personal or professional use only. No content may be reproduced or distributed without prior written consent.</p>
          <p style={{ marginTop: 12 }}>MITRE ATT&CK® is a registered trademark of The MITRE Corporation. {COMPANY_NAME} is not affiliated with or endorsed by MITRE.</p>
        </LegalSection>

        <LegalSection title="7. Privacy">
          <p>Your use of the Service is governed by our <Link to="/privacy" style={{ color: '#14b8a6' }}>Privacy Policy</Link>, incorporated into these Terms by reference.</p>
        </LegalSection>

        <LegalSection title="8. Disclaimers">
          <p>The Service is provided "as is" without warranties of any kind. We do not warrant that the Service will be uninterrupted, error-free, or current. Training content reflects general cybersecurity knowledge and may not reflect the latest threat landscape.</p>
        </LegalSection>

        <LegalSection title="9. Limitation of Liability">
          <p>To the maximum extent permitted by law, {COMPANY_NAME} shall not be liable for any indirect, incidental, special, or consequential damages. Our total liability shall not exceed amounts paid by you in the 12 months preceding the claim.</p>
        </LegalSection>

        <LegalSection title="10. Termination">
          <p>We may suspend or terminate your access at any time for violation of these terms. You may delete your account at any time from Account Settings. Upon termination, your right to use the Service ceases immediately.</p>
        </LegalSection>

        <LegalSection title="11. Changes to Terms">
          <p>We may modify these Terms at any time. Material changes will be communicated via email or in-app notice at least 14 days before taking effect. Continued use after the effective date constitutes acceptance.</p>
        </LegalSection>

        <LegalSection title="12. Governing Law">
          <p>These Terms are governed by the laws of the State of Delaware, United States. Disputes shall be resolved in the courts of Delaware.</p>
        </LegalSection>

        <LegalSection title="13. Contact">
          <p>Questions about these Terms? Email us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#14b8a6' }}>{CONTACT_EMAIL}</a>.</p>
        </LegalSection>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Link to="/privacy" style={{ fontSize: 13, color: '#14b8a6', textDecoration: 'none' }}>Privacy Policy</Link>
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

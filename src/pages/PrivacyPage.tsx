import { SalesFooter } from '../components/sales/SalesFooter';

export function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="legal-page-content">
        <h1>Privacy Policy</h1>
        <p className="legal-page-updated">Last Updated: [Date]</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            [Company Name] ("we," "us," or "our") operates the CyberSecurity Learner platform ("Service").
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
            use our Service. Please read this policy carefully. By using the Service, you consent to the practices
            described in this Privacy Policy.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>

          <h3>Account Information</h3>
          <p>
            When you create an account through Google OAuth, we receive and store the following information
            from your Google profile:
          </p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Profile picture URL</li>
            <li>Google account identifier</li>
          </ul>

          <h3>Payment Information</h3>
          <p>
            If you subscribe to a paid plan, payment processing is handled by Stripe. We do not directly store
            your credit card number or full payment details. Stripe may share with us:
          </p>
          <ul>
            <li>Last four digits of your card</li>
            <li>Card brand and expiration date</li>
            <li>Billing address</li>
            <li>Transaction history and subscription status</li>
          </ul>

          <h3>Usage Data</h3>
          <p>We automatically collect information about how you interact with the Service, including:</p>
          <ul>
            <li>Pages visited and features used</li>
            <li>Learning progress and quiz/scenario results</li>
            <li>Time spent on the platform</li>
            <li>Device type, browser type, and operating system</li>
            <li>IP address and approximate geographic location</li>
            <li>Referring URLs and search terms</li>
          </ul>

          <h3>Cookies and Similar Technologies</h3>
          <p>
            We use cookies and similar tracking technologies to maintain your session, remember your preferences,
            and analyze usage patterns. You can control cookie preferences through your browser settings, though
            disabling cookies may affect Service functionality.
          </p>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve the Service</li>
            <li>Create and manage your account</li>
            <li>Process payments and manage subscriptions</li>
            <li>Track your learning progress and personalize your experience</li>
            <li>Send transactional emails (account confirmations, payment receipts, subscription changes)</li>
            <li>Communicate important updates about the Service</li>
            <li>Analyze usage trends to improve our educational content</li>
            <li>Detect, prevent, and address technical issues or abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Sharing and Third Parties</h2>
          <p>
            We do not sell your personal information. We may share your data with the following third-party
            service providers who assist in operating the Service:
          </p>
          <ul>
            <li><strong>Google</strong> — Authentication via Google OAuth</li>
            <li><strong>Stripe</strong> — Payment processing and subscription management</li>
            <li><strong>Supabase</strong> — Database hosting and backend infrastructure</li>
            <li><strong>Vercel</strong> — Application hosting and deployment</li>
            <li><strong>Analytics providers</strong> — Aggregated usage analytics (no personally identifiable information is shared)</li>
          </ul>
          <p>We may also disclose your information if required to do so by law or in response to valid legal requests by public authorities.</p>
        </section>

        <section>
          <h2>5. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is active or as needed to provide
            you with the Service. If you delete your account, we will delete or anonymize your personal data
            within 30 days, except where we are required to retain it for legal, accounting, or regulatory purposes.
          </p>
          <p>
            Aggregated, anonymized data that cannot be used to identify you may be retained indefinitely for
            analytics and Service improvement purposes.
          </p>
        </section>

        <section>
          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information,
            including:
          </p>
          <ul>
            <li>Encryption of data in transit (TLS/SSL)</li>
            <li>Encryption of sensitive data at rest</li>
            <li>Regular security assessments</li>
            <li>Access controls limiting employee access to personal data</li>
          </ul>
          <p>
            However, no method of transmission over the Internet or electronic storage is 100% secure. While we
            strive to protect your information, we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Data Portability:</strong> Request a copy of your data in a structured, machine-readable format</li>
            <li><strong>Objection:</strong> Object to certain processing of your personal data</li>
            <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at{' '}
            <a href="mailto:socialfunnels@gmail.com">socialfunnels@gmail.com</a>.
            We will respond to your request within 30 days.
          </p>
        </section>

        <section>
          <h2>8. Children's Privacy</h2>
          <p>
            The Service is not intended for children under the age of 13 (or the applicable age of consent in
            your jurisdiction). We do not knowingly collect personal information from children. If we become
            aware that we have collected personal data from a child without parental consent, we will take steps
            to delete that information promptly.
          </p>
        </section>

        <section>
          <h2>9. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence.
            These countries may have different data protection laws. By using the Service, you consent to the
            transfer of your information to such countries. We take appropriate safeguards to ensure your data
            remains protected in accordance with this Privacy Policy.
          </p>
        </section>

        <section>
          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes by
            posting the updated policy on this page and updating the "Last Updated" date. For significant changes,
            we will provide additional notice via email or in-app notification. Your continued use of the Service
            after changes are posted constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2>11. Contact Information</h2>
          <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
          <ul>
            <li>Email: <a href="mailto:socialfunnels@gmail.com">socialfunnels@gmail.com</a></li>
            <li>[Company Name]</li>
            <li>[Company Address]</li>
          </ul>
        </section>
      </div>

      <SalesFooter />
    </div>
  );
}

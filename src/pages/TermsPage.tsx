import { SalesFooter } from '../components/sales/SalesFooter';

export function TermsPage() {
  return (
    <div className="legal-page">
      <div className="legal-page-content">
        <h1>Terms of Service</h1>
        <p className="legal-page-updated">Last Updated: [Date]</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the CyberSecurity Learner platform ("Service"), operated by [Company Name] ("we," "us," or "our"),
            you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.
          </p>
          <p>
            We reserve the right to update or modify these Terms at any time. Your continued use of the Service after any changes constitutes
            acceptance of the revised Terms. We will notify registered users of material changes via email or in-app notification.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            CyberSecurity Learner is an educational platform that helps security professionals, students, and GRC teams learn and
            understand MITRE ATT&CK techniques through interactive flashcards, scenario-based learning, and case file exercises.
          </p>
          <p>
            The Service is provided for educational and informational purposes only. It is not affiliated with or endorsed by the
            MITRE Corporation. MITRE ATT&CK is a registered trademark of The MITRE Corporation.
          </p>
        </section>

        <section>
          <h2>3. User Accounts</h2>
          <p>
            To access certain features of the Service, you must create an account by authenticating through Google OAuth.
            By creating an account, you agree to:
          </p>
          <ul>
            <li>Provide accurate and complete information during registration</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
            <li>Accept responsibility for all activities that occur under your account</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate accounts that violate these Terms or that we reasonably believe have been compromised.
          </p>
        </section>

        <section>
          <h2>4. Subscription Plans and Payment</h2>
          <p>
            The Service offers both free and paid subscription tiers. Paid plans are billed on a recurring monthly basis through
            our payment processor, Stripe.
          </p>
          <ul>
            <li><strong>Free Tier:</strong> Limited access to core features at no cost.</li>
            <li><strong>Paid Tiers (Starter, Professional, Team):</strong> Enhanced features and increased usage limits as described on our pricing page.</li>
          </ul>
          <p>By subscribing to a paid plan, you agree that:</p>
          <ul>
            <li>You authorize recurring charges to your provided payment method</li>
            <li>Subscription fees are billed in advance on a monthly basis</li>
            <li>You may cancel your subscription at any time; access continues until the end of your current billing period</li>
            <li>Refunds are handled on a case-by-case basis at our sole discretion</li>
            <li>We reserve the right to change pricing with 30 days' notice to existing subscribers</li>
          </ul>
        </section>

        <section>
          <h2>5. Intellectual Property</h2>
          <p>
            All content, features, and functionality of the Service — including but not limited to text, graphics, logos, icons,
            software, and educational materials — are owned by [Company Name] and are protected by copyright, trademark, and other
            intellectual property laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise exploit any
            content from the Service without our prior written consent.
          </p>
        </section>

        <section>
          <h2>6. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Violate any applicable law or regulation</li>
            <li>Infringe upon the rights of others</li>
            <li>Attempt to gain unauthorized access to the Service, other accounts, or related systems</li>
            <li>Use the Service for any malicious, harmful, or unlawful purpose</li>
            <li>Interfere with or disrupt the Service or its infrastructure</li>
            <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
            <li>Share account credentials or allow multiple individuals to use a single account (unless on a Team plan)</li>
            <li>Scrape, data-mine, or use automated tools to extract content from the Service</li>
          </ul>
        </section>

        <section>
          <h2>7. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
            INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT.
          </p>
          <p>
            We do not warrant that the Service will be uninterrupted, error-free, or secure. Educational content provided
            through the Service is for learning purposes and should not be relied upon as professional cybersecurity advice.
          </p>
        </section>

        <section>
          <h2>8. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, [COMPANY NAME] AND ITS OFFICERS, DIRECTORS, EMPLOYEES,
            AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
            INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH
            YOUR USE OF THE SERVICE.
          </p>
          <p>
            IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU HAVE PAID US IN THE TWELVE (12) MONTHS PRECEDING
            THE CLAIM, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
          </p>
        </section>

        <section>
          <h2>9. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless [Company Name] and its officers, directors, employees, and agents
            from and against any claims, liabilities, damages, losses, or expenses (including reasonable attorneys' fees) arising
            out of or in connection with your use of the Service or violation of these Terms.
          </p>
        </section>

        <section>
          <h2>10. Termination</h2>
          <p>
            We may suspend or terminate your access to the Service at any time, with or without cause, and with or without notice.
            Upon termination:
          </p>
          <ul>
            <li>Your right to access and use the Service will cease immediately</li>
            <li>Any active paid subscription will be canceled (pro-rated refunds may be issued at our discretion)</li>
            <li>We may delete your account data after a reasonable retention period</li>
          </ul>
          <p>
            You may terminate your account at any time by contacting us. Sections that by their nature should survive
            termination (including Intellectual Property, Limitation of Liability, and Indemnification) will remain in effect.
          </p>
        </section>

        <section>
          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of [State/Jurisdiction],
            without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved
            exclusively in the courts located in [State/Jurisdiction].
          </p>
        </section>

        <section>
          <h2>12. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or
            eliminated to the minimum extent necessary so that the remaining provisions remain in full force and effect.
          </p>
        </section>

        <section>
          <h2>13. Contact Information</h2>
          <p>If you have any questions about these Terms of Service, please contact us at:</p>
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

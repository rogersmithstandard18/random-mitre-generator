import { SalesFooter } from '../components/sales/SalesFooter';

export function AboutPage() {
  return (
    <div className="legal-page">
      <div className="legal-page-content">
        <h1>About CyberSecurity Learner</h1>

        <section>
          <h2>Our Mission</h2>
          <p>
            Cybersecurity shouldn't feel like learning a foreign language. CyberSecurity Learner was built to
            bridge the gap between complex MITRE ATT&CK techniques and the plain-language understanding that
            security professionals, students, and business leaders actually need. Whether you're studying for
            a certification, briefing executives on risk, or training the next generation of defenders, this
            platform translates the technical into the practical.
          </p>
        </section>

        <section>
          <h2>What We Offer</h2>
          <ul>
            <li>
              <strong>Translation Cards</strong> — Every MITRE ATT&CK technique explained in clear,
              plain-language terms with real-world context, risk categories, and business impact.
            </li>
            <li>
              <strong>SOC Scenarios</strong> — Interactive incident response scenarios that put you in
              the analyst's seat, building practical decision-making skills.
            </li>
            <li>
              <strong>Case Files</strong> — Gamified threat detection challenges where you investigate
              and identify attacker techniques in realistic environments.
            </li>
            <li>
              <strong>Learning Paths</strong> — Structured content for Blue Team, Red Team, Purple Team,
              and GRC professionals, so you can focus on what matters for your role.
            </li>
            <li>
              <strong>Spaced Repetition</strong> — A smart flashcard system designed to help you retain
              what you learn, not just cram and forget.
            </li>
          </ul>
        </section>

        <section>
          <h2>Meet the Creator</h2>
          <p>
            Hi — I'm the person behind CyberSecurity Learner, and I built this because I've lived on both
            sides of the cybersecurity education challenge.
          </p>
          <p>
            I spent 10 years working at Arizona State University's University Technology Office 
            solving real problems across a major research institution. I hold a
            Bachelor of Science in Information Technology from ASU's Ira A. Fulton Schools of Engineering,
            and that foundation has shaped everything I do.
          </p>
          <p>
            For the past 4 years, I've been instructing IT security at a vocational school, teaching adults
            who are changing careers or leveling up their skills. Now I'm transitioning into secondary
            education, bringing IT security instruction to high school students through both one-year and
            two-year cohort programs. I have a CTE certification in standardized specialized
            CTE industry and emerging technology, which reflects my commitment to meeting students where
            they are — whether they're career changers or just getting started.
          </p>
          <p>
            I built this app because I kept seeing the same problem in my classrooms and in the industry:
            people struggling to connect abstract framework concepts to real-world meaning. CyberSecurity
            Learner is my answer to that, a tool that makes MITRE ATT&CK genuinely accessible.
          </p>
          <p>
            This app was vibe engineered — built with AI-assisted development and a whole lot of domain
            expertise. It's a reflection of how modern tools and deep subject-matter knowledge can come
            together to create something meaningful.
          </p>
        </section>

        <section>
          <h2>Continuous Improvement</h2>
          <p>
            CyberSecurity Learner is actively maintained and continuously improving. New techniques,
            scenarios, and features are added regularly to keep pace with the evolving threat landscape
            and the needs of learners at every level. If you have feedback or ideas, I'd love to hear
            from you.
          </p>
        </section>
      </div>
      <SalesFooter />
    </div>
  );
}

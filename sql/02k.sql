-- Run 11 of 12 (entries 51-55 of 60)
-- ============================================================
-- 02_seed_techniques.sql
-- Run this second — seeds all 70 MITRE ATT&CK techniques
-- ============================================================

INSERT INTO techniques (
  technique_id, technique_name, tactic, tactic_id, difficulty,
  learning_paths, plain_explanation, risk_category, risk_description,
  boardroom_pitch, industry_impacts, detection_hints, mitigations,
  reflection_question, spot_the_risk
) VALUES
('T1491', 'Defacement', 'Impact', 'TA0012', 'Beginner',
 ARRAY['Blue Team', 'GRC Focus'],
 'Attackers modify the visual content of websites or internal systems to display their own messaging — for political statements, reputation damage, or to signal a successful breach.',
 'Loss of Confidence',
 'Website defacement is one of the most visible and embarrassing cyberattacks. Even if systems are restored quickly, the reputational damage and customer confidence impact can be severe.',
 'A defaced website tells the world we were breached before our communications team can respond. Reputational recovery from a public defacement takes far longer than technical recovery.',
 '[{"industry":"Government","description":"Government agency website defaced with political messaging, triggering media coverage and public concern."},{"industry":"Retail","description":"E-commerce homepage replaced with attacker content, driving customers to competitors and triggering stock impact."}]',
 ARRAY['File integrity monitoring on web content directories','Web application change detection','CDN purge event monitoring'],
 ARRAY['File integrity monitoring on web servers','Web application firewall','Immutable web content deployment pipelines'],
 'Why is website defacement often a sign of a deeper, more serious compromise than it appears?',
 'The company''s public website is replaced with a hacktivist message at 8 AM. Customer service is flooded with calls before the security team is notified.'),

('T1489', 'Service Stop', 'Impact', 'TA0012', 'Intermediate',
 ARRAY['Blue Team', 'Purple Team'],
 'Attackers stop critical services — backup agents, security tools, databases — to maximize the impact of their attack and prevent recovery.',
 'Business Interruption',
 'Stopping backup and security services before deploying ransomware or wipers ensures maximum damage and minimum recovery options.',
 'Ransomware operators systematically disable backup services before encrypting data. If our backups stop running and nobody notices, our recovery options disappear before the attack even begins.',
 '[{"industry":"Healthcare","description":"Backup services stopped on hospital servers before ransomware deployment, eliminating recovery options."},{"industry":"Manufacturing","description":"Database services halted on production systems, shutting down manufacturing operations."}]',
 ARRAY['Service stop events for critical processes (Event ID 7036)','Backup agent health monitoring','Security tool service monitoring'],
 ARRAY['Protect critical service processes from termination','Out-of-band backup health monitoring','Tamper protection on security tools'],
 'Why do ransomware operators prioritize stopping backup services before deploying their payload?',
 'The backup agent service on all file servers stops within a 10-minute window on a Sunday night. Three hours later, ransomware begins encrypting files.'),

-- ── ADDITIONAL HIGH-VALUE TECHNIQUES ────────────────────────,
('T1566.002', 'Phishing: Spearphishing Link', 'Initial Access', 'TA0001', 'Intermediate',
 ARRAY['Blue Team', 'GRC Focus'],
 'Attackers send targeted phishing emails containing a malicious link crafted specifically for the recipient — using personal details to make the message convincing.',
 'Direct Financial Loss',
 'Spearphishing has a significantly higher success rate than generic phishing because it is personalized — the attacker has done research and the email feels legitimate.',
 'When attackers know a target''s name, role, projects, and manager, their phishing emails are nearly indistinguishable from real communications. Generic defenses are insufficient.',
 '[{"industry":"Financial Services","description":"Targeted executive phishing referencing real deal names and counterparties to steal M&A credentials."},{"industry":"Technology","description":"Developer-targeted phishing impersonating GitHub notifications for code review links."}]',
 ARRAY['URL click-time protection and sandboxing','User-reported phishing pipeline','Threat intelligence correlation on phishing domains'],
 ARRAY['Security awareness training with spearphishing simulations','Multi-factor authentication','Email authentication enforcement'],
 'What reconnaissance do attackers typically conduct before launching a spearphishing campaign?',
 'A sales executive receives an email referencing her real customer by name, her real colleague as the sender, and a link to "updated contract terms" — all details available on LinkedIn.'),

('T1499', 'Endpoint Denial of Service', 'Impact', 'TA0012', 'Intermediate',
 ARRAY['Blue Team', 'GRC Focus'],
 'Attackers target individual endpoints or applications with resource exhaustion to make them crash or become unresponsive, disrupting specific services.',
 'Business Interruption',
 'Application-layer denial of service can be launched with minimal traffic by targeting specific application vulnerabilities, making it harder to detect than volumetric attacks.',
 'Application-layer DoS attacks target specific features of our applications, not just the network. A small number of carefully crafted requests can crash a server that handles millions of normal requests.',
 '[{"industry":"Financial Services","description":"Trading application endpoint targeted with resource-exhaustion requests during peak market hours."},{"industry":"Healthcare","description":"Electronic health record application made unresponsive during a critical care period."}]',
 ARRAY['Application performance monitoring anomaly detection','Rate limiting rule triggers','Error rate spikes in application logs'],
 ARRAY['Rate limiting and request validation','Web application firewall with behavioral rules','Horizontal scaling and load balancing'],
 'What is the difference between a network-layer DDoS attack and an application-layer DoS attack?',
 'A web application becomes unresponsive to legitimate users after receiving 500 requests per second — well below the network bandwidth limit — because each request triggers an expensive database query.'),

('T1110.003', 'Brute Force: Password Spraying', 'Credential Access', 'TA0006', 'Beginner',
 ARRAY['Blue Team', 'GRC Focus'],
 'Attackers try one or a few common passwords against many different accounts to avoid lockout policies — trading speed for stealth.',
 'Regulatory Action',
 'Password spraying evades lockout thresholds by staying under the failed-login limit on each account, making it nearly invisible to traditional account lockout monitoring.',
 'Password spraying finds the weakest password in the organization. All it takes is one account with "Winter2024!" and the attacker has a foothold. Password policy enforcement is non-negotiable.',
 '[{"industry":"Healthcare","description":"Staff accounts compromised through spraying with seasonal passwords, exposing patient data systems."},{"industry":"Financial Services","description":"Password spray against Microsoft 365 gaining access to executive email accounts."}]',
 ARRAY['Distributed failed login detection across multiple accounts','Baseline deviation alerts for login failure rates','Identity protection spray detection analytics'],
 ARRAY['Ban common passwords with breach-password screening','Multi-factor authentication on all accounts','Identity protection policies in Azure AD / Entra ID'],
 'Why does password spraying bypass traditional account lockout policies?',
 'Azure AD sign-in logs show 2 failed logins on each of 400 accounts within a 30-minute window — all using the same password. No single account hit the lockout threshold.')
ON CONFLICT (technique_id) DO NOTHING;

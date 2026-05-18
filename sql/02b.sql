-- Run 2 of 12 (entries 6-10 of 60)
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
('T1583', 'Acquire Infrastructure', 'Resource Development', 'TA0042', 'Advanced',
 ARRAY['Red Team', 'Purple Team'],
 'Attackers rent or buy servers, domains, and cloud accounts to stage attacks, host payloads, and run command-and-control infrastructure that looks legitimate.',
 'Business Interruption',
 'Attack infrastructure hosted on legitimate cloud providers is nearly impossible to block by IP reputation alone — attackers hide behind the same services we use.',
 'Attackers buy domain names similar to ours, rent servers on the same cloud providers we use, and obtain TLS certificates to appear legitimate. Traditional blocklists struggle to keep up.',
 '[{"industry":"Technology","description":"Attacker-controlled subdomains impersonating SaaS vendor login pages for credential harvesting."},{"industry":"Financial Services","description":"Typosquat domains impersonating bank portals used in phishing campaigns against customers."}]',
 ARRAY['Typosquat domain monitoring','Certificate Transparency monitoring for brand impersonation','Threat intelligence feeds for new C2 infrastructure'],
 ARRAY['Brand protection monitoring service','DMARC enforcement to prevent domain impersonation','Customer education about official domain names'],
 'Why is it difficult to block attacker infrastructure when it is hosted on major cloud providers?',
 'A certificate transparency alert shows a new TLS certificate issued for "company-support-portal.com" — one letter different from the real company domain.'),

-- ── INITIAL ACCESS ──────────────────────────────────────────,
('T1566', 'Phishing', 'Initial Access', 'TA0001', 'Beginner',
 ARRAY['Blue Team', 'GRC Focus'],
 'Attackers send deceptive emails or messages to trick users into clicking malicious links, opening weaponized attachments, or revealing credentials.',
 'Direct Financial Loss',
 'A single successful phishing email can grant an attacker a foothold inside the corporate network, leading to data theft, ransomware deployment, or wire-fraud losses.',
 'Phishing is the number-one way attackers get inside organizations. One click by one employee can expose customer data, trigger regulatory fines, and halt operations.',
 '[{"industry":"Financial Services","description":"Business email compromise leading to fraudulent wire transfers and account takeover."},{"industry":"Healthcare","description":"Credential harvesting that exposes electronic health records and triggers HIPAA breach notifications."},{"industry":"Retail","description":"Point-of-sale credential theft resulting in payment card data exposure."}]',
 ARRAY['Email gateway filtering for suspicious attachments','URL sandboxing and click-time protection','User-reported phishing workflows'],
 ARRAY['Security awareness training','Multi-factor authentication','DMARC / DKIM / SPF email authentication'],
 'Why is phishing still the most common initial access vector despite decades of awareness training?',
 'A finance team member receives an email from the CEO asking for an urgent wire transfer. The email address is one letter off from the real domain.'),

('T1190', 'Exploit Public-Facing Application', 'Initial Access', 'TA0001', 'Intermediate',
 ARRAY['Red Team', 'Blue Team'],
 'Attackers exploit vulnerabilities in internet-facing applications such as web servers, VPNs, or email gateways to gain unauthorized access.',
 'Business Interruption',
 'An unpatched public application can be weaponized to breach the perimeter, potentially taking down customer-facing services and exposing backend databases.',
 'When our web applications or VPN gateways have known vulnerabilities, attackers can walk right in. Timely patching is a direct investment in business continuity.',
 '[{"industry":"Technology","description":"SaaS platform compromise affecting thousands of downstream customers."},{"industry":"Government","description":"Exploitation of citizen-facing portals leading to mass PII exposure."}]',
 ARRAY['Web application firewall (WAF) alerts','Anomalous POST requests or error spikes','Vulnerability scan correlation'],
 ARRAY['Timely patch management','Web application firewalls','Network segmentation behind DMZ'],
 'What factors make patching public-facing applications difficult for large organizations?',
 'A vulnerability scan shows a critical CVE on the company VPN appliance. The patch has been available for 60 days but has not been applied.'),

('T1195', 'Supply Chain Compromise', 'Initial Access', 'TA0001', 'Advanced',
 ARRAY['Purple Team', 'GRC Focus'],
 'Attackers compromise a trusted third-party vendor or software update mechanism to distribute malicious code to the vendor''s customers.',
 'Legal Liability',
 'A compromised vendor update can silently install backdoors across thousands of organizations, creating massive legal exposure and trust erosion.',
 'When a trusted software vendor is compromised, their update becomes our vulnerability. Third-party risk management is essential to protect the entire supply chain.',
 '[{"industry":"Government","description":"Nation-state actors targeting government IT management software to access classified networks."},{"industry":"Technology","description":"Compromised developer tools or libraries affecting thousands of downstream applications."}]',
 ARRAY['Software bill of materials (SBOM) monitoring','Behavioral analysis of software updates','Network traffic anomaly detection post-update'],
 ARRAY['Vendor security assessments','Software composition analysis','Zero-trust architecture for vendor connections'],
 'How does the SolarWinds incident illustrate the cascading risk of supply chain compromise?',
 'A critical business application receives an automatic update from the vendor. The update was signed with a valid certificate but contains an unexpected outbound connection.'),

('T1078', 'Valid Accounts', 'Initial Access', 'TA0001', 'Intermediate',
 ARRAY['Blue Team', 'Red Team', 'GRC Focus'],
 'Attackers use stolen, purchased, or default credentials to log in as legitimate users — bypassing perimeter controls entirely because the login looks normal.',
 'Regulatory Action',
 'When an attacker logs in with a real username and password, traditional security tools see a legitimate user. Detection depends on behavioral analysis, not signature matching.',
 'Credential theft is the fastest path through our defenses. Once an attacker has a valid password, they are invisible to most security tools. Identity is our new perimeter.',
 '[{"industry":"Financial Services","description":"Purchased credential sets from dark web used to access online banking portals and initiate transfers."},{"industry":"Healthcare","description":"Stolen clinician credentials used to access patient records without triggering access controls."}]',
 ARRAY['Impossible travel alerts','MFA failure spike detection','Credential stuffing detection on login endpoints'],
 ARRAY['Multi-factor authentication on all accounts','Breach password screening','Privileged access management'],
 'How can organizations detect the use of valid but stolen credentials when the login itself appears normal?',
 'A domain admin account authenticates from an IP address in Eastern Europe at 3 AM. The legitimate owner of that account is on vacation in Florida.')
ON CONFLICT (technique_id) DO NOTHING;

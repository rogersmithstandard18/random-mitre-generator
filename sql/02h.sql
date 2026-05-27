-- Run 8 of 12 (entries 36-40 of 60)
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
('T1550', 'Use Alternate Authentication Material', 'Lateral Movement', 'TA0008', 'Advanced',
 ARRAY['Red Team', 'Purple Team'],
 'Attackers use stolen password hashes, Kerberos tickets, or tokens instead of plaintext passwords to authenticate and move laterally.',
 'Loss of Confidence',
 'Pass-the-hash and pass-the-ticket attacks bypass traditional authentication logging, making attacker movement invisible to standard monitoring.',
 'Attackers do not need to know passwords — stolen authentication tokens let them impersonate any user. This makes strong credential isolation and monitoring essential.',
 '[{"industry":"Financial Services","description":"Golden ticket attacks granting persistent, undetectable access to the entire Active Directory domain."},{"industry":"Technology","description":"Stolen OAuth tokens providing access to cloud services and SaaS applications without triggering MFA."}]',
 ARRAY['Kerberos anomaly detection (overpass-the-hash)','Token replay detection','Impossible travel for authentication events'],
 ARRAY['Credential Guard','Regular KRBTGT password rotation','Tiered administration model'],
 'What is the difference between pass-the-hash, pass-the-ticket, and golden ticket attacks?',
 'A Kerberos ticket for a domain admin account has a 10-year expiration. Normal tickets in this environment expire after 10 hours.'),

('T1534', 'Internal Spearphishing', 'Lateral Movement', 'TA0008', 'Intermediate',
 ARRAY['Blue Team', 'GRC Focus'],
 'Attackers use a compromised internal account to send phishing emails to colleagues — the message comes from a trusted coworker, making it far more convincing.',
 'Direct Financial Loss',
 'An internal phishing email from a known colleague bypasses email gateway controls and carries enormous social trust — the recipient has no reason to be suspicious.',
 'Once attackers have one mailbox, they weaponize it against everyone in the contact list. Internal phishing has a dramatically higher success rate than external campaigns.',
 '[{"industry":"Financial Services","description":"Compromised CFO email used to send wire transfer requests to the finance team — approved because the sender is trusted."},{"industry":"Technology","description":"Compromised developer account sending malicious code review links to the entire engineering department."}]',
 ARRAY['Unusual internal email sending volume','Links in internal email pointing to external domains','User-reported suspicious internal emails'],
 ARRAY['Email DLP for internal messages','Zero-trust verification for financial requests regardless of sender','Security awareness training covering internal phishing'],
 'Why is an internal phishing email significantly more dangerous than an external one?',
 'The CFO''s assistant receives an email from the CFO''s actual account asking her to urgently wire $75,000 to a new vendor. The CFO''s account was compromised 48 hours earlier.'),

-- ── COLLECTION ───────────────────────────────────────────────,
('T1114', 'Email Collection', 'Collection', 'TA0009', 'Intermediate',
 ARRAY['Blue Team', 'GRC Focus'],
 'Attackers access email accounts or servers to collect sensitive communications, contacts, attachments, and organizational intelligence.',
 'Legal Liability',
 'Email collections can expose attorney-client privilege, trade secrets, M&A plans, and regulated personal data — creating significant legal and regulatory exposure.',
 'Our email contains our most sensitive communications — legal strategy, financial plans, customer data. When attackers access mailboxes, the exposure is both legal and reputational.',
 '[{"industry":"Financial Services","description":"Access to executive mailboxes revealing upcoming M&A activity, enabling insider trading."},{"industry":"Government","description":"Collection of diplomatic communications for intelligence purposes."}]',
 ARRAY['Unusual mailbox access patterns (volume, time, location)','Email forwarding rule creation alerts','eDiscovery / compliance search monitoring'],
 ARRAY['Mailbox access auditing','Conditional access policies','Data loss prevention for email'],
 'Why is email one of the highest-value targets for both espionage and financial crime?',
 'A new inbox rule is created on the CFO''s mailbox forwarding all emails containing "merger," "acquisition," or "confidential" to an external Gmail address.'),

('T1113', 'Screen Capture', 'Collection', 'TA0009', 'Beginner',
 ARRAY['Blue Team', 'Red Team'],
 'Attackers take screenshots of the victim''s desktop to capture displayed information such as documents, credentials, or sensitive applications.',
 'Loss of Confidence',
 'Screen captures can expose any information visible on screen, including data not stored in files — such as dashboards, messages, and live transactions.',
 'Attackers can silently photograph everything on an employee''s screen. This captures data that never gets saved to a file — trading screens, chat messages, client information.',
 '[{"industry":"Financial Services","description":"Screenshots of trading terminals capturing position data and order flow."},{"industry":"Healthcare","description":"Screen captures of patient charts during clinical review."}]',
 ARRAY['API calls to screen capture functions','Unusual image files in temp directories','EDR behavior analytics for screenshot tools'],
 ARRAY['Endpoint detection for screen capture APIs','Desktop watermarking','Application-level screen capture prevention'],
 'Why is screen capture particularly dangerous for organizations that handle sensitive visual data?',
 'An EDR alert shows a process repeatedly calling the Windows GDI screen capture API every 30 seconds and saving JPG files to a hidden temp folder.'),

('T1005', 'Data from Local System', 'Collection', 'TA0009', 'Beginner',
 ARRAY['Blue Team', 'Red Team'],
 'Attackers search through local files, folders, and drives on a compromised system to find sensitive data worth exfiltrating.',
 'Legal Liability',
 'A compromised endpoint often contains far more sensitive data than attackers expected — documents, credentials, configuration files, and cached data from cloud services.',
 'Every employee laptop is a potential data breach waiting to happen. Local data discovery is how attackers turn a single compromised workstation into a major data incident.',
 '[{"industry":"Technology","description":"Source code, API keys, and credentials found in developer home directories and desktop files."},{"industry":"Healthcare","description":"PHI-containing spreadsheets found on clinician laptops outside the approved data governance system."}]',
 ARRAY['Unusual file access patterns (breadth and volume)','DLP alerts on sensitive file type access','EDR behavioral detection for data staging activity'],
 ARRAY['Data loss prevention (DLP)','Enforce data classification and storage policies','Endpoint encryption for sensitive data at rest'],
 'What types of data are most commonly found on endpoints that organizations did not realize were there?',
 'A compromised workstation runs a script that searches for *.xlsx, *.pdf, and *.docx files containing keywords like "password," "SSN," and "confidential" and copies them to a zip file.')
ON CONFLICT (technique_id) DO NOTHING;

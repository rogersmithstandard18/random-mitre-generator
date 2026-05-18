-- Run 1 of 12 (entries 1-5 of 60)
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
-- ── RECONNAISSANCE ──────────────────────────────────────────,
('T1593', 'Search Open Websites/Domains', 'Reconnaissance', 'TA0043', 'Beginner',
 ARRAY['Red Team', 'GRC Focus'],
 'Attackers search public websites, social media, and domain records to gather information about the target organization before launching an attack.',
 'Loss of Confidence',
 'Public information leakage gives attackers intelligence about employees, technologies, and organizational structure — enabling more targeted and effective attacks.',
 'Everything we post publicly — job listings, social media, conference talks — gives attackers intelligence to craft targeted attacks. Information governance extends beyond our firewall.',
 '[{"industry":"Technology","description":"Job postings revealing specific technology stacks and security tools, enabling attackers to tailor exploits."},{"industry":"Financial Services","description":"LinkedIn profiles identifying key personnel for executive-targeted spearphishing."}]',
 ARRAY['Cannot typically be detected (pre-compromise activity)','Monitor for credential leaks on dark web','Track organizational mentions on paste sites'],
 ARRAY['OPSEC awareness training','Review public-facing information policies','Limit technology details in job postings'],
 'Why is reconnaissance almost impossible to detect, and how does that change our defensive strategy?',
 'A job posting for "Senior Security Engineer" lists the exact SIEM, EDR, and firewall vendors used by the organization.'),

('T1596', 'Search Open Technical Databases', 'Reconnaissance', 'TA0043', 'Intermediate',
 ARRAY['Red Team', 'Purple Team'],
 'Attackers query public technical databases like Shodan, Censys, or Certificate Transparency logs to find exposed services and infrastructure details.',
 'Loss of Confidence',
 'Public-facing assets that appear in Shodan or Censys give attackers a free inventory of your internet exposure before they touch a single system.',
 'Attackers use search engines for devices to find our exposed servers, misconfigured services, and forgotten test systems. What they find for free is what we must monitor and remediate.',
 '[{"industry":"Technology","description":"Exposed API endpoints and development servers discovered before internal teams know they are public."},{"industry":"Healthcare","description":"Medical device management interfaces indexed by Shodan and accessible without authentication."}]',
 ARRAY['Monitor Certificate Transparency logs for new certificates','Set up Shodan/Censys alerts for your IP ranges','ASM (attack surface management) tooling'],
 ARRAY['Attack surface management program','Regular external vulnerability scans','Firewall egress review for unintended exposure'],
 'What types of infrastructure are most commonly found exposed in Shodan scans?',
 'A Shodan search for the company''s IP range shows an RDP port open on a server the IT team believed was internal-only.'),

('T1598', 'Phishing for Information', 'Reconnaissance', 'TA0043', 'Beginner',
 ARRAY['Blue Team', 'GRC Focus'],
 'Attackers send phishing messages not to deliver malware, but purely to harvest information — credentials, org charts, or system details — before a larger attack.',
 'Loss of Confidence',
 'Reconnaissance phishing is harder to detect than malware phishing because nothing malicious executes — the attacker just wants answers to questions.',
 'Not all phishing is about malware. Some attackers use fake surveys, fake IT helpdesk emails, or impersonation calls to gather intelligence for a more targeted attack.',
 '[{"industry":"Financial Services","description":"Fake IT surveys collecting VPN client versions and two-factor methods from employees."},{"industry":"Government","description":"Impersonation emails asking staff to confirm their department and manager for a fake directory update."}]',
 ARRAY['User-reported phishing pipeline','Email gateway analytics for unusual reply-to patterns','Security awareness metrics tracking'],
 ARRAY['Security awareness training','Email authentication (DMARC/DKIM/SPF)','Never-reply-to-unsolicited-email policy'],
 'Why is information-gathering phishing harder to detect than payload-delivery phishing?',
 'An employee receives an email from "IT Support" asking them to reply with their username, current VPN client version, and whether they use hardware or software MFA tokens.'),

-- ── RESOURCE DEVELOPMENT ────────────────────────────────────,
('T1588', 'Obtain Capabilities', 'Resource Development', 'TA0042', 'Advanced',
 ARRAY['Purple Team', 'Red Team'],
 'Attackers acquire or develop tools, exploits, and infrastructure before launching an attack — including purchasing malware, exploits, or stolen credentials.',
 'Market Misconduct',
 'The availability of commoditized attack tools and stolen credential marketplaces lowers the barrier to entry for sophisticated attacks against any organization.',
 'Attackers can buy ready-made hacking tools and stolen credentials on underground markets. We must assume capable adversaries and invest in detection, not just prevention.',
 '[{"industry":"Financial Services","description":"Purchased zero-day exploits targeting banking applications for financial fraud."},{"industry":"Government","description":"State-sponsored acquisition of commercial spyware for surveillance operations."}]',
 ARRAY['Threat intelligence feeds for new exploit availability','Dark web monitoring for organizational credentials','Vulnerability correlation with known exploit markets'],
 ARRAY['Threat intelligence program','Proactive vulnerability management','Assume-breach security architecture'],
 'How does the commercialization of cyber attack tools change the threat landscape for organizations?',
 'Threat intelligence reports that a zero-day exploit for your primary VPN vendor is being sold on a dark web marketplace for $50,000.')
ON CONFLICT (technique_id) DO NOTHING;

-- Run 5 of 12 (entries 21-25 of 60)
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
('T1548', 'Abuse Elevation Control Mechanism', 'Privilege Escalation', 'TA0004', 'Intermediate',
 ARRAY['Red Team', 'Blue Team'],
 'Attackers bypass built-in access controls like UAC (Windows) or sudo (Linux) to execute code with elevated privileges without proper authorization.',
 'Audit Failure',
 'Circumventing elevation controls undermines the integrity of access management frameworks and creates findings during security audits.',
 'Our operating systems have built-in guardrails to prevent unauthorized elevation. When attackers bypass these, the entire access control model is compromised.',
 '[{"industry":"Manufacturing","description":"UAC bypass on engineering workstations enabling unauthorized changes to industrial control configurations."},{"industry":"Technology","description":"Sudo bypass on Linux servers granting root access to production infrastructure."}]',
 ARRAY['UAC bypass technique signatures','Unexpected sudo usage patterns','Process creation with unusual parent-child relationships'],
 ARRAY['Enforce UAC at highest level','Restrict sudo access tightly','Privileged access management (PAM) solutions'],
 'What is the difference between UAC bypass and a legitimate admin elevation?',
 'An endpoint alerts on a process spawning with SYSTEM privileges from a user-level application without any UAC prompt being displayed.'),

('T1055', 'Process Injection', 'Privilege Escalation', 'TA0004', 'Advanced',
 ARRAY['Red Team', 'Purple Team'],
 'Attackers inject malicious code into legitimate running processes to execute under the permissions of that process — gaining its privileges and evading detection.',
 'Business Interruption',
 'Code running inside a trusted process like svchost.exe or explorer.exe inherits its permissions and trust level, making malicious activity nearly invisible to standard tools.',
 'Attackers hide their code inside our legitimate processes. What looks like a normal Windows service is actually running attacker-controlled code. Behavioral monitoring is the only reliable defense.',
 '[{"industry":"Financial Services","description":"Malicious code injected into a banking application process to intercept transaction data."},{"industry":"Government","description":"Nation-state malware injecting into antivirus processes to gain elevated trust and evade detection."}]',
 ARRAY['Behavioral detection of cross-process memory writes','Parent-child process anomaly detection','EDR with memory scanning capabilities'],
 ARRAY['Endpoint detection with memory protection','Windows Defender Credential Guard','Attack surface reduction rules blocking process injection'],
 'Why is process injection one of the most difficult attacker techniques to detect reliably?',
 'An EDR alert shows explorer.exe writing into the memory space of lsass.exe — behavior that no legitimate user application should perform.'),

-- ── DEFENSE EVASION ─────────────────────────────────────────,
('T1070', 'Indicator Removal', 'Defense Evasion', 'TA0005', 'Intermediate',
 ARRAY['Blue Team', 'Purple Team'],
 'Attackers delete or modify logs, files, and other artifacts to remove evidence of their presence and make forensic investigation more difficult.',
 'Audit Failure',
 'Destroyed evidence impairs incident response, undermines forensic integrity, and can lead to regulatory penalties for inadequate log retention.',
 'When attackers erase their tracks, we lose visibility into what happened and what data was compromised. Centralized, tamper-proof logging is essential for both security and compliance.',
 '[{"industry":"Financial Services","description":"Cleared transaction logs making it impossible to reconstruct the scope of financial fraud."},{"industry":"Healthcare","description":"Deleted access logs preventing determination of which patient records were viewed or exfiltrated."}]',
 ARRAY['Log gap detection in SIEM','File integrity monitoring on log directories','Event log clearing event (Event ID 1102)'],
 ARRAY['Centralized log forwarding (SIEM)','Immutable log storage','Endpoint detection monitoring for log tampering'],
 'Why should logs be forwarded to a separate system in real time rather than stored only on the source machine?',
 'The Windows Security event log on a domain controller was cleared at 3 AM. The only remaining event is Event ID 1102 showing the log was cleared by an admin account.'),

('T1027', 'Obfuscated Files or Information', 'Defense Evasion', 'TA0005', 'Intermediate',
 ARRAY['Blue Team', 'Red Team'],
 'Attackers encode, encrypt, or otherwise obscure malicious code and data to evade signature-based detection tools like antivirus.',
 'Business Interruption',
 'Obfuscated malware can bypass security tools, extending attacker dwell time and increasing the blast radius of an incident before detection occurs.',
 'Modern attackers disguise their tools to slip past antivirus and email filters. This is why behavior-based detection and defense-in-depth are critical investments.',
 '[{"industry":"Technology","description":"Obfuscated scripts in CI/CD pipelines deploying hidden backdoors into production builds."},{"industry":"Government","description":"Encrypted payloads evading classified network monitoring tools."}]',
 ARRAY['Entropy analysis on suspicious files','Behavioral detection of decoded payloads at runtime','AMSI (Antimalware Scan Interface) integration'],
 ARRAY['Behavior-based endpoint protection','Sandboxing for file detonation','Script block logging and AMSI enforcement'],
 'Why are signature-based defenses insufficient against obfuscated malware?',
 'An email attachment passes antivirus scanning, but when executed, it decodes a Base64-encoded payload and establishes an outbound connection.'),

('T1562', 'Impair Defenses', 'Defense Evasion', 'TA0005', 'Intermediate',
 ARRAY['Blue Team', 'Purple Team'],
 'Attackers disable or tamper with security tools — antivirus, firewalls, logging agents — to blind defenders and operate without detection.',
 'Audit Failure',
 'When security tools go dark, attackers can operate freely. Alert fatigue from false positives is often exploited to normalize the silence before a major incident.',
 'If an attacker can turn off our alarms before committing the crime, everything else becomes easier. Monitoring the health of our security tools is just as important as the tools themselves.',
 '[{"industry":"Financial Services","description":"Antivirus service terminated on trading workstations before a credential dumping attack."},{"industry":"Healthcare","description":"Logging agent disabled on a hospital server hours before a ransomware deployment."}]',
 ARRAY['Security tool heartbeat monitoring','Alerts on AV/EDR service stop events','SIEM gap detection for missing log sources'],
 ARRAY['Protect security tool processes from termination','Tamper protection on endpoint agents','Out-of-band monitoring for tool health'],
 'How should organizations detect when their own security tools have been disabled or tampered with?',
 'The EDR console shows a workstation went offline 4 hours ago. The endpoint''s AV service was manually stopped by a process running as SYSTEM.')
ON CONFLICT (technique_id) DO NOTHING;

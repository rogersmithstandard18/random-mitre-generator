-- Run 4 of 12 (entries 16-20 of 60)
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
('T1547', 'Boot or Logon Autostart Execution', 'Persistence', 'TA0003', 'Intermediate',
 ARRAY['Blue Team', 'Red Team'],
 'Attackers configure malware to run automatically when the system boots or a user logs in, ensuring they maintain access even after a reboot.',
 'Business Interruption',
 'Persistent malware survives reboots and reimaging attempts, extending dwell time and increasing the cost and complexity of incident response.',
 'Once an attacker sets up persistence, simply restarting a computer does not remove them. Detection and remediation become significantly more expensive the longer they remain.',
 '[{"industry":"Government","description":"Persistent backdoors in government workstations enabling long-term intelligence collection."},{"industry":"Financial Services","description":"Malware surviving endpoint rebuilds and re-establishing access to trading platforms."}]',
 ARRAY['Registry run key monitoring','Startup folder change alerts','Scheduled task auditing'],
 ARRAY['Endpoint detection and response (EDR)','Application allowlisting','Regular baseline comparison of autostart locations'],
 'Why is persistence one of the first objectives for an attacker after gaining initial access?',
 'After a security incident, the IT team reimages an affected laptop. Within hours, the same C2 beacon reappears — the attacker placed a registry run key that was included in the system backup image.'),

('T1136', 'Create Account', 'Persistence', 'TA0003', 'Beginner',
 ARRAY['Blue Team', 'GRC Focus'],
 'Attackers create new user accounts on compromised systems or in cloud environments to maintain access that looks like a legitimate user.',
 'Audit Failure',
 'Unauthorized accounts that bypass normal provisioning workflows create gaps in identity governance and can go undetected during audits.',
 'If attackers can create their own accounts in our environment, they look like employees. This undermines our identity controls and can cause audit findings.',
 '[{"industry":"Healthcare","description":"Rogue accounts accessing electronic health records outside of approved clinical workflows."},{"industry":"Technology","description":"Unauthorized cloud IAM accounts provisioned with admin privileges across production environments."}]',
 ARRAY['Alerts on account creation outside of HR provisioning workflows','Cloud IAM change monitoring','Privileged account anomaly detection'],
 ARRAY['Identity governance and access reviews','Just-in-time account provisioning','Cloud security posture management'],
 'How can organizations detect the difference between a legitimately provisioned account and one created by an attacker?',
 'A new admin account appears in Active Directory at 11 PM on a Saturday. It was not created through the standard HR onboarding process.'),

('T1505', 'Server Software Component', 'Persistence', 'TA0003', 'Advanced',
 ARRAY['Blue Team', 'Red Team'],
 'Attackers plant web shells, malicious plugins, or backdoored server components on web servers to maintain persistent access through the web application layer.',
 'Business Interruption',
 'Web shells provide persistent backdoor access through port 443 — the same port used for normal HTTPS traffic — making them extremely difficult to detect and block.',
 'A web shell planted on our public-facing server gives attackers a permanent back door through our firewall. Standard perimeter controls cannot distinguish malicious web requests from legitimate ones.',
 '[{"industry":"Technology","description":"Web shell uploaded to a content management system giving persistent RCE through the web tier."},{"industry":"Government","description":"Malicious IIS module installed on a government web server providing stealthy persistent access."}]',
 ARRAY['File integrity monitoring on web server directories','Web application firewall anomaly detection','Unexpected child processes spawned by web server processes'],
 ARRAY['File integrity monitoring','Restrict web server write permissions','Regular scanning of web directories for unauthorized files'],
 'Why are web shells particularly difficult to detect compared to other persistence mechanisms?',
 'A file integrity alert fires on the web server — a new .aspx file appeared in the uploads directory. The file was not deployed by the development team.'),

('T1542', 'Pre-OS Boot', 'Persistence', 'TA0003', 'Advanced',
 ARRAY['Blue Team', 'Purple Team'],
 'Attackers modify firmware, boot records, or the boot process itself to execute malicious code before the operating system loads — surviving even full OS reinstalls.',
 'Business Interruption',
 'Firmware-level persistence is the ultimate attacker goal — it survives reimaging, OS reinstalls, and hard drive replacement, making it extraordinarily expensive to remediate.',
 'When attackers reach the firmware layer, standard incident response procedures fail. Reimaging does not help. Hardware replacement may be the only option — at enormous cost.',
 '[{"industry":"Government","description":"Nation-state firmware implants surviving classified system reimaging procedures."},{"industry":"Manufacturing","description":"BIOS-level persistence on industrial control workstations surviving standard recovery procedures."}]',
 ARRAY['UEFI Secure Boot monitoring','Firmware integrity verification tools','Unexpected firmware update events'],
 ARRAY['Enable UEFI Secure Boot','Firmware update management policy','Measured boot and TPM attestation'],
 'Why does firmware-level persistence represent the highest severity level of attacker persistence?',
 'A compromised server continues beaconing to a C2 server after three full OS reinstalls. The security team suspects a firmware-level implant.'),

-- ── PRIVILEGE ESCALATION ────────────────────────────────────,
('T1068', 'Exploitation for Privilege Escalation', 'Privilege Escalation', 'TA0004', 'Advanced',
 ARRAY['Red Team', 'Purple Team'],
 'Attackers exploit software vulnerabilities in the operating system or applications to gain higher privileges, such as moving from a standard user to administrator.',
 'Regulatory Action',
 'Privilege escalation allows attackers to access regulated data and critical systems, potentially triggering compliance violations and mandatory breach disclosures.',
 'When an attacker elevates from a regular user to an admin, they gain access to everything — customer data, financial systems, and intellectual property. Hardening systems against this is a compliance imperative.',
 '[{"industry":"Financial Services","description":"Escalation to domain admin enabling access to core banking systems and transaction databases."},{"industry":"Government","description":"Privilege escalation on classified networks enabling unauthorized access to sensitive information."}]',
 ARRAY['Endpoint exploit detection signatures','Unexpected privilege changes in SIEM','Kernel-level integrity monitoring'],
 ARRAY['Timely OS and application patching','Least privilege enforcement','Exploit guard / attack surface reduction rules'],
 'Why is the principle of least privilege the most effective defense against privilege escalation?',
 'A standard user account suddenly appears in the Domain Admins group. No change request or approval exists in the ticketing system.')
ON CONFLICT (technique_id) DO NOTHING;

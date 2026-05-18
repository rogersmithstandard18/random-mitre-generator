-- Run 7 of 12 (entries 31-35 of 60)
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
('T1087', 'Account Discovery', 'Discovery', 'TA0007', 'Beginner',
 ARRAY['Red Team', 'Blue Team'],
 'Attackers enumerate user accounts on local systems, domains, or cloud environments to identify high-value targets for further exploitation.',
 'Loss of Confidence',
 'Account enumeration reveals the organizational structure and identifies privileged accounts, providing attackers a roadmap for escalation.',
 'Attackers map out our user accounts to find admin and executive targets. Monitoring for unusual account queries helps us catch intruders during the reconnaissance phase.',
 '[{"industry":"Technology","description":"Enumeration of cloud IAM roles identifying service accounts with overprivileged access."},{"industry":"Financial Services","description":"Discovery of privileged trading system accounts for targeted credential attacks."}]',
 ARRAY['Unusual LDAP queries from non-admin workstations','Cloud API calls listing IAM users','Net user / net group command monitoring'],
 ARRAY['Restrict LDAP query access','Monitor cloud IAM API usage','Limit account visibility through tiered administration'],
 'Why is account discovery a critical step for attackers before lateral movement?',
 'A workstation in the marketing department is running "net group Domain Admins /domain" commands during business hours.'),

('T1046', 'Network Service Scanning', 'Discovery', 'TA0007', 'Beginner',
 ARRAY['Red Team', 'Blue Team'],
 'Attackers scan the internal network to discover available services, open ports, and potential targets for lateral movement.',
 'Business Interruption',
 'Internal scanning provides attackers a map of the network, revealing vulnerable services and pathways to critical systems.',
 'Once inside our network, attackers scan for open doors — unpatched services, exposed databases, management interfaces. Network segmentation limits what they can find.',
 '[{"industry":"Manufacturing","description":"Scanning revealing exposed SCADA and ICS systems on flat network segments."},{"industry":"Healthcare","description":"Discovery of unsegmented medical devices with known vulnerabilities."}]',
 ARRAY['Internal network scan detection (port sweep alerts)','Anomalous connection volume from single host','IDS/IPS signature for scanning tools'],
 ARRAY['Network segmentation and microsegmentation','Host-based firewalls','Intrusion detection systems on internal segments'],
 'How does network segmentation reduce the value of internal network scanning for an attacker?',
 'Network monitoring shows a single workstation attempting connections to port 445 on every IP address in the 10.0.0.0/16 subnet within 5 minutes.'),

('T1082', 'System Information Discovery', 'Discovery', 'TA0007', 'Beginner',
 ARRAY['Red Team', 'Blue Team'],
 'Attackers gather detailed information about the compromised system — OS version, hardware, installed software, network configuration — to plan their next moves.',
 'Loss of Confidence',
 'System enumeration tells attackers exactly what they are working with — what patches are missing, what security tools are installed, and what the network looks like from the inside.',
 'An attacker''s first move after getting in is to look around. System discovery commands run within minutes of a breach. Monitoring these commands is an early warning system.',
 '[{"industry":"Technology","description":"Automated discovery scripts enumerating cloud instance metadata, environment variables, and IAM roles."},{"industry":"Healthcare","description":"Medical device OS enumeration revealing end-of-life operating systems without security support."}]',
 ARRAY['Command-line monitoring for systeminfo, uname, hostname','Process execution analytics for discovery tool chains','Endpoint detection for enumeration script patterns'],
 ARRAY['Disable or restrict system information commands for standard users','Monitor and baseline discovery command usage','EDR behavioral detection for post-compromise discovery'],
 'What does an attacker learn from running "systeminfo" that makes it worth the detection risk?',
 'Within 10 minutes of a phishing email being opened, the affected endpoint runs systeminfo, ipconfig /all, net localgroup administrators, and whoami in rapid succession.'),

('T1057', 'Process Discovery', 'Discovery', 'TA0007', 'Beginner',
 ARRAY['Red Team', 'Blue Team'],
 'Attackers list running processes on a compromised system to identify security tools to avoid, high-value applications to target, and the overall security posture.',
 'Loss of Confidence',
 'By listing running processes, attackers immediately know which security tools are active and which applications hold sensitive data worth targeting.',
 'An attacker who knows our security tools can work around them. Process discovery gives attackers a real-time inventory of our defenses — and our valuable targets.',
 '[{"industry":"Financial Services","description":"Process listing revealing active trading platform processes to target for credential interception."},{"industry":"Technology","description":"Security tool discovery enabling attackers to adjust techniques to avoid specific EDR detection."}]',
 ARRAY['Behavioral detection of process enumeration commands (tasklist, ps)','Honey processes — fake security tool processes that alert when queried','Process access monitoring'],
 ARRAY['Deploy decoy security tool processes as honeypots','EDR with process enumeration detection','Limit access to process listing for standard user accounts'],
 'How can organizations use the attacker''s need to enumerate processes as a detection opportunity?',
 'A compromised endpoint runs tasklist.exe and the output is sent to a remote server. The process list reveals which EDR product is installed.'),

-- ── LATERAL MOVEMENT ────────────────────────────────────────,
('T1021', 'Remote Services', 'Lateral Movement', 'TA0008', 'Intermediate',
 ARRAY['Red Team', 'Blue Team'],
 'Attackers use legitimate remote access services like RDP, SSH, or SMB to move between systems using stolen credentials.',
 'Direct Financial Loss',
 'Lateral movement through remote services allows attackers to reach high-value targets like financial systems, databases, and domain controllers.',
 'Attackers use the same remote access tools our IT staff relies on. Without proper segmentation and monitoring, they can reach any system in the network.',
 '[{"industry":"Financial Services","description":"RDP lateral movement from a compromised workstation to payment processing servers."},{"industry":"Government","description":"SSH pivoting across segmented networks to reach classified information systems."}]',
 ARRAY['Unusual RDP/SSH sessions from non-admin endpoints','Lateral movement analytics in EDR','Authentication anomaly detection'],
 ARRAY['Network segmentation','Restrict remote service access to jump servers','Privileged access management'],
 'Why should organizations use jump servers instead of allowing direct RDP/SSH between all systems?',
 'A workstation in accounting establishes an RDP session to a database server at 11 PM. The account used has never accessed that server before.')
ON CONFLICT (technique_id) DO NOTHING;

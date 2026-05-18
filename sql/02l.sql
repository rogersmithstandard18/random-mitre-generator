-- Run 12 of 12 (entries 56-60 of 60)
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
('T1036', 'Masquerading', 'Defense Evasion', 'TA0005', 'Beginner',
 ARRAY['Blue Team', 'Red Team'],
 'Attackers disguise malicious files, processes, or services as legitimate ones by giving them names similar to trusted system components or software.',
 'Business Interruption',
 'A process named "svchost32.exe" looks legitimate to a casual observer but is not a real Windows process. Detection requires knowing what legitimate looks like.',
 'Attackers rename their tools to look like normal Windows processes or user applications. Without verified process integrity, it is nearly impossible to separate attacker activity from legitimate operations.',
 '[{"industry":"Technology","description":"Malware renamed to "chrome_update.exe" placed in a temp folder and added to startup."},{"industry":"Financial Services","description":"Attacker''s C2 binary named "svchost.exe" running from a user''s AppData folder instead of System32."}]',
 ARRAY['Process path verification (svchost.exe should only run from System32)','File hash comparison against known-good baselines','Parent process anomaly detection'],
 ARRAY['Endpoint detection with process integrity verification','Application allowlisting based on path and hash','Alert on known-good process names running from unexpected paths'],
 'How can security teams efficiently distinguish legitimate system processes from masquerading malware?',
 'A process named "svchost.exe" is running from C:\\Users\\employee\\AppData\\Roaming\\ instead of C:\\Windows\\System32\\ — a classic masquerading technique.'),

('T1562.001', 'Impair Defenses: Disable or Modify Tools', 'Defense Evasion', 'TA0005', 'Intermediate',
 ARRAY['Blue Team', 'Purple Team'],
 'Attackers specifically target and disable security software — antivirus, EDR, firewalls — before conducting the main attack to operate without detection.',
 'Audit Failure',
 'Disabling security tools before attacking ensures the main event goes undetected. The silence in security logs is the warning sign that is most often missed.',
 'When our security tools go silent, it should immediately trigger an investigation. Attackers disable defenses first because they know the attack that follows will be logged.',
 '[{"industry":"Financial Services","description":"EDR agent killed on workstations hours before a mass credential dumping operation."},{"industry":"Healthcare","description":"Windows Defender disabled on hospital servers via registry modification before ransomware deployment."}]',
 ARRAY['Security tool heartbeat and health monitoring','Registry modification alerts for AV/EDR settings','Event log monitoring for security tool service stops'],
 ARRAY['Tamper protection on all endpoint security tools','Out-of-band monitoring that does not rely on the protected endpoint','Canary alerts when security tools go offline'],
 'Why is monitoring the health of your own security tools one of the most important detection capabilities?',
 'Windows Defender is disabled via registry modification on 50 endpoints within a 15-minute window. The EDR console shows those endpoints go dark. Ransomware begins 2 hours later.'),

('T1574', 'Hijack Execution Flow', 'Privilege Escalation', 'TA0004', 'Advanced',
 ARRAY['Red Team', 'Purple Team'],
 'Attackers manipulate how the OS or an application loads code — by planting malicious DLLs or modifying search paths — so their code runs in place of legitimate code.',
 'Business Interruption',
 'DLL hijacking runs attacker code inside a legitimate application''s process, inheriting its permissions and trust level. Detection requires knowing exactly what every application should load.',
 'Legitimate applications inadvertently become launchpads for attacker code. The application starts normally, but the malicious DLL it loads runs alongside it with full trust.',
 '[{"industry":"Technology","description":"Malicious DLL planted in an application directory runs with SYSTEM privileges when the application is started."},{"industry":"Government","description":"DLL search order hijacking on classified system software used to establish persistent privileged access."}]',
 ARRAY['DLL load monitoring for unexpected library paths','Process module integrity verification','File system monitoring of application directories'],
 ARRAY['Application manifest pinning of DLL load paths','Privileged path write protection','EDR with DLL load chain monitoring'],
 'Why do legitimate applications often have DLL search order vulnerabilities even when well-written?',
 'A legitimate signed application starts normally but loads a malicious DLL from the current working directory before finding the real DLL in System32.'),

('T1040', 'Network Sniffing', 'Credential Access', 'TA0006', 'Intermediate',
 ARRAY['Red Team', 'Blue Team'],
 'Attackers capture network traffic passing through a compromised system to harvest credentials, session tokens, and sensitive data transmitted in cleartext.',
 'Direct Financial Loss',
 'Any unencrypted protocol is vulnerable to sniffing. Legacy protocols like HTTP, FTP, Telnet, and SNMP v1/v2 transmit credentials and data in cleartext that any attacker on the network can read.',
 'Unencrypted protocols on our internal network are a vulnerability we often forget about. An attacker with access to one system can harvest credentials from the entire network segment.',
 '[{"industry":"Manufacturing","description":"Cleartext SCADA protocol credentials captured from industrial network traffic, enabling ICS manipulation."},{"industry":"Financial Services","description":"Unencrypted SNMP community strings captured, granting management access to network infrastructure."}]',
 ARRAY['Promiscuous mode network interface detection','Unexpected packet capture tool execution','Network anomaly detection for broadcast/ARP behavior'],
 ARRAY['Enforce encryption for all internal protocols','Network segmentation to limit broadcast domain scope','Detect and eliminate cleartext credential protocols'],
 'Which commonly used internal protocols still transmit credentials in cleartext that organizations should prioritize eliminating?',
 'A compromised workstation is running Wireshark in promiscuous mode, capturing all traffic on the network segment including cleartext LDAP queries with bind credentials.'),

('T1187', 'Forced Authentication', 'Credential Access', 'TA0006', 'Intermediate',
 ARRAY['Red Team', 'Blue Team'],
 'Attackers trick Windows systems into automatically authenticating to an attacker-controlled server, capturing the resulting NTLM hash for offline cracking or relay attacks.',
 'Direct Financial Loss',
 'NTLM relay attacks require no user interaction — Windows automatically authenticates to what it believes is a legitimate server, handing the attacker a usable credential hash.',
 'Windows is designed to be helpful — it will automatically try to authenticate to servers it sees on the network. Attackers exploit this to capture credentials without any user action.',
 '[{"industry":"Financial Services","description":"NTLM hash captured from a finance server and cracked offline to reveal a service account password."},{"industry":"Government","description":"NTLM relay attack granting immediate access to a domain controller without cracking any credentials."}]',
 ARRAY['NTLM relay attempt detection','Unusual SMB authentication attempts to non-domain systems','Monitoring for responder/Inveigh tool signatures'],
 ARRAY['Disable NTLM where Kerberos is available','Enable SMB signing to prevent relay attacks','Network segmentation to limit broadcast authentication'],
 'Why does enabling SMB signing specifically prevent NTLM relay attacks even when NTLM is still used?',
 'A compromised laptop broadcasts a fake SMB server on the local network. Other Windows systems automatically attempt NTLM authentication, sending their hashed credentials to the attacker.')
ON CONFLICT (technique_id) DO NOTHING;

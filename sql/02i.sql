-- Run 9 of 12 (entries 41-45 of 60)
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
('T1560', 'Archive Collected Data', 'Collection', 'TA0009', 'Intermediate',
 ARRAY['Blue Team', 'Red Team'],
 'Attackers compress or encrypt collected files before exfiltration to reduce size, avoid DLP detection, and make the contents unreadable in transit.',
 'Regulatory Action',
 'Encrypted archives bypass content-based DLP tools — the sensitive data is hidden inside a zip or 7z file that looks like noise on the wire.',
 'Data loss prevention tools that scan content cannot read inside encrypted archives. Attackers use this to package stolen data in a way that defeats our controls at the perimeter.',
 '[{"industry":"Financial Services","description":"Customer records compressed and password-protected before upload to a cloud service, bypassing DLP."},{"industry":"Healthcare","description":"PHI data packaged into encrypted archives to evade email content scanning before exfiltration."}]',
 ARRAY['Archive file creation monitoring (zip, 7z, rar) at unusual volume','DLP alerts on archive uploads to cloud services','Endpoint behavioral detection for data staging patterns'],
 ARRAY['Network DLP with archive inspection capability','Endpoint DLP monitoring file staging behavior','Data egress controls on cloud upload destinations'],
 'Why does encryption of collected data fundamentally challenge content-based DLP approaches?',
 'A compromised workstation creates a 2GB password-protected zip file in the AppData folder containing hundreds of documents, then uploads it to a file-sharing service.'),

-- ── COMMAND AND CONTROL ─────────────────────────────────────,
('T1071', 'Application Layer Protocol', 'Command and Control', 'TA0011', 'Intermediate',
 ARRAY['Blue Team', 'Purple Team'],
 'Attackers communicate with compromised systems using standard protocols like HTTPS, DNS, or SMTP to blend C2 traffic with normal network activity.',
 'Business Interruption',
 'C2 over standard protocols evades basic network monitoring, allowing attackers to maintain persistent control and coordinate operations undetected.',
 'Attackers hide their communications inside normal web traffic. Without deep inspection of outbound connections, we cannot distinguish attacker commands from employee browsing.',
 '[{"industry":"Government","description":"DNS-based C2 channels bypassing air-gapped network inspection for long-term espionage."},{"industry":"Manufacturing","description":"HTTPS-based C2 blending with legitimate cloud service traffic on OT networks."}]',
 ARRAY['DNS query anomaly detection (length, frequency, entropy)','JA3/JA3S TLS fingerprinting','Beaconing pattern detection'],
 ARRAY['DNS filtering and monitoring','TLS inspection','Network detection and response (NDR)'],
 'Why is DNS particularly attractive as a C2 channel for attackers?',
 'A workstation generates 10,000 DNS queries per hour to unique subdomains of a single domain. Each subdomain appears to contain encoded data.'),

('T1573', 'Encrypted Channel', 'Command and Control', 'TA0011', 'Advanced',
 ARRAY['Blue Team', 'Red Team'],
 'Attackers encrypt their command-and-control communications to prevent network security tools from inspecting the content of their traffic.',
 'Business Interruption',
 'Encrypted C2 channels render content-based network inspection useless, allowing attackers to operate freely unless metadata-based detection is in place.',
 'Attackers encrypt their traffic just like we encrypt ours. Without the ability to inspect encrypted outbound connections, our network security tools are blind.',
 '[{"industry":"Financial Services","description":"Custom-encrypted channels evading DLP and network monitoring on trading networks."},{"industry":"Government","description":"State-sponsored actors using proprietary encryption to bypass national monitoring infrastructure."}]',
 ARRAY['TLS certificate anomalies (self-signed, short-lived)','JA3 hash matching against known malware profiles','Encrypted traffic metadata analysis'],
 ARRAY['TLS inspection at network boundary','Certificate allowlisting','Endpoint-based C2 detection (EDR)'],
 'How can organizations detect malicious encrypted traffic without decrypting everything?',
 'A workstation establishes a TLS connection to an IP address with a self-signed certificate. The JA3 fingerprint matches a known Cobalt Strike beacon profile.'),

('T1572', 'Protocol Tunneling', 'Command and Control', 'TA0011', 'Advanced',
 ARRAY['Blue Team', 'Purple Team'],
 'Attackers tunnel malicious traffic inside legitimate protocols — for example, hiding C2 commands inside DNS queries or HTTP requests — to bypass protocol-based firewalls.',
 'Business Interruption',
 'Protocol tunneling defeats firewall rules that allow specific protocols. DNS is almost always allowed outbound — making it a universal smuggling channel.',
 'If attackers can hide their commands inside DNS queries, they can communicate with compromised systems even through the most restrictive firewalls. Protocol intent, not just protocol type, must be inspected.',
 '[{"industry":"Government","description":"DNS tunneling carrying C2 traffic through a firewall that only blocks non-standard protocols."},{"industry":"Financial Services","description":"HTTP tunneling encoding C2 commands in normal-looking web request headers."}]',
 ARRAY['DNS query volume and entropy analysis','Deep packet inspection for protocol anomalies','Network detection for tunneling tool signatures (iodine, dnscat2)'],
 ARRAY['DNS filtering with query analytics','Deep packet inspection beyond protocol type','Network detection and response (NDR) with behavioral analytics'],
 'Why is DNS tunneling particularly difficult to block without impacting legitimate DNS traffic?',
 'DNS logs show queries to subdomains like "aGVsbG8gd29ybGQ.attacker.com" — the subdomain is Base64-encoded data, not a real hostname.'),

-- ── EXFILTRATION ─────────────────────────────────────────────,
('T1041', 'Exfiltration Over C2 Channel', 'Exfiltration', 'TA0010', 'Intermediate',
 ARRAY['Blue Team', 'Purple Team'],
 'Attackers steal data by sending it out through the same command-and-control connection they use to control the compromised system.',
 'Regulatory Action',
 'Data exfiltration over existing C2 channels is harder to detect because it blends with the attacker''s normal communication, delaying breach discovery and notification.',
 'Attackers can steal our data through the same hidden channel they use to control compromised machines. Without network monitoring for unusual outbound traffic, we may never know data left.',
 '[{"industry":"Healthcare","description":"Patient records exfiltrated over encrypted C2 channel, delaying HIPAA breach notification timeline."},{"industry":"Retail","description":"Payment card data exfiltrated in small batches to avoid detection thresholds."}]',
 ARRAY['Unusual outbound data volume per endpoint','Beaconing detection (periodic outbound connections)','DNS tunneling detection'],
 ARRAY['Network DLP','Egress filtering','TLS inspection for outbound traffic'],
 'Why does combining C2 and exfiltration into one channel make detection more difficult?',
 'Network monitoring shows a workstation sending 2 GB of data to a cloud service IP over HTTPS at 2 AM on a weekend. Normal daily upload volume for this host is under 50 MB.')
ON CONFLICT (technique_id) DO NOTHING;

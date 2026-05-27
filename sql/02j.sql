-- Run 10 of 12 (entries 46-50 of 60)
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
('T1567', 'Exfiltration Over Web Service', 'Exfiltration', 'TA0010', 'Intermediate',
 ARRAY['Blue Team', 'GRC Focus'],
 'Attackers upload stolen data to legitimate cloud services like Google Drive, Dropbox, or Pastebin to blend exfiltration with normal business traffic.',
 'Regulatory Action',
 'Using legitimate cloud services for exfiltration makes stolen data nearly invisible in network logs, delaying detection and breach response.',
 'Attackers upload our data to the same cloud services we use every day — Google Drive, OneDrive, Dropbox. Without cloud access controls, data walks out the front door.',
 '[{"industry":"Technology","description":"Source code uploaded to personal cloud storage accounts by compromised developer workstations."},{"industry":"Financial Services","description":"Customer account data exfiltrated to file-sharing services, triggering PCI DSS and privacy violations."}]',
 ARRAY['Cloud access security broker (CASB) monitoring','Unusual upload volume to cloud storage','DLP policy triggers on sensitive file patterns'],
 ARRAY['CASB deployment','Restrict personal cloud storage access','Endpoint DLP'],
 'How does the use of legitimate cloud services for exfiltration challenge traditional network security controls?',
 'A finance department laptop uploads 500 MB to a personal Dropbox account. The organization uses OneDrive as its approved cloud storage.'),

('T1048', 'Exfiltration Over Alternative Protocol', 'Exfiltration', 'TA0010', 'Advanced',
 ARRAY['Blue Team', 'Purple Team'],
 'Attackers use non-standard protocols like FTP, SFTP, DNS, ICMP, or custom protocols to exfiltrate data and bypass controls that focus on HTTP/HTTPS.',
 'Regulatory Action',
 'Exfiltration over unexpected protocols bypasses DLP tools and firewall rules that only inspect common web traffic, allowing data to leave undetected.',
 'Most data loss prevention tools focus on web traffic. Attackers exfiltrate through DNS, ICMP, or FTP — protocols that security teams often overlook — and the data walks right out.',
 '[{"industry":"Government","description":"ICMP tunneling used to exfiltrate classified data through a firewall that only inspects TCP/UDP traffic."},{"industry":"Financial Services","description":"FTP exfiltration of customer data to an overseas server through a firewall policy gap."}]',
 ARRAY['Protocol anomaly detection on egress traffic','DNS exfiltration detection (query size, frequency, entropy)','ICMP traffic volume monitoring'],
 ARRAY['Egress filtering restricting unnecessary outbound protocols','Network detection and response (NDR)','Full packet capture for incident investigation'],
 'Why do organizations often have weaker controls on DNS and ICMP compared to HTTP/HTTPS?',
 'Network monitoring shows large ICMP packets leaving the network at regular 30-second intervals — ICMP is not blocked outbound and is being used to carry encoded data.'),

-- ── IMPACT ───────────────────────────────────────────────────,
('T1486', 'Data Encrypted for Impact', 'Impact', 'TA0012', 'Beginner',
 ARRAY['Blue Team', 'GRC Focus'],
 'Attackers encrypt files and systems with ransomware, making data inaccessible until a ransom is paid or backups are restored.',
 'Direct Financial Loss',
 'Ransomware can halt all business operations, destroy data, and result in ransom payments, recovery costs, regulatory fines, and customer lawsuits.',
 'Ransomware is the most financially devastating cyberattack most organizations face. Tested backups and incident response plans are our insurance policy against total operational shutdown.',
 '[{"industry":"Healthcare","description":"Hospital systems encrypted, forcing diversion of emergency patients and cancellation of surgeries."},{"industry":"Manufacturing","description":"Production lines shut down for weeks while systems are rebuilt from backups."},{"industry":"Government","description":"City and county services offline, disrupting 911 dispatch, court systems, and public records."}]',
 ARRAY['Mass file rename or extension change alerts','Canary file monitoring (honeypot files)','Volume shadow copy deletion detection'],
 ARRAY['Immutable offline backups','Network segmentation','Endpoint detection with ransomware-specific behavioral rules'],
 'Why are tested, offline backups the single most important defense against ransomware?',
 'At 5 AM, a file server begins renaming thousands of files with a .locked extension. The volume shadow copies are deleted simultaneously.'),

('T1498', 'Network Denial of Service', 'Impact', 'TA0012', 'Beginner',
 ARRAY['Blue Team', 'GRC Focus'],
 'Attackers flood network resources with traffic to overwhelm systems and make services unavailable to legitimate users.',
 'Business Interruption',
 'DDoS attacks can take customer-facing services offline for hours or days, causing revenue loss and reputational damage.',
 'A DDoS attack can take our website and services offline in minutes. DDoS mitigation services are a cost of doing business for any organization with an internet presence.',
 '[{"industry":"Financial Services","description":"Online banking and trading platforms taken offline during critical market hours."},{"industry":"Retail","description":"E-commerce sites unavailable during peak shopping periods, causing direct revenue loss."}]',
 ARRAY['Traffic volume anomaly detection','CDN and ISP-level DDoS alerts','Application response time degradation'],
 ARRAY['DDoS mitigation services (CDN-based)','Rate limiting','Anycast network distribution'],
 'What is the difference between volumetric, protocol, and application-layer DDoS attacks?',
 'The company website response time jumps from 200ms to 30 seconds. Network monitoring shows a 50x increase in inbound traffic from thousands of source IPs.'),

('T1485', 'Data Destruction', 'Impact', 'TA0012', 'Intermediate',
 ARRAY['Blue Team', 'Purple Team'],
 'Attackers deliberately destroy data, databases, or entire systems to cause maximum disruption and deny the organization access to its own information.',
 'Direct Financial Loss',
 'Intentional data destruction can permanently eliminate business records, intellectual property, and operational data — with recovery costs reaching millions.',
 'Unlike ransomware where data can potentially be recovered, data destruction is permanent. Our backup and disaster recovery capabilities directly determine how fast we can resume operations.',
 '[{"industry":"Financial Services","description":"Destruction of transaction records requiring costly manual reconstruction and regulatory reporting."},{"industry":"Government","description":"Wiper malware destroying agency databases and citizen records as part of geopolitical conflict."}]',
 ARRAY['Mass file deletion alerts','Disk wipe tool execution detection','Database drop/truncate command monitoring'],
 ARRAY['Immutable backup storage','Disaster recovery testing','Least privilege on database and file server access'],
 'How does a wiper attack differ from ransomware in terms of attacker motivation and organizational recovery?',
 'A compromised admin account executes a script that truncates all tables in the production database and then wipes the backup server.')
ON CONFLICT (technique_id) DO NOTHING;

-- Run 7 of 8 (entries 79-91 of 92)
-- ============================================================
-- 03_seed_cves.sql
-- Run this third — seeds top 100 high-impact CVEs
-- ============================================================

INSERT INTO cves (
  cve_id, description, plain_explanation, severity, cvss_score,
  published_date, affected_products
) VALUES
('CVE-2022-32893', 'Out-of-bounds write in WebKit affecting Safari and other WebKit-based browsers leading to remote code execution.',
 'A WebKit zero-day exploited in the wild to execute code just by visiting a malicious website in Safari. Apple issued an emergency patch after detecting active exploitation.',
 'HIGH', 8.8, '2022-08-17',
 '[{"vendor":"Apple","product":"Safari, iOS, macOS","versions":"prior to Safari 15.6.1, iOS 15.6.1, macOS 12.5.1"}]'),

('CVE-2022-42856', 'Type confusion vulnerability in WebKit/JavaScriptCore leading to arbitrary code execution on Apple devices.',
 'A WebKit type confusion bug exploited in the wild against older iPhone models. Processing malicious web content could lead to arbitrary code execution — a browser-based drive-by attack.',
 'HIGH', 8.8, '2022-11-01',
 '[{"vendor":"Apple","product":"iOS, iPadOS","versions":"prior to iOS 15.7.2, iOS 16.1.2"}]'),

('CVE-2020-14145', 'Observable discrepancy in OpenSSH client allowing user enumeration.',
 'An OpenSSH information disclosure that allowed attackers to determine which usernames are valid on a server by observing timing differences in responses — useful for targeted attacks.',
 'MEDIUM', 5.9, '2020-06-29',
 '[{"vendor":"OpenSSH","product":"OpenSSH client","versions":"5.7 through 8.3p1"}]'),

('CVE-2024-20353', 'Denial of service vulnerability in Cisco ASA and FTD software.',
 'A Cisco ASA vulnerability that could allow an unauthenticated attacker to cause the VPN device to reload, disrupting VPN access for all users and exposing the network perimeter.',
 'HIGH', 8.6, '2024-04-24',
 '[{"vendor":"Cisco","product":"ASA, FTD","versions":"multiple versions"}]'),

('CVE-2024-20359', 'Persistent local code execution in Cisco ASA and FTD. Used in ArcaneDoor espionage campaign.',
 'A Cisco ASA vulnerability used in the ArcaneDoor espionage campaign to establish persistent backdoor access on firewall appliances — surviving reboots and traditional remediation.',
 'MEDIUM', 6.0, '2024-04-24',
 '[{"vendor":"Cisco","product":"ASA, FTD","versions":"multiple versions"}]'),

('CVE-2022-37969', 'Privilege escalation in Windows Common Log File System driver exploited in ransomware campaigns.',
 'A CLFS driver EoP used in the wild by ransomware operators to gain SYSTEM privileges after initial access — part of the recurring pattern of attackers targeting this Windows kernel component.',
 'HIGH', 7.8, '2022-09-13',
 '[{"vendor":"Microsoft","product":"Windows CLFS Driver","versions":"Windows 10, 11, Server 2019, 2022"}]'),

('CVE-2023-21554', 'Remote code execution in Windows Message Queuing service (MSMQ). Known as QueueJumper.',
 'QueueJumper — a critical MSMQ bug that could allow unauthenticated remote code execution on Windows systems with MSMQ enabled. The service was often enabled without administrators realizing it.',
 'CRITICAL', 9.8, '2023-04-11',
 '[{"vendor":"Microsoft","product":"Windows MSMQ","versions":"Windows 10, 11, Server 2008-2022"}]'),

('CVE-2024-38112', 'Windows MSHTML Platform spoofing vulnerability allowing phishing attacks bypassing security checks.',
 'A Windows MSHTML spoofing bug exploited as a zero-day that let attackers craft URLs that appeared to be safe but actually executed malicious code — bypassing browser security indicators.',
 'HIGH', 7.5, '2024-07-09',
 '[{"vendor":"Microsoft","product":"Windows MSHTML Platform","versions":"Windows 10, 11, Server 2019, 2022"}]'),

('CVE-2023-29357', 'Privilege escalation in Microsoft SharePoint Server allowing token forgery.',
 'A SharePoint EoP that let attackers forge JWT authentication tokens and impersonate any user including administrators — without needing any existing credentials.',
 'CRITICAL', 9.8, '2023-06-13',
 '[{"vendor":"Microsoft","product":"SharePoint Server","versions":"2019"}]'),

('CVE-2024-26234', 'Windows proxy driver spoofing vulnerability. Used by malicious signed driver.',
 'A spoofing vulnerability where a malicious driver was signed with a valid Microsoft WHQL certificate, allowing attackers to load it on Windows systems while appearing completely legitimate.',
 'MEDIUM', 6.7, '2024-04-09',
 '[{"vendor":"Microsoft","product":"Windows Proxy Driver","versions":"Windows 10, 11"}]'),

('CVE-2022-3602', 'Buffer overflow in OpenSSL X.509 certificate verification. Highly anticipated but lower impact than feared.',
 'Initially feared to be a Heartbleed-level event, this OpenSSL buffer overflow was serious but harder to exploit than anticipated. Affected applications verifying X.509 certificates from untrusted sources.',
 'HIGH', 7.5, '2022-11-01',
 '[{"vendor":"OpenSSL","product":"OpenSSL","versions":"3.0.0 through 3.0.6"}]'),

('CVE-2022-30333', 'Path traversal in RARLAB UnRAR on Linux and UNIX allowing arbitrary file write.',
 'A Linux UnRAR path traversal that let malicious archives write files outside their intended directory. Exploited against Zimbra email servers to plant web shells.',
 'HIGH', 7.5, '2022-06-09',
 '[{"vendor":"RARLAB","product":"UnRAR","versions":"prior to 6.12"}]'),

('CVE-2020-0796', 'Remote code execution vulnerability in Windows SMBv3 compression. Known as SMBGhost. Wormable.',
 'SMBGhost — a wormable SMB vulnerability that could spread between Windows 10 machines without any user interaction. While no major worm materialized, it was critical for network-wide ransomware potential.',
 'CRITICAL', 10.0, '2020-03-12',
 '[{"vendor":"Microsoft","product":"Windows SMBv3","versions":"Windows 10 1903, 1909"}]')
ON CONFLICT (cve_id) DO NOTHING;

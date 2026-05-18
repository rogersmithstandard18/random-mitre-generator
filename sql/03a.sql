-- Run 1 of 8 (entries 1-13 of 92)
-- ============================================================
-- 03_seed_cves.sql
-- Run this third — seeds top 100 high-impact CVEs
-- ============================================================

INSERT INTO cves (
  cve_id, description, plain_explanation, severity, cvss_score,
  published_date, affected_products, mitre_technique_ids
) VALUES
-- ── CVSS 10.0 ───────────────────────────────────────────────,
('CVE-2021-44228', 'Remote code execution vulnerability in Apache Log4j2 logging library via JNDI lookup in log messages.',
 'Log4Shell — one of the most critical bugs ever found. Any Java application using Log4j that logs user input could be fully taken over just by sending a crafted string. Attackers could run any code they wanted on the server.',
 'CRITICAL', 10.0, '2021-12-10',
 '[{"vendor":"Apache","product":"Log4j2","versions":"2.0-beta9 to 2.14.1"}]',
 ARRAY['T1190','T1059']),

('CVE-2020-1472', 'Privilege escalation vulnerability in Microsoft Netlogon Remote Protocol (MS-NRPC) allowing attackers to establish a vulnerable Netlogon secure channel connection.',
 'ZeroLogon — by sending a specific series of zeros to a domain controller, an attacker on the local network could instantly become a domain administrator with no credentials required.',
 'CRITICAL', 10.0, '2020-08-11',
 '[{"vendor":"Microsoft","product":"Windows Server","versions":"2008-2019"}]',
 ARRAY['T1068','T1078']),

('CVE-2014-6271', 'Arbitrary code execution vulnerability in GNU Bash through environment variables. Known as Shellshock.',
 'Shellshock — a bug in the Bash shell that had been hiding for 25 years. Any web server, router, or system using Bash in CGI scripts could be completely taken over by sending a crafted HTTP request.',
 'CRITICAL', 10.0, '2014-09-24',
 '[{"vendor":"GNU","product":"Bash","versions":"1.14 through 4.3"}]',
 ARRAY['T1190','T1059']),

('CVE-2017-5638', 'Remote code execution vulnerability in Apache Struts 2 REST plugin via crafted Content-Type header. Used in the Equifax breach.',
 'The Apache Struts bug that caused the Equifax breach exposing 147 million Americans. Sending a specially crafted web request could execute any command on the server — no authentication needed.',
 'CRITICAL', 10.0, '2017-03-11',
 '[{"vendor":"Apache","product":"Struts 2","versions":"2.3.5 through 2.3.31, 2.5 through 2.5.10"}]',
 ARRAY['T1190']),

('CVE-2021-22893', 'Remote code execution vulnerability in Pulse Connect Secure SSL VPN before patching.',
 'A critical zero-day in Pulse VPN that was actively exploited by nation-state actors before a patch existed. Attackers could take full control of the VPN gateway — the device meant to protect the network.',
 'CRITICAL', 10.0, '2021-04-20',
 '[{"vendor":"Pulse Secure","product":"Pulse Connect Secure","versions":"prior to 9.1R11.4"}]',
 ARRAY['T1190','T1133']),

('CVE-2023-20198', 'Privilege escalation and authentication bypass in Cisco IOS XE Web UI. Actively exploited as a zero-day.',
 'A zero-day in Cisco network gear that let attackers create admin accounts with no credentials. Tens of thousands of Cisco devices were backdoored before the patch arrived.',
 'CRITICAL', 10.0, '2023-10-16',
 '[{"vendor":"Cisco","product":"IOS XE","versions":"all versions with Web UI enabled"}]',
 ARRAY['T1190','T1136']),

('CVE-2020-5902', 'Remote code execution vulnerability in F5 BIG-IP Traffic Management User Interface (TMUI).',
 'A critical bug in F5 load balancers — devices that sit in front of corporate networks — allowed full takeover with a simple web request. Widely exploited within days of disclosure.',
 'CRITICAL', 10.0, '2020-07-01',
 '[{"vendor":"F5","product":"BIG-IP","versions":"11.6.x, 12.1.x, 13.1.x, 14.1.x, 15.0.x, 15.1.x"}]',
 ARRAY['T1190']),

('CVE-2024-1709', 'Authentication bypass vulnerability in ConnectWise ScreenConnect allowing unauthenticated remote code execution.',
 'A critical authentication bypass in popular remote support software. Attackers could skip the login screen entirely and take full control of systems being remotely managed.',
 'CRITICAL', 10.0, '2024-02-19',
 '[{"vendor":"ConnectWise","product":"ScreenConnect","versions":"prior to 23.9.8"}]',
 ARRAY['T1190','T1078']),

('CVE-2023-22515', 'Privilege escalation vulnerability in Confluence Data Center and Server allowing creation of admin accounts.',
 'A broken access control bug in Confluence — the popular team wiki — let anyone on the internet create an administrator account without knowing any existing credentials.',
 'CRITICAL', 10.0, '2023-10-04',
 '[{"vendor":"Atlassian","product":"Confluence Data Center and Server","versions":"8.0.0-8.3.2"}]',
 ARRAY['T1190','T1136']),

('CVE-2023-46604', 'Remote code execution vulnerability in Apache ActiveMQ allowing attackers to execute arbitrary shell commands.',
 'A critical bug in Apache ActiveMQ, a popular messaging system used in enterprise software. Sending a crafted network packet could instantly execute any command on the server — actively used by ransomware groups.',
 'CRITICAL', 10.0, '2023-10-27',
 '[{"vendor":"Apache","product":"ActiveMQ","versions":"5.15.15 and earlier, 5.16.6 and earlier, 5.17.4 and earlier"}]',
 ARRAY['T1190','T1486']),

-- ── CVSS 9.8 ────────────────────────────────────────────────,
('CVE-2021-26855', 'Server-side request forgery vulnerability in Microsoft Exchange Server. Part of the ProxyLogon exploit chain.',
 'ProxyLogon — a Microsoft Exchange bug exploited by nation-state hackers before a patch existed. It allowed attackers to authenticate as any user and read all their email without knowing any passwords.',
 'CRITICAL', 9.8, '2021-03-02',
 '[{"vendor":"Microsoft","product":"Exchange Server","versions":"2013, 2016, 2019"}]',
 ARRAY['T1190','T1114']),

('CVE-2019-0708', 'Remote code execution vulnerability in Remote Desktop Services (BlueKeep). Wormable pre-authentication vulnerability.',
 'BlueKeep — a wormable RDP bug meaning it could spread automatically from machine to machine like WannaCry. No login required to take over a vulnerable Windows system via Remote Desktop.',
 'CRITICAL', 9.8, '2019-05-14',
 '[{"vendor":"Microsoft","product":"Windows","versions":"XP, 7, Server 2003, Server 2008"}]',
 ARRAY['T1190','T1021'])
ON CONFLICT (cve_id) DO NOTHING;

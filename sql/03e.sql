-- Run 5 of 8 (entries 53-65 of 92)
-- ============================================================
-- 03_seed_cves.sql
-- Run this third — seeds top 100 high-impact CVEs
-- ============================================================

INSERT INTO cves (
  cve_id, description, plain_explanation, severity, cvss_score,
  published_date, affected_products, mitre_technique_ids
) VALUES
('CVE-2021-43798', 'Path traversal in Grafana allowing unauthenticated access to arbitrary files.',
 'A Grafana monitoring dashboard bug that let anyone — without logging in — read arbitrary files from the server. Database credentials, API keys, and config files were all exposed.',
 'HIGH', 7.5, '2021-12-07',
 '[{"vendor":"Grafana Labs","product":"Grafana","versions":"8.0.0 through 8.3.0"}]',
 ARRAY['T1190','T1005']),

('CVE-2023-32315', 'Path traversal in Openfire XMPP server allowing unauthenticated admin access.',
 'A path traversal in Openfire messaging server that bypassed authentication on the admin console, letting attackers access administrative functionality without credentials.',
 'HIGH', 7.5, '2023-05-26',
 '[{"vendor":"Ignite Realtime","product":"Openfire","versions":"3.10.0 through 4.7.4"}]',
 ARRAY['T1190','T1078']),

-- ── CVSS 7.3 ────────────────────────────────────────────────,
('CVE-2021-33766', 'Information disclosure vulnerability in Microsoft Exchange Server (ProxyToken).',
 'ProxyToken — an Exchange bug that let attackers create email forwarding rules as any user without needing their credentials, simply by exploiting a flaw in how Exchange handles authentication tokens.',
 'HIGH', 7.3, '2021-07-13',
 '[{"vendor":"Microsoft","product":"Exchange Server","versions":"2013, 2016, 2019"}]',
 ARRAY['T1114','T1078']),

-- ── MORE HIGH-IMPACT CVEs ────────────────────────────────────,
('CVE-2021-26857', 'Insecure deserialization in Microsoft Exchange Server Unified Messaging service allowing SYSTEM code execution.',
 'Part of the ProxyLogon chain — after gaining access via CVE-2021-26855, attackers could use this deserialization bug to run code as the SYSTEM account on Exchange servers.',
 'HIGH', 7.8, '2021-03-02',
 '[{"vendor":"Microsoft","product":"Exchange Server","versions":"2013, 2016, 2019"}]',
 ARRAY['T1190','T1059']),

('CVE-2021-26858', 'Arbitrary file write in Microsoft Exchange Server allowing post-authentication remote code execution.',
 'Another ProxyLogon chain component — after authentication bypass, attackers could write files anywhere on the filesystem, typically used to install web shells for persistent access.',
 'HIGH', 7.8, '2021-03-02',
 '[{"vendor":"Microsoft","product":"Exchange Server","versions":"2013, 2016, 2019"}]',
 ARRAY['T1190','T1505']),

('CVE-2021-27065', 'Arbitrary file write in Microsoft Exchange Server, completing the ProxyLogon web shell deployment chain.',
 'The final piece of the ProxyLogon chain — used to write web shells to disk after initial access, giving attackers persistent backdoor access to compromised Exchange servers.',
 'HIGH', 7.8, '2021-03-02',
 '[{"vendor":"Microsoft","product":"Exchange Server","versions":"2013, 2016, 2019"}]',
 ARRAY['T1190','T1505']),

('CVE-2022-22963', 'Remote code execution in Spring Cloud Function via routing expressions.',
 'A critical Spring Cloud Function bug exploited in the wild allowing unauthenticated remote code execution on Java microservices using the routing expression evaluation feature.',
 'CRITICAL', 9.8, '2022-03-29',
 '[{"vendor":"Spring","product":"Spring Cloud Function","versions":"3.1.6, 3.2.2 and prior"}]',
 ARRAY['T1190']),

('CVE-2021-21972', 'Remote code execution in VMware vCenter Server via vSphere Client file upload without authentication.',
 'A critical VMware vCenter bug that let unauthenticated attackers upload files and execute code on vCenter servers — giving full control of every virtual machine managed by that vCenter.',
 'CRITICAL', 9.8, '2021-02-23',
 '[{"vendor":"VMware","product":"vCenter Server","versions":"6.5, 6.7, 7.0"}]',
 ARRAY['T1190']),

('CVE-2023-27997', 'Heap buffer overflow in Fortinet FortiOS SSL-VPN pre-authentication remote code execution.',
 'A critical pre-authentication RCE in Fortinet VPN appliances exploited as a zero-day by nation-state actors. No credentials required to take full control of corporate VPN gateways.',
 'CRITICAL', 9.8, '2023-06-13',
 '[{"vendor":"Fortinet","product":"FortiOS","versions":"6.0 through 7.2.4"}]',
 ARRAY['T1190']),

('CVE-2021-20038', 'Stack-based buffer overflow in SonicWall SMA 100 series VPN appliances allowing remote code execution.',
 'A critical buffer overflow in SonicWall SSL-VPN appliances allowing unauthenticated remote code execution — taking full control of the device securing corporate network perimeters.',
 'CRITICAL', 9.8, '2021-12-08',
 '[{"vendor":"SonicWall","product":"SMA 100 series","versions":"prior to 10.2.0.8-37sv"}]',
 ARRAY['T1190']),

('CVE-2022-24086', 'Improper input validation in Adobe Commerce (Magento) allowing unauthenticated remote code execution.',
 'A critical Magento/Adobe Commerce bug exploited in the wild to compromise e-commerce stores. Attackers could inject and execute server-side code without any login, stealing payment data.',
 'CRITICAL', 9.8, '2022-02-13',
 '[{"vendor":"Adobe","product":"Commerce (Magento)","versions":"2.3.x and 2.4.x prior to patches"}]',
 ARRAY['T1190']),

('CVE-2023-48788', 'SQL injection in Fortinet FortiClientEMS leading to unauthenticated remote code execution.',
 'A critical SQL injection in Fortinet endpoint management software that let attackers run OS commands on the server without authentication — actively exploited to compromise enterprise environments.',
 'CRITICAL', 9.8, '2024-03-12',
 '[{"vendor":"Fortinet","product":"FortiClientEMS","versions":"7.0.1 through 7.0.10, 7.2.0 through 7.2.2"}]',
 ARRAY['T1190']),

('CVE-2023-50164', 'Path traversal in Apache Struts 2 file upload allowing remote code execution.',
 'A critical Apache Struts 2 vulnerability allowing file upload path traversal and remote code execution — the same framework responsible for the 2017 Equifax breach (CVE-2017-5638).',
 'CRITICAL', 9.8, '2023-12-07',
 '[{"vendor":"Apache","product":"Struts 2","versions":"2.5.0 through 2.5.32, 6.0.0 through 6.3.0"}]',
 ARRAY['T1190'])
ON CONFLICT (cve_id) DO NOTHING;

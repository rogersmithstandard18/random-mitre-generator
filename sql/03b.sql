-- Run 2 of 8 (entries 14-26 of 92)
-- ============================================================
-- 03_seed_cves.sql
-- Run this third — seeds top 100 high-impact CVEs
-- ============================================================

INSERT INTO cves (
  cve_id, description, plain_explanation, severity, cvss_score,
  published_date, affected_products
) VALUES
('CVE-2021-34527', 'Remote code execution vulnerability in Windows Print Spooler service. Known as PrintNightmare.',
 'PrintNightmare — a critical Windows printing bug that let standard users install malicious print drivers and execute code as SYSTEM. Affected every Windows machine with the Print Spooler running.',
 'CRITICAL', 9.8, '2021-07-01',
 '[{"vendor":"Microsoft","product":"Windows Print Spooler","versions":"all supported Windows versions"}]'),

('CVE-2022-26134', 'Remote code execution via OGNL injection in Atlassian Confluence Server and Data Center.',
 'A critical Confluence bug actively exploited within hours of disclosure. A single web request could execute any command on the server without authentication — ransomware groups jumped on it immediately.',
 'CRITICAL', 9.8, '2022-06-02',
 '[{"vendor":"Atlassian","product":"Confluence Server and Data Center","versions":"prior to 7.4.17"}]'),

('CVE-2021-26084', 'OGNL injection in Atlassian Confluence Server and Data Center allowing unauthenticated remote code execution.',
 'Another critical Confluence bug allowing anyone on the internet to run commands on corporate wikis. Used to install cryptocurrency miners and ransomware on thousands of servers.',
 'CRITICAL', 9.8, '2021-08-25',
 '[{"vendor":"Atlassian","product":"Confluence Server","versions":"prior to 6.13.23, 7.4.11, 7.11.6, 7.12.5, 7.13.0"}]'),

('CVE-2021-21985', 'Remote code execution vulnerability in VMware vCenter Server via vSphere Client plugin.',
 'A critical bug in VMware vCenter — the system used to manage entire fleets of virtual machines. Taking over vCenter means taking over every VM it manages. Mass exploitation followed within days.',
 'CRITICAL', 9.8, '2021-05-25',
 '[{"vendor":"VMware","product":"vCenter Server","versions":"6.5, 6.7, 7.0"}]'),

('CVE-2023-34362', 'SQL injection vulnerability in Progress MOVEit Transfer leading to unauthorized access and remote code execution.',
 'A SQL injection bug in MOVEit file transfer software exploited by the Cl0p ransomware group to steal data from hundreds of organizations including government agencies and major corporations.',
 'CRITICAL', 9.8, '2023-05-31',
 '[{"vendor":"Progress","product":"MOVEit Transfer","versions":"prior to 2021.0.6, 2021.1.4, 2022.0.4, 2022.1.5, 2023.0.1"}]'),

('CVE-2022-1388', 'Authentication bypass in F5 BIG-IP iControl REST interface allowing unauthenticated command execution.',
 'Another critical F5 bug — this one let attackers skip authentication entirely on the management interface of BIG-IP load balancers, running commands as root with a single HTTP request.',
 'CRITICAL', 9.8, '2022-05-04',
 '[{"vendor":"F5","product":"BIG-IP","versions":"16.1.x, 15.1.x, 14.1.x, 13.1.x"}]'),

('CVE-2023-42793', 'Authentication bypass in JetBrains TeamCity CI/CD server allowing full server takeover.',
 'A critical authentication bypass in TeamCity, the software used to build and deploy code at thousands of companies. Exploited by Russian state actors to gain access to software supply chains.',
 'CRITICAL', 9.8, '2023-09-19',
 '[{"vendor":"JetBrains","product":"TeamCity","versions":"prior to 2023.05.4"}]'),

('CVE-2021-22986', 'Unauthenticated remote code execution in F5 BIG-IP and BIG-IQ iControl REST interface.',
 'A no-authentication-required RCE on F5 management interfaces. Attackers could take full control of BIG-IP and BIG-IQ devices — which manage traffic and security policies for large networks.',
 'CRITICAL', 9.8, '2021-03-10',
 '[{"vendor":"F5","product":"BIG-IP, BIG-IQ","versions":"multiple versions"}]'),

('CVE-2022-36934', 'Integer overflow in WhatsApp for Android and iOS leading to remote code execution.',
 'A WhatsApp bug that could allow a remote attacker to execute code on a victim''s phone simply by initiating a video call — no user interaction needed beyond receiving the call.',
 'CRITICAL', 9.8, '2022-09-27',
 '[{"vendor":"Meta","product":"WhatsApp","versions":"prior to 2.22.16.12 (Android), 2.22.16.12 (iOS)"}]'),

('CVE-2021-38647', 'Unauthenticated remote code execution in Open Management Infrastructure (OMI) agent deployed in Azure. Known as OMIGOD.',
 'OMIGOD — Microsoft silently installed a vulnerable agent on Linux Azure VMs. Attackers on the same network could take root control of any affected VM with a single HTTP request.',
 'CRITICAL', 9.8, '2021-09-15',
 '[{"vendor":"Microsoft","product":"Open Management Infrastructure","versions":"prior to 1.6.8.1"}]'),

('CVE-2021-40539', 'Authentication bypass and remote code execution in Zoho ManageEngine ADSelfService Plus.',
 'A critical bug in a self-service password reset tool that allowed nation-state actors to bypass authentication and take control of the server. Used in attacks against US defense contractors.',
 'CRITICAL', 9.8, '2021-09-07',
 '[{"vendor":"Zoho","product":"ManageEngine ADSelfService Plus","versions":"prior to build 6114"}]'),

('CVE-2024-27198', 'Authentication bypass in JetBrains TeamCity CI/CD server (second critical bypass in 6 months).',
 'A second critical authentication bypass in JetBrains TeamCity discovered shortly after the first. Attackers could gain admin control over software build systems — a prime supply chain attack target.',
 'CRITICAL', 9.8, '2024-03-04',
 '[{"vendor":"JetBrains","product":"TeamCity","versions":"prior to 2023.11.4"}]'),

('CVE-2022-22965', 'Remote code execution in Spring Framework via data binding on JDK 9+. Known as Spring4Shell.',
 'Spring4Shell — a critical bug in the Spring Java framework affecting applications running on newer Java versions. Could allow full server takeover via crafted HTTP parameters.',
 'CRITICAL', 9.8, '2022-04-01',
 '[{"vendor":"Spring","product":"Spring Framework","versions":"5.3.0-5.3.17, 5.2.0-5.2.19"}]'),

-- ── CVSS 9.4-9.6 ────────────────────────────────────────────
ON CONFLICT (cve_id) DO NOTHING;

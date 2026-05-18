-- Run 4 of 8 (entries 40-52 of 92)
-- ============================================================
-- 03_seed_cves.sql
-- Run this third — seeds top 100 high-impact CVEs
-- ============================================================

INSERT INTO cves (
  cve_id, description, plain_explanation, severity, cvss_score,
  published_date, affected_products, mitre_technique_ids
) VALUES
('CVE-2022-30190', 'Remote code execution via Microsoft Support Diagnostic Tool (MSDT) called from Office. Known as Follina.',
 'Follina — a zero-day that weaponized the Windows troubleshooter. A Word document could execute system commands just by being opened, and even worked in Protected View in some configurations.',
 'HIGH', 7.8, '2022-05-30',
 '[{"vendor":"Microsoft","product":"Windows MSDT","versions":"Windows 7 through 11, Server 2008-2022"}]',
 ARRAY['T1204','T1059']),

('CVE-2022-0847', 'Privilege escalation vulnerability in Linux kernel pipe handling. Known as Dirty Pipe.',
 'Dirty Pipe — a Linux kernel bug that let any local user overwrite read-only files and elevate privileges to root. Affected Android phones and cloud Linux servers.',
 'HIGH', 7.8, '2022-03-07',
 '[{"vendor":"Linux","product":"Kernel","versions":"5.8 through 5.16.11"}]',
 ARRAY['T1068']),

('CVE-2021-3156', 'Heap-based buffer overflow in sudo leading to local privilege escalation. Known as Baron Samedit.',
 'Baron Samedit — a 10-year-old bug in sudo that let any local user become root without knowing any passwords, on nearly every Linux and macOS system. Found by Qualys in early 2021.',
 'HIGH', 7.8, '2021-01-26',
 '[{"vendor":"Todd Miller","product":"sudo","versions":"1.8.2 through 1.8.31p2, 1.9.0 through 1.9.5p1"}]',
 ARRAY['T1068']),

('CVE-2021-4034', 'Local privilege escalation in polkit pkexec. Known as PwnKit.',
 'PwnKit — a 12-year-old memory corruption bug in a core Linux component. Any unprivileged local user could become root in seconds. Found on virtually every major Linux distribution.',
 'HIGH', 7.8, '2022-01-25',
 '[{"vendor":"polkit","product":"pkexec","versions":"all versions prior to 0.120"}]',
 ARRAY['T1068']),

('CVE-2023-38831', 'Remote code execution in WinRAR via crafted archive files, exploited in the wild before disclosure.',
 'A WinRAR zero-day exploited by multiple threat groups for months before discovery. Opening a specially crafted archive could execute code — attackers used it to target financial sector victims.',
 'HIGH', 7.8, '2023-08-23',
 '[{"vendor":"RARLAB","product":"WinRAR","versions":"prior to 6.23"}]',
 ARRAY['T1204','T1566']),

('CVE-2022-24521', 'Privilege escalation in Windows Common Log File System (CLFS) driver.',
 'A Windows kernel driver bug actively exploited in the wild, allowing attackers with basic access to escalate to SYSTEM level — commonly chained after initial access techniques.',
 'HIGH', 7.8, '2022-04-12',
 '[{"vendor":"Microsoft","product":"Windows CLFS Driver","versions":"Windows 10, 11, Server 2019, 2022"}]',
 ARRAY['T1068']),

('CVE-2023-28252', 'Privilege escalation in Windows Common Log File System driver. Exploited by Nokoyawa ransomware.',
 'A CLFS kernel driver elevation of privilege bug used by the Nokoyawa ransomware group to gain SYSTEM privileges after initial access — enabling full network compromise.',
 'HIGH', 7.8, '2023-04-11',
 '[{"vendor":"Microsoft","product":"Windows CLFS Driver","versions":"Windows 10, 11, Server 2019, 2022"}]',
 ARRAY['T1068','T1486']),

('CVE-2024-30051', 'Privilege escalation in Windows Desktop Window Manager Core Library. Exploited as zero-day by QakBot.',
 'A Windows DWM kernel bug exploited as a zero-day by QakBot malware operators to elevate privileges to SYSTEM after gaining initial foothold on victim machines.',
 'HIGH', 7.8, '2024-05-14',
 '[{"vendor":"Microsoft","product":"Windows DWM Core Library","versions":"Windows 10, 11, Server 2019, 2022"}]',
 ARRAY['T1068']),

('CVE-2022-38028', 'Privilege escalation in Windows Print Spooler service. Exploited by Forest Blizzard (APT28).',
 'A Print Spooler privilege escalation actively exploited by Russian APT28 to gain SYSTEM privileges on targeted government and military networks. Related to the broader PrintNightmare vulnerability class.',
 'HIGH', 7.8, '2022-10-11',
 '[{"vendor":"Microsoft","product":"Windows Print Spooler","versions":"Windows 7 through 11, Server 2008-2022"}]',
 ARRAY['T1068','T1547']),

('CVE-2021-36955', 'Privilege escalation in Windows Common Log File System driver.',
 'A Windows kernel driver EoP vulnerability that, when chained with initial access, allowed attackers to gain full SYSTEM privileges on Windows endpoints.',
 'HIGH', 7.8, '2021-10-12',
 '[{"vendor":"Microsoft","product":"Windows CLFS Driver","versions":"Windows 7 through 11, Server 2008-2022"}]',
 ARRAY['T1068']),

-- ── CVSS 7.5 ────────────────────────────────────────────────,
('CVE-2014-0160', 'Buffer over-read in OpenSSL TLS/DTLS heartbeat extension allowing memory disclosure. Known as Heartbleed.',
 'Heartbleed — a bug in OpenSSL that let anyone read the memory of servers handling encrypted web traffic. Private SSL keys, session tokens, and plaintext passwords were all exposed.',
 'HIGH', 7.5, '2014-04-07',
 '[{"vendor":"OpenSSL","product":"OpenSSL","versions":"1.0.1 through 1.0.1f"}]',
 ARRAY['T1190','T1040']),

('CVE-2023-44487', 'HTTP/2 Rapid Reset attack enabling distributed denial of service at record scale.',
 'HTTP/2 Rapid Reset — a DDoS technique exploiting a design flaw in HTTP/2 that allowed attackers to generate record-breaking traffic volumes with relatively small botnets, overwhelming major internet services.',
 'HIGH', 7.5, '2023-10-10',
 '[{"vendor":"Multiple","product":"HTTP/2 implementations","versions":"all HTTP/2 servers without mitigation"}]',
 ARRAY['T1498']),

('CVE-2021-41773', 'Path traversal and remote code execution in Apache HTTP Server 2.4.49.',
 'A path traversal bug in Apache web server that let attackers access files outside the web root — and execute system commands if CGI was enabled. Massively exploited within hours of disclosure.',
 'HIGH', 7.5, '2021-10-05',
 '[{"vendor":"Apache","product":"HTTP Server","versions":"2.4.49"}]',
 ARRAY['T1190','T1059'])
ON CONFLICT (cve_id) DO NOTHING;

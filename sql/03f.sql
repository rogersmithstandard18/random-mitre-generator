-- Run 6 of 8 (entries 66-78 of 92)
-- ============================================================
-- 03_seed_cves.sql
-- Run this third — seeds top 100 high-impact CVEs
-- ============================================================

INSERT INTO cves (
  cve_id, description, plain_explanation, severity, cvss_score,
  published_date, affected_products, mitre_technique_ids
) VALUES
('CVE-2024-23897', 'Arbitrary file read through Jenkins CLI leading to remote code execution.',
 'A critical Jenkins build system vulnerability allowing unauthenticated file reads that could expose credentials and secrets, and in some configurations lead to full code execution.',
 'CRITICAL', 9.8, '2024-01-24',
 '[{"vendor":"Jenkins","product":"Jenkins","versions":"2.441 and prior, LTS 2.426.2 and prior"}]',
 ARRAY['T1190','T1005']),

('CVE-2021-36942', 'Windows LSA Spoofing vulnerability enabling NTLM relay attacks against Active Directory. Known as PetitPotam.',
 'PetitPotam — a technique to force Windows domain controllers to authenticate to attacker-controlled servers, enabling NTLM relay attacks that could fully compromise Active Directory.',
 'CRITICAL', 9.8, '2021-08-12',
 '[{"vendor":"Microsoft","product":"Windows LSA","versions":"Windows 7 through Server 2022"}]',
 ARRAY['T1187','T1557']),

('CVE-2022-21882', 'Privilege escalation in Win32k allowing local attackers to gain SYSTEM privileges.',
 'A Win32k kernel vulnerability that let local attackers elevate to SYSTEM — used in targeted attacks to complete privilege escalation after initial access via other methods.',
 'HIGH', 7.0, '2022-01-11',
 '[{"vendor":"Microsoft","product":"Win32k","versions":"Windows 10, 11, Server 2019, 2022"}]',
 ARRAY['T1068']),

('CVE-2023-29336', 'Privilege escalation in Win32k exploited as a zero-day in targeted attacks.',
 'A Win32k EoP zero-day exploited in targeted attacks to escalate privileges to SYSTEM level, typically chained after initial access via phishing or exploitation.',
 'HIGH', 7.8, '2023-05-09',
 '[{"vendor":"Microsoft","product":"Win32k","versions":"Windows Server 2008-2019"}]',
 ARRAY['T1068']),

('CVE-2022-34713', 'Remote code execution in Windows Support Diagnostic Tool (MSDT). Known as DogWalk.',
 'DogWalk — a companion vulnerability to Follina affecting MSDT. A malicious attachment could execute code via the Windows diagnostic troubleshooter, similar to Follina but through a different path.',
 'HIGH', 7.8, '2022-08-09',
 '[{"vendor":"Microsoft","product":"Windows MSDT","versions":"Windows 7 through 11, Server 2008-2022"}]',
 ARRAY['T1204','T1059']),

('CVE-2024-30040', 'Security feature bypass in Windows MSHTML Platform allowing arbitrary code execution.',
 'A Windows MSHTML bypass that allowed attackers to execute code on victims'' systems via crafted files — even with modern security features enabled. Exploited as a zero-day before patching.',
 'HIGH', 8.8, '2024-05-14',
 '[{"vendor":"Microsoft","product":"Windows MSHTML Platform","versions":"Windows 10, 11, Server 2019, 2022"}]',
 ARRAY['T1204']),

('CVE-2023-24880', 'Windows SmartScreen security bypass allowing execution of untrusted files.',
 'A SmartScreen bypass that let malicious files evade Windows mark-of-the-web warnings — exploited by the Magniber ransomware group to deliver payloads that bypassed user security warnings.',
 'MEDIUM', 4.4, '2023-03-14',
 '[{"vendor":"Microsoft","product":"Windows SmartScreen","versions":"Windows 10, 11, Server 2019, 2022"}]',
 ARRAY['T1553','T1486']),

('CVE-2024-29988', 'SmartScreen prompt bypass in Windows allowing execution of malicious files.',
 'A SmartScreen bypass exploited by threat actors to deliver malware while avoiding Windows security warnings that tell users a file is potentially dangerous.',
 'HIGH', 8.8, '2024-04-09',
 '[{"vendor":"Microsoft","product":"Windows SmartScreen","versions":"Windows 10, 11"}]',
 ARRAY['T1553','T1204']),

('CVE-2023-36761', 'Information disclosure in Microsoft Word leaking NTLM hashes via preview pane.',
 'A Microsoft Word bug that leaked NTLM credential hashes just by previewing a document — no clicking, no macros. The hashes could then be cracked offline or used in relay attacks.',
 'MEDIUM', 6.2, '2023-09-12',
 '[{"vendor":"Microsoft","product":"Word","versions":"2013, 2016, 2019, 2021, 365"}]',
 ARRAY['T1187','T1040']),

('CVE-2022-0185', 'Linux kernel heap overflow in filesystem context functionality allowing privilege escalation.',
 'A Linux kernel heap overflow that could be exploited by a local attacker to escape containers and gain root privileges on the host — a significant risk in containerized cloud environments.',
 'HIGH', 8.4, '2022-02-11',
 '[{"vendor":"Linux","product":"Kernel","versions":"5.1 through 5.16.2"}]',
 ARRAY['T1068']),

('CVE-2022-26138', 'Hardcoded credentials in Atlassian Questions for Confluence allowing unauthenticated data access.',
 'A hardcoded "disabledsystemuser" account with a publicly disclosed password installed by an Atlassian app. Anyone who knew the password could access Confluence as a system user.',
 'CRITICAL', 9.8, '2022-07-20',
 '[{"vendor":"Atlassian","product":"Questions for Confluence","versions":"2.7.34, 2.7.35, 3.0.2"}]',
 ARRAY['T1078','T1190']),

('CVE-2021-30657', 'macOS Gatekeeper bypass allowing execution of unsigned code via specific app bundle formats.',
 'A macOS security bypass that let malicious applications pass Gatekeeper verification — Apple''s protection against unsigned code. Exploited by Shlayer malware to deliver adware and worse.',
 'MEDIUM', 5.5, '2021-04-26',
 '[{"vendor":"Apple","product":"macOS","versions":"prior to 11.3"}]',
 ARRAY['T1553','T1204']),

('CVE-2023-38180', '.NET and Visual Studio denial of service vulnerability.',
 'A vulnerability in .NET and ASP.NET Core that allowed attackers to crash web applications with specially crafted requests, causing denial of service against .NET-based web services.',
 'HIGH', 7.5, '2023-08-08',
 '[{"vendor":"Microsoft","product":".NET and Visual Studio","versions":"multiple versions"}]',
 ARRAY['T1499'])
ON CONFLICT (cve_id) DO NOTHING;

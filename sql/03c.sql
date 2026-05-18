-- Run 3 of 8 (entries 27-39 of 92)
-- ============================================================
-- 03_seed_cves.sql
-- Run this third — seeds top 100 high-impact CVEs
-- ============================================================

INSERT INTO cves (
  cve_id, description, plain_explanation, severity, cvss_score,
  published_date, affected_products
) VALUES
('CVE-2023-4966', 'Sensitive information disclosure in Citrix NetScaler ADC and Gateway leading to session hijacking. Known as Citrix Bleed.',
 'Citrix Bleed — by sending a crafted request, attackers could steal session tokens from Citrix gateways, giving them authenticated access as any logged-in user including administrators.',
 'CRITICAL', 9.4, '2023-10-10',
 '[{"vendor":"Citrix","product":"NetScaler ADC and Gateway","versions":"prior to 13.1-49.13, 14.1-8.50"}]'),

('CVE-2024-21762', 'Out-of-bounds write in Fortinet FortiOS SSL VPN leading to remote code execution.',
 'A critical Fortinet FortiOS bug allowing unauthenticated attackers to execute code on VPN gateways — the front door of corporate networks. Actively exploited before wide patching.',
 'CRITICAL', 9.6, '2024-02-08',
 '[{"vendor":"Fortinet","product":"FortiOS","versions":"6.0-7.4"}]'),

-- ── CVSS 9.3 ────────────────────────────────────────────────,
('CVE-2017-0144', 'Remote code execution vulnerability in Windows SMBv1. Exploited by EternalBlue and used in WannaCry and NotPetya.',
 'EternalBlue — the NSA exploit that powered WannaCry and NotPetya. By sending a crafted packet to Windows file sharing, attackers could take full control of the machine — no login, no interaction.',
 'CRITICAL', 9.3, '2017-03-14',
 '[{"vendor":"Microsoft","product":"Windows SMBv1","versions":"XP through Server 2008 R2"}]'),

-- ── CVSS 9.1 ────────────────────────────────────────────────,
('CVE-2024-21887', 'Command injection in Ivanti Connect Secure and Policy Secure web components.',
 'A command injection bug in Ivanti VPN appliances chained with a SSRF vulnerability to achieve unauthenticated RCE. Exploited by Chinese state-sponsored groups against government targets.',
 'CRITICAL', 9.1, '2024-01-10',
 '[{"vendor":"Ivanti","product":"Connect Secure, Policy Secure","versions":"all supported versions"}]'),

('CVE-2023-22518', 'Improper authorization in Atlassian Confluence Data Center and Server allowing data destruction.',
 'A Confluence bug that allowed unauthenticated users to reset the entire Confluence instance, destroying all data. Actively exploited by ransomware groups to wipe corporate wikis.',
 'CRITICAL', 9.1, '2023-10-31',
 '[{"vendor":"Atlassian","product":"Confluence Data Center and Server","versions":"prior to 7.19.16, 8.3.4, 8.4.4, 8.5.3, 8.6.1"}]'),

-- ── CVSS 8.8 ────────────────────────────────────────────────,
('CVE-2022-41082', 'Remote code execution in Microsoft Exchange Server. Part of ProxyNotShell exploit chain.',
 'ProxyNotShell — a pair of Exchange vulnerabilities chained together to achieve RCE. Requires authentication first, but once in, attackers could run system commands on Exchange servers.',
 'HIGH', 8.8, '2022-10-03',
 '[{"vendor":"Microsoft","product":"Exchange Server","versions":"2013, 2016, 2019"}]'),

('CVE-2021-40444', 'Remote code execution in Microsoft MSHTML (Trident) browser engine via crafted Office documents.',
 'A zero-day that let attackers execute code by sending a victim a Microsoft Office document. Just opening the file — or sometimes just previewing it — was enough to compromise the system.',
 'HIGH', 8.8, '2021-09-07',
 '[{"vendor":"Microsoft","product":"Windows MSHTML","versions":"multiple Windows versions"}]'),

('CVE-2022-26923', 'Privilege escalation vulnerability in Active Directory Certificate Services allowing domain privilege escalation.',
 'A flaw in Windows certificate services that allowed any domain user to obtain a certificate for a domain controller account, then use it to fully compromise the domain.',
 'HIGH', 8.8, '2022-05-10',
 '[{"vendor":"Microsoft","product":"Active Directory Certificate Services","versions":"Windows Server 2008-2022"}]'),

('CVE-2024-1708', 'Path traversal in ConnectWise ScreenConnect allowing unauthenticated file access.',
 'Paired with the authentication bypass (CVE-2024-1709), this path traversal allowed attackers to read and write arbitrary files on ScreenConnect servers, enabling full system compromise.',
 'HIGH', 8.4, '2024-02-19',
 '[{"vendor":"ConnectWise","product":"ScreenConnect","versions":"prior to 23.9.8"}]'),

('CVE-2022-40684', 'Authentication bypass in Fortinet FortiOS, FortiProxy, and FortiSwitchManager management interfaces.',
 'A critical authentication bypass on Fortinet management interfaces that let attackers log in as super-administrators and modify firewall configurations. Exploited within days of disclosure.',
 'CRITICAL', 9.8, '2022-10-10',
 '[{"vendor":"Fortinet","product":"FortiOS, FortiProxy, FortiSwitchManager","versions":"FortiOS 7.0.0-7.0.6, 7.2.0-7.2.1"}]'),

-- ── CVSS 8.3 ────────────────────────────────────────────────,
('CVE-2023-36884', 'Remote code execution in Microsoft Office and Windows HTML via crafted documents. Exploited as a zero-day.',
 'A zero-day in Office HTML rendering exploited by the RomCom threat group against NATO summit attendees. Sending a crafted Word document could take over the victim''s system.',
 'HIGH', 8.3, '2023-07-11',
 '[{"vendor":"Microsoft","product":"Office, Windows","versions":"multiple versions"}]'),

-- ── CVSS 8.2 ────────────────────────────────────────────────,
('CVE-2024-21893', 'Server-side request forgery in Ivanti Connect Secure and Policy Secure SAML component.',
 'An SSRF in Ivanti VPN that, when chained with CVE-2024-21887, enabled unauthenticated remote code execution on VPN gateways without any user interaction.',
 'HIGH', 8.2, '2024-01-31',
 '[{"vendor":"Ivanti","product":"Connect Secure, Policy Secure","versions":"all supported versions"}]'),

-- ── CVSS 8.1 ────────────────────────────────────────────────,
('CVE-2024-6387', 'Race condition in OpenSSH sshd leading to unauthenticated remote code execution. Known as regreSSHion.',
 'regreSSHion — a regression that brought back a 2006 OpenSSH bug. The race condition was hard to exploit but theoretically allowed unauthenticated RCE on millions of Linux servers running SSH.',
 'HIGH', 8.1, '2024-07-01',
 '[{"vendor":"OpenSSH","product":"sshd","versions":"8.5p1 through 9.7p1"}]'),

-- ── CVSS 7.8 ────────────────────────────────────────────────
ON CONFLICT (cve_id) DO NOTHING;

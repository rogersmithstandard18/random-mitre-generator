-- ============================================================
-- 03_seed_cves.sql
-- Run this third — seeds top 100 high-impact CVEs
-- ============================================================

INSERT INTO cves (
  cve_id, description, plain_explanation, severity, cvss_score,
  published_date, affected_products, mitre_technique_ids
) VALUES

-- ── CVSS 10.0 ───────────────────────────────────────────────
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

-- ── CVSS 9.8 ────────────────────────────────────────────────
('CVE-2021-26855', 'Server-side request forgery vulnerability in Microsoft Exchange Server. Part of the ProxyLogon exploit chain.',
 'ProxyLogon — a Microsoft Exchange bug exploited by nation-state hackers before a patch existed. It allowed attackers to authenticate as any user and read all their email without knowing any passwords.',
 'CRITICAL', 9.8, '2021-03-02',
 '[{"vendor":"Microsoft","product":"Exchange Server","versions":"2013, 2016, 2019"}]',
 ARRAY['T1190','T1114']),

('CVE-2019-0708', 'Remote code execution vulnerability in Remote Desktop Services (BlueKeep). Wormable pre-authentication vulnerability.',
 'BlueKeep — a wormable RDP bug meaning it could spread automatically from machine to machine like WannaCry. No login required to take over a vulnerable Windows system via Remote Desktop.',
 'CRITICAL', 9.8, '2019-05-14',
 '[{"vendor":"Microsoft","product":"Windows","versions":"XP, 7, Server 2003, Server 2008"}]',
 ARRAY['T1190','T1021']),

('CVE-2021-34527', 'Remote code execution vulnerability in Windows Print Spooler service. Known as PrintNightmare.',
 'PrintNightmare — a critical Windows printing bug that let standard users install malicious print drivers and execute code as SYSTEM. Affected every Windows machine with the Print Spooler running.',
 'CRITICAL', 9.8, '2021-07-01',
 '[{"vendor":"Microsoft","product":"Windows Print Spooler","versions":"all supported Windows versions"}]',
 ARRAY['T1068','T1547']),

('CVE-2022-26134', 'Remote code execution via OGNL injection in Atlassian Confluence Server and Data Center.',
 'A critical Confluence bug actively exploited within hours of disclosure. A single web request could execute any command on the server without authentication — ransomware groups jumped on it immediately.',
 'CRITICAL', 9.8, '2022-06-02',
 '[{"vendor":"Atlassian","product":"Confluence Server and Data Center","versions":"prior to 7.4.17"}]',
 ARRAY['T1190']),

('CVE-2021-26084', 'OGNL injection in Atlassian Confluence Server and Data Center allowing unauthenticated remote code execution.',
 'Another critical Confluence bug allowing anyone on the internet to run commands on corporate wikis. Used to install cryptocurrency miners and ransomware on thousands of servers.',
 'CRITICAL', 9.8, '2021-08-25',
 '[{"vendor":"Atlassian","product":"Confluence Server","versions":"prior to 6.13.23, 7.4.11, 7.11.6, 7.12.5, 7.13.0"}]',
 ARRAY['T1190']),

('CVE-2021-21985', 'Remote code execution vulnerability in VMware vCenter Server via vSphere Client plugin.',
 'A critical bug in VMware vCenter — the system used to manage entire fleets of virtual machines. Taking over vCenter means taking over every VM it manages. Mass exploitation followed within days.',
 'CRITICAL', 9.8, '2021-05-25',
 '[{"vendor":"VMware","product":"vCenter Server","versions":"6.5, 6.7, 7.0"}]',
 ARRAY['T1190']),

('CVE-2023-34362', 'SQL injection vulnerability in Progress MOVEit Transfer leading to unauthorized access and remote code execution.',
 'A SQL injection bug in MOVEit file transfer software exploited by the Cl0p ransomware group to steal data from hundreds of organizations including government agencies and major corporations.',
 'CRITICAL', 9.8, '2023-05-31',
 '[{"vendor":"Progress","product":"MOVEit Transfer","versions":"prior to 2021.0.6, 2021.1.4, 2022.0.4, 2022.1.5, 2023.0.1"}]',
 ARRAY['T1190','T1005']),

('CVE-2022-1388', 'Authentication bypass in F5 BIG-IP iControl REST interface allowing unauthenticated command execution.',
 'Another critical F5 bug — this one let attackers skip authentication entirely on the management interface of BIG-IP load balancers, running commands as root with a single HTTP request.',
 'CRITICAL', 9.8, '2022-05-04',
 '[{"vendor":"F5","product":"BIG-IP","versions":"16.1.x, 15.1.x, 14.1.x, 13.1.x"}]',
 ARRAY['T1190','T1078']),

('CVE-2023-42793', 'Authentication bypass in JetBrains TeamCity CI/CD server allowing full server takeover.',
 'A critical authentication bypass in TeamCity, the software used to build and deploy code at thousands of companies. Exploited by Russian state actors to gain access to software supply chains.',
 'CRITICAL', 9.8, '2023-09-19',
 '[{"vendor":"JetBrains","product":"TeamCity","versions":"prior to 2023.05.4"}]',
 ARRAY['T1190','T1195']),

('CVE-2021-22986', 'Unauthenticated remote code execution in F5 BIG-IP and BIG-IQ iControl REST interface.',
 'A no-authentication-required RCE on F5 management interfaces. Attackers could take full control of BIG-IP and BIG-IQ devices — which manage traffic and security policies for large networks.',
 'CRITICAL', 9.8, '2021-03-10',
 '[{"vendor":"F5","product":"BIG-IP, BIG-IQ","versions":"multiple versions"}]',
 ARRAY['T1190']),

('CVE-2022-36934', 'Integer overflow in WhatsApp for Android and iOS leading to remote code execution.',
 'A WhatsApp bug that could allow a remote attacker to execute code on a victim''s phone simply by initiating a video call — no user interaction needed beyond receiving the call.',
 'CRITICAL', 9.8, '2022-09-27',
 '[{"vendor":"Meta","product":"WhatsApp","versions":"prior to 2.22.16.12 (Android), 2.22.16.12 (iOS)"}]',
 ARRAY['T1190']),

('CVE-2021-38647', 'Unauthenticated remote code execution in Open Management Infrastructure (OMI) agent deployed in Azure. Known as OMIGOD.',
 'OMIGOD — Microsoft silently installed a vulnerable agent on Linux Azure VMs. Attackers on the same network could take root control of any affected VM with a single HTTP request.',
 'CRITICAL', 9.8, '2021-09-15',
 '[{"vendor":"Microsoft","product":"Open Management Infrastructure","versions":"prior to 1.6.8.1"}]',
 ARRAY['T1190','T1068']),

('CVE-2021-40539', 'Authentication bypass and remote code execution in Zoho ManageEngine ADSelfService Plus.',
 'A critical bug in a self-service password reset tool that allowed nation-state actors to bypass authentication and take control of the server. Used in attacks against US defense contractors.',
 'CRITICAL', 9.8, '2021-09-07',
 '[{"vendor":"Zoho","product":"ManageEngine ADSelfService Plus","versions":"prior to build 6114"}]',
 ARRAY['T1190','T1078']),

('CVE-2024-27198', 'Authentication bypass in JetBrains TeamCity CI/CD server (second critical bypass in 6 months).',
 'A second critical authentication bypass in JetBrains TeamCity discovered shortly after the first. Attackers could gain admin control over software build systems — a prime supply chain attack target.',
 'CRITICAL', 9.8, '2024-03-04',
 '[{"vendor":"JetBrains","product":"TeamCity","versions":"prior to 2023.11.4"}]',
 ARRAY['T1190','T1195']),

('CVE-2022-22965', 'Remote code execution in Spring Framework via data binding on JDK 9+. Known as Spring4Shell.',
 'Spring4Shell — a critical bug in the Spring Java framework affecting applications running on newer Java versions. Could allow full server takeover via crafted HTTP parameters.',
 'CRITICAL', 9.8, '2022-04-01',
 '[{"vendor":"Spring","product":"Spring Framework","versions":"5.3.0-5.3.17, 5.2.0-5.2.19"}]',
 ARRAY['T1190']),

-- ── CVSS 9.4-9.6 ────────────────────────────────────────────
('CVE-2023-4966', 'Sensitive information disclosure in Citrix NetScaler ADC and Gateway leading to session hijacking. Known as Citrix Bleed.',
 'Citrix Bleed — by sending a crafted request, attackers could steal session tokens from Citrix gateways, giving them authenticated access as any logged-in user including administrators.',
 'CRITICAL', 9.4, '2023-10-10',
 '[{"vendor":"Citrix","product":"NetScaler ADC and Gateway","versions":"prior to 13.1-49.13, 14.1-8.50"}]',
 ARRAY['T1190','T1078']),

('CVE-2024-21762', 'Out-of-bounds write in Fortinet FortiOS SSL VPN leading to remote code execution.',
 'A critical Fortinet FortiOS bug allowing unauthenticated attackers to execute code on VPN gateways — the front door of corporate networks. Actively exploited before wide patching.',
 'CRITICAL', 9.6, '2024-02-08',
 '[{"vendor":"Fortinet","product":"FortiOS","versions":"6.0-7.4"}]',
 ARRAY['T1190']),

-- ── CVSS 9.3 ────────────────────────────────────────────────
('CVE-2017-0144', 'Remote code execution vulnerability in Windows SMBv1. Exploited by EternalBlue and used in WannaCry and NotPetya.',
 'EternalBlue — the NSA exploit that powered WannaCry and NotPetya. By sending a crafted packet to Windows file sharing, attackers could take full control of the machine — no login, no interaction.',
 'CRITICAL', 9.3, '2017-03-14',
 '[{"vendor":"Microsoft","product":"Windows SMBv1","versions":"XP through Server 2008 R2"}]',
 ARRAY['T1210','T1486']),

-- ── CVSS 9.1 ────────────────────────────────────────────────
('CVE-2024-21887', 'Command injection in Ivanti Connect Secure and Policy Secure web components.',
 'A command injection bug in Ivanti VPN appliances chained with a SSRF vulnerability to achieve unauthenticated RCE. Exploited by Chinese state-sponsored groups against government targets.',
 'CRITICAL', 9.1, '2024-01-10',
 '[{"vendor":"Ivanti","product":"Connect Secure, Policy Secure","versions":"all supported versions"}]',
 ARRAY['T1190','T1059']),

('CVE-2023-22518', 'Improper authorization in Atlassian Confluence Data Center and Server allowing data destruction.',
 'A Confluence bug that allowed unauthenticated users to reset the entire Confluence instance, destroying all data. Actively exploited by ransomware groups to wipe corporate wikis.',
 'CRITICAL', 9.1, '2023-10-31',
 '[{"vendor":"Atlassian","product":"Confluence Data Center and Server","versions":"prior to 7.19.16, 8.3.4, 8.4.4, 8.5.3, 8.6.1"}]',
 ARRAY['T1190','T1485']),

-- ── CVSS 8.8 ────────────────────────────────────────────────
('CVE-2022-41082', 'Remote code execution in Microsoft Exchange Server. Part of ProxyNotShell exploit chain.',
 'ProxyNotShell — a pair of Exchange vulnerabilities chained together to achieve RCE. Requires authentication first, but once in, attackers could run system commands on Exchange servers.',
 'HIGH', 8.8, '2022-10-03',
 '[{"vendor":"Microsoft","product":"Exchange Server","versions":"2013, 2016, 2019"}]',
 ARRAY['T1190','T1078']),

('CVE-2021-40444', 'Remote code execution in Microsoft MSHTML (Trident) browser engine via crafted Office documents.',
 'A zero-day that let attackers execute code by sending a victim a Microsoft Office document. Just opening the file — or sometimes just previewing it — was enough to compromise the system.',
 'HIGH', 8.8, '2021-09-07',
 '[{"vendor":"Microsoft","product":"Windows MSHTML","versions":"multiple Windows versions"}]',
 ARRAY['T1204','T1566']),

('CVE-2022-26923', 'Privilege escalation vulnerability in Active Directory Certificate Services allowing domain privilege escalation.',
 'A flaw in Windows certificate services that allowed any domain user to obtain a certificate for a domain controller account, then use it to fully compromise the domain.',
 'HIGH', 8.8, '2022-05-10',
 '[{"vendor":"Microsoft","product":"Active Directory Certificate Services","versions":"Windows Server 2008-2022"}]',
 ARRAY['T1068','T1078']),

('CVE-2024-1708', 'Path traversal in ConnectWise ScreenConnect allowing unauthenticated file access.',
 'Paired with the authentication bypass (CVE-2024-1709), this path traversal allowed attackers to read and write arbitrary files on ScreenConnect servers, enabling full system compromise.',
 'HIGH', 8.4, '2024-02-19',
 '[{"vendor":"ConnectWise","product":"ScreenConnect","versions":"prior to 23.9.8"}]',
 ARRAY['T1190']),

('CVE-2022-40684', 'Authentication bypass in Fortinet FortiOS, FortiProxy, and FortiSwitchManager management interfaces.',
 'A critical authentication bypass on Fortinet management interfaces that let attackers log in as super-administrators and modify firewall configurations. Exploited within days of disclosure.',
 'CRITICAL', 9.8, '2022-10-10',
 '[{"vendor":"Fortinet","product":"FortiOS, FortiProxy, FortiSwitchManager","versions":"FortiOS 7.0.0-7.0.6, 7.2.0-7.2.1"}]',
 ARRAY['T1190','T1078']),

-- ── CVSS 8.3 ────────────────────────────────────────────────
('CVE-2023-36884', 'Remote code execution in Microsoft Office and Windows HTML via crafted documents. Exploited as a zero-day.',
 'A zero-day in Office HTML rendering exploited by the RomCom threat group against NATO summit attendees. Sending a crafted Word document could take over the victim''s system.',
 'HIGH', 8.3, '2023-07-11',
 '[{"vendor":"Microsoft","product":"Office, Windows","versions":"multiple versions"}]',
 ARRAY['T1204','T1566']),

-- ── CVSS 8.2 ────────────────────────────────────────────────
('CVE-2024-21893', 'Server-side request forgery in Ivanti Connect Secure and Policy Secure SAML component.',
 'An SSRF in Ivanti VPN that, when chained with CVE-2024-21887, enabled unauthenticated remote code execution on VPN gateways without any user interaction.',
 'HIGH', 8.2, '2024-01-31',
 '[{"vendor":"Ivanti","product":"Connect Secure, Policy Secure","versions":"all supported versions"}]',
 ARRAY['T1190']),

-- ── CVSS 8.1 ────────────────────────────────────────────────
('CVE-2024-6387', 'Race condition in OpenSSH sshd leading to unauthenticated remote code execution. Known as regreSSHion.',
 'regreSSHion — a regression that brought back a 2006 OpenSSH bug. The race condition was hard to exploit but theoretically allowed unauthenticated RCE on millions of Linux servers running SSH.',
 'HIGH', 8.1, '2024-07-01',
 '[{"vendor":"OpenSSH","product":"sshd","versions":"8.5p1 through 9.7p1"}]',
 ARRAY['T1190','T1021']),

-- ── CVSS 7.8 ────────────────────────────────────────────────
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

-- ── CVSS 7.5 ────────────────────────────────────────────────
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
 ARRAY['T1190','T1059']),

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

-- ── CVSS 7.3 ────────────────────────────────────────────────
('CVE-2021-33766', 'Information disclosure vulnerability in Microsoft Exchange Server (ProxyToken).',
 'ProxyToken — an Exchange bug that let attackers create email forwarding rules as any user without needing their credentials, simply by exploiting a flaw in how Exchange handles authentication tokens.',
 'HIGH', 7.3, '2021-07-13',
 '[{"vendor":"Microsoft","product":"Exchange Server","versions":"2013, 2016, 2019"}]',
 ARRAY['T1114','T1078']),

-- ── MORE HIGH-IMPACT CVEs ────────────────────────────────────
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
 ARRAY['T1190']),

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
 ARRAY['T1499']),

('CVE-2022-32893', 'Out-of-bounds write in WebKit affecting Safari and other WebKit-based browsers leading to remote code execution.',
 'A WebKit zero-day exploited in the wild to execute code just by visiting a malicious website in Safari. Apple issued an emergency patch after detecting active exploitation.',
 'HIGH', 8.8, '2022-08-17',
 '[{"vendor":"Apple","product":"Safari, iOS, macOS","versions":"prior to Safari 15.6.1, iOS 15.6.1, macOS 12.5.1"}]',
 ARRAY['T1189','T1190']),

('CVE-2022-42856', 'Type confusion vulnerability in WebKit/JavaScriptCore leading to arbitrary code execution on Apple devices.',
 'A WebKit type confusion bug exploited in the wild against older iPhone models. Processing malicious web content could lead to arbitrary code execution — a browser-based drive-by attack.',
 'HIGH', 8.8, '2022-11-01',
 '[{"vendor":"Apple","product":"iOS, iPadOS","versions":"prior to iOS 15.7.2, iOS 16.1.2"}]',
 ARRAY['T1189']),

('CVE-2020-14145', 'Observable discrepancy in OpenSSH client allowing user enumeration.',
 'An OpenSSH information disclosure that allowed attackers to determine which usernames are valid on a server by observing timing differences in responses — useful for targeted attacks.',
 'MEDIUM', 5.9, '2020-06-29',
 '[{"vendor":"OpenSSH","product":"OpenSSH client","versions":"5.7 through 8.3p1"}]',
 ARRAY['T1087','T1046']),

('CVE-2024-20353', 'Denial of service vulnerability in Cisco ASA and FTD software.',
 'A Cisco ASA vulnerability that could allow an unauthenticated attacker to cause the VPN device to reload, disrupting VPN access for all users and exposing the network perimeter.',
 'HIGH', 8.6, '2024-04-24',
 '[{"vendor":"Cisco","product":"ASA, FTD","versions":"multiple versions"}]',
 ARRAY['T1498','T1499']),

('CVE-2024-20359', 'Persistent local code execution in Cisco ASA and FTD. Used in ArcaneDoor espionage campaign.',
 'A Cisco ASA vulnerability used in the ArcaneDoor espionage campaign to establish persistent backdoor access on firewall appliances — surviving reboots and traditional remediation.',
 'MEDIUM', 6.0, '2024-04-24',
 '[{"vendor":"Cisco","product":"ASA, FTD","versions":"multiple versions"}]',
 ARRAY['T1542','T1505']),

('CVE-2022-37969', 'Privilege escalation in Windows Common Log File System driver exploited in ransomware campaigns.',
 'A CLFS driver EoP used in the wild by ransomware operators to gain SYSTEM privileges after initial access — part of the recurring pattern of attackers targeting this Windows kernel component.',
 'HIGH', 7.8, '2022-09-13',
 '[{"vendor":"Microsoft","product":"Windows CLFS Driver","versions":"Windows 10, 11, Server 2019, 2022"}]',
 ARRAY['T1068','T1486']),

('CVE-2023-21554', 'Remote code execution in Windows Message Queuing service (MSMQ). Known as QueueJumper.',
 'QueueJumper — a critical MSMQ bug that could allow unauthenticated remote code execution on Windows systems with MSMQ enabled. The service was often enabled without administrators realizing it.',
 'CRITICAL', 9.8, '2023-04-11',
 '[{"vendor":"Microsoft","product":"Windows MSMQ","versions":"Windows 10, 11, Server 2008-2022"}]',
 ARRAY['T1190']),

('CVE-2024-38112', 'Windows MSHTML Platform spoofing vulnerability allowing phishing attacks bypassing security checks.',
 'A Windows MSHTML spoofing bug exploited as a zero-day that let attackers craft URLs that appeared to be safe but actually executed malicious code — bypassing browser security indicators.',
 'HIGH', 7.5, '2024-07-09',
 '[{"vendor":"Microsoft","product":"Windows MSHTML Platform","versions":"Windows 10, 11, Server 2019, 2022"}]',
 ARRAY['T1566','T1204']),

('CVE-2023-29357', 'Privilege escalation in Microsoft SharePoint Server allowing token forgery.',
 'A SharePoint EoP that let attackers forge JWT authentication tokens and impersonate any user including administrators — without needing any existing credentials.',
 'CRITICAL', 9.8, '2023-06-13',
 '[{"vendor":"Microsoft","product":"SharePoint Server","versions":"2019"}]',
 ARRAY['T1078','T1068']),

('CVE-2024-26234', 'Windows proxy driver spoofing vulnerability. Used by malicious signed driver.',
 'A spoofing vulnerability where a malicious driver was signed with a valid Microsoft WHQL certificate, allowing attackers to load it on Windows systems while appearing completely legitimate.',
 'MEDIUM', 6.7, '2024-04-09',
 '[{"vendor":"Microsoft","product":"Windows Proxy Driver","versions":"Windows 10, 11"}]',
 ARRAY['T1553','T1068']),

('CVE-2022-3602', 'Buffer overflow in OpenSSL X.509 certificate verification. Highly anticipated but lower impact than feared.',
 'Initially feared to be a Heartbleed-level event, this OpenSSL buffer overflow was serious but harder to exploit than anticipated. Affected applications verifying X.509 certificates from untrusted sources.',
 'HIGH', 7.5, '2022-11-01',
 '[{"vendor":"OpenSSL","product":"OpenSSL","versions":"3.0.0 through 3.0.6"}]',
 ARRAY['T1190']),

('CVE-2022-30333', 'Path traversal in RARLAB UnRAR on Linux and UNIX allowing arbitrary file write.',
 'A Linux UnRAR path traversal that let malicious archives write files outside their intended directory. Exploited against Zimbra email servers to plant web shells.',
 'HIGH', 7.5, '2022-06-09',
 '[{"vendor":"RARLAB","product":"UnRAR","versions":"prior to 6.12"}]',
 ARRAY['T1190','T1505']),

('CVE-2020-0796', 'Remote code execution vulnerability in Windows SMBv3 compression. Known as SMBGhost. Wormable.',
 'SMBGhost — a wormable SMB vulnerability that could spread between Windows 10 machines without any user interaction. While no major worm materialized, it was critical for network-wide ransomware potential.',
 'CRITICAL', 10.0, '2020-03-12',
 '[{"vendor":"Microsoft","product":"Windows SMBv3","versions":"Windows 10 1903, 1909"}]',
 ARRAY['T1210','T1486']),

('CVE-2021-28482', 'Remote code execution in Microsoft Exchange Server via unsafe deserialization (April 2021 patch Tuesday).',
 'One of several Exchange vulnerabilities patched in April 2021. Exploitable by authenticated users, it allowed remote code execution on Exchange servers through specially crafted API calls.',
 'HIGH', 8.8, '2021-04-13',
 '[{"vendor":"Microsoft","product":"Exchange Server","versions":"2013, 2016, 2019"}]',
 ARRAY['T1190'])

ON CONFLICT (cve_id) DO NOTHING;

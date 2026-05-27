-- Run 6 of 12 (entries 26-30 of 60)
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
('T1218', 'System Binary Proxy Execution', 'Defense Evasion', 'TA0005', 'Intermediate',
 ARRAY['Red Team', 'Blue Team'],
 'Attackers use trusted, signed Windows binaries like mshta.exe, regsvr32.exe, or certutil.exe to execute malicious code — bypassing application control policies.',
 'Business Interruption',
 'Legitimate signed binaries trusted by the OS are weaponized to run attacker code. Application allowlisting that only checks signatures is bypassed entirely.',
 'Attackers turn our own trusted operating system tools against us. A signed Microsoft binary executing attacker code defeats most traditional allowlisting controls.',
 '[{"industry":"Technology","description":"certutil.exe used to download and decode a malicious payload disguised as a certificate file."},{"industry":"Government","description":"mshta.exe executing a remote HTA file containing an attacker''s backdoor from a signed process."}]',
 ARRAY['Command-line argument monitoring for LOLBin abuse','Child process monitoring for unusual binaries','Script block logging for HTA and WSH execution'],
 ARRAY['Application control with behavioral rules','Monitor and restrict LOLBin usage','Attack surface reduction rules in Windows Defender'],
 'Why does signing a binary with a trusted certificate not guarantee it cannot be weaponized?',
 'certutil.exe runs on a workstation and downloads a file from an external URL, decodes it from Base64, and saves it to a temp folder — all legitimate certutil functionality.'),

-- ── CREDENTIAL ACCESS ────────────────────────────────────────,
('T1003', 'OS Credential Dumping', 'Credential Access', 'TA0006', 'Intermediate',
 ARRAY['Red Team', 'Purple Team'],
 'Attackers extract stored credentials (password hashes, tokens, tickets) from operating system memory or files to authenticate as legitimate users.',
 'Direct Financial Loss',
 'Dumped credentials give attackers the keys to move laterally, access sensitive data, and impersonate privileged users — dramatically increasing breach costs.',
 'When attackers steal credentials from memory, they can log in as our admins. This is why privileged access management and credential hygiene are critical investments.',
 '[{"industry":"Financial Services","description":"Dumped domain admin credentials used to access core banking and wire transfer systems."},{"industry":"Government","description":"Credential extraction from classified workstations enabling lateral movement to high-value intelligence systems."}]',
 ARRAY['LSASS memory access alerts','Credential Guard status monitoring','Honeypot credential detection'],
 ARRAY['Windows Credential Guard','Privileged access workstations (PAWs)','Restrict debug privileges'],
 'Why do attackers target LSASS memory specifically, and how does Credential Guard mitigate this?',
 'An EDR alert shows a process (not an admin tool) attempting to read the memory of lsass.exe on a domain controller.'),

('T1110', 'Brute Force', 'Credential Access', 'TA0006', 'Beginner',
 ARRAY['Blue Team', 'GRC Focus'],
 'Attackers systematically try many passwords or credential combinations to guess the correct one and gain access to accounts.',
 'Regulatory Action',
 'Successful brute force attacks often indicate weak password policies, which regulators view as a fundamental control failure.',
 'If our accounts can be guessed through repeated login attempts, we have a password policy problem. Account lockout and MFA are the minimum standard regulators expect.',
 '[{"industry":"Healthcare","description":"Brute-forced clinician accounts providing access to patient records and prescription systems."},{"industry":"Retail","description":"Credential stuffing attacks on customer loyalty accounts leading to points theft and data exposure."}]',
 ARRAY['Failed login threshold alerts','Password spray detection across multiple accounts','Geo-impossible travel alerts'],
 ARRAY['Multi-factor authentication','Account lockout policies','Password complexity requirements and breach-password screening'],
 'What is the difference between brute force, password spraying, and credential stuffing?',
 'The SIEM shows 500 failed login attempts against the VPN portal in 10 minutes, each using a different username but the same password.'),

('T1056', 'Input Capture', 'Credential Access', 'TA0006', 'Intermediate',
 ARRAY['Blue Team', 'Red Team'],
 'Attackers capture keystrokes, clipboard content, or form input to steal credentials and sensitive data as users type them.',
 'Direct Financial Loss',
 'Keyloggers capture credentials at the source — before encryption, before MFA prompts — making them one of the most direct paths to account compromise.',
 'A keylogger captures every password an employee types, including MFA codes. Traditional network security tools cannot stop data that is captured before it is ever sent anywhere.',
 '[{"industry":"Financial Services","description":"Keylogger on a trader''s workstation capturing banking credentials and MFA codes in real time."},{"industry":"Healthcare","description":"Input capture malware recording clinician EHR login credentials across a hospital network."}]',
 ARRAY['Behavioral detection of keylogging APIs','Clipboard monitoring anomalies','Endpoint memory scanning for keylogger patterns'],
 ARRAY['Endpoint detection and response','Hardware security keys (FIDO2) resistant to keylogging','Privileged access workstations with no internet access'],
 'Why are hardware security keys (FIDO2) more resistant to keylogging than software MFA?',
 'An EDR alert shows a process hooking the SetWindowsHookEx API — the standard mechanism used by keyloggers to capture all keyboard input system-wide.'),

('T1555', 'Credentials from Password Stores', 'Credential Access', 'TA0006', 'Intermediate',
 ARRAY['Red Team', 'Blue Team'],
 'Attackers extract saved passwords from browsers, password managers, or OS credential stores — gathering credentials the user saved for convenience.',
 'Direct Financial Loss',
 'Saved browser passwords are a gold mine for attackers. One compromised endpoint can yield dozens of credentials across personal and corporate accounts.',
 'Most employees save passwords in their browser for convenience. When an attacker accesses a workstation, those saved credentials are immediately available — no cracking required.',
 '[{"industry":"Retail","description":"Browser credential extraction from a point-of-sale system yielding e-commerce and banking credentials."},{"industry":"Technology","description":"Developer workstation compromise exposing saved API keys, cloud console credentials, and code repository tokens."}]',
 ARRAY['Process access monitoring for browser credential stores','Endpoint detection for credential extraction tools','Browser extension auditing'],
 ARRAY['Enterprise password manager with no browser save','Endpoint protection with credential theft detection','Privileged workstation policies prohibiting general browsing'],
 'Why are browser-saved passwords a higher risk than people generally assume?',
 'An attacker runs a tool that extracts all Chrome saved passwords in under 30 seconds from an unlocked workstation — no administrative privileges required.')
ON CONFLICT (technique_id) DO NOTHING;

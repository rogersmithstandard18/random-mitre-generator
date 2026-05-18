-- Run 3 of 12 (entries 11-15 of 60)
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
('T1091', 'Replication Through Removable Media', 'Initial Access', 'TA0001', 'Beginner',
 ARRAY['Blue Team', 'GRC Focus'],
 'Attackers spread malware by loading it onto USB drives or other removable media and getting it into air-gapped or restricted environments through physical access.',
 'Business Interruption',
 'USB-based attacks bypass every network security control — the malware walks through the front door in someone''s pocket.',
 'Network security tools cannot stop a malware-infected USB drive. Physical access controls and USB device management policies are critical for operational and industrial environments.',
 '[{"industry":"Manufacturing","description":"USB drive dropped in a parking lot infects an OT engineering workstation on an air-gapped network."},{"industry":"Government","description":"Classified network compromised via USB drive used by an insider or social engineering victim."}]',
 ARRAY['USB device control policy enforcement','Endpoint detection for autorun execution','Physical access logging in sensitive areas'],
 ARRAY['Disable AutoRun on all endpoints','USB device allowlisting','Enforce clean-desk and media handling policies'],
 'Why are USB-based attacks particularly dangerous for air-gapped industrial and government networks?',
 'A USB drive labeled "Salary Information Q4" is found in the parking lot. An employee plugs it in to find the owner.'),

-- ── EXECUTION ───────────────────────────────────────────────,
('T1059', 'Command and Scripting Interpreter', 'Execution', 'TA0002', 'Beginner',
 ARRAY['Blue Team', 'Red Team'],
 'Attackers use built-in command-line tools like PowerShell, Bash, or Python to execute malicious commands on a compromised system.',
 'Business Interruption',
 'Abuse of legitimate scripting tools makes malicious activity hard to distinguish from normal administration, enabling attackers to operate undetected.',
 'Attackers use the same tools our IT team uses every day. Without proper logging and monitoring of scripts, malicious activity blends into normal operations.',
 '[{"industry":"Financial Services","description":"PowerShell-based attacks automating credential theft across trading systems."},{"industry":"Manufacturing","description":"Scripts disabling safety systems on operational technology networks."}]',
 ARRAY['PowerShell script block logging','Command-line argument monitoring','Behavioral analytics for unusual script execution'],
 ARRAY['Application allowlisting','Constrained language mode for PowerShell','Script signing enforcement'],
 'Why is it challenging to block scripting interpreters when they are essential for system administration?',
 'A help desk workstation begins executing encoded PowerShell commands at 2 AM. The commands are downloading files from an external IP address.'),

('T1204', 'User Execution', 'Execution', 'TA0002', 'Beginner',
 ARRAY['Blue Team', 'GRC Focus'],
 'Attackers rely on a user to run a malicious file, click a link, or enable macros — the human becomes the execution mechanism.',
 'Direct Financial Loss',
 'Social engineering tricks users into executing malware, bypassing technical controls and making the human element the weakest link in the security chain.',
 'No firewall can stop an employee from double-clicking a file they believe is legitimate. Investing in user education directly reduces our exposure to ransomware and data theft.',
 '[{"industry":"Healthcare","description":"Staff opening malicious attachments disguised as patient records, deploying ransomware across hospital systems."},{"industry":"Retail","description":"Employees running fake invoice documents that install keyloggers capturing payment data."}]',
 ARRAY['Endpoint detection for newly dropped executables','Macro execution monitoring in Office applications','Sandbox detonation of email attachments'],
 ARRAY['Disable Office macros by default','Application allowlisting','Security awareness training'],
 'How can organizations reduce reliance on user judgment without restricting legitimate business workflows?',
 'An HR employee receives a "resume" attachment in .docm format. When opened, it asks to "Enable Content" to view the document.'),

('T1053', 'Scheduled Task/Job', 'Execution', 'TA0002', 'Intermediate',
 ARRAY['Blue Team', 'Red Team'],
 'Attackers create scheduled tasks or cron jobs to automatically execute malicious code at a set time or interval — often for persistence or delayed payload delivery.',
 'Business Interruption',
 'Malicious scheduled tasks look exactly like legitimate system maintenance jobs. Without monitoring task creation, attackers can hide persistent execution in plain sight.',
 'Scheduled tasks run automatically and are trusted by the OS. Attackers use them to guarantee code runs even after the initial access vector is closed.',
 '[{"industry":"Financial Services","description":"Scheduled task running a credential dumper nightly during off-hours to avoid detection."},{"industry":"Government","description":"Cron job exfiltrating collected data every 6 hours on a compromised Linux server."}]',
 ARRAY['Scheduled task creation alerts (Event ID 4698)','Cron job monitoring on Linux servers','Comparison of tasks against known-good baseline'],
 ARRAY['Restrict task creation to privileged accounts','Audit scheduled tasks regularly','EDR behavioral detection for task-spawned processes'],
 'Why do attackers prefer scheduled tasks over other persistence mechanisms?',
 'Event ID 4698 fires at 11 PM — a new scheduled task was created by a standard user account running a PowerShell command from a temp directory.'),

('T1106', 'Native API', 'Execution', 'TA0002', 'Advanced',
 ARRAY['Red Team', 'Purple Team'],
 'Attackers call Windows or Linux native system APIs directly to execute code, avoiding higher-level interfaces that security tools monitor more closely.',
 'Business Interruption',
 'Direct API calls bypass many endpoint security tools that only hook into higher-level application interfaces, making the malicious activity invisible to standard monitoring.',
 'When attackers talk directly to the OS at the lowest level, our security tools may not see the conversation. Kernel-level visibility is essential for detecting sophisticated threats.',
 '[{"industry":"Technology","description":"Malware using direct syscalls to bypass user-mode endpoint detection hooks."},{"industry":"Government","description":"Nation-state implants using native API calls to evade commercial EDR products."}]',
 ARRAY['Kernel-level EDR with syscall monitoring','Memory integrity scanning','Behavioral detection for unusual API call patterns'],
 ARRAY['Endpoint detection with kernel-level visibility','Application allowlisting','Memory protection features (e.g., Windows Defender Credential Guard)'],
 'Why do sophisticated attackers prefer direct syscalls over higher-level Windows API calls?',
 'An EDR alert flags a process making direct NTDLL syscalls to allocate memory and inject code — bypassing the API hooks the security tool relies on.')
ON CONFLICT (technique_id) DO NOTHING;

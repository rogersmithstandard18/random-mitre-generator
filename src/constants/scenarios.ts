import type { Scenario } from '@/types/Scenario';

const scenarios: Scenario[] = [
  {
    id: 'scenario_01',
    title: 'The Ghost VPN Session',
    subtitle: 'Remote Access Security & The 5-Minute Rule',
    difficulty: 'Intermediate',
    learning_paths: ['Blue Team', 'Purple Team'],
    estimated_time: '15-20 minutes',
    protagonist: {
      name: 'Alex',
      role: 'Junior SOC Analyst',
      experience: 'Entry-level',
    },
    situation: {
      time: '02:14 AM',
      shift: 'Night Shift',
      alert_type: 'Impossible Travel - Successful Login',
      severity: 'High',
      description:
        "User 'Mark Sloan' (DevOps) logged in from Chicago at 02:00 AM and then from an IP address in Lagos, Nigeria, at 02:12 AM. EDR shows PowerShell script executing on Mark's workstation.",
    },
    mitre_attack: {
      tactics: ['TA0001 - Initial Access', 'TA0002 - Execution', 'TA0003 - Persistence'],
      techniques: [
        {
          id: 'T1078',
          name: 'Valid Accounts',
          description: 'Adversaries may obtain and abuse credentials of existing accounts',
        },
        {
          id: 'T1136.001',
          name: 'Create Account: Local Account',
          description: 'Creating local admin accounts for persistence (if not stopped)',
        },
      ],
    },
    security_plus_objectives: [
      '1.4 - Given a scenario, analyze indicators of malicious activity',
      '4.1 - Given a scenario, use the appropriate tool to assess organizational security',
      '4.5 - Given a scenario, implement cybersecurity resilience',
    ],
    owasp_mapping: [
      'A01:2025 - Broken Access Control',
      'A07:2025 - Authentication Failures',
      'A09:2025 - Security Logging and Alerting Failures',
    ],
    key_concepts: [
      'Impossible Travel detection',
      '5-Minute Rule for escalation',
      'Chain of command',
      'Authorization for account disablement',
      'SIEM correlation',
      'EDR analysis',
    ],
    choices: [
      {
        id: 'choice_a',
        text: "Investigate further on your own. Check PowerShell logs, analyze the script, and try to determine if it's malicious before bothering Sarah.",
        score: 3,
        max_score: 8,
        outcome_type: 'poor',
        outcome:
          "You spend 22 minutes analyzing. Meanwhile, the attacker creates a new local administrator account and begins lateral movement to the finance server. Critical mistake: You violated the '5-Minute Rule' - when you have confirmed compromise (Impossible Travel), escalate immediately.",
        lessons: [
          'Impossible Travel is a hard indicator of compromise',
          'Investigation can happen in parallel AFTER containment',
          'The 5-Minute Rule exists to minimize breach window',
        ],
        consequences: 'Extended breach window, lateral movement successful',
      },
      {
        id: 'choice_b',
        text: "Immediately escalate to Sarah. Recognize this as 'Impossible Travel' - a confirmed compromise. Interrupt her current work to get authorization to disable Mark's account.",
        score: 8,
        max_score: 8,
        outcome_type: 'excellent',
        outcome:
          "You notify Sarah: 'Sarah, I have a high-severity incident. Impossible Travel on Mark Sloan's DevOps account - Chicago to Lagos in 12 minutes. PowerShell execution detected. I need authorization to disable his account.' Sarah approves immediately. Within 4 minutes, the account is disabled and endpoint is isolated. Perfect execution of the 5-Minute Rule.",
        lessons: [
          'Proper escalation script usage',
          "Getting 'air cover' from supervisor",
          'Fast containment prevents lateral movement',
          'Following chain of command under pressure',
        ],
        consequences: 'Breach contained, minimal damage, professional response',
      },
      {
        id: 'choice_c',
        text: "Call Mark directly to ask if he's traveling. Maybe there's a legitimate explanation before you escalate this.",
        score: 0,
        max_score: 8,
        outcome_type: 'critical_failure',
        outcome:
          "Critical error. You wake Mark up at 2:14 AM. He confirms he's home in Chicago. While you're on the phone, the attacker - monitoring the account - realizes they've been detected and immediately begins data exfiltration and log deletion. Never contact the compromised user during an active incident.",
        lessons: [
          'Never contact potentially compromised users during incidents',
          'Attacker may be monitoring the account',
          'Direct contact can tip off the adversary',
          'Follow incident response procedures',
        ],
        consequences: 'Attacker alerted, data exfiltration successful, evidence destroyed',
      },
    ],
    fact_check: {
      fiction:
        'Analysts can disable any account they want the moment they see an alert.',
      reality:
        "In a real SOC, disabling a high-level account without authorization can result in severe business impact and disciplinary action. Always get 'Air Cover' from a supervisor.",
    },
  },
  {
    id: 'scenario_02',
    title: 'The Rogue Access Point',
    subtitle: 'Wireless Security & Physical Hierarchy',
    difficulty: 'Beginner',
    learning_paths: ['Blue Team', 'GRC Focus'],
    estimated_time: '10-15 minutes',
    protagonist: {
      name: 'Leo',
      role: 'SOC Analyst',
      experience: 'Mid-level',
    },
    situation: {
      time: '10:45 AM',
      shift: 'Day Shift',
      alert_type: 'Unauthorized SSID Detected',
      severity: 'High',
      description:
        "Automated sensor detects unauthorized SSID 'Company_Guest_Fast' broadcasting from 3rd-floor breakroom. Using WPA2-Personal instead of company standard WPA3-Enterprise.",
    },
    mitre_attack: {
      tactics: ['TA0001 - Initial Access', 'TA0006 - Credential Access'],
      techniques: [
        {
          id: 'T1200',
          name: 'Hardware Additions',
          description: 'Physical devices like WiFi Pineapple for credential harvesting',
        },
        {
          id: 'T1557.002',
          name: 'Adversary-in-the-Middle: ARP Cache Poisoning',
          description: 'Evil Twin attacks to intercept traffic',
        },
      ],
    },
    security_plus_objectives: [
      '1.2 - Explain common threat vectors and attack surfaces',
      '3.4 - Given a scenario, install and configure wireless security settings',
      '4.2 - Summarize the importance of policies, processes, and procedures',
    ],
    owasp_mapping: [
      'A02:2025 - Security Misconfiguration',
      'A06:2025 - Insecure Design',
      'A09:2025 - Security Logging and Alerting Failures',
    ],
    key_concepts: [
      'Rogue Access Point detection',
      'Evil Twin attacks',
      'WiFi Pineapple',
      'Physical security coordination',
      'Chain of command',
      'Help Desk procedures',
      'WPA2 vs WPA3 security',
    ],
    choices: [
      {
        id: 'choice_a',
        text: 'Run additional network scans to identify all devices connected to the rogue AP and collect evidence. You want a complete picture before taking action.',
        score: 2,
        max_score: 8,
        outcome_type: 'poor',
        outcome:
          "You spend 35 minutes conducting thorough analysis. You identify 4 employee devices that connected and evidence of credential harvesting. However, the attacker - monitoring their device - realizes they've been detected and physically removes the Pineapple. By the time you contact facilities, the device is gone.",
        lessons: [
          'Physical threats require immediate physical response',
          "Technical evidence collection shouldn't delay containment",
          'Attacker can monitor and respond to detection',
          'Capture evidence first, then immediately pursue physical removal',
        ],
        consequences: 'Attacker escaped with device, credentials compromised, evidence lost',
      },
      {
        id: 'choice_b',
        text: "Send an email to the CEO and CISO immediately with subject line 'URGENT: Security Breach on 3rd Floor.' This is a serious physical security incident.",
        score: 4,
        max_score: 8,
        outcome_type: 'poor',
        outcome:
          "The CEO receives your email during a board meeting and calls the CISO in a panic. The CISO calls you asking why this wasn't routed through proper channels. The Help Desk wasn't notified. By the time escalation completes, 28 minutes have passed. The CEO doesn't remove rogue APs - the Help Desk does.",
        lessons: [
          'Follow chain of command',
          'Escalate to appropriate responders first',
          'Over-escalation creates chaos and delays',
          'Know who handles physical security tasks',
        ],
        consequences: 'Delayed response, unnecessary executive alarm, procedural violation',
      },
      {
        id: 'choice_c',
        text: "Contact IT Help Desk with specific information: 'Unauthorized wireless device detected. SSID: Company_Guest_Fast, Location: 3rd floor breakroom, Signal strength indicates device is within 30 feet of sensor AP-3F-12. Request immediate physical removal.'",
        score: 8,
        max_score: 8,
        outcome_type: 'excellent',
        outcome:
          'Help Desk dispatches technician immediately. Within 11 minutes, they locate a WiFi Pineapple hidden behind the coffee maker. Device is carefully bagged as evidence. You notify your supervisor with full report. Perfect execution: actionable intelligence to the right responders, proper chain of command.',
        lessons: [
          'Provide specific, actionable intelligence',
          'Contact the team responsible for physical response',
          'Preserve evidence properly',
          'Follow up with supervisor after action taken',
        ],
        consequences: 'Device recovered, evidence preserved, attacker identified through investigation',
      },
    ],
    fact_check: {
      fiction:
        'Security incidents should always be escalated to the highest level of management immediately.',
      reality:
        'Proper escalation follows chain of command. Route to the team that can actually respond (Help Desk for physical removal), then escalate to management if needed.',
    },
  },
  {
    id: 'scenario_03',
    title: 'MFA Fatigue & Lateral Movement',
    subtitle: 'IAM Security & Authorization Logic',
    difficulty: 'Advanced',
    learning_paths: ['Blue Team', 'Purple Team', 'GRC Focus'],
    estimated_time: '20-25 minutes',
    protagonist: {
      name: 'Maya',
      role: 'SOC Analyst',
      experience: 'Mid-level',
    },
    situation: {
      time: '3:42 PM',
      shift: 'Day Shift',
      alert_type: 'MFA Spam / Network Scanning',
      severity: 'Critical',
      description:
        "CFO's account shows 40+ denied MFA push notifications in 3 minutes, followed by 1 successful login. Minutes later, EDR shows port scanning from CFO's laptop targeting /finance subnet.",
    },
    mitre_attack: {
      tactics: [
        'TA0001 - Initial Access',
        'TA0006 - Credential Access',
        'TA0007 - Discovery',
        'TA0008 - Lateral Movement',
      ],
      techniques: [
        {
          id: 'T1078',
          name: 'Valid Accounts',
          description: 'Using compromised CFO credentials',
        },
        {
          id: 'T1621',
          name: 'Multi-Factor Authentication Request Generation',
          description: 'MFA fatigue attack - bombarding user with push notifications',
        },
        {
          id: 'T1046',
          name: 'Network Service Scanning',
          description: 'Port scanning to discover lateral movement targets',
        },
      ],
    },
    security_plus_objectives: [
      '1.4 - Given a scenario, analyze indicators of malicious activity',
      '4.3 - Given a scenario, implement identity and access management',
      '4.4 - Given a scenario, implement authentication and authorization solutions',
      '4.5 - Given a scenario, implement cybersecurity resilience',
    ],
    owasp_mapping: [
      'A01:2025 - Broken Access Control',
      'A07:2025 - Authentication Failures',
      'A09:2025 - Security Logging and Alerting Failures',
    ],
    key_concepts: [
      'MFA Fatigue attacks',
      'Push notification bombing',
      'Network isolation procedures',
      'Executive account handling',
      'Business impact assessment',
      'Emergency escalation protocols',
      'Getting authorization under time pressure',
    ],
    choices: [
      {
        id: 'choice_a',
        text: "Wait for the CFO to call IT and complain about unusual activity. They'll notice the port scanning eventually, and then you'll have business justification to act.",
        score: 1,
        max_score: 8,
        outcome_type: 'critical_failure',
        outcome:
          "The CFO doesn't notice anything. The laptop operates normally from their perspective. Meanwhile, the attacker completes enumeration, identifies the finance file server, and accesses payroll data, M&A documents, and financial forecasts. By the time the CFO leaves for a meeting 28 minutes later, significant data has been compromised.",
        lessons: [
          'Never wait for victims to report during active breach',
          "Attackers don't announce themselves to users",
          'Proactive detection and response is your job',
          'Every minute counts during active lateral movement',
        ],
        consequences: 'Major data breach, financial information compromised, regulatory exposure',
      },
      {
        id: 'choice_b',
        text: "Immediately isolate the CFO's laptop from the network. This is an active breach and every second counts. You'll explain to Rita after the fact.",
        score: 4,
        max_score: 8,
        outcome_type: 'mixed',
        outcome:
          "You isolate the laptop immediately. Breach is contained - good. However, the CFO is mid-presentation with investors discussing Q4 earnings. Their screen goes dark. CFO calls CIO in rage. CIO calls Rita. Rita calls you asking why you acted without authorization. Problem: You created business disruption without air cover.",
        lessons: [
          'Get authorization for executive-level actions',
          "Technical correctness doesn't excuse procedural violations",
          'Protecting business operations AND security',
          'Fast approval is possible with proper communication',
        ],
        consequences: 'Breach contained but executive disruption, disciplinary discussion, strained relationships',
      },
      {
        id: 'choice_c',
        text: "Use emergency escalation protocol: Send Rita a Slack message marked URGENT, step to her office door, make eye contact, and hold up a note: 'Active CFO breach - need approval to isolate - 60 seconds.'",
        score: 8,
        max_score: 8,
        outcome_type: 'excellent',
        outcome:
          "Perfect execution. Rita sees your Slack, glances at you, sees your note, and holds up one finger. She mutes her call, reviews your evidence at your desk, and says 'Isolate it now. I'll call the CFO.' You isolate the laptop. Rita manages stakeholder communication. Breach contained with minimal business impact. Professional SOC operations.",
        lessons: [
          'Emergency escalation protocols exist for this reason',
          "Visual signals work when verbal interruption isn't appropriate",
          'Supervisor can provide air cover and manage communications',
          'Fast authorization + proper procedure = optimal outcome',
        ],
        consequences: 'Breach contained, executive informed properly, team coordination excellent',
      },
    ],
    fact_check: {
      fiction:
        'You should always act immediately on security threats regardless of who is affected.',
      reality:
        "Executive accounts require authorization before disruptive actions. Get fast approval through emergency protocols, but GET approval. Your supervisor shields you from political fallout.",
    },
  },
  {
    id: 'scenario_04',
    title: 'The BEC Rule Creation',
    subtitle: 'Email Security & Senior Guidance',
    difficulty: 'Intermediate',
    learning_paths: ['Blue Team', 'GRC Focus'],
    estimated_time: '15-20 minutes',
    protagonist: {
      name: 'Sam',
      role: 'Junior SOC Analyst',
      experience: 'Entry-level',
    },
    situation: {
      time: '11:23 AM',
      shift: 'Day Shift',
      alert_type: 'New Inbox Rule Created',
      severity: 'Medium-High',
      description:
        "Alert shows new Inbox Rule on HR Director's Outlook: 'Move all mail with Invoice, Wire, Payment, or Payroll to RSS Feeds folder.' Could be BEC or legitimate business process.",
    },
    mitre_attack: {
      tactics: ['TA0009 - Collection', 'TA0005 - Defense Evasion'],
      techniques: [
        {
          id: 'T1114.003',
          name: 'Email Collection: Email Forwarding Rule',
          description: 'Creating rules to hide financial correspondence for BEC',
        },
        {
          id: 'T1078',
          name: 'Valid Accounts',
          description: 'Using compromised HR Director credentials',
        },
      ],
    },
    security_plus_objectives: [
      '1.2 - Explain common threat vectors and attack surfaces',
      '1.4 - Given a scenario, analyze indicators of malicious activity',
      '4.2 - Summarize the importance of policies, processes, and procedures',
      '5.6 - Given a scenario, implement security awareness practices',
    ],
    owasp_mapping: [
      'A01:2025 - Broken Access Control',
      'A07:2025 - Authentication Failures',
      'A09:2025 - Security Logging and Alerting Failures',
    ],
    key_concepts: [
      'Business Email Compromise (BEC)',
      'Email rule abuse',
      'False positive analysis',
      'Asking for senior guidance properly',
      'Showing your work',
      'User verification procedures',
      'Balancing urgency with validation',
    ],
    choices: [
      {
        id: 'choice_a',
        text: "Send Marcus a Slack message: 'Hey Marcus, what is this?' [screenshot of alert]",
        score: 2,
        max_score: 8,
        outcome_type: 'poor',
        outcome:
          "Marcus responds: 'I don't know. Did you check login history? What does T1114 say? Have you verified if HR uses RSS feeds?' You: 'No, I just saw the alert.' Marcus: 'Okay, well, do that investigation and let me know.' Problem: You asked Marcus to do your job. Show your work first.",
        lessons: [
          'Senior analysts guide thinking, not do initial investigation',
          "Show what you've already discovered",
          "Ask specific questions, not open-ended 'what is this'",
          'Demonstrate effort before requesting help',
        ],
        consequences: 'Time wasted, competence questioned, investigation delayed',
      },
      {
        id: 'choice_b',
        text: "Escalate directly to CISO: 'Possible BEC on HR Director's account. Requesting immediate investigation.'",
        score: 3,
        max_score: 8,
        outcome_type: 'poor',
        outcome:
          "CISO calls HR Director immediately about potential compromise. HR Director checks with team - turns out they created the rule themselves for email organization testing. CISO calls back: 'Next time, verify with the user or senior analyst before escalating to me.' Problem: Skipped chain of command and basic validation.",
        lessons: [
          "Don't escalate to executives without validation",
          'Use chain of command appropriately',
          'Verify before alarming leadership',
          'CISO time is for confirmed incidents or escalation failures',
        ],
        consequences: 'False positive escalation, strained executive relationships, procedural violation',
      },
      {
        id: 'choice_c',
        text: "Message Marcus: 'Marcus, I have an alert on HR Director's account - New inbox rule moving financial keywords to RSS folder. Maps to T1114.003 (Email Forwarding Rule), common in BEC. I checked logins - no impossible travel, but unusual mobile login this morning. Should I escalate to CISO or contact HR first to verify legitimacy?'",
        score: 8,
        max_score: 8,
        outcome_type: 'excellent',
        outcome:
          "Marcus reviews your analysis and responds with guidance on user verification phrasing. You call HR Director professionally. They confirm: 'No, I didn't create any rules. I don't even know what RSS is.' You escalate to Marcus, who escalates to CISO. Account secured, rule removed. Investigation reveals phished credentials. Perfect: investigation done, senior guidance sought, professional verification.",
        lessons: [
          'Present findings with relevant frameworks (MITRE)',
          "Show what you've already checked",
          'Ask specific next-step questions',
          'Professional user verification techniques',
        ],
        consequences: 'BEC attempt stopped, credentials secured, professional handling throughout',
      },
    ],
    fact_check: {
      fiction:
        'Senior analysts are there to answer all your questions and do investigations for you.',
      reality:
        "Senior analysts validate your thinking and guide decisions. They expect you to do initial investigation and present findings. 'What is this?' is lazy; showing your analysis is professional.",
    },
  },
  {
    id: 'scenario_05',
    title: 'The Post-Mortem Brief',
    subtitle: 'Reporting & Non-Technical Communication',
    difficulty: 'Advanced',
    learning_paths: ['Blue Team', 'GRC Focus', 'Purple Team'],
    estimated_time: '20-25 minutes',
    protagonist: {
      name: 'Senior Analyst',
      role: 'Senior SOC Analyst',
      experience: 'Senior-level',
    },
    situation: {
      time: '9:00 AM',
      shift: 'Day Shift - Post-Incident',
      alert_type: 'Ransomware Attempt (Stopped)',
      severity: 'Critical (Mitigated)',
      description:
        'Team successfully stopped ransomware overnight. Attacker used Search Order Hijacking (DLL Sideloading) but EDR caught it before encryption. IT Director (non-technical) needs briefing for executive team.',
    },
    mitre_attack: {
      tactics: ['TA0002 - Execution', 'TA0005 - Defense Evasion', 'TA0040 - Impact'],
      techniques: [
        {
          id: 'T1574',
          name: 'Hijack Execution Flow: DLL Search Order Hijacking',
          description: 'Placing malicious DLL in search path to execute via legitimate executables',
        },
        {
          id: 'T1486',
          name: 'Data Encrypted for Impact',
          description: 'Ransomware encryption attempt (prevented)',
        },
      ],
    },
    security_plus_objectives: [
      '1.5 - Explain the purpose of mitigation techniques',
      '4.2 - Summarize the importance of policies, processes, and procedures',
      '5.1 - Summarize elements of effective security governance',
      '5.2 - Explain elements of the risk management process',
      '5.6 - Given a scenario, implement security awareness practices',
    ],
    owasp_mapping: [
      'A06:2025 - Insecure Design',
      'A08:2025 - Software or Data Integrity Failures',
      'A09:2025 - Security Logging and Alerting Failures',
    ],
    key_concepts: [
      'Executive communication',
      'Plain language translation',
      'Risk communication',
      'Post-incident reporting',
      'Managing expectations',
      'Avoiding false promises',
      'Residual risk acknowledgment',
    ],
    choices: [
      {
        id: 'choice_a',
        text: "'We detected T1574 DLL Sideloading via Search Order Hijacking. The adversary attempted to leverage legitimate executables to proxy execution of malicious code, but our EDR behavioral detection prevented the ransomware payload from executing.'",
        score: 3,
        max_score: 8,
        outcome_type: 'poor',
        outcome:
          "IT Director nods politely but doesn't understand. They ask 'So... are we safe?' You respond with more technical details. Later, Director briefs CEO: 'There was some DLL thing. I think we're okay?' CEO is frustrated by unclear communication. Problem: Technical jargon for non-technical audience.",
        lessons: [
          'Match communication to audience technical level',
          "Technical accuracy doesn't equal effective communication",
          'Directors need business impact, not implementation details',
          'Translate technical concepts to business language',
        ],
        consequences: 'Poor communication, unclear risk assessment, executive confusion',
      },
      {
        id: 'choice_b',
        text: "'The attack is completely stopped. We've patched the vulnerability and implemented additional controls. This will never happen again. Your systems are 100% safe now.'",
        score: 2,
        max_score: 8,
        outcome_type: 'critical_failure',
        outcome:
          "IT Director shares your assessment: 'We're completely safe. This will never happen again.' Two weeks later, different attack vector succeeds (phishing). CEO: 'I thought you said we were 100% safe?' Your credibility is damaged. Critical error: Made absolute promises about security, which is impossible.",
        lessons: [
          'Never promise 100% security',
          'Security is risk management, not elimination',
          'Overpromising damages trust when next incident occurs',
          'Be honest about residual risks and ongoing efforts',
        ],
        consequences: 'False security, credibility destroyed, executive trust broken',
      },
      {
        id: 'choice_c',
        text: "'Last night an attacker tried to lock up all our files and demand ransom. They used a trick where they placed a fake file that our computer trusted. Our security software caught the fake file before it could encrypt anything. We've removed their access and are investigating entry point. We stopped this attack, but we're hardening defenses to reduce similar future risks.'",
        score: 8,
        max_score: 8,
        outcome_type: 'excellent',
        outcome:
          "IT Director understands completely. They ask good follow-ups: 'How did they get the fake file on the laptop?' You explain ongoing investigation. Director briefs CEO clearly. CEO understands both the success (attack stopped) and reality (more work needed). CEO approves budget for additional training. Perfect: plain language, honest risk assessment, path forward.",
        lessons: [
          'Use metaphors and analogies for complex technical concepts',
          'Acknowledge residual risk honestly',
          'Provide clear next steps and ongoing efforts',
          'Build trust through honest, clear communication',
        ],
        consequences: 'Executive understanding, budget approval, trust established, realistic expectations set',
      },
    ],
    fact_check: {
      fiction:
        'Technical accuracy is the most important part of communication with executives.',
      reality:
        "Communication must match the audience. MITRE codes for executives is bad as kindergarten language for engineers. The goal is understanding, not demonstrating technical knowledge.",
    },
  },
];

export default scenarios;

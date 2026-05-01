/* ═══════════════════════════════════════════════════════════
   GAME DATA — ported from CyberSecurityGame (Python)
   Source: game_data.py, constants.py
═══════════════════════════════════════════════════════════ */

import type { ToolId, ThreatType, ThreatDef, GameTool } from '@/types/GameState';
import type { MitreTactic } from '@/types/TranslationCard';

/* ── Balance constants (from constants.py) ── */
export const SYSTEM_HP_MAX = 60;
export const SP_PER_TURN = 4;
export const GUESS_DAMAGE = 15;
export const TOOL_BASE_DAMAGE = 25;
export const CAUSES_SHOWN = 5;
export const EVIDENCE_SP_COST = 1;
export const TOTAL_ROUNDS = 3;

/** Weighted roll: how many correct causes appear per turn */
export const CORRECT_CAUSE_WEIGHTS: Record<number, number> = { 1: 0.60, 2: 0.30, 3: 0.10 };

/** Round tier weights — difficulty escalates per round */
export const ROUND_WEIGHTS: Record<1 | 2 | 3, number>[] = [
  { 1: 0.70, 2: 0.25, 3: 0.05 },
  { 1: 0.40, 2: 0.45, 3: 0.15 },
  { 1: 0.15, 2: 0.40, 3: 0.45 },
];

/** SP cost by effectiveness band */
export function toolSpCost(eff: number): number {
  return eff >= 0.8 ? 2 : 1;
}

/* ── Tools (from game_data.py lines 3-71) ── */
export const TOOLS_DEF: Record<ToolId, Omit<GameTool, 'currentCooldown'>> = {
  firewall: {
    id: 'firewall',
    name: 'Firewall',
    description: 'Blocks unauthorised network traffic. Strong against network-layer attacks. Useless against social engineering.',
    baseCooldown: 2,
    effectiveness: {
      phishing:   [0.0, 0.0],
      ransomware: [0.3, 0.5],
      apt:        [0.4, 0.5],
    },
  },
  antivirus: {
    id: 'antivirus',
    name: 'Antivirus',
    description: 'Scans for and removes known malicious software. Cannot stop phishing or patch vulnerabilities.',
    baseCooldown: 1,
    effectiveness: {
      phishing:   [0.0, 0.0],
      ransomware: [0.4, 0.5],
      apt:        [0.3, 0.5],
    },
  },
  ids: {
    id: 'ids',
    name: 'Intrusion Detection System',
    description: 'Monitors traffic and behaviour. Catches phishing by flagging spoofed senders and suspicious links.',
    baseCooldown: 1,
    effectiveness: {
      phishing:   [0.4, 1.0],
      ransomware: [0.3, 0.5],
      apt:        [0.3, 0.8],
    },
  },
  encryption: {
    id: 'encryption',
    name: 'Encryption Tool',
    description: 'Encrypts data in transit and at rest. Useless once ransomware is already encrypting files.',
    baseCooldown: 1,
    effectiveness: {
      phishing:   [0.0, 0.0],
      ransomware: [0.0, 0.0],
      apt:        [0.3, 0.5],
    },
  },
  patch_manager: {
    id: 'patch_manager',
    name: 'Patch Manager',
    description: 'Closes known vulnerabilities. Ransomware nearly always enters through unpatched systems.',
    baseCooldown: 2,
    effectiveness: {
      phishing:   [0.0, 0.0],
      ransomware: [0.4, 1.0],
      apt:        [0.3, 0.5],
    },
  },
  honeypot: {
    id: 'honeypot',
    name: 'Honeypot',
    description: 'Decoy system that lures and exposes attackers. Uniquely effective against slow-moving APTs.',
    baseCooldown: 3,
    effectiveness: {
      phishing:   [0.0, 0.0],
      ransomware: [0.0, 0.0],
      apt:        [0.4, 1.0],
    },
  },
};

export const ALL_TOOL_IDS: ToolId[] = ['firewall', 'antivirus', 'ids', 'encryption', 'patch_manager', 'honeypot'];

/** Optimal tool per threat type */
export const CORRECT_TOOL: Record<ThreatType, ToolId> = {
  phishing: 'ids',
  ransomware: 'patch_manager',
  apt: 'honeypot',
};

/* ── Tool mismatch lessons (from game_data.py lines 79-153) ── */
export const TOOL_MISMATCH_LESSONS: Record<string, string> = {
  'firewall:phishing':
    'A firewall blocks network traffic — but phishing never touches the network perimeter. The attack lives entirely in the inbox. The firewall has nothing to block.',
  'antivirus:phishing':
    'Antivirus scans for malicious files and executables. A phishing email is just text and a link — no payload to detect. The AV has nothing to act on.',
  'encryption:phishing':
    'Encrypting data protects it from being read in transit. Phishing doesn\'t intercept data — it tricks users into handing it over willingly. Encryption is irrelevant here.',
  'patch_manager:phishing':
    'Patching closes software vulnerabilities. Phishing is a human problem, not a software flaw. No patch exists for a user clicking a convincing fake email.',
  'honeypot:phishing':
    'A honeypot lures attackers probing your network. Phishing targets your users directly via email — the attacker never touches your network infrastructure to find.',
  'firewall:apt':
    'The APT is already inside using valid credentials. A firewall stops things getting in — it can\'t evict an attacker who legitimately authenticated.',
  'antivirus:apt':
    'APTs use legitimate system tools (LOLBins) to avoid AV detection entirely. There is no malware signature to find. The AV sees normal admin activity.',
  'encryption:ransomware':
    'Encryption protects data from being read if stolen. Ransomware doesn\'t steal data — it encrypts it and holds it hostage. Your encryption can\'t out-encrypt the ransomware that\'s already running.',
  'honeypot:ransomware':
    'A honeypot works on patient attackers who probe slowly. Ransomware spreads and encrypts as fast as possible — it will never wander into your decoy system.',
  'firewall:ransomware':
    'The ransomware is already inside spreading laterally. Blocking the perimeter at this point is like locking the front door after the attacker is already upstairs.',
  'ids:ransomware':
    'An IDS watches for suspicious traffic patterns. Ransomware spreading across internal drives doesn\'t generate the kind of network anomalies IDS looks for — it looks like normal file access.',
  'ids:apt':
    'IDS flags anomalous traffic — but the APT is using valid credentials and normal-looking access patterns deliberately designed to stay under IDS thresholds. Partial effect only — the honeypot is the real trap.',
  'patch_manager:apt':
    'Patching closes entry vulnerabilities, but the APT is already inside using stolen credentials. Patches won\'t evict them — you need to expose and trap them.',
  'encryption:apt':
    'Encrypting data makes exfiltration harder but doesn\'t stop an attacker with valid credentials — they can access the data before it leaves. Partial effect only.',
};

export const PARTIAL_LESSON =
  'This tool has some effect but isn\'t the right fit for this threat type. It slows the attacker but doesn\'t address the core attack vector. Identify the root cause to unlock the optimal tool for full effectiveness.';

/* ── Cause pools (from game_data.py lines 162-217) ── */
export const CAUSE_POOLS: Record<ThreatType, { real: string[]; fake: string[] }> = {
  phishing: {
    real: [
      'Employees clicking spoofed login links',
      'Spoofed sender addresses bypassing spam filters',
      'Urgency-framed emails pressuring quick action',
      'Misspelled domains impersonating trusted brands',
      'Credential harvesting via fake login portals',
      'CEO fraud — impersonating senior staff',
    ],
    fake: [
      'Unpatched vulnerability in web server',
      'Malware spreading via USB drives',
      'Lateral movement from compromised credentials',
      'Encrypted C2 traffic to foreign IP',
      'Database exfiltration via SQL injection',
      'Ransomware payload dropped on file server',
    ],
  },
  ransomware: {
    real: [
      'Unpatched OS vulnerability exploited for entry',
      'Ransomware payload encrypting local and network drives',
      'Lateral movement spreading encryption to new hosts',
      'Backup files targeted and destroyed first',
      'RaaS toolkit used — low barrier to entry for attacker',
      'Initial access via phishing email 48 hours prior',
    ],
    fake: [
      'Spoofed emails targeting HR department',
      'Low-and-slow data exfiltration to unknown IP',
      'Valid admin credentials used at odd hours',
      'DNS poisoning redirecting internal traffic',
      'New scheduled tasks created on domain controller',
      'Certificate spoofing on internal HTTPS traffic',
    ],
  },
  apt: {
    real: [
      'Valid credentials used — likely from prior breach',
      'Low-and-slow exfiltration staying under alert thresholds',
      'Living-off-the-land — using built-in system tools',
      'New scheduled tasks for persistence on key servers',
      'Attacker studying network topology before acting',
      'Long dwell time — weeks or months before detection',
    ],
    fake: [
      'Mass file encryption across network drives',
      'Ransom note dropped on multiple desktops',
      'Phishing campaign targeting all-staff email list',
      'CPU and memory spikes on endpoints',
      'Antivirus alerts firing on known malware signatures',
      'USB-based malware introduction at workstations',
    ],
  },
};

/* ── Threat types (from game_data.py lines 219-300) ── */
export const THREAT_TYPES: Record<ThreatType, ThreatDef> = {
  phishing: {
    name: 'Phishing Campaign',
    tiers: {
      1: { hp: 25,  attackDamage: 6,  label: 'Basic' },
      2: { hp: 45,  attackDamage: 12, label: 'Targeted' },
      3: { hp: 65,  attackDamage: 20, label: 'Spear-Phishing' },
    },
    introByTier: {
      1: 'ALERT: Employees reporting suspicious emails. A basic phishing campaign is underway.',
      2: 'ALERT: Targeted phishing emails crafted to impersonate senior staff. Several users at risk.',
      3: 'CRITICAL: Highly sophisticated spear-phishing campaign targeting executives with personalised vectors.',
    },
    debrief: [
      'WHAT HAPPENED: A phishing campaign targeted employees with fake emails to steal credentials. 90%+ of breaches start with a phishing email.',
      'KEY INSIGHT: No unusual network traffic at this stage — nothing has executed yet. It is purely social engineering. The IDS catches it by analysing email metadata patterns.',
      'REAL WORLD DEFENCE: Security awareness training, email filtering with SPF/DKIM/DMARC, and MFA all reduce phishing risk dramatically.',
    ],
  },
  ransomware: {
    name: 'Ransomware Outbreak',
    tiers: {
      1: { hp: 30,  attackDamage: 10, label: 'Commodity' },
      2: { hp: 50,  attackDamage: 18, label: 'RaaS' },
      3: { hp: 75,  attackDamage: 28, label: 'State-Sponsored' },
    },
    introByTier: {
      1: 'ALERT: File encryption detected on several endpoints. A commodity ransomware strain is spreading.',
      2: 'CRITICAL: Ransomware-as-a-Service attack underway. Multiple departments locked out. Spreading fast.',
      3: 'EMERGENCY: State-sponsored ransomware variant. Highly evasive — spreading before defences can react.',
    },
    debrief: [
      'WHAT HAPPENED: Ransomware encrypted files and demanded payment. It enters via unpatched vulnerabilities or phishing then spreads laterally before detection.',
      'KEY INSIGHT: Encrypted files and a ransom note are definitive. Slow inbound probes are an APT signature — a classic red herring here.',
      'REAL WORLD DEFENCE: Regular patching, offline backups (3-2-1 rule), network segmentation, and EDR tools.',
    ],
  },
  apt: {
    name: 'Advanced Persistent Threat',
    tiers: {
      1: { hp: 35,  attackDamage: 12, label: 'Criminal Group' },
      2: { hp: 55,  attackDamage: 20, label: 'Nation-State' },
      3: { hp: 80,  attackDamage: 30, label: 'Zero-Day APT' },
    },
    introByTier: {
      1: 'WARNING: Unusual low-and-slow activity detected. A criminal group may have persistent access.',
      2: 'WARNING: Nation-state level intrusion suspected. Stealthy exfiltration of sensitive data underway.',
      3: 'CRITICAL: Zero-day APT detected. Sophisticated actor with unknown tools. Extreme caution required.',
    },
    debrief: [
      'WHAT HAPPENED: A persistent actor had long-term access and quietly exfiltrated data. APTs move slowly and use legitimate tools to avoid detection.',
      'KEY INSIGHT: Valid credentials at odd hours, slow outbound transfers, new scheduled tasks. The attacker studies your network before striking.',
      'REAL WORLD DEFENCE: Threat hunting, UEBA, zero-trust architecture, honeypots for lateral movement detection, and a SIEM for log correlation.',
    ],
  },
};

/* ── Evidence hints revealed when investigating ── */
export const EVIDENCE_HINTS: Record<ThreatType, string[]> = {
  phishing: [
    'Email headers show a spoofed sender domain — classic social engineering vector.',
    'No unusual network traffic detected. The attack is user-targeted, not system-targeted.',
    'Multiple users received nearly identical urgent emails within minutes.',
    'The suspicious URL points to a credential harvesting page, not malware delivery.',
    'SPF/DKIM checks failed on the incoming emails — sender authentication is missing.',
  ],
  ransomware: [
    'File system activity shows rapid, sequential encryption of local and network drives.',
    'A ransom note was dropped on affected systems demanding cryptocurrency payment.',
    'Event logs show an unpatched CVE was exploited to gain initial access.',
    'Backup volumes were targeted and deleted before the encryption payload ran.',
    'Lateral movement is spreading through SMB shares to new hosts.',
  ],
  apt: [
    'Login events show valid credentials used at unusual hours from an unfamiliar IP.',
    'Outbound data transfers are slow and periodic — designed to stay under alert thresholds.',
    'The attacker is using built-in system tools (LOLBins) instead of custom malware.',
    'New scheduled tasks have appeared on critical servers — a persistence mechanism.',
    'The estimated dwell time suggests the attacker has been inside for weeks.',
  ],
};

/* ── Tactic → Threat type mapping ── */
const TACTIC_TO_THREAT: Partial<Record<MitreTactic, ThreatType>> = {
  'Initial Access': 'phishing',
  'Execution': 'phishing',
  'Reconnaissance': 'phishing',
  'Impact': 'ransomware',
  'Persistence': 'ransomware',
  'Privilege Escalation': 'ransomware',
  'Collection': 'apt',
  'Exfiltration': 'apt',
  'Lateral Movement': 'apt',
  'Command and Control': 'apt',
  'Discovery': 'apt',
};

const THREAT_TYPES_LIST: ThreatType[] = ['phishing', 'ransomware', 'apt'];

export function mapTechniqueToThreatType(tactic: MitreTactic): ThreatType {
  return TACTIC_TO_THREAT[tactic] ?? THREAT_TYPES_LIST[Math.floor(Math.random() * THREAT_TYPES_LIST.length)];
}

/* ── Utility: weighted random pick ── */
export function weightedRoll<T extends string | number>(weights: Record<T, number>): T {
  const entries = Object.entries(weights) as [T, number][];
  const total = entries.reduce((sum, [, w]) => sum + (w as number), 0);
  let r = Math.random() * total;
  for (const [key, weight] of entries) {
    r -= weight as number;
    if (r <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

/** Shuffle an array (Fisher-Yates) */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

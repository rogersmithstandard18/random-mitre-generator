export type Altitude = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type SlaStatus = 'ok' | 'at-risk' | 'breach';
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface SocRole {
  id: string;
  label: string;
  short: string;
  altitude: Altitude;
  dept: string;
  initials: string;
  name: string;
}

export interface SocIncident {
  id: string;
  title: string;
  kind: string;
  severity: Severity;
  status: string;
  dept: string;
  asset: string;
  assignee: string;
  openedAt: string;
  mttdMin: number;
  ageMin: number;
  mitre: string;
  cve: string | null;
  source: string;
  confidence: number;
  fintechTags: string[];
  blastRadius: { hosts: number; accounts: number; services: number; customers: number };
  dollarsAtRisk: number;
  sla: { ack: SlaStatus; contain: SlaStatus; resolve: SlaStatus };
  summary: string;
  timeline?: { t: string; who: string; what: string }[];
}

export interface DrillOption {
  id: string;
  label: string;
  action: string;
  correct: boolean;
  explanation: string;
}

export interface SocDrill {
  id: string;
  title: string;
  category: string;
  level: string;
  mitre: string;
  severity: Severity;
  fintechFraming: string;
  estMin: number;
  incidentId: string;
  alert: { ruleName: string; ruleType: string; firedAt: string; asset: string; summary: string };
  evidence: {
    logs: string;
    pacAnomaly?: string;
    replicationDetail?: string;
    asnMix?: [string, string][];
    networkAlerts: { name: string; detail: string }[];
  };
  threatIntel: { attribution: string; reputation: string };
  options: DrillOption[];
  expectedTerms: string[];
  aar: { whatHappened: string; ttp: string; lesson: string; keyTerms: string[] };
}

export const ALTITUDE_LABELS = ['Ground', 'Lead', 'Manager', 'Director', 'Sr Director', 'Executive', 'C-Suite'];

export const ROLES: SocRole[] = [
  { id: 't1',         label: 'Tier 1 SOC Analyst',         short: 'T1 Analyst',   altitude: 0, dept: 'soc',    initials: 'MR', name: 'Maya Reyes' },
  { id: 'sr_analyst', label: 'Sr. SOC Analyst (T2/T3)',    short: 'Sr Analyst',   altitude: 0, dept: 'soc',    initials: 'DK', name: 'Devon Kim' },
  { id: 'shift_lead', label: 'SOC Shift Lead',             short: 'Shift Lead',   altitude: 1, dept: 'soc',    initials: 'AO', name: 'Aisha Okafor' },
  { id: 'ir_lead',    label: 'IR / Forensics Lead',        short: 'IR Lead',      altitude: 1, dept: 'ir',     initials: 'JT', name: 'Jordan Tan' },
  { id: 'det_eng',    label: 'Detection Engineering Lead', short: 'DetEng Lead',  altitude: 1, dept: 'deteng', initials: 'PV', name: 'Priya Venkat' },
  { id: 'soc_manager',label: 'SOC Manager',                short: 'SOC Manager',  altitude: 2, dept: 'soc',    initials: 'HN', name: 'Henry Nakamura' },
  { id: 'grc',        label: 'Compliance & GRC Director',  short: 'GRC Director', altitude: 3, dept: 'grc',    initials: 'EM', name: 'Elena Marsh' },
  { id: 'dir_secops', label: 'Director, Security Ops',     short: 'Director',     altitude: 3, dept: 'exec',   initials: 'SC', name: 'Sarah Chen' },
  { id: 'sr_dir',     label: 'Sr. Director, Cyber Defense',short: 'Sr Director',  altitude: 4, dept: 'exec',   initials: 'MA', name: 'Marcus Adeyemi' },
  { id: 'ciso',       label: 'CISO',                       short: 'CISO',         altitude: 5, dept: 'exec',   initials: 'LP', name: 'Lena Petrova' },
  { id: 'cto',        label: 'CTO',                        short: 'CTO',          altitude: 5, dept: 'exec',   initials: 'RS', name: 'Raj Sundaram' },
  { id: 'ceo',        label: 'CEO',                        short: 'CEO',          altitude: 6, dept: 'exec',   initials: 'VW', name: 'Victoria Wexler' },
];

export const KIND_META: Record<string, { label: string; color: string }> = {
  c2:         { label: 'C2 Beacon',       color: '#7C3AED' },
  fraud:      { label: 'Fraud',           color: '#DC2626' },
  ad:         { label: 'Active Directory',color: '#D97706' },
  ddos:       { label: 'DDoS',            color: '#2563EB' },
  bruteforce: { label: 'Brute Force',     color: '#0F7C42' },
  lotl:       { label: 'LotL',            color: '#0891B2' },
  cred:       { label: 'Credentials',     color: '#9333EA' },
  cloud:      { label: 'Cloud',           color: '#2563EB' },
  web:        { label: 'Web / WAF',       color: '#6B7280' },
  phish:      { label: 'Phishing',        color: '#EF4444' },
};

export const INCIDENTS: SocIncident[] = [
  {
    id: 'INC-9201', title: 'Encoded PowerShell C2 beacon on executive laptop',
    kind: 'c2', severity: 'Critical', status: 'Containment', dept: 'soc',
    asset: 'EXEC-LAPTOP-07 · ceo_assistant', assignee: 'Devon Kim (Sr T3)',
    openedAt: '2026-05-22 09:02 UTC', mttdMin: 4, ageMin: 142,
    mitre: 'T1059.001 · T1071.001', cve: 'CVE-2021-34527', source: 'EDR — Sysmon EventID 3',
    confidence: 96, fintechTags: ['Insider exec context', 'PrintNightmare', 'C2 jitter'],
    blastRadius: { hosts: 1, accounts: 1, services: 0, customers: 0 }, dollarsAtRisk: 8_400_000,
    sla: { ack: 'ok', contain: 'at-risk', resolve: 'ok' },
    summary: 'Encoded PS loader with 47s±12s jitter beaconing to 94.130.88.12. PrintNightmare DLL hijack via spoolsv.exe staged 6 days ago.',
    timeline: [
      { t: '09:02:44', who: 'SIEM',              what: 'Rule R-2103 fired: Encoded PowerShell C2 Beacon' },
      { t: '09:03:01', who: 'Maya R. (T1)',       what: 'Acknowledged. Pulled Sysmon EID 3 for host.' },
      { t: '09:06:18', who: 'Maya R. (T1)',       what: 'Escalated to T3 — confirmed jitter pattern, exec asset.' },
      { t: '09:11:40', who: 'Devon K. (T3)',      what: 'Started memory acquisition. Notified IR Lead.' },
      { t: '09:14:09', who: 'Jordan T. (IR)',     what: 'Engaged. Token revocation queued for ceo_assistant.' },
      { t: '09:17:22', who: 'Jordan T. (IR)',     what: 'Firewall block applied to 94.130.88.12 at edge.' },
      { t: '09:28:55', who: 'Aisha O. (Lead)',    what: 'Briefed SOC Manager. CISO informed via incident channel.' },
    ],
  },
  {
    id: 'INC-9197', title: 'SWIFT wire anomaly — $4.2M to first-time beneficiary',
    kind: 'fraud', severity: 'Critical', status: 'Hunting', dept: 'ir',
    asset: 'SWIFT-GW-02 · payment ops', assignee: 'Jordan Tan (IR)',
    openedAt: '2026-05-22 07:48 UTC', mttdMin: 1, ageMin: 218,
    mitre: 'T1565.001', cve: null, source: 'Fraud rules — F-104', confidence: 88,
    fintechTags: ['SWIFT MT103', 'Round-dollar amount', 'Off-hours'],
    blastRadius: { hosts: 0, accounts: 2, services: 1, customers: 0 }, dollarsAtRisk: 4_200_000,
    sla: { ack: 'ok', contain: 'ok', resolve: 'ok' },
    summary: 'MT103 message to a beneficiary first seen 11 minutes prior. Originator approved via expired hardware token reuse pattern.',
  },
  {
    id: 'INC-9193', title: 'DC compromise — ntdsutil IFM on tier-0 DC-PROD-02',
    kind: 'ad', severity: 'Critical', status: 'Eradicating', dept: 'ir',
    asset: 'DC-PROD-02 · forest root', assignee: 'Jordan Tan (IR)',
    openedAt: '2026-05-22 03:42 UTC', mttdMin: 6, ageMin: 504,
    mitre: 'T1003.003', cve: null, source: 'EDR — process telemetry', confidence: 99,
    fintechTags: ['Tier-0', 'krbtgt at risk', 'Forest-wide blast'],
    blastRadius: { hosts: 1, accounts: 31_400, services: 6, customers: 0 }, dollarsAtRisk: 240_000_000,
    sla: { ack: 'ok', contain: 'ok', resolve: 'at-risk' },
    summary: 'ntds.dit exfiltrated (412MB) to Bulgarian VPS. Enterprise krbtgt double-reset in flight.',
  },
  {
    id: 'INC-9188', title: 'Card-not-present fraud burst — 1,847 attempts in 90s',
    kind: 'fraud', severity: 'High', status: 'Mitigating', dept: 'soc',
    asset: 'card-auth-prod · gateway', assignee: 'Maya Reyes (T1)',
    openedAt: '2026-05-22 06:21 UTC', mttdMin: 2, ageMin: 305,
    mitre: 'T1110.004', cve: null, source: 'Fraud rules — F-088', confidence: 82,
    fintechTags: ['CNP', 'BIN range targeted', 'Velocity rule'],
    blastRadius: { hosts: 0, accounts: 312, services: 2, customers: 312 }, dollarsAtRisk: 86_000,
    sla: { ack: 'ok', contain: 'ok', resolve: 'ok' },
    summary: 'BIN-range card testing from rotating residential proxies. 312 cards bypassed initial velocity rule.',
  },
  {
    id: 'INC-9181', title: 'Edge DDoS — 84 Gbps SYN flood on api.bank.com',
    kind: 'ddos', severity: 'High', status: 'Mitigating', dept: 'itops',
    asset: 'edge-cdn · api.bank.com', assignee: 'Ricardo Bauer (IT Ops)',
    openedAt: '2026-05-22 04:55 UTC', mttdMin: 1, ageMin: 391,
    mitre: 'T1498.001', cve: null, source: 'CDN telemetry', confidence: 99,
    fintechTags: ['Customer-facing', 'Trading hours', 'Vendor escalation'],
    blastRadius: { hosts: 0, accounts: 0, services: 1, customers: 14_800 }, dollarsAtRisk: 0,
    sla: { ack: 'ok', contain: 'ok', resolve: 'ok' },
    summary: 'Sustained 84 Gbps SYN from 12k IPs across 38 ASNs. CDN absorbing 100%; origin not impacted.',
  },
  {
    id: 'INC-9176', title: 'Brute-force on Citrix gateway — 4,200 attempts on svc_finance',
    kind: 'bruteforce', severity: 'High', status: 'Triage', dept: 'soc',
    asset: 'citrix-gw-01 · perimeter', assignee: 'Maya Reyes (T1)',
    openedAt: '2026-05-22 05:30 UTC', mttdMin: 3, ageMin: 356,
    mitre: 'T1110.001', cve: null, source: 'Auth logs', confidence: 91,
    fintechTags: ['Service account', 'External', 'FTP-Patator pattern'],
    blastRadius: { hosts: 0, accounts: 1, services: 1, customers: 0 }, dollarsAtRisk: 0,
    sla: { ack: 'ok', contain: 'ok', resolve: 'ok' },
    summary: '4,200 auth attempts on svc_finance from rotating proxies. Account locked, IP block deployed.',
  },
  {
    id: 'INC-9170', title: 'LotL credential dump — svchost from Public dir',
    kind: 'lotl', severity: 'High', status: 'Eradicating', dept: 'ir',
    asset: 'FIN-WKS-118 · rkhan', assignee: 'Jordan Tan (IR)',
    openedAt: '2026-05-22 14:08 UTC', mttdMin: 1, ageMin: 17,
    mitre: 'T1003.001 · T1036', cve: null, source: 'EDR — Sysmon EID 10', confidence: 98,
    fintechTags: ['LockBit hash', 'Phishing precursor', 'Cached creds burned'],
    blastRadius: { hosts: 1, accounts: 14, services: 0, customers: 0 }, dollarsAtRisk: 1_200_000,
    sla: { ack: 'ok', contain: 'ok', resolve: 'ok' },
    summary: 'Masquerading svchost (C:\\Users\\Public) opened 0x1410 handle to lsass. lsass.dmp exfiltrated 2.1MB.',
  },
  {
    id: 'INC-9165', title: 'Credential stuffing — Tor exit + temp admin not revoked',
    kind: 'cred', severity: 'Medium', status: 'Closed', dept: 'soc',
    asset: 'CORP-WKS-042 · jsmith', assignee: 'Maya Reyes (T1)',
    openedAt: '2026-05-21 23:14 UTC', mttdMin: 2, ageMin: 1100,
    mitre: 'T1078', cve: null, source: 'Auth logs', confidence: 90,
    fintechTags: ['Tor', 'Off-hours', 'Stale privilege'],
    blastRadius: { hosts: 1, accounts: 1, services: 0, customers: 0 }, dollarsAtRisk: 0,
    sla: { ack: 'ok', contain: 'ok', resolve: 'ok' },
    summary: 'Failed-then-success from Tor exit, unrevoked temp admin. Password rotated, MFA pushed.',
  },
  {
    id: 'INC-9159', title: 'Suspicious AWS console login from new geo — root account',
    kind: 'cloud', severity: 'Medium', status: 'Triage', dept: 'soc',
    asset: 'aws · root account', assignee: 'Devon Kim (Sr T3)',
    openedAt: '2026-05-22 11:14 UTC', mttdMin: 1, ageMin: 30,
    mitre: 'T1078.004', cve: null, source: 'CloudTrail', confidence: 70,
    fintechTags: ['Root account', 'New geo', 'MFA challenged'],
    blastRadius: { hosts: 0, accounts: 1, services: 0, customers: 0 }, dollarsAtRisk: 0,
    sla: { ack: 'ok', contain: 'ok', resolve: 'ok' },
    summary: 'AWS root console login from São Paulo. MFA challenged + passed. Awaiting user confirmation.',
  },
  {
    id: 'INC-9144', title: 'Phishing — finance team, invoice lure (no exec)',
    kind: 'phish', severity: 'Low', status: 'Closed', dept: 'soc',
    asset: 'email · 14 finance recipients', assignee: 'Maya Reyes (T1)',
    openedAt: '2026-05-21 18:00 UTC', mttdMin: 11, ageMin: 1400,
    mitre: 'T1566.001', cve: null, source: 'Email gateway', confidence: 99,
    fintechTags: ['Invoice lure', 'Finance dept'],
    blastRadius: { hosts: 0, accounts: 0, services: 0, customers: 0 }, dollarsAtRisk: 0,
    sla: { ack: 'ok', contain: 'ok', resolve: 'ok' },
    summary: '14 emails quarantined pre-delivery. 0 clicks. Domain blocklisted. Awareness ping sent.',
  },
];

export const DRILLS: SocDrill[] = [
  {
    id: 'drill-ddos-syn',
    title: 'Edge SYN flood during trading hours',
    category: 'Network · Perimeter',
    level: 'T1 / IT Ops',
    mitre: 'T1498.001 — Network DoS: Direct',
    severity: 'High',
    fintechFraming: 'Trading hours · customer-facing api.bank.com · vendor escalation criteria',
    estMin: 11,
    incidentId: 'DRILL-DDOS-1184',
    alert: {
      ruleName: 'Edge SYN volume + new-IP fan-out anomaly',
      ruleType: 'Behavioral · CDN telemetry',
      firedAt: '2026-05-25 09:43:18 ET',
      asset: 'edge-cdn · api.bank.com',
      summary: '84 Gbps SYN flood from 12,400 source IPs across 38 ASNs. Sustained 6 minutes and climbing.',
    },
    evidence: {
      logs: `09:43:18  edge-pop-iad1  Gbps in:14.2  → SYN 92%  unique src/sec:4,800
09:44:30  edge-pop-iad1  Gbps in:48.0  → SYN 96%  unique src/sec:11,200
09:45:12  edge-pop-iad1  Gbps in:71.6  → SYN 97%  unique src/sec:13,900
09:46:00  edge-pop-iad1  Gbps in:84.3  → SYN 97%  unique src/sec:14,100
09:46:00  origin-rps     2,108         → 2,094 (Δ -0.7%)  ← origin unaffected
09:46:00  customer-p95   142ms         → 148ms (Δ +4%)`,
      asnMix: [
        ['AS-14618 (AWS)', '1,820 IPs'],
        ['AS-16509 (AWS)', '1,610 IPs'],
        ['AS-46606 (Hetzner)', '980 IPs'],
        ['AS-9009 (M247)', '770 IPs'],
        ['+ 34 others', '7,220 IPs'],
      ],
      networkAlerts: [
        { name: 'Trading hours overlap', detail: 'Volume began at 09:43 ET — 13 minutes after US equities open. Customer authentication API is in scope.' },
        { name: 'CDN scrubbing capacity', detail: '100 Gbps commit with edge provider. Currently at 84% of commit, headroom thinning.' },
        { name: 'Concurrent recon', detail: 'Three WAF rules also tripping on host header injection from a different /24 — possible cover for a second attack.' },
      ],
    },
    threatIntel: {
      attribution: 'Botnet profile matches Mirai-derivative observed against EU retail banks in March. Not financially motivated — extortion email not received (yet).',
      reputation: '12k IPs, 38 ASNs · 4% known-bad in TI feeds (typical for cloud-IP-rented attacks)',
    },
    options: [
      {
        id: 'a', label: 'Engage vendor BGP scrubbing, hold the line, monitor origin',
        action: 'Open priority case with CDN/scrubbing vendor, confirm absorption, watch origin RPS + customer p95, brief on-call IT lead and SOC manager, do NOT change application config',
        correct: true,
        explanation: 'Correct. Origin is healthy, customer latency moved +4%. The CDN is doing its job — your role is to (1) confirm vendor SOC is engaged, (2) watch the headroom (84/100 Gbps means escalate if it climbs), (3) brief stakeholders, (4) investigate the WAF cover. Changing app config during a live attack adds risk without reducing it.',
      },
      {
        id: 'b', label: 'BGP-blackhole the destination /32',
        action: 'Null-route api.bank.com at the upstream provider',
        correct: false,
        explanation: 'Would take api.bank.com fully offline during trading hours. Origin is healthy; reserve blackholing for when scrubbing is overrun.',
      },
      {
        id: 'c', label: 'Block all listed source ASNs at the edge',
        action: 'Push ACLs to deny AS-14618, AS-16509, etc.',
        correct: false,
        explanation: "Those are AWS and major hosting providers — you'll deny legitimate customer traffic. Source-ASN blocking at this scale is collateral damage with no upside.",
      },
      {
        id: 'd', label: 'Wait and observe before contacting the vendor',
        action: 'Hold for 15 more minutes to confirm sustained pattern',
        correct: false,
        explanation: 'Vendor escalation has its own SLA. Engaging is cheap; waiting costs you the early-engagement clock if the attack escalates.',
      },
    ],
    expectedTerms: ['SYN flood', '84 Gbps', 'scrubbing', 'CDN', 'BGP', 'blackhole', 'origin RPS', 'vendor escalation', 'p95', 'Mirai', 'ASN', 'WAF cover'],
    aar: {
      whatHappened: 'A Mirai-derivative botnet directed 84 Gbps of SYN traffic at api.bank.com during US market open. The CDN absorbed 100% within its commit. Customer-facing latency moved 4%. Concurrent WAF activity was a likely distraction.',
      ttp: 'Volumetric L3/L4 DoS for distraction or pressure, not for outage. Cloud-IP rental gives the attacker high ASN diversity. The concurrent WAF probing pattern is the tell that the real target may be reconnaissance, not the flood.',
      lesson: "During a sustained, vendor-absorbed DDoS, the SOC's job is not to act on the flood — it's to watch the headroom, find the cover, and avoid changing app config. The two metrics that matter are origin RPS and CDN headroom.",
      keyTerms: ['T1498.001', 'BGP scrubbing', 'Edge absorption', 'Trading-hours blast', 'Cover-fire DDoS'],
    },
  },
  {
    id: 'drill-kerb-roast-golden',
    title: 'Kerberoast → Golden Ticket forge',
    category: 'Identity · Kerberos',
    level: 'T2 / T3 / IR',
    mitre: 'T1558.003 (Kerberoasting) → T1558.001 (Golden Ticket)',
    severity: 'Critical',
    fintechFraming: 'krbtgt at risk · 31,400 enterprise accounts · payment ops authentication path',
    estMin: 14,
    incidentId: 'DRILL-KERB-3309',
    alert: {
      ruleName: 'Atypical TGS-REQ volume + post-event krbtgt-forged TGT indicator',
      ruleType: 'Behavioral · Domain Controller telemetry',
      firedAt: '2026-05-25 02:18:44 ET',
      asset: 'DC-PROD-02 · forest root',
      summary: 'Workstation requested 27 service tickets for high-privilege SPNs in 90 seconds. 6h later, a TGT was presented with anomalous PAC values for svc_sql_prod.',
    },
    evidence: {
      logs: `# Phase 1 — Roasting (02:18:44 → 02:20:11)
02:18:44  EventID=4769  client=CORP-WKS-019  user=jdoe  ticket_service=MSSQLSvc/sqlprod01:1433  encryption=0x17 (RC4-HMAC)
02:18:51  EventID=4769  client=CORP-WKS-019  user=jdoe  ticket_service=MSSQLSvc/sqlprod02:1433  encryption=0x17 (RC4-HMAC)
02:18:58  EventID=4769  client=CORP-WKS-019  user=jdoe  ticket_service=HTTP/jenkins.bank.local  encryption=0x17 (RC4-HMAC)
... 24 more TGS-REQs in the next 60 seconds (all RC4) ...

# Phase 2 — Forged TGT (08:14:52)
08:14:52  EventID=4624  user=svc_sql_prod  logon_type=3  src=CORP-WKS-019
08:14:52  EventID=4769  user=svc_sql_prod  PAC GroupSIDs=[Domain Admins, Enterprise Admins]  TGT_lifetime=10y
08:14:53  EventID=4672  Special privileges assigned svc_sql_prod
08:15:12  EventID=4688  cmd.exe → net group "Domain Admins" /domain /add svc_sql_prod`,
      pacAnomaly: 'TGT lifetime: 10 years (default 10 hours). PAC group SIDs include Enterprise Admins, but svc_sql_prod has never been a member historically. krbtgt-signed TGT presented without preceding AS-REQ.',
      networkAlerts: [
        { name: 'RC4-HMAC requested where AES available', detail: 'All 27 TGS responses are RC4 — explicitly requested by the client. Offline crackable; tools (Rubeus, Impacket) downgrade to RC4 for this reason.' },
        { name: 'Service accounts with weak passwords', detail: 'svc_sql_prod was last rotated 2,140 days ago. Has SPN. No PSO enforced. AD audit flagged this in two prior cycles.' },
        { name: 'Six-hour gap', detail: 'Time between roasting and ticket use matches offline cracking time for an 8-character password on commodity GPU.' },
      ],
    },
    threatIntel: {
      attribution: 'Pattern matches multiple ransomware-affiliate playbooks (Conti, Royal). Roast → crack offline → return with privileged TGT for AD foothold before encryption.',
      reputation: 'No external file hash — purely LotL using Microsoft-signed Kerberos infrastructure.',
    },
    options: [
      {
        id: 'a', label: 'Double-reset krbtgt, invalidate forged tickets, IR-led containment',
        action: 'Execute krbtgt double-reset (twice, 10h apart per MS guidance), force re-auth across the forest, revoke svc_sql_prod, isolate CORP-WKS-019, audit all SPN-bound accounts',
        correct: true,
        explanation: 'Correct. A krbtgt-signed forged TGT is a Golden Ticket — there is no other way to invalidate it. The double-reset ensures all in-flight tickets become unusable. Note: a single krbtgt reset is insufficient — Kerberos accepts the current AND previous key, so attackers can re-issue tickets until the second reset.',
      },
      {
        id: 'b', label: 'Reset svc_sql_prod password and disable the account',
        action: 'Rotate the cracked account',
        correct: false,
        explanation: "Stops THIS account from authenticating but doesn't invalidate the already-forged Golden Ticket. The attacker can present that TGT as any user for 10 years. You must reset krbtgt.",
      },
      {
        id: 'c', label: 'Block CORP-WKS-019 at the network and reimage',
        action: 'Cut the originating workstation',
        correct: false,
        explanation: 'The forged TGT can be presented from any host. Containing the workstation is necessary but not sufficient — krbtgt double-reset is mandatory.',
      },
      {
        id: 'd', label: 'Single krbtgt reset',
        action: 'Rotate the krbtgt password once',
        correct: false,
        explanation: 'A single reset is insufficient because Kerberos accepts tickets signed by the previous krbtgt key. Forged tickets remain valid until the SECOND reset. Microsoft and CISA both call for the double-reset, 10 hours apart.',
      },
    ],
    expectedTerms: ['Kerberoasting', 'TGS-REQ', 'Event ID 4769', 'RC4-HMAC', 'Golden Ticket', 'krbtgt', 'double-reset', 'PAC', 'SPN', 'Rubeus', 'Impacket', 'offline cracking', 'TGT lifetime'],
    aar: {
      whatHappened: 'An attacker on CORP-WKS-019 used domain user jdoe to request TGS tickets for 27 service accounts, forcing RC4-HMAC for offline cracking. After ~6 hours they returned with svc_sql_prod credentials and forged a Golden Ticket with a 10-year lifetime and Enterprise Admin group membership.',
      ttp: 'Kerberoasting (T1558.003) → offline crack → Golden Ticket forge (T1558.001). Signature: bulk TGS-REQs with RC4 explicitly requested, followed hours later by a TGT without a preceding AS-REQ and with anomalous PAC values.',
      lesson: 'Two detection rules close most of this: (1) bulk TGS-REQs from one client across many SPNs with RC4, (2) any TGT lifetime longer than policy max, or any TGT with PAC groups the principal is not a member of. Three controls close it permanently: AES-only Kerberos, long passwords for SPN-bound accounts, and PSO-enforced rotation.',
      keyTerms: ['T1558.003 Kerberoasting', 'T1558.001 Golden Ticket', 'krbtgt Double-Reset', 'RC4-HMAC Downgrade', 'PAC Validation', 'SPN Audit'],
    },
  },
  {
    id: 'drill-ad-dcsync',
    title: 'DCSync — replication rights abused for credential dump',
    category: 'Active Directory · Tier-0',
    level: 'T2 / T3 / IR',
    mitre: 'T1003.006 — OS Credential Dumping: DCSync',
    severity: 'Critical',
    fintechFraming: 'Tier-0 forest root · krbtgt hash extracted · forest-wide blast',
    estMin: 13,
    incidentId: 'DRILL-AD-7782',
    alert: {
      ruleName: 'DRSUAPI/GetNCChanges from non-DC source',
      ruleType: 'Behavioral · DC network telemetry + ACL drift',
      firedAt: '2026-05-25 01:54:22 ET',
      asset: 'DC-PROD-02 · forest root',
      summary: 'A workstation (not a DC) issued DRSUAPI replication calls to DC-PROD-02 and pulled secrets including the krbtgt hash. Calling principal had Replicating Directory Changes granted 5 days ago.',
    },
    evidence: {
      logs: `01:54:22  EventID=4662  ObjectServer=DS  ObjectType=domainDNS
           Properties={1131f6aa-9c07-11d1-f79f-00c04fc2dcd2}  AccessMask=0x100
           ↑ DS-Replication-Get-Changes
01:54:22  EventID=4662  Properties={1131f6ad-9c07-11d1-f79f-00c04fc2dcd2}
           ↑ DS-Replication-Get-Changes-All
01:54:22  DRSUAPI RPC  client=CORP-WKS-019  server=DC-PROD-02
           call=GetNCChanges  request_size=312B  response_size=18.4MB
01:54:22  EventID=4624  user=svc_legacy_app  logon_type=3  src=CORP-WKS-019  NTLM
01:54:30  EventID=4634  (logoff)

# ACL change 5 days ago
2026-05-20 14:11:08  EventID=5136  ObjectClass=domainDNS
  OperationType=Value Added
  AccessControlEntry: principal=svc_legacy_app
  granted={DS-Replication-Get-Changes, DS-Replication-Get-Changes-All}
  Performed by: helpdesk_lead (account compromised — see INC-9165)`,
      replicationDetail: 'GetNCChanges with EXOP_REPL_OBJ requested the krbtgt account secrets. Response payload (18.4MB) contains NT hashes for the entire domain, including krbtgt.',
      networkAlerts: [
        { name: 'Tier-0 RPC from non-DC source', detail: 'CORP-WKS-019 is a regular workstation. DRSUAPI replication should only ever come from another DC — no exceptions.' },
        { name: 'ACL drift not detected at change time', detail: 'The two GUIDs are exactly the permissions needed for DCSync. The 5-day-old ACE was added by a help-desk account compromised in INC-9165.' },
        { name: 'Short session, large payload', detail: 'Logon at 01:54:22, logoff at 01:54:30 — 8 seconds, 18.4MB transferred. Burst-and-leave pattern of Mimikatz lsadump::dcsync or Impacket secretsdump.py.' },
      ],
    },
    threatIntel: {
      attribution: "TTPs match dwell-then-burst APTs and ransomware affiliates. DCSync is the pre-encryption credential harvest of choice — quieter than ntdsutil IFM (no file on disk).",
      reputation: 'No malicious binary on disk — uses standard Windows RPC. Tool fingerprint matches Mimikatz/Impacket calling pattern.',
    },
    options: [
      {
        id: 'a', label: 'Assume full domain compromise: double-reset krbtgt, revoke replication ACEs, enterprise-wide credential rotation',
        action: 'Force krbtgt double-reset, revoke DS-Replication ACEs immediately, disable svc_legacy_app, isolate CORP-WKS-019, audit ALL principals with replication rights, force enterprise-wide password reset for privileged accounts, engage IR + GRC (NYDFS 72h clock starts)',
        correct: true,
        explanation: 'Correct. DCSync pulls every NT hash including krbtgt — the entire forest credentials are burned. Revoke the ACEs FIRST (so the attacker cannot redo it), then krbtgt double-reset. Audit ALL replication-rights holders because attackers commonly add multiple persistence accounts. The NYDFS 72-hour notification clock starts at first material indication.',
      },
      {
        id: 'b', label: 'Block CORP-WKS-019 and reimage; reset svc_legacy_app',
        action: 'Network-isolate the source workstation, reset the calling account',
        correct: false,
        explanation: "The data already left — every credential including krbtgt is in attacker hands. They don't need this workstation anymore. Reimaging is appropriate but cannot be the response: you must invalidate krbtgt.",
      },
      {
        id: 'c', label: 'Single krbtgt reset',
        action: 'Rotate krbtgt once',
        correct: false,
        explanation: 'Same trap — Kerberos accepts tickets signed by the previous krbtgt key, so a single reset leaves forged tickets valid. Microsoft + CISA guidance is two resets, 10h apart.',
      },
      {
        id: 'd', label: 'Just revoke the replication ACEs and monitor',
        action: 'Remove the GUID rights, watch for re-grant',
        correct: false,
        explanation: 'Necessary but nowhere near sufficient. Revoking the ACEs stops future replication but does nothing about the hashes already extracted. The krbtgt hash lets them forge tickets forever.',
      },
    ],
    expectedTerms: ['DCSync', 'DRSUAPI', 'GetNCChanges', 'Replicating Directory Changes', '1131f6aa', 'ACL drift', 'krbtgt', 'double-reset', 'Mimikatz', 'Impacket secretsdump', 'EventID 4662', 'EventID 5136', 'Tier-0', 'Golden Ticket'],
    aar: {
      whatHappened: "An attacker compromised the help-desk lead account (INC-9165) and added Replication permissions to stale service account svc_legacy_app. Five days later they issued DRSUAPI replication calls from a workstation and pulled the entire domain credential database including krbtgt. Total time on wire: 8 seconds.",
      ttp: 'Persistence via ACL drift on Tier-0 objects, then DCSync (T1003.006). File-less alternative to ntdsutil IFM — no ntds.dit on disk, just a single RPC call. The 5-day gap between ACL change and use is designed to defeat point-in-time detection.',
      lesson: 'Three detections close this: (1) any DRSUAPI/GetNCChanges from a non-DC source, (2) any ACE granting the two replication GUIDs on a domain object, (3) short authenticated sessions from non-DC sources transferring multi-megabyte payloads. Once krbtgt is in adversary hands, only the double-reset remediates.',
      keyTerms: ['T1003.006 DCSync', 'DRSUAPI', 'Replicating Directory Changes', 'ACL Drift', 'krbtgt Double-Reset', 'Tier-0 Persistence', 'Golden Ticket Precursor'],
    },
  },
];

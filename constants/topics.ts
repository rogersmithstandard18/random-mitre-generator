export interface Topic {
  id: string;
  title: string;
  description: string;
  bullets: string[];
}

const topics: Topic[] = [
  {
    id: "TA0001",
    title: "Initial Access",
    description: "Techniques used to gain first-time access to a system.",
    bullets: [
      "Phishing Campaigns",
      "Exploiting Public-Facing Applications",
      "External Remote Services",
      "Supply Chain Compromise"
    ]
  },
  {
    id: "TA0002",
    title: "Execution",
    description: "Techniques that result in code execution on a local or remote system.",
    bullets: [
      "Command Line Interface",
      "Scripting",
      "Windows Management Instrumentation",
      "PowerShell"
    ]
  },
  {
    id: "TA0003",
    title: "Persistence",
    description: "Maintain long-term access to systems.",
    bullets: [
      "Registry Run Keys",
      "Startup Folder Modification",
      "Boot or Logon Autostart Execution",
      "Create Account"
    ]
  },
  {
    id: "TA0004",
    title: "Privilege Escalation",
    description: "Techniques to obtain higher permission levels.",
    bullets: [
      "Access Token Manipulation",
      "Bypass User Account Control",
      "Exploitation for Privilege Escalation",
      "Sudo and Sudo Caching"
    ]
  },
  {
    id: "TA0005",
    title: "Defense Evasion",
    description: "Avoiding detection throughout an operation.",
    bullets: [
      "Disabling Security Tools",
      "Obfuscated Files or Information",
      "Indicator Removal",
      "Masquerading"
    ]
  },
  {
    id: "TA0006",
    title: "Credential Access",
    description: "Techniques for stealing credentials like account names and passwords.",
    bullets: [
      "Brute Force",
      "Credential Dumping",
      "Input Capture",
      "Network Sniffing"
    ]
  },
  {
    id: "TA0007",
    title: "Discovery",
    description: "Techniques used to gain knowledge about the system and network.",
    bullets: [
      "Account Discovery",
      "Network Service Scanning",
      "System Information Discovery",
      "Process Discovery"
    ]
  },
  {
    id: "TA0008",
    title: "Lateral Movement",
    description: "Techniques to enter and control remote systems on a network.",
    bullets: [
      "Remote Services",
      "Internal Spearphishing",
      "Pass the Hash",
      "Remote Desktop Protocol"
    ]
  },
  {
    id: "TA0009",
    title: "Collection",
    description: "Techniques used to gather information relevant to the objective.",
    bullets: [
      "Audio Capture",
      "Screen Capture",
      "Data from Local System",
      "Email Collection"
    ]
  },
  {
    id: "TA0010",
    title: "Exfiltration",
    description: "Techniques to steal data from the network.",
    bullets: [
      "Automated Exfiltration",
      "Data Transfer Size Limits",
      "Scheduled Transfer",
      "Data Compressed"
    ]
  },
  {
    id: "TA0011",
    title: "Command and Control",
    description: "Techniques for communication with controlled systems within a target network.",
    bullets: [
      "Application Layer Protocol",
      "Encrypted Channel",
      "Multi-Stage Channels",
      "Proxy"
    ]
  },
  {
    id: "TA0012",
    title: "Impact",
    description: "Techniques to disrupt availability or compromise integrity.",
    bullets: [
      "Data Destruction",
      "Endpoint Denial of Service",
      "Firmware Corruption",
      "Network Denial of Service"
    ]
  }
];

export default topics;

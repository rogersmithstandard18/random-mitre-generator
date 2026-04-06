// Curated list of beginner-friendly technique IDs for the weekly free case file rotation.
// These are chosen for relatable scenarios, clear threat narratives, and broad coverage
// of MITRE ATT&CK tactics. Rotates every 12 weeks (one per week).

export const WEEKLY_CASE_FILE_IDS = [
  'T1566', // Phishing — Initial Access (Beginner)
  'T1486', // Data Encrypted for Impact — Ransomware (Beginner)
  'T1059', // Command and Scripting Interpreter — Execution (Beginner)
  'T1110', // Brute Force — Credential Access (Beginner)
  'T1204', // User Execution — Execution (Beginner)
  'T1136', // Create Account — Persistence (Beginner)
  'T1046', // Network Service Scanning — Discovery (Beginner)
  'T1113', // Screen Capture — Collection (Beginner)
  'T1087', // Account Discovery — Discovery (Beginner)
  'T1498', // Network Denial of Service — Impact (Beginner)
  'T1593', // Search Open Websites/Domains — Reconnaissance (Beginner)
  'T1547', // Boot or Logon Autostart Execution — Persistence (Intermediate)
] as const;

/**
 * Returns the ISO week number for a given date.
 * Weeks start on Monday and week 1 contains the first Thursday of the year.
 */
export function getISOWeekNumber(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number (Mon=1, Sun=7)
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Returns the technique ID for the current week's free case file.
 */
export function getWeeklyTechniqueId(date: Date = new Date()): string {
  const week = getISOWeekNumber(date);
  return WEEKLY_CASE_FILE_IDS[week % WEEKLY_CASE_FILE_IDS.length];
}

/**
 * Returns the case file ID (e.g. "cf-T1566") for the current week.
 */
export function getWeeklyCaseFileId(date: Date = new Date()): string {
  return `cf-${getWeeklyTechniqueId(date)}`;
}

/**
 * Returns the start of the next ISO week (Monday 00:00 UTC).
 */
export function getNextWeekReset(date: Date = new Date()): Date {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // Mon=1, Sun=7
  const daysUntilMonday = 8 - dayNum; // days until next Monday
  d.setUTCDate(d.getUTCDate() + daysUntilMonday);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Checks if a given timestamp is within the current ISO week.
 */
export function isCurrentWeek(timestamp: string | Date, now: Date = new Date()): boolean {
  const ts = new Date(timestamp);
  return getISOWeekNumber(ts) === getISOWeekNumber(now) &&
    ts.getUTCFullYear() === now.getUTCFullYear();
}

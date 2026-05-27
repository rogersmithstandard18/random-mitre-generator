-- ============================================================
-- 01_create_tables.sql
-- Run this first in the Supabase SQL Editor
-- ============================================================

-- ── TECHNIQUES TABLE ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS techniques (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  technique_id         TEXT UNIQUE NOT NULL,
  technique_name       TEXT NOT NULL,
  tactic               TEXT NOT NULL,
  tactic_id            TEXT NOT NULL,
  difficulty           TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  learning_paths       TEXT[] NOT NULL DEFAULT '{}'
                         CHECK (learning_paths <@ ARRAY['Blue Team','Red Team','Purple Team','GRC Focus']::TEXT[]),
  plain_explanation    TEXT NOT NULL,
  risk_category        TEXT NOT NULL,
  risk_description     TEXT NOT NULL,
  boardroom_pitch      TEXT NOT NULL,
  industry_impacts     JSONB NOT NULL DEFAULT '[]',
  detection_hints      TEXT[] NOT NULL DEFAULT '{}',
  mitigations          TEXT[] NOT NULL DEFAULT '{}',
  reflection_question  TEXT NOT NULL,
  spot_the_risk        TEXT NOT NULL,
  created_at           TIMESTAMPTZ DEFAULT now()
);

-- ── CVEs TABLE ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cves (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cve_id               TEXT UNIQUE NOT NULL
                         CHECK (cve_id ~ '^CVE-\d{4}-\d{4,}$'),
  description          TEXT NOT NULL,
  plain_explanation    TEXT NOT NULL,
  severity             TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
  cvss_score           DECIMAL(3,1) CHECK (cvss_score >= 0 AND cvss_score <= 10),
  published_date       DATE,
  affected_products    JSONB NOT NULL DEFAULT '[]',
  created_at           TIMESTAMPTZ DEFAULT now()
);

-- ── JUNCTION TABLE: CVE ↔ MITRE Technique (many-to-many) ───
CREATE TABLE IF NOT EXISTS cve_techniques (
  cve_id               TEXT NOT NULL REFERENCES cves(cve_id) ON DELETE CASCADE,
  technique_id         TEXT NOT NULL REFERENCES techniques(technique_id) ON DELETE CASCADE,
  PRIMARY KEY (cve_id, technique_id)
);

-- ── INDEXES ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_techniques_tactic        ON techniques (tactic);
CREATE INDEX IF NOT EXISTS idx_techniques_difficulty     ON techniques (difficulty);
CREATE INDEX IF NOT EXISTS idx_cves_severity             ON cves (severity);
CREATE INDEX IF NOT EXISTS idx_cves_cvss                 ON cves (cvss_score DESC);
CREATE INDEX IF NOT EXISTS idx_cve_techniques_technique  ON cve_techniques (technique_id);

-- ── ROW LEVEL SECURITY (public read, no public write) ───────
ALTER TABLE techniques   ENABLE ROW LEVEL SECURITY;
ALTER TABLE cves         ENABLE ROW LEVEL SECURITY;
ALTER TABLE cve_techniques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read techniques"
  ON techniques FOR SELECT USING (true);

CREATE POLICY "Public read cves"
  ON cves FOR SELECT USING (true);

CREATE POLICY "Public read cve_techniques"
  ON cve_techniques FOR SELECT USING (true);

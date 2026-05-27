-- ============================================================
-- 01b_add_junction_table.sql
-- Run this if you already ran 01_create_tables.sql before the
-- junction table was added. Creates cve_techniques only.
-- ============================================================

CREATE TABLE IF NOT EXISTS cve_techniques (
  cve_id        TEXT NOT NULL REFERENCES cves(cve_id)       ON DELETE CASCADE,
  technique_id  TEXT NOT NULL REFERENCES techniques(technique_id) ON DELETE CASCADE,
  PRIMARY KEY (cve_id, technique_id)
);

CREATE INDEX IF NOT EXISTS idx_cve_techniques_technique
  ON cve_techniques (technique_id);

ALTER TABLE cve_techniques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read cve_techniques"
  ON cve_techniques FOR SELECT USING (true);

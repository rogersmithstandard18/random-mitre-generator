-- Run 8 of 8 (entries 92-92 of 92)
-- ============================================================
-- 03_seed_cves.sql
-- Run this third — seeds top 100 high-impact CVEs
-- ============================================================

INSERT INTO cves (
  cve_id, description, plain_explanation, severity, cvss_score,
  published_date, affected_products, mitre_technique_ids
) VALUES
('CVE-2021-28482', 'Remote code execution in Microsoft Exchange Server via unsafe deserialization (April 2021 patch Tuesday).',
 'One of several Exchange vulnerabilities patched in April 2021. Exploitable by authenticated users, it allowed remote code execution on Exchange servers through specially crafted API calls.',
 'HIGH', 8.8, '2021-04-13',
 '[{"vendor":"Microsoft","product":"Exchange Server","versions":"2013, 2016, 2019"}]',
 ARRAY['T1190'])
ON CONFLICT (cve_id) DO NOTHING;

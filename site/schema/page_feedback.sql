-- Page-helpfulness tally. See docs/deploy-feedback.md.
--
-- Three columns, on purpose. There is deliberately no IP, no hash of an IP, no
-- cookie, no session, no user agent, no referrer, no per-vote timestamp and no
-- free text. privacy.md promises exactly that in plain language, so adding a
-- column here means editing a public promise first.
CREATE TABLE IF NOT EXISTS page_feedback (
  page TEXT PRIMARY KEY,
  yes  INTEGER NOT NULL DEFAULT 0,
  no   INTEGER NOT NULL DEFAULT 0
);

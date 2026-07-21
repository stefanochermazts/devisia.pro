CREATE TABLE lead_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT NOT NULL,
  form_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT,
  privacy_accepted BOOLEAN NOT NULL,
  privacy_accepted_at TIMESTAMPTZ NOT NULL,
  marketing_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  referrer TEXT,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'processed', 'spam')),
  metadata JSONB,
  confirmation_email_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (confirmation_email_status IN ('pending', 'sent', 'failed')),
  confirmation_email_sent_at TIMESTAMPTZ,
  confirmation_email_error TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS lead_submissions_submission_id_idx
  ON lead_submissions (submission_id);

CREATE INDEX IF NOT EXISTS lead_submissions_created_at_idx
  ON lead_submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS lead_submissions_email_idx
  ON lead_submissions (email);

CREATE INDEX IF NOT EXISTS lead_submissions_source_idx
  ON lead_submissions (source);

CREATE INDEX IF NOT EXISTS lead_submissions_status_idx
  ON lead_submissions (status);

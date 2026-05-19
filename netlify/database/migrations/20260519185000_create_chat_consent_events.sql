CREATE TABLE chat_consent_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  consent_id UUID NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('accepted', 'withdrawn')),
  locale TEXT NOT NULL CHECK (locale IN ('it', 'en')),
  surface TEXT NOT NULL CHECK (surface IN ('widget', 'standalone')),
  privacy_path TEXT NOT NULL CHECK (privacy_path IN ('/privacy', '/en/privacy')),
  consent_text_version TEXT NOT NULL CHECK (consent_text_version ~ '^[a-z0-9][a-z0-9_-]*-v[0-9]+$'),
  ai_disclosure_version TEXT NOT NULL CHECK (ai_disclosure_version ~ '^[a-z0-9][a-z0-9_-]*-v[0-9]+$'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS chat_consent_events_consent_id_event_type_idx
  ON chat_consent_events (consent_id, event_type);

CREATE INDEX IF NOT EXISTS chat_consent_events_consent_id_created_at_idx
  ON chat_consent_events (consent_id, created_at DESC);

CREATE INDEX IF NOT EXISTS chat_consent_events_created_at_idx
  ON chat_consent_events (created_at DESC);

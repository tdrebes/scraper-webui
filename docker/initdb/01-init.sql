-- Enable extensions required for default values
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table storing scraped content records surfaced in the UI
CREATE TABLE IF NOT EXISTS scraped_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  summary TEXT,
  source_url TEXT,
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}',
  raw_text TEXT
);

-- Helpful indexes for filtering by capture time and tags
CREATE INDEX IF NOT EXISTS idx_scraped_content_captured_at
  ON scraped_content (captured_at DESC);

CREATE INDEX IF NOT EXISTS idx_scraped_content_tags
  ON scraped_content USING GIN (tags);

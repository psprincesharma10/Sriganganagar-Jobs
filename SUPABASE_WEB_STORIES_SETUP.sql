-- Run this once in Supabase SQL Editor.
-- Creates the web_stories table used by the new "Web Stories" tab in the
-- Admin Panel, and by the public Google Web Stories pages at /stories/:slug

CREATE TABLE IF NOT EXISTS web_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'intro',   -- 'intro' | 'job-category' | 'blog' | 'custom'
  poster_image TEXT NOT NULL,               -- required cover image (portrait, min 640x853)
  pages JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{ image, headline, cta_text, cta_link }]
  status TEXT NOT NULL DEFAULT 'draft',     -- 'draft' | 'scheduled' | 'published'
  scheduled_date DATE,                      -- when status = 'scheduled', auto-publishes on this date
  created_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

ALTER TABLE web_stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published stories" ON web_stories;
CREATE POLICY "Public can read published stories"
  ON web_stories FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can insert/update/delete stories" ON web_stories;
CREATE POLICY "Public can insert stories"
  ON web_stories FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can update stories"
  ON web_stories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete stories"
  ON web_stories FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_web_stories_slug ON web_stories (slug);
CREATE INDEX IF NOT EXISTS idx_web_stories_status ON web_stories (status);

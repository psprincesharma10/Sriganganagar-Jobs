-- Run this once in Supabase SQL Editor.
-- Simple key-value settings table used for:
--  - Social media links (Facebook, Instagram, YouTube, etc.) shown in Footer + Sidebar
--  - YouTube videos section shown in the homepage sidebar

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read settings" ON site_settings;
CREATE POLICY "Public can read settings"
  ON site_settings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can write settings" ON site_settings;
CREATE POLICY "Public can insert settings"
  ON site_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can update settings"
  ON site_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

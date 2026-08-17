-- Run this once in Supabase SQL Editor.
-- Adds CMS-style fields to blog_posts and news_posts for the upgraded
-- Admin Panel: article type, SEO fields, and (for News) source/trust fields.
-- All new columns are nullable/optional so existing posts keep working
-- exactly as before — nothing is deleted or renamed.

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS article_type TEXT,
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS keywords TEXT;

ALTER TABLE news_posts
  ADD COLUMN IF NOT EXISTS header_image TEXT,
  ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS article_type TEXT,
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS keywords TEXT,
  ADD COLUMN IF NOT EXISTS source_type TEXT,
  ADD COLUMN IF NOT EXISTS source_name TEXT,
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS verification_status TEXT;

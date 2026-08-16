-- Run this once in Supabase SQL Editor.
-- Adds a "location" column to the jobs table so jobs can be filtered by
-- City/District (Rajasthan-wide), and so the homepage "Browse by City"
-- section and the new Location filter on the jobs listing page can work.
--
-- Older job posts made before this change will simply have location = NULL
-- (they still display fine, just won't match a specific city filter).

ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS location TEXT;

CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs (location);

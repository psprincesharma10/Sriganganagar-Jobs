-- Run this once in Supabase SQL Editor.
-- Adds a skill_categories column so each candidate can select up to
-- 5 skill categories (instead of just 1). The old "skill_category"
-- column is kept as-is (stores the first selected skill) for backward
-- compatibility with existing filters/search.

ALTER TABLE candidates
  ADD COLUMN IF NOT EXISTS skill_categories JSONB DEFAULT '[]'::jsonb;

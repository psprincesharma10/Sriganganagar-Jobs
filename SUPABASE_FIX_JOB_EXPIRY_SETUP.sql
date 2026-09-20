-- Run this once in Supabase SQL Editor.
--
-- BACKGROUND: Job listings were accidentally set to expire after only
-- 30 days (20 for Featured jobs) instead of the intended 12 months —
-- this has now been fixed in the code for all NEW job posts. This SQL
-- fixes your EXISTING jobs that already expired early due to that bug,
-- extending them to 12 months from when they were originally posted
-- (so genuinely old jobs still expire eventually, just correctly this time).
--
-- Safe to run multiple times.

UPDATE jobs
SET expires_at = created_at + INTERVAL '12 months'
WHERE expires_at < created_at + INTERVAL '12 months';

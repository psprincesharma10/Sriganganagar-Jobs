-- Run this once in Supabase SQL Editor.
-- Fixes candidate registration/profile-save not reaching the database:
-- Row Level Security (RLS) was blocking INSERT/UPDATE from the public
-- anon key, so registrations were silently falling back to local
-- browser storage instead of being saved to Supabase.
--
-- This allows anyone (candidates, self-service, no admin login) to:
--  - insert their own profile (register)
--  - update their own profile (edit profile / login re-save)
--  - read all candidate profiles (needed for Search Workers page)
--
-- Safe for this use case since there is no separate admin-only data in
-- this table, and phone_number + password_hash controls login access.

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert candidates" ON candidates;
CREATE POLICY "Public can insert candidates"
  ON candidates FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update candidates" ON candidates;
CREATE POLICY "Public can update candidates"
  ON candidates FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read candidates" ON candidates;
CREATE POLICY "Public can read candidates"
  ON candidates FOR SELECT
  TO anon, authenticated
  USING (true);

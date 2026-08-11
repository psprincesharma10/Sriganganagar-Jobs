-- Run this once in Supabase SQL Editor to enable Mobile Number + Password
-- login for the Candidate Portal (no OTP / no paid SMS service needed).
--
-- This simply adds a password_hash column to your existing "candidates"
-- table. The app hashes the password with SHA-256 in the browser before
-- it is ever sent to Supabase, so the actual password is never stored.

ALTER TABLE candidates
  ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Optional but recommended: makes phone-number lookups (login) fast.
CREATE INDEX IF NOT EXISTS idx_candidates_phone_number
  ON candidates (phone_number);

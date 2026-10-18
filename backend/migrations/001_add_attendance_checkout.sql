-- Run this once in the Supabase SQL Editor for an existing database.
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS check_out_at timestamptz;

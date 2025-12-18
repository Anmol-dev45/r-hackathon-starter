-- Instructions for setting up GunaasoNepal database

-- Step 1: Execute the main schema.sql file in your Supabase SQL Editor
-- This will create all tables, triggers, and RLS policies

-- Step 2: Create the evidence storage bucket
-- Go to Supabase Dashboard > Storage > Create new bucket
-- Bucket name: evidence
-- Public bucket: Yes (for public complaints)

-- OR run this SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidence', 'evidence', true)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Set up storage policies for the evidence bucket
-- Run these in Supabase SQL Editor:

-- Allow public read access to evidence files
CREATE POLICY "Public evidence files are accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'evidence');

-- Allow anyone to upload evidence files (rate limiting should be handled at app level)
CREATE POLICY "Anyone can upload evidence files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'evidence' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM complaints
    )
  );

-- Allow users to delete their own complaint evidence (if authenticated)
CREATE POLICY "Users can delete their own evidence"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'evidence' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM complaints WHERE user_id = auth.uid()
    )
  );

-- Step 4: Verify RLS is enabled on all tables
-- Run this to check:
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('complaints', 'evidence_files', 'complaint_status_history', 'public_projects', 'complaint_categories');

-- All should show rowsecurity = true

-- Step 5: Test the tracking ID generator
SELECT generate_tracking_id();
-- Should return something like: GN-2025-A3B7F1

-- Step 6: Verify default categories are inserted
SELECT category_key, name_en, name_ne FROM complaint_categories ORDER BY sort_order;
-- Should return 10 categories

-- Step 7: Create indexes on storage.objects for better performance (optional)
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_id ON storage.objects(bucket_id);
CREATE INDEX IF NOT EXISTS idx_storage_objects_name ON storage.objects(name);

-- Step 8: Set up database functions for statistics (optional, for future dashboard)
CREATE OR REPLACE FUNCTION get_complaint_stats()
RETURNS TABLE(
  total_complaints BIGINT,
  submitted_count BIGINT,
  under_review_count BIGINT,
  forwarded_count BIGINT,
  resolved_count BIGINT,
  rejected_count BIGINT,
  closed_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_complaints,
    COUNT(*) FILTER (WHERE status = 'submitted')::BIGINT as submitted_count,
    COUNT(*) FILTER (WHERE status = 'under_review')::BIGINT as under_review_count,
    COUNT(*) FILTER (WHERE status = 'forwarded')::BIGINT as forwarded_count,
    COUNT(*) FILTER (WHERE status = 'resolved')::BIGINT as resolved_count,
    COUNT(*) FILTER (WHERE status = 'rejected')::BIGINT as rejected_count,
    COUNT(*) FILTER (WHERE status = 'closed')::BIGINT as closed_count
  FROM complaints;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the stats function
SELECT * FROM get_complaint_stats();

-- Step 9: Create a function to get district-wise complaint counts
CREATE OR REPLACE FUNCTION get_complaints_by_district()
RETURNS TABLE(
  district VARCHAR(50),
  complaint_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    location_district as district,
    COUNT(*)::BIGINT as complaint_count
  FROM complaints
  WHERE location_district IS NOT NULL AND is_public = true
  GROUP BY location_district
  ORDER BY complaint_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the district stats function
SELECT * FROM get_complaints_by_district();

-- Step 10: Optional - Add sample public project data for testing
-- Uncomment and modify as needed:
/*
INSERT INTO public_projects (
  project_name,
  project_type,
  description,
  province,
  district,
  municipality,
  budget_allocated,
  budget_spent,
  start_date,
  expected_completion_date,
  status,
  progress_percentage
) VALUES
(
  'Road Widening - Kathmandu Ring Road',
  'Infrastructure',
  'Widening of Ring Road to reduce traffic congestion',
  'Bagmati',
  'Kathmandu',
  'Kathmandu Metropolitan City',
  5000000000,
  2500000000,
  '2024-01-01',
  '2026-12-31',
  'ongoing',
  50
),
(
  'Community Health Center - Pokhara',
  'Health',
  'Construction of new community health center in Ward 15',
  'Gandaki',
  'Kaski',
  'Pokhara Metropolitan City',
  150000000,
  120000000,
  '2023-06-01',
  '2025-03-31',
  'ongoing',
  80
);
*/

-- Step 11: Set up email notifications (future feature)
-- This requires configuring Supabase Auth email templates
-- Go to: Supabase Dashboard > Authentication > Email Templates

-- Step 12: Enable Realtime (optional, for live complaint updates)
-- Run this to enable realtime on complaints table:
ALTER PUBLICATION supabase_realtime ADD TABLE complaints;
ALTER PUBLICATION supabase_realtime ADD TABLE complaint_status_history;

-- Step 13: Performance optimization - Analyze tables
ANALYZE complaints;
ANALYZE evidence_files;
ANALYZE complaint_status_history;
ANALYZE public_projects;
ANALYZE complaint_categories;

-- Step 14: Security check - Verify service role key is set in .env.local
-- SUPABASE_SERVICE_ROLE_KEY should be set and kept secret
-- NEXT_PUBLIC_SUPABASE_ANON_KEY is safe for client-side use

-- Step 15: Test RLS policies with different user contexts
-- This should be done from your application after deployment

-- Completed! Your GunaasoNepal database is ready.

-- Setup Storage Bucket for Evidence Files
-- Run this in your Supabase SQL Editor

-- Step 1: Create the evidence bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidence', 'evidence', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Step 2: Remove any existing policies (if you're re-running this)
DROP POLICY IF EXISTS "Public evidence files are accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload evidence files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own evidence" ON storage.objects;

-- Step 3: Create new policies

-- Allow public read access to all evidence files
CREATE POLICY "Public evidence files are accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'evidence');

-- Allow anyone to upload evidence files
-- Note: The path format is "complaint_id/timestamp-filename"
CREATE POLICY "Anyone can upload evidence files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'evidence');

-- Allow anyone to update evidence files (for upserts)
CREATE POLICY "Anyone can update evidence files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'evidence')
  WITH CHECK (bucket_id = 'evidence');

-- Allow deletion of evidence files (admin only in production)
CREATE POLICY "Anyone can delete evidence files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'evidence');

-- Step 4: Verify the bucket was created
SELECT * FROM storage.buckets WHERE id = 'evidence';

-- Step 5: Verify the policies were created
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%evidence%';

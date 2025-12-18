-- GunaasoNepal Database Schema
-- Citizen-first governance transparency & accountability platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for complaint categories
CREATE TYPE complaint_category AS ENUM (
  'service_delivery',
  'corruption',
  'rti_request',
  'public_project',
  'police_misconduct',
  'health_services',
  'education',
  'infrastructure',
  'land_administration',
  'other'
);

-- Create enum for complaint status
CREATE TYPE complaint_status AS ENUM (
  'submitted',
  'under_review',
  'forwarded',
  'resolved',
  'rejected',
  'closed'
);

-- Create enum for submission type
CREATE TYPE submission_type AS ENUM (
  'anonymous',
  'pseudonymous',
  'verified'
);

-- Create enum for evidence type
CREATE TYPE evidence_type AS ENUM (
  'image',
  'audio',
  'video',
  'document',
  'other'
);

-- Complaints table
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_id VARCHAR(20) UNIQUE NOT NULL,
  
  -- Submission metadata
  submission_type submission_type NOT NULL DEFAULT 'anonymous',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  pseudonym VARCHAR(100),
  
  -- Complaint details
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category complaint_category NOT NULL,
  location_province VARCHAR(50),
  location_district VARCHAR(50),
  location_municipality VARCHAR(100),
  location_ward VARCHAR(10),
  location_details TEXT,
  
  -- Status
  status complaint_status NOT NULL DEFAULT 'submitted',
  priority INTEGER DEFAULT 0,
  
  -- Metadata
  is_public BOOLEAN DEFAULT true,
  is_sensitive BOOLEAN DEFAULT false,
  language VARCHAR(10) DEFAULT 'ne',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Contact (optional, encrypted)
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  
  CONSTRAINT chk_verified_user CHECK (
    (submission_type = 'verified' AND user_id IS NOT NULL) OR
    (submission_type != 'verified')
  ),
  CONSTRAINT chk_pseudonym CHECK (
    (submission_type = 'pseudonymous' AND pseudonym IS NOT NULL) OR
    (submission_type != 'pseudonymous')
  )
);

-- Evidence files table
CREATE TABLE evidence_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  
  file_name VARCHAR(255) NOT NULL,
  file_type evidence_type NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  storage_path TEXT NOT NULL,
  storage_bucket VARCHAR(100) DEFAULT 'evidence',
  
  -- Metadata
  caption TEXT,
  is_public BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT chk_file_size CHECK (file_size <= 52428800) -- 50MB limit
);

-- Complaint status history table
CREATE TABLE complaint_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  
  old_status complaint_status,
  new_status complaint_status NOT NULL,
  notes TEXT,
  updated_by VARCHAR(100), -- Admin/system identifier (future use)
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Public projects table
CREATE TABLE public_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  project_name VARCHAR(200) NOT NULL,
  project_type VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Location
  province VARCHAR(50),
  district VARCHAR(50),
  municipality VARCHAR(100),
  ward VARCHAR(10),
  
  -- Financial
  budget_allocated DECIMAL(15, 2),
  budget_spent DECIMAL(15, 2),
  budget_currency VARCHAR(10) DEFAULT 'NPR',
  
  -- Timeline
  start_date DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  
  -- Status
  status VARCHAR(50) DEFAULT 'ongoing',
  progress_percentage INTEGER DEFAULT 0,
  
  -- Source
  data_source VARCHAR(200),
  source_url TEXT,
  
  -- Metadata
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT chk_budget CHECK (budget_spent <= budget_allocated),
  CONSTRAINT chk_progress CHECK (progress_percentage >= 0 AND progress_percentage <= 100)
);

-- Complaint categories lookup table
CREATE TABLE complaint_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_key complaint_category UNIQUE NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_ne VARCHAR(100) NOT NULL,
  description_en TEXT,
  description_ne TEXT,
  icon VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Create indexes for better query performance
CREATE INDEX idx_complaints_tracking_id ON complaints(tracking_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_created_at ON complaints(created_at DESC);
CREATE INDEX idx_complaints_user_id ON complaints(user_id);
CREATE INDEX idx_complaints_district ON complaints(location_district);
CREATE INDEX idx_evidence_complaint_id ON evidence_files(complaint_id);
CREATE INDEX idx_status_history_complaint_id ON complaint_status_history(complaint_id);
CREATE INDEX idx_public_projects_district ON public_projects(district);
CREATE INDEX idx_public_projects_status ON public_projects(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_complaints_updated_at
  BEFORE UPDATE ON complaints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_public_projects_updated_at
  BEFORE UPDATE ON public_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to log status changes
CREATE OR REPLACE FUNCTION log_complaint_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO complaint_status_history (complaint_id, old_status, new_status)
    VALUES (NEW.id, OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_complaint_status_changes
  AFTER UPDATE ON complaints
  FOR EACH ROW
  EXECUTE FUNCTION log_complaint_status_change();

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_categories ENABLE ROW LEVEL SECURITY;

-- Complaints RLS Policies
-- Public read access for public complaints
CREATE POLICY "Public complaints are viewable by everyone"
  ON complaints FOR SELECT
  USING (is_public = true);

-- Verified users can view their own complaints
CREATE POLICY "Users can view their own complaints"
  ON complaints FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can insert complaints (anonymous allowed)
CREATE POLICY "Anyone can submit complaints"
  ON complaints FOR INSERT
  WITH CHECK (true);

-- Only verified users can update their own complaints (within limits)
CREATE POLICY "Users can update their own complaints"
  ON complaints FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Evidence files RLS Policies
-- Public evidence is viewable by everyone
CREATE POLICY "Public evidence is viewable by everyone"
  ON evidence_files FOR SELECT
  USING (
    is_public = true AND
    EXISTS (SELECT 1 FROM complaints WHERE complaints.id = evidence_files.complaint_id AND complaints.is_public = true)
  );

-- Users can view evidence for their own complaints
CREATE POLICY "Users can view their own complaint evidence"
  ON evidence_files FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM complaints WHERE complaints.id = evidence_files.complaint_id AND complaints.user_id = auth.uid())
  );

-- Anyone can insert evidence (linked to complaint)
CREATE POLICY "Anyone can upload evidence"
  ON evidence_files FOR INSERT
  WITH CHECK (true);

-- Complaint status history RLS Policies
-- Public status history is viewable by everyone for public complaints
CREATE POLICY "Public complaint status history is viewable"
  ON complaint_status_history FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM complaints WHERE complaints.id = complaint_status_history.complaint_id AND complaints.is_public = true)
  );

-- Users can view status history for their own complaints
CREATE POLICY "Users can view their own complaint status history"
  ON complaint_status_history FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM complaints WHERE complaints.id = complaint_status_history.complaint_id AND complaints.user_id = auth.uid())
  );

-- Public projects RLS Policies
-- Everyone can view public projects
CREATE POLICY "Public projects are viewable by everyone"
  ON public_projects FOR SELECT
  USING (true);

-- Complaint categories RLS Policies
-- Everyone can view active categories
CREATE POLICY "Active categories are viewable by everyone"
  ON complaint_categories FOR SELECT
  USING (is_active = true);

-- Insert default complaint categories
INSERT INTO complaint_categories (category_key, name_en, name_ne, description_en, description_ne, icon, sort_order) VALUES
  ('service_delivery', 'Service Delivery', 'सेवा प्रवाह', 'Issues with government service delivery', 'सरकारी सेवा प्रवाह सम्बन्धी समस्या', 'service', 1),
  ('corruption', 'Corruption', 'भ्रष्टाचार', 'Report corruption and bribery', 'भ्रष्टाचार र घुसखोरी रिपोर्ट गर्नुहोस्', 'alert', 2),
  ('rti_request', 'Right to Information', 'सूचनाको हक', 'Request information under RTI Act', 'सूचनाको हक ऐन अन्तर्गत जानकारी माग', 'info', 3),
  ('public_project', 'Public Projects', 'सार्वजनिक परियोजना', 'Issues with public infrastructure projects', 'सार्वजनिक पूर्वाधार परियोजना सम्बन्धी समस्या', 'construction', 4),
  ('police_misconduct', 'Police Misconduct', 'प्रहरी दुर्व्यवहार', 'Report police misconduct or abuse', 'प्रहरी दुर्व्यवहार वा दुरुपयोग रिपोर्ट', 'shield', 5),
  ('health_services', 'Health Services', 'स्वास्थ्य सेवा', 'Healthcare and medical service issues', 'स्वास्थ्य सेवा र चिकित्सा सम्बन्धी समस्या', 'health', 6),
  ('education', 'Education', 'शिक्षा', 'Education system and school issues', 'शिक्षा प्रणाली र विद्यालय सम्बन्धी समस्या', 'education', 7),
  ('infrastructure', 'Infrastructure', 'पूर्वाधार', 'Roads, water, electricity issues', 'सडक, पानी, बिजुली सम्बन्धी समस्या', 'infrastructure', 8),
  ('land_administration', 'Land Administration', 'भूमि प्रशासन', 'Land records and registration issues', 'जग्गा अभिलेख र दर्ता सम्बन्धी समस्या', 'land', 9),
  ('other', 'Other', 'अन्य', 'Other governance issues', 'अन्य शासन सम्बन्धी समस्या', 'other', 10);

-- Create function to generate unique tracking ID
CREATE OR REPLACE FUNCTION generate_tracking_id()
RETURNS VARCHAR(20) AS $$
DECLARE
  new_id VARCHAR(20);
  done BOOLEAN := false;
BEGIN
  WHILE NOT done LOOP
    -- Format: GN-YYYY-XXXXXX (e.g., GN-2025-A3B7F1)
    new_id := 'GN-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || 
              UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    
    -- Check if ID already exists
    IF NOT EXISTS (SELECT 1 FROM complaints WHERE tracking_id = new_id) THEN
      done := true;
    END IF;
  END LOOP;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate tracking ID
CREATE OR REPLACE FUNCTION set_tracking_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tracking_id IS NULL OR NEW.tracking_id = '' THEN
    NEW.tracking_id := generate_tracking_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_complaint_tracking_id
  BEFORE INSERT ON complaints
  FOR EACH ROW
  EXECUTE FUNCTION set_tracking_id();

-- Create storage bucket for evidence files (execute this in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('evidence', 'evidence', true);

-- Storage policies for evidence bucket (execute this in Supabase dashboard)
-- CREATE POLICY "Public evidence files are accessible"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'evidence');
-- 
-- CREATE POLICY "Anyone can upload evidence files"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'evidence');

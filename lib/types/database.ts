// GunaasoNepal TypeScript Types and Interfaces
// Database types matching Supabase schema

export type SubmissionType = 'anonymous' | 'pseudonymous' | 'verified';

export type ComplaintCategory =
    | 'service_delivery'
    | 'corruption'
    | 'rti_request'
    | 'public_project'
    | 'police_misconduct'
    | 'health_services'
    | 'education'
    | 'infrastructure'
    | 'land_administration'
    | 'other';

export type ComplaintStatus =
    | 'submitted'
    | 'under_review'
    | 'forwarded'
    | 'resolved'
    | 'rejected'
    | 'closed';

export type EvidenceType = 'image' | 'audio' | 'video' | 'document' | 'other';

export interface Database {
    public: {
        Tables: {
            complaints: {
                Row: Complaint;
                Insert: ComplaintInsert;
                Update: ComplaintUpdate;
            };
            evidence_files: {
                Row: EvidenceFile;
                Insert: EvidenceFileInsert;
                Update: EvidenceFileUpdate;
            };
            complaint_status_history: {
                Row: ComplaintStatusHistory;
                Insert: ComplaintStatusHistoryInsert;
                Update: ComplaintStatusHistoryUpdate;
            };
            public_projects: {
                Row: PublicProject;
                Insert: PublicProjectInsert;
                Update: PublicProjectUpdate;
            };
            complaint_categories: {
                Row: ComplaintCategoryInfo;
                Insert: ComplaintCategoryInfoInsert;
                Update: ComplaintCategoryInfoUpdate;
            };
        };
    };
}

// Complaint types
export interface Complaint {
    id: string;
    tracking_id: string;
    submission_type: SubmissionType;
    user_id: string | null;
    pseudonym: string | null;
    title: string;
    description: string;
    category: ComplaintCategory;
    location_province: string | null;
    location_district: string | null;
    location_municipality: string | null;
    location_ward: string | null;
    location_details: string | null;
    status: ComplaintStatus;
    priority: number;
    is_public: boolean;
    is_sensitive: boolean;
    language: string;
    created_at: string;
    updated_at: string;
    contact_phone: string | null;
    contact_email: string | null;
}

export interface ComplaintInsert {
    tracking_id?: string;
    submission_type: SubmissionType;
    user_id?: string | null;
    pseudonym?: string | null;
    title: string;
    description: string;
    category: ComplaintCategory;
    location_province?: string | null;
    location_district?: string | null;
    location_municipality?: string | null;
    location_ward?: string | null;
    location_details?: string | null;
    status?: ComplaintStatus;
    priority?: number;
    is_public?: boolean;
    is_sensitive?: boolean;
    language?: string;
    contact_phone?: string | null;
    contact_email?: string | null;
}

export interface ComplaintUpdate {
    title?: string;
    description?: string;
    status?: ComplaintStatus;
    is_public?: boolean;
}

// Evidence file types
export interface EvidenceFile {
    id: string;
    complaint_id: string;
    file_name: string;
    file_type: EvidenceType;
    file_size: number;
    mime_type: string;
    storage_path: string;
    storage_bucket: string;
    caption: string | null;
    is_public: boolean;
    created_at: string;
}

export interface EvidenceFileInsert {
    complaint_id: string;
    file_name: string;
    file_type: EvidenceType;
    file_size: number;
    mime_type: string;
    storage_path: string;
    storage_bucket?: string;
    caption?: string | null;
    is_public?: boolean;
}

export interface EvidenceFileUpdate {
    caption?: string | null;
    is_public?: boolean;
}

// Complaint status history types
export interface ComplaintStatusHistory {
    id: string;
    complaint_id: string;
    old_status: ComplaintStatus | null;
    new_status: ComplaintStatus;
    notes: string | null;
    updated_by: string | null;
    created_at: string;
}

export interface ComplaintStatusHistoryInsert {
    complaint_id: string;
    old_status?: ComplaintStatus | null;
    new_status: ComplaintStatus;
    notes?: string | null;
    updated_by?: string | null;
}

export interface ComplaintStatusHistoryUpdate {
    notes?: string | null;
}

// Public project types
export interface PublicProject {
    id: string;
    project_name: string;
    project_type: string;
    description: string | null;
    province: string | null;
    district: string | null;
    municipality: string | null;
    ward: string | null;
    budget_allocated: number | null;
    budget_spent: number | null;
    budget_currency: string;
    start_date: string | null;
    expected_completion_date: string | null;
    actual_completion_date: string | null;
    status: string;
    progress_percentage: number;
    data_source: string | null;
    source_url: string | null;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
}

export interface PublicProjectInsert {
    project_name: string;
    project_type: string;
    description?: string | null;
    province?: string | null;
    district?: string | null;
    municipality?: string | null;
    ward?: string | null;
    budget_allocated?: number | null;
    budget_spent?: number | null;
    budget_currency?: string;
    start_date?: string | null;
    expected_completion_date?: string | null;
    actual_completion_date?: string | null;
    status?: string;
    progress_percentage?: number;
    data_source?: string | null;
    source_url?: string | null;
    is_verified?: boolean;
}

export interface PublicProjectUpdate {
    project_name?: string;
    description?: string | null;
    budget_spent?: number | null;
    progress_percentage?: number;
    status?: string;
    actual_completion_date?: string | null;
}

// Complaint category info types
export interface ComplaintCategoryInfo {
    id: string;
    category_key: ComplaintCategory;
    name_en: string;
    name_ne: string;
    description_en: string | null;
    description_ne: string | null;
    icon: string | null;
    sort_order: number;
    is_active: boolean;
}

export interface ComplaintCategoryInfoInsert {
    category_key: ComplaintCategory;
    name_en: string;
    name_ne: string;
    description_en?: string | null;
    description_ne?: string | null;
    icon?: string | null;
    sort_order?: number;
    is_active?: boolean;
}

export interface ComplaintCategoryInfoUpdate {
    name_en?: string;
    name_ne?: string;
    description_en?: string | null;
    description_ne?: string | null;
    icon?: string | null;
    sort_order?: number;
    is_active?: boolean;
}

// API Request/Response types

// Submit complaint request
export interface SubmitComplaintRequest {
    submission_type: SubmissionType;
    pseudonym?: string;
    title: string;
    description: string;
    category: ComplaintCategory;
    location?: {
        province?: string;
        district?: string;
        municipality?: string;
        ward?: string;
        details?: string;
    };
    is_public?: boolean;
    is_sensitive?: boolean;
    language?: string;
    contact?: {
        phone?: string;
        email?: string;
    };
}

export interface SubmitComplaintResponse {
    success: boolean;
    complaint_id: string;
    tracking_id: string;
    message: string;
}

// Upload evidence request
export interface UploadEvidenceRequest {
    complaint_id?: string;
    tracking_id?: string;
    file: File;
    caption?: string;
    is_public?: boolean;
}

export interface UploadEvidenceResponse {
    success: boolean;
    evidence_id: string;
    file_url: string;
    message: string;
}

// Track complaint request
export interface TrackComplaintRequest {
    tracking_id: string;
}

export interface TrackComplaintResponse {
    success: boolean;
    complaint: Complaint;
    status_history: ComplaintStatusHistory[];
    evidence_files: EvidenceFile[];
}

// List complaints request
export interface ListComplaintsRequest {
    category?: ComplaintCategory;
    district?: string;
    status?: ComplaintStatus;
    page?: number;
    limit?: number;
    sort_by?: 'created_at' | 'updated_at';
    sort_order?: 'asc' | 'desc';
}

export interface ListComplaintsResponse {
    success: boolean;
    complaints: Complaint[];
    total: number;
    page: number;
    limit: number;
}

// List public projects request
export interface ListPublicProjectsRequest {
    district?: string;
    project_type?: string;
    status?: string;
    page?: number;
    limit?: number;
}

export interface ListPublicProjectsResponse {
    success: boolean;
    projects: PublicProject[];
    total: number;
    page: number;
    limit: number;
}

// Get categories response
export interface GetCategoriesResponse {
    success: boolean;
    categories: ComplaintCategoryInfo[];
}

// Error response
export interface ErrorResponse {
    success: false;
    error: string;
    message: string;
}

// Nepal-specific location data
export const NEPAL_PROVINCES = [
    'Koshi',
    'Madhesh',
    'Bagmati',
    'Gandaki',
    'Lumbini',
    'Karnali',
    'Sudurpashchim',
] as const;

export type NepalProvince = (typeof NEPAL_PROVINCES)[number];

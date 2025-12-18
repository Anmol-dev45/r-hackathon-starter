# GunaasoNepal API Testing Guide

This file contains curl commands and examples for testing all API endpoints.

## Base URL
```bash
# Local development
BASE_URL="http://localhost:3000"

# Production (replace with your domain)
BASE_URL="https://gunaasonepal.com"
```

## 1. Categories API

### Get all categories
```bash
curl -X GET "$BASE_URL/api/categories" | jq

# With language parameter
curl -X GET "$BASE_URL/api/categories?language=ne" | jq
```

Expected response:
```json
{
  "success": true,
  "categories": [
    {
      "id": "uuid",
      "category_key": "corruption",
      "name_en": "Corruption",
      "name_ne": "भ्रष्टाचार",
      "description_en": "Report corruption and bribery",
      "description_ne": "भ्रष्टाचार र घुसखोरी रिपोर्ट गर्नुहोस्",
      "icon": "alert",
      "sort_order": 2,
      "is_active": true
    }
  ]
}
```

## 2. Complaint Submission API

### Submit anonymous complaint
```bash
curl -X POST "$BASE_URL/api/complaints/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "submission_type": "anonymous",
    "title": "Poor road conditions in Ward 5 causing frequent accidents",
    "description": "The main road in Ward 5 has multiple large potholes that have not been repaired for over 6 months. Several accidents have occurred. Citizens have complained to the ward office multiple times with no action taken. The road condition is particularly dangerous during monsoon season.",
    "category": "infrastructure",
    "location": {
      "province": "Bagmati",
      "district": "Kathmandu",
      "municipality": "Kathmandu Metropolitan City",
      "ward": "5",
      "details": "Main road near Ratna Park intersection"
    },
    "is_public": true,
    "language": "en"
  }' | jq
```

### Submit pseudonymous complaint
```bash
curl -X POST "$BASE_URL/api/complaints/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "submission_type": "pseudonymous",
    "pseudonym": "ConcernedCitizen123",
    "title": "Bribery at land registration office",
    "description": "Officials at the land registration office in Kathmandu are demanding bribes to process legitimate land registration applications. Multiple citizens have been asked to pay 5000 NPR extra to get their documents processed within reasonable time. Without paying, applications are deliberately delayed for months.",
    "category": "corruption",
    "location": {
      "province": "Bagmati",
      "district": "Kathmandu",
      "municipality": "Kathmandu Metropolitan City"
    },
    "is_sensitive": true,
    "language": "en",
    "contact": {
      "email": "concerned@example.com"
    }
  }' | jq
```

### Submit verified complaint (requires authentication)
```bash
# First, get auth token (login via your auth flow)
AUTH_TOKEN="your-jwt-token-here"

curl -X POST "$BASE_URL/api/complaints/submit" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "submission_type": "verified",
    "title": "Incomplete community health center construction",
    "description": "The community health center construction in Ward 10 was supposed to be completed by March 2025 according to the project timeline. As of December 2025, the building is only 40% complete. Budget allocation was NPR 50 million but there are concerns about fund mismanagement and contractor negligence.",
    "category": "public_project",
    "location": {
      "province": "Bagmati",
      "district": "Lalitpur",
      "municipality": "Lalitpur Metropolitan City",
      "ward": "10"
    },
    "language": "en",
    "contact": {
      "phone": "9841234567",
      "email": "verified.user@example.com"
    }
  }' | jq
```

Expected response:
```json
{
  "success": true,
  "complaint_id": "550e8400-e29b-41d4-a716-446655440000",
  "tracking_id": "GN-2025-A3B7F1",
  "message": "Complaint submitted successfully. Your tracking ID is: GN-2025-A3B7F1"
}
```

### Validation error example
```bash
curl -X POST "$BASE_URL/api/complaints/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "submission_type": "anonymous",
    "title": "Short",
    "description": "Too short description",
    "category": "infrastructure"
  }' | jq
```

Expected error:
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Title must be at least 10 characters long, Description must be at least 50 characters long"
}
```

## 3. Evidence Upload API

### Upload image evidence
```bash
TRACKING_ID="GN-2025-A3B7F1"

curl -X POST "$BASE_URL/api/evidence/upload" \
  -F "file=@/path/to/photo.jpg" \
  -F "tracking_id=$TRACKING_ID" \
  -F "caption=Photo showing potholes on the main road" \
  -F "is_public=true" | jq
```

### Upload document evidence
```bash
curl -X POST "$BASE_URL/api/evidence/upload" \
  -F "file=@/path/to/document.pdf" \
  -F "tracking_id=$TRACKING_ID" \
  -F "caption=Official complaint letter submitted to ward office" | jq
```

### Upload audio evidence
```bash
curl -X POST "$BASE_URL/api/evidence/upload" \
  -F "file=@/path/to/recording.mp3" \
  -F "tracking_id=$TRACKING_ID" \
  -F "caption=Audio recording of conversation with official" | jq
```

Expected response:
```json
{
  "success": true,
  "evidence_id": "660e8400-e29b-41d4-a716-446655440000",
  "file_url": "https://kyvoqvqqbsaozxiknlrh.supabase.co/storage/v1/object/public/evidence/...",
  "message": "Evidence file uploaded successfully"
}
```

### Get evidence for a complaint
```bash
curl -X GET "$BASE_URL/api/evidence/upload?tracking_id=$TRACKING_ID" | jq
```

## 4. Complaint Tracking API

### Track complaint by tracking ID
```bash
curl -X GET "$BASE_URL/api/complaints/track?tracking_id=GN-2025-A3B7F1" | jq
```

Expected response:
```json
{
  "success": true,
  "complaint": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "tracking_id": "GN-2025-A3B7F1",
    "submission_type": "anonymous",
    "title": "Poor road conditions in Ward 5",
    "description": "...",
    "category": "infrastructure",
    "status": "submitted",
    "location_province": "Bagmati",
    "location_district": "Kathmandu",
    "created_at": "2025-12-18T10:30:00Z",
    "updated_at": "2025-12-18T10:30:00Z"
  },
  "status_history": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "complaint_id": "550e8400-e29b-41d4-a716-446655440000",
      "old_status": null,
      "new_status": "submitted",
      "notes": null,
      "created_at": "2025-12-18T10:30:00Z"
    }
  ],
  "evidence_files": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "file_name": "photo.jpg",
      "file_type": "image",
      "caption": "Photo showing potholes",
      "file_url": "https://...",
      "created_at": "2025-12-18T10:35:00Z"
    }
  ]
}
```

### Tracking ID not found
```bash
curl -X GET "$BASE_URL/api/complaints/track?tracking_id=GN-2025-INVALID" | jq
```

Expected error:
```json
{
  "success": false,
  "error": "Complaint not found",
  "message": "No complaint found with this tracking ID. Please check and try again."
}
```

## 5. Complaint Listing API

### List all public complaints
```bash
curl -X GET "$BASE_URL/api/complaints/list" | jq
```

### Filter by category
```bash
curl -X GET "$BASE_URL/api/complaints/list?category=corruption" | jq
```

### Filter by district
```bash
curl -X GET "$BASE_URL/api/complaints/list?district=Kathmandu" | jq
```

### Filter by status
```bash
curl -X GET "$BASE_URL/api/complaints/list?status=submitted" | jq
```

### Combined filters with pagination
```bash
curl -X GET "$BASE_URL/api/complaints/list?category=infrastructure&district=Kathmandu&page=1&limit=10&sort_by=created_at&sort_order=desc" | jq
```

Expected response:
```json
{
  "success": true,
  "complaints": [
    {
      "id": "...",
      "tracking_id": "GN-2025-A3B7F1",
      "title": "...",
      "category": "infrastructure",
      "status": "submitted",
      "location_district": "Kathmandu",
      "created_at": "2025-12-18T10:30:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

## 6. Public Projects API

### List all public projects
```bash
curl -X GET "$BASE_URL/api/projects/list" | jq
```

### Filter by district
```bash
curl -X GET "$BASE_URL/api/projects/list?district=Kathmandu" | jq
```

### Filter by status
```bash
curl -X GET "$BASE_URL/api/projects/list?status=ongoing" | jq
```

### Combined filters with pagination
```bash
curl -X GET "$BASE_URL/api/projects/list?district=Kathmandu&status=ongoing&page=1&limit=20" | jq
```

### Get specific project details
```bash
PROJECT_ID="770e8400-e29b-41d4-a716-446655440000"
curl -X GET "$BASE_URL/api/projects/$PROJECT_ID" | jq
```

Expected response:
```json
{
  "success": true,
  "project": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "project_name": "Road Widening - Kathmandu Ring Road",
    "project_type": "Infrastructure",
    "description": "Widening of Ring Road to reduce traffic congestion",
    "province": "Bagmati",
    "district": "Kathmandu",
    "budget_allocated": 5000000000,
    "budget_spent": 2500000000,
    "budget_currency": "NPR",
    "start_date": "2024-01-01",
    "expected_completion_date": "2026-12-31",
    "status": "ongoing",
    "progress_percentage": 50
  }
}
```

## 7. Statistics API

### Get platform statistics
```bash
curl -X GET "$BASE_URL/api/stats" | jq
```

Expected response:
```json
{
  "success": true,
  "stats": {
    "total_complaints": 150,
    "complaints_by_status": {
      "submitted": 50,
      "under_review": 30,
      "forwarded": 25,
      "resolved": 35,
      "rejected": 5,
      "closed": 5
    },
    "complaints_by_category": [
      { "category": "infrastructure", "count": 45 },
      { "category": "corruption", "count": 30 },
      { "category": "service_delivery", "count": 25 }
    ],
    "complaints_by_district": [
      { "district": "Kathmandu", "count": 60 },
      { "district": "Lalitpur", "count": 40 },
      { "district": "Bhaktapur", "count": 30 }
    ],
    "total_evidence_files": 220,
    "total_public_projects": 45
  }
}
```

## Testing Workflow

### Complete submission and tracking flow
```bash
# 1. Get categories
curl -X GET "$BASE_URL/api/categories" | jq

# 2. Submit complaint
RESPONSE=$(curl -s -X POST "$BASE_URL/api/complaints/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "submission_type": "anonymous",
    "title": "Test complaint for workflow verification",
    "description": "This is a test complaint to verify the complete workflow from submission to tracking. It includes all required fields and follows best practices for complaint submission.",
    "category": "infrastructure",
    "location": {
      "district": "Kathmandu"
    }
  }')

echo $RESPONSE | jq

# Extract tracking ID
TRACKING_ID=$(echo $RESPONSE | jq -r '.tracking_id')
echo "Tracking ID: $TRACKING_ID"

# 3. Upload evidence
curl -X POST "$BASE_URL/api/evidence/upload" \
  -F "file=@/path/to/test-image.jpg" \
  -F "tracking_id=$TRACKING_ID" \
  -F "caption=Test evidence file" | jq

# 4. Track complaint
curl -X GET "$BASE_URL/api/complaints/track?tracking_id=$TRACKING_ID" | jq

# 5. Verify in public listing
curl -X GET "$BASE_URL/api/complaints/list?category=infrastructure" | jq
```

## Load Testing (Optional)

### Using Apache Bench
```bash
# Test complaint listing endpoint
ab -n 100 -c 10 "$BASE_URL/api/complaints/list"

# Test tracking endpoint
ab -n 50 -c 5 "$BASE_URL/api/complaints/track?tracking_id=GN-2025-A3B7F1"

# Test statistics endpoint
ab -n 200 -c 20 "$BASE_URL/api/stats"
```

### Using wrk
```bash
# Install wrk first: brew install wrk (macOS) or apt install wrk (Linux)

# Test for 30 seconds with 10 connections
wrk -t10 -c10 -d30s "$BASE_URL/api/complaints/list"
```

## Monitoring

### Check API health
```bash
# Monitor response times
time curl -X GET "$BASE_URL/api/complaints/list" > /dev/null

# Monitor with verbose output
curl -w "\nTime Total: %{time_total}s\n" -X GET "$BASE_URL/api/complaints/list" | jq
```

### Database query performance
```sql
-- Run in Supabase SQL Editor to check slow queries
SELECT * FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

---

**Note:** Replace `/path/to/photo.jpg` with actual file paths when testing file uploads.
**Note:** Save tracking IDs from submission responses for subsequent tracking tests.

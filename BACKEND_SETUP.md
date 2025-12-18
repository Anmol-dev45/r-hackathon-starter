# GunaasoNepal Backend Setup Guide

## Database Schema

The complete database schema is defined in [`supabase/schema.sql`](supabase/schema.sql). This includes:

### Tables
- **complaints** - Main table for citizen complaints
- **evidence_files** - Evidence attachments (photos, audio, documents)
- **complaint_status_history** - Audit trail of status changes
- **public_projects** - Public infrastructure projects and budgets
- **complaint_categories** - Localized complaint categories (English/Nepali)

### Key Features
- Auto-generated tracking IDs (format: `GN-YYYY-XXXXXX`)
- Row Level Security (RLS) policies for privacy
- Support for anonymous, pseudonymous, and verified submissions
- Automatic status change logging
- File upload validation and storage integration

## Setup Instructions

### 1. Initialize Database

```bash
# Go to your Supabase project dashboard
# Navigate to SQL Editor
# Copy and paste the contents of supabase/schema.sql
# Execute the SQL script
```

### 2. Create Storage Bucket

```bash
# In Supabase Dashboard:
# Storage > Create new bucket
# Name: evidence
# Public: Yes
```

Or via SQL:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidence', 'evidence', true);
```

### 3. Configure Storage Policies

See [`supabase/setup-instructions.sql`](supabase/setup-instructions.sql) for detailed storage policies.

### 4. Verify Environment Variables

Ensure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## API Endpoints

### Complaints

#### Submit Complaint
```
POST /api/complaints/submit
Content-Type: application/json

{
  "submission_type": "anonymous" | "pseudonymous" | "verified",
  "pseudonym": "string (required for pseudonymous)",
  "title": "string (10-200 chars)",
  "description": "string (50-5000 chars)",
  "category": "service_delivery" | "corruption" | "rti_request" | ...,
  "location": {
    "province": "Bagmati",
    "district": "Kathmandu",
    "municipality": "Kathmandu Metropolitan City",
    "ward": "15",
    "details": "Near Ratna Park"
  },
  "is_public": true,
  "is_sensitive": false,
  "language": "ne",
  "contact": {
    "phone": "9841234567",
    "email": "citizen@example.com"
  }
}

Response:
{
  "success": true,
  "complaint_id": "uuid",
  "tracking_id": "GN-2025-A3B7F1",
  "message": "Complaint submitted successfully..."
}
```

#### Track Complaint
```
GET /api/complaints/track?tracking_id=GN-2025-A3B7F1

Response:
{
  "success": true,
  "complaint": { ... },
  "status_history": [ ... ],
  "evidence_files": [ ... ]
}
```

#### List Complaints
```
GET /api/complaints/list?category=corruption&district=Kathmandu&page=1&limit=20

Response:
{
  "success": true,
  "complaints": [ ... ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### Evidence Files

#### Upload Evidence
```
POST /api/evidence/upload
Content-Type: multipart/form-data

{
  "file": File,
  "complaint_id": "uuid" OR "tracking_id": "GN-2025-XXXXXX",
  "caption": "Photo of damaged road",
  "is_public": true
}

Response:
{
  "success": true,
  "evidence_id": "uuid",
  "file_url": "https://...",
  "message": "Evidence file uploaded successfully"
}
```

Supported file types:
- **Images**: JPEG, PNG, WebP, HEIC (max 50MB)
- **Audio**: MP3, WAV, OGG, M4A (max 50MB)
- **Video**: MP4, MPEG, WebM, QuickTime (max 50MB)
- **Documents**: PDF, DOC, DOCX, TXT (max 50MB)

#### Get Evidence
```
GET /api/evidence/upload?complaint_id=uuid

Response:
{
  "success": true,
  "evidence": [ ... ]
}
```

### Public Projects

#### List Projects
```
GET /api/projects/list?district=Kathmandu&status=ongoing&page=1&limit=20

Response:
{
  "success": true,
  "projects": [ ... ],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

#### Get Project Details
```
GET /api/projects/[id]

Response:
{
  "success": true,
  "project": { ... }
}
```

### Categories

#### Get All Categories
```
GET /api/categories?language=ne

Response:
{
  "success": true,
  "categories": [
    {
      "category_key": "corruption",
      "name_en": "Corruption",
      "name_ne": "भ्रष्टाचार",
      "description_en": "...",
      "description_ne": "...",
      "icon": "alert"
    },
    ...
  ]
}
```

## TypeScript Types

All types are defined in [`lib/types/database.ts`](lib/types/database.ts):
- Database table types
- API request/response types
- Enums for complaint categories, statuses, etc.

## Utility Functions

Available in [`lib/utils/validation.ts`](lib/utils/validation.ts):
- File validation (size, type)
- Complaint submission validation
- Phone/email validation
- Date formatting
- Pagination helpers
- Sensitive data redaction

## Security Features

### Row Level Security (RLS)
- Public complaints are viewable by everyone
- Private complaints only viewable by submitter
- Anonymous submissions have no user association
- Contact information hidden from public view

### Data Privacy
- Automatic redaction of sensitive information
- Optional anonymity for whistleblowers
- Secure file storage with access controls
- No IP logging or tracking by default

### File Upload Security
- MIME type validation
- File size limits (50MB)
- Sanitized file names
- Organized storage paths per complaint

## Testing

### Test Complaint Submission
```bash
curl -X POST http://localhost:3000/api/complaints/submit \
  -H "Content-Type: application/json" \
  -d '{
    "submission_type": "anonymous",
    "title": "Poor road conditions in Ward 5",
    "description": "The main road in Ward 5 has multiple potholes causing accidents. This has been an issue for over 6 months with no maintenance.",
    "category": "infrastructure",
    "location": {
      "district": "Kathmandu",
      "municipality": "Kathmandu Metropolitan City",
      "ward": "5"
    }
  }'
```

### Test Tracking
```bash
curl http://localhost:3000/api/complaints/track?tracking_id=GN-2025-A3B7F1
```

### Test File Upload
```bash
curl -X POST http://localhost:3000/api/evidence/upload \
  -F "file=@/path/to/image.jpg" \
  -F "tracking_id=GN-2025-A3B7F1" \
  -F "caption=Photo evidence of the issue"
```

## Next Steps

1. **Frontend Integration**: Build React components to consume these APIs
2. **Localization**: Implement Nepali language support throughout
3. **Mobile App**: Consider React Native for mobile access
4. **Admin Dashboard**: Future phase for government officials
5. **Analytics**: Implement complaint statistics and trends
6. **Notifications**: Email/SMS updates for complaint status changes
7. **RTI Integration**: Automated RTI request generation
8. **Legal Compliance**: Ensure NPPA/CIAA integration for corruption cases

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment

- Node.js 20+
- Next.js 15
- React 19
- TypeScript 5
- Supabase (PostgreSQL 15)

## License

Built for civic transparency and accountability in Nepal.

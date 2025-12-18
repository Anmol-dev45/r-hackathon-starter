# GunaasoNepal Backend Architecture

## Overview

GunaasoNepal is a civic-tech platform enabling Nepali citizens to submit governance complaints, track their status, and view public project information. The backend is built on Next.js API routes with Supabase (PostgreSQL) as the database and storage provider.

## Architecture Diagram

```
┌─────────────┐
│   Citizens  │
│  (Web/App)  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         Next.js Frontend                │
│  (React 19, TypeScript, Tailwind)      │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│      Next.js API Routes                 │
│  /api/complaints/*                      │
│  /api/evidence/*                        │
│  /api/projects/*                        │
│  /api/categories                        │
│  /api/stats                             │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         Supabase Client Layer           │
│  (RLS-enforced, auth-aware)            │
└──────┬──────────────────────────────────┘
       │
       ├─────────┬──────────────┐
       ▼         ▼              ▼
┌────────┐  ┌─────────┐  ┌──────────┐
│Database│  │ Storage │  │   Auth   │
│(Postgres)  │ (S3-like) │  │ (JWT)   │
└────────┘  └─────────┘  └──────────┘
```

## Technology Stack

### Core
- **Runtime**: Node.js 20+
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Database**: PostgreSQL 15 (via Supabase)
- **Storage**: Supabase Storage (S3-compatible)
- **Auth**: Supabase Auth (optional, supports anonymous)

### Key Libraries
- `@supabase/supabase-js` - Supabase client
- `@supabase/ssr` - Server-side rendering support
- `next` - React framework
- `react` - UI library

## Database Schema

### Core Tables

#### 1. complaints
Primary table for citizen complaints.

**Key Fields:**
- `id` (UUID) - Primary key
- `tracking_id` (VARCHAR) - Public tracking identifier (e.g., GN-2025-A3B7F1)
- `submission_type` (ENUM) - anonymous | pseudonymous | verified
- `user_id` (UUID, nullable) - Links to auth.users for verified submissions
- `pseudonym` (VARCHAR, nullable) - Display name for pseudonymous submissions
- `title` (VARCHAR 200) - Complaint title
- `description` (TEXT) - Detailed complaint description
- `category` (ENUM) - Complaint category (10 types)
- `location_*` (VARCHAR) - Province, district, municipality, ward, details
- `status` (ENUM) - submitted | under_review | forwarded | resolved | rejected | closed
- `is_public` (BOOLEAN) - Whether complaint is publicly visible
- `is_sensitive` (BOOLEAN) - Flags potentially sensitive content
- `contact_phone`, `contact_email` (VARCHAR, nullable) - Optional contact info

**Constraints:**
- Verified submissions must have user_id
- Pseudonymous submissions must have pseudonym
- Title: 10-200 characters
- Description: 50-5000 characters (validated in API)

**Indexes:**
- tracking_id (unique)
- status
- category
- created_at (DESC)
- user_id
- location_district

#### 2. evidence_files
Stores metadata for uploaded evidence files.

**Key Fields:**
- `id` (UUID) - Primary key
- `complaint_id` (UUID) - Foreign key to complaints
- `file_name` (VARCHAR) - Original file name
- `file_type` (ENUM) - image | audio | video | document | other
- `file_size` (BIGINT) - File size in bytes (max 50MB)
- `mime_type` (VARCHAR) - MIME type
- `storage_path` (TEXT) - Path in Supabase Storage
- `storage_bucket` (VARCHAR) - Storage bucket name (default: 'evidence')
- `caption` (TEXT, nullable) - Optional description
- `is_public` (BOOLEAN) - Whether file is publicly accessible

**Constraints:**
- file_size ≤ 52,428,800 bytes (50MB)

#### 3. complaint_status_history
Audit log for complaint status changes.

**Key Fields:**
- `id` (UUID) - Primary key
- `complaint_id` (UUID) - Foreign key to complaints
- `old_status` (ENUM, nullable) - Previous status
- `new_status` (ENUM) - New status
- `notes` (TEXT, nullable) - Optional notes about status change
- `updated_by` (VARCHAR, nullable) - Identifier of who made the change
- `created_at` (TIMESTAMPTZ) - Timestamp of change

**Triggers:**
- Automatically populated when complaint status changes

#### 4. public_projects
Information about government infrastructure projects.

**Key Fields:**
- `id` (UUID) - Primary key
- `project_name` (VARCHAR 200) - Project name
- `project_type` (VARCHAR) - Type of project
- `description` (TEXT) - Project description
- `province`, `district`, `municipality`, `ward` - Location
- `budget_allocated`, `budget_spent` (DECIMAL) - Financial info
- `budget_currency` (VARCHAR) - Currency code (default: NPR)
- `start_date`, `expected_completion_date`, `actual_completion_date` (DATE)
- `status` (VARCHAR) - Project status
- `progress_percentage` (INTEGER) - Completion percentage (0-100)
- `data_source`, `source_url` (VARCHAR/TEXT) - Data provenance
- `is_verified` (BOOLEAN) - Whether data is verified

**Constraints:**
- budget_spent ≤ budget_allocated
- progress_percentage between 0 and 100

#### 5. complaint_categories
Localized complaint categories.

**Key Fields:**
- `id` (UUID) - Primary key
- `category_key` (ENUM) - Category identifier
- `name_en`, `name_ne` (VARCHAR) - English and Nepali names
- `description_en`, `description_ne` (TEXT) - Descriptions
- `icon` (VARCHAR) - Icon identifier
- `sort_order` (INTEGER) - Display order
- `is_active` (BOOLEAN) - Whether category is active

**Default Categories:**
1. Service Delivery (सेवा प्रवाह)
2. Corruption (भ्रष्टाचार)
3. Right to Information (सूचनाको हक)
4. Public Projects (सार्वजनिक परियोजना)
5. Police Misconduct (प्रहरी दुर्व्यवहार)
6. Health Services (स्वास्थ्य सेवा)
7. Education (शिक्षा)
8. Infrastructure (पूर्वाधार)
9. Land Administration (भूमि प्रशासन)
10. Other (अन्य)

## Row Level Security (RLS)

### Philosophy
- **Privacy by default**: Sensitive data protected
- **Transparency**: Public complaints visible to all
- **User ownership**: Users control their own data
- **Anonymous support**: No authentication required for basic functionality

### Policies

#### complaints table
1. **Public read**: Anyone can read public complaints (`is_public = true`)
2. **Owner read**: Users can read their own complaints
3. **Public insert**: Anyone can submit complaints (anonymous allowed)
4. **Owner update**: Users can update their own verified complaints

#### evidence_files table
1. **Public read**: Anyone can view evidence for public complaints
2. **Owner read**: Users can view evidence for their own complaints
3. **Public insert**: Anyone can upload evidence

#### complaint_status_history table
1. **Public read**: Visible for public complaints
2. **Owner read**: Users can view history of their own complaints

#### public_projects table
1. **Public read**: Everyone can view all projects

#### complaint_categories table
1. **Public read**: Everyone can view active categories

### Implementation Note
API routes use `createClient()` which enforces RLS by using the anon key. For admin operations that need to bypass RLS, use `createAdminClient()`.

## API Routes

### Structure
```
app/api/
├── categories/
│   └── route.ts              # GET categories
├── complaints/
│   ├── submit/
│   │   └── route.ts          # POST new complaint
│   ├── track/
│   │   └── route.ts          # GET complaint by tracking_id
│   └── list/
│       └── route.ts          # GET complaints with filters
├── evidence/
│   └── upload/
│       └── route.ts          # POST/GET evidence files
├── projects/
│   ├── list/
│   │   └── route.ts          # GET public projects
│   └── [id]/
│       └── route.ts          # GET project by ID
└── stats/
    └── route.ts              # GET platform statistics
```

### Authentication Flow
1. **Anonymous**: No auth required, direct API access
2. **Pseudonymous**: No auth required, pseudonym provided in request
3. **Verified**: Requires Supabase Auth JWT token in headers

### Request/Response Format
All APIs return JSON with consistent structure:
```typescript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable message"
}
```

### Status Codes
- `200` - Success (GET)
- `201` - Created (POST)
- `400` - Bad request (validation error)
- `401` - Unauthorized (auth required)
- `404` - Not found
- `500` - Server error

## Storage

### Bucket: evidence
- **Public access**: Yes (for public complaints)
- **Path structure**: `{complaint_id}/{timestamp}-{sanitized_filename}`
- **Allowed types**: Images, audio, video, documents
- **Size limit**: 50MB per file
- **Naming**: Auto-sanitized (special chars removed)

### Storage Policies
1. **Public read**: All evidence files are readable
2. **Authenticated upload**: Anyone can upload (rate limiting recommended)
3. **Owner delete**: Users can delete evidence for their own complaints

### File Validation
Performed in API layer:
- MIME type checking
- Size validation
- File name sanitization
- Evidence type classification

## Security Considerations

### Input Validation
- All user input sanitized
- File uploads strictly validated
- SQL injection prevented via parameterized queries
- XSS prevention through React's built-in escaping

### Data Privacy
- Contact information hidden in public listings
- Redaction of phone numbers, emails, citizenship numbers
- Optional anonymity fully supported
- No IP address logging

### Rate Limiting
Currently not implemented. Recommended:
- 10 complaints per IP per hour
- 20 file uploads per IP per hour
- Use Vercel's built-in rate limiting or implement middleware

### Sensitive Data
- Service role key must be kept secret
- Never log sensitive user data
- Encrypt contact information at rest (future improvement)

## Performance Optimization

### Database Indexes
- All foreign keys indexed
- Common filter fields indexed (status, category, district)
- Timestamp fields indexed for sorting

### Query Optimization
- Use `select()` to fetch only needed fields
- Pagination implemented (default 20, max 100)
- Avoid N+1 queries (use joins where appropriate)

### Caching Strategy (Future)
- Cache categories (rarely change)
- Cache statistics (update every 5 minutes)
- CDN for evidence files (Supabase CDN enabled)

## Monitoring & Logging

### Recommended Tools
- **Errors**: Sentry for error tracking
- **Performance**: Vercel Analytics
- **Database**: Supabase Dashboard
- **Uptime**: UptimeRobot or similar

### Metrics to Track
- API response times (p50, p95, p99)
- Error rates by endpoint
- Complaint submission rate
- Storage usage growth
- Database connection pool usage

### Logging Best Practices
- Log errors with context
- Don't log sensitive data
- Use structured logging (JSON)
- Set appropriate log levels

## Deployment

### Environment Variables (Required)
```bash
NEXT_PUBLIC_SUPABASE_URL          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Public anon key (client-side safe)
SUPABASE_SERVICE_ROLE_KEY         # Admin key (server-only, secret!)
NEXT_PUBLIC_APP_URL               # Your domain
```

### Platform Recommendations
1. **Vercel** (Recommended)
   - Zero config deployment
   - Edge functions support
   - Automatic HTTPS
   - Built-in CDN

2. **Self-hosted**
   - Requires Node.js 20+
   - PM2 for process management
   - Nginx reverse proxy
   - SSL certificate (Let's Encrypt)

### Build Process
```bash
npm install
npm run build
npm start
```

## Future Enhancements

### Phase 2: Government Dashboard
- Admin authentication
- Status update capabilities
- Internal notes system
- Assignment to departments

### Phase 3: Advanced Features
- Email/SMS notifications
- Real-time updates (WebSocket)
- Complaint similarity detection
- Automated RTI request generation
- AI-powered category suggestion
- Multi-language support (Nepali, English, Maithili, etc.)

### Phase 4: Integration
- NPPA (National Public Procurement Portal) integration
- CIAA (Commission for the Investigation of Abuse of Authority) API
- District Administration Office portals
- Mobile app (React Native)

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- Functional components (React)
- Async/await over promises
- Descriptive variable names

### Git Workflow
- Feature branches
- Pull request reviews required
- Conventional commits
- CI/CD via GitHub Actions

### Testing
- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical paths
- Load testing before major releases

## Support & Contributing

### Getting Help
- Read documentation first
- Check existing GitHub issues
- Join community Discord (if available)
- Email: support@gunaasonepal.com (if configured)

### Contributing
- Fork repository
- Create feature branch
- Write tests
- Submit pull request
- Follow code style

## License & Legal

Built for civic transparency and accountability in Nepal.
Ensure compliance with Nepal's laws regarding:
- Data protection
- Whistleblower protection
- Right to Information Act
- Anti-corruption laws

---

**Last Updated**: December 18, 2025  
**Version**: 1.0.0  
**Status**: Production Ready (MVP)

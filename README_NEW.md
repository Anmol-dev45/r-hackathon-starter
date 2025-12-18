# GunaasoNepal - Citizen Governance Transparency Platform

**गुनासो नेपाल** - Empowering Nepali citizens to report governance issues, track complaints, and view public projects transparently.

## 🎯 Project Overview

GunaasoNepal is a civic-tech platform designed exclusively for citizens (MVP phase) to:
- Submit governance complaints (service delivery, corruption, RTI, infrastructure, etc.)
- Submit anonymously, pseudonymously, or with verification
- Upload evidence (photos, audio, documents)
- Track complaint status via unique tracking ID
- View public projects, budgets, and timelines
- Learn about RTI and anti-corruption rights

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account (free tier works)

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/gunaasonepal.git
cd gunaasonepal

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your Supabase credentials
```

### Database Setup

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Go to SQL Editor
4. Copy and paste contents of `supabase/schema.sql`
5. Execute the SQL script
6. Create storage bucket: Go to Storage → Create bucket → Name: "evidence" → Public: Yes
7. See `supabase/setup-instructions.sql` for detailed setup

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── complaints/        # Complaint submission, tracking, listing
│   │   ├── evidence/          # Evidence file upload
│   │   ├── projects/          # Public projects API
│   │   ├── categories/        # Complaint categories
│   │   └── stats/             # Platform statistics
│   ├── auth/                  # Authentication pages (Supabase Auth)
│   └── protected/             # Protected pages (optional auth)
├── components/                # React components
├── lib/
│   ├── supabase/             # Supabase client setup
│   ├── types/                # TypeScript types
│   └── utils/                # Utility functions
├── supabase/
│   ├── schema.sql            # Complete database schema
│   └── setup-instructions.sql # Detailed setup guide
├── ARCHITECTURE.md           # Backend architecture documentation
├── BACKEND_SETUP.md          # Backend setup guide
├── API_TESTING.md            # API testing examples
└── DEPLOYMENT_CHECKLIST.md   # Production deployment checklist
```

## 🔑 Key Features

### Backend (Completed ✅)
- ✅ PostgreSQL database schema with 5 core tables
- ✅ Row Level Security (RLS) policies for data privacy
- ✅ Auto-generated tracking IDs (format: GN-2025-XXXXXX)
- ✅ Support for anonymous, pseudonymous, and verified submissions
- ✅ File upload with validation (images, audio, video, documents)
- ✅ Complaint tracking and status history
- ✅ Public projects and budgets API
- ✅ Platform statistics API
- ✅ Complaint categories (bilingual: English/Nepali)

### Frontend (In Progress 🚧)
- 🚧 Complaint submission form
- 🚧 File upload interface
- 🚧 Complaint tracking page
- 🚧 Public complaint listing
- 🚧 Public projects dashboard
- 🚧 Mobile-responsive design
- 🚧 Nepali language support

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Complete backend architecture overview
- **[BACKEND_SETUP.md](BACKEND_SETUP.md)** - Detailed backend setup guide with API docs
- **[API_TESTING.md](API_TESTING.md)** - API testing examples with curl commands
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Production deployment guide

## 🔧 Available API Endpoints

### Complaints
- `POST /api/complaints/submit` - Submit new complaint
- `GET /api/complaints/track?tracking_id=GN-2025-XXXXXX` - Track complaint
- `GET /api/complaints/list` - List public complaints (with filters)

### Evidence
- `POST /api/evidence/upload` - Upload evidence file
- `GET /api/evidence/upload?complaint_id=uuid` - Get evidence files

### Public Projects
- `GET /api/projects/list` - List public projects
- `GET /api/projects/[id]` - Get project details

### Categories & Stats
- `GET /api/categories` - Get complaint categories
- `GET /api/stats` - Get platform statistics

See [BACKEND_SETUP.md](BACKEND_SETUP.md) for complete API documentation.

## 🧪 Testing

```bash
# Run tests
npm test

# API testing (see API_TESTING.md for examples)
curl -X GET http://localhost:3000/api/categories | jq

# Submit test complaint
curl -X POST http://localhost:3000/api/complaints/submit \
  -H "Content-Type: application/json" \
  -d @test-complaint.json
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for complete deployment guide.

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Git Workflow
1. **Never push directly to `main` or `dev`**
2. Always create a feature branch: `git checkout -b feature/your-feature`
3. Commit with descriptive messages
4. Push to your branch: `git push origin feature/your-feature`
5. Create a Pull Request to `dev` branch
6. Wait for code review

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Meaningful variable names
- Comment complex logic
- Write tests for new features

### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

Example: `feature/complaint-submission-form`

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL 15 (Supabase)
- **Auth**: Supabase Auth (optional, supports anonymous)
- **Storage**: Supabase Storage
- **Deployment**: Vercel (recommended)

## 🔒 Security

- Row Level Security (RLS) enforced
- Anonymous submissions supported
- Contact information protected
- File upload validation
- No IP address logging
- Sensitive data redaction

## 📊 Database Tables

1. **complaints** - Main complaint records
2. **evidence_files** - Uploaded evidence metadata
3. **complaint_status_history** - Status change audit log
4. **public_projects** - Government project information
5. **complaint_categories** - Localized complaint categories

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed schema documentation.

## 🌍 Nepal-Specific Features

- 7 provinces, 77 districts support
- Nepali language interface (planned)
- Nepal timezone (NPT)
- Nepali phone number validation (9XXXXXXXXX)
- Local currency (NPR)
- RTI (Right to Information) integration planned
- CIAA/NPPA integration planned

## 📝 License

Built for civic transparency and accountability in Nepal.

## 👥 Team

- **Project Lead**: [Your Name]
- **Backend**: Completed ✅
- **Frontend**: In Progress 🚧
- **Contributors**: Welcome!

## 📞 Support

- **Documentation**: See docs/ folder
- **Issues**: GitHub Issues
- **Email**: support@gunaasonepal.com (if configured)

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- ✅ Backend schema and APIs
- 🚧 Citizen-facing frontend
- 🚧 Complaint submission flow
- 🚧 Tracking functionality
- 🚧 Mobile responsiveness

### Phase 2: Enhanced Features
- Email/SMS notifications
- Advanced search and filters
- Complaint analytics
- Multi-language support
- Mobile app (React Native)

### Phase 3: Government Integration
- Admin dashboard
- Department assignment
- Status updates by officials
- NPPA/CIAA API integration
- Automated forwarding

---

**Status**: Backend Complete ✅ | Frontend In Progress 🚧  
**Version**: 1.0.0 (MVP)  
**Last Updated**: December 18, 2025

**गुनासो नेपाल** - नागरिक पहिलो, पारदर्शिता र जवाफदेहिता

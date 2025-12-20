# Seeding Sample Data

This guide explains how to populate your database with sample complaints and projects.

## Quick Start

1. **Make sure you're logged in** to your application
2. Visit: `http://localhost:3000/seed`
3. Click the buttons to seed data

## What Gets Created

### Sample Complaints (6 total)

The seeding will create 6 diverse complaints with different:
- **Statuses**: `submitted`, `under_review`, `forwarded`, `resolved`
- **Categories**: infrastructure, service_delivery, corruption, education, health_services, public_project
- **Submission Types**: verified, pseudonymous, anonymous
- **Locations**: Different provinces and districts across Nepal

Example complaints:
1. Poor Road Conditions (Infrastructure) - Under Review
2. Irregular Water Supply (Service Delivery) - Forwarded
3. Corruption in Land Office (Corruption) - Submitted
4. School Infrastructure Issues (Education) - Resolved
5. Medicine Shortage (Health Services) - Under Review
6. Illegal Construction (Public Project) - Forwarded

### Public Projects (8 total)

Creates 8 government projects with:
- **Statuses**: `completed`, `ongoing`, `planned`
- **Types**: Infrastructure, Water Supply, Environment, Education, Healthcare, Energy, Agriculture, Tourism
- **Progress**: Varying completion percentages (0% to 100%)
- **Budgets**: Realistic allocated and spent amounts in NPR

Example projects:
1. Kathmandu Ring Road Expansion - Completed (100%)
2. Smart Water Supply Pokhara - Ongoing (65%)
3. Green City Initiative - Ongoing (35%)
4. Digital Education Platform - Ongoing (30%)
5. Healthcare Centers Upgrade - Planned (5%)
6. Solar Power Grid - Ongoing (45%)

## API Endpoints

### Seed Complaints
```bash
POST /api/seed/complaints
Authorization: Required (must be logged in)
```

### Seed Projects
```bash
POST /api/seed/projects
Authorization: Required (must be logged in)
```

## Using cURL

```bash
# Seed complaints
curl -X POST http://localhost:3000/api/seed/complaints \
  -H "Cookie: your-auth-cookie"

# Seed projects
curl -X POST http://localhost:3000/api/seed/projects \
  -H "Cookie: your-auth-cookie"
```

## Database Status Mapping

The complaint statuses in the database map to the frontend as follows:

| Database Status | Frontend Display | Color |
|----------------|------------------|-------|
| `submitted` | "Received ✓" / "Submitted" | Blue |
| `under_review` | "Being Reviewed" / "Under Review" | Purple/Yellow |
| `forwarded` | "Sent to Department" / "Forwarded" | Yellow/Purple |
| `resolved` | "Resolved ✓" | Green |
| `rejected` | "Not Accepted" / "Rejected" | Red |
| `closed` | "Closed" | Gray |

## Viewing Seeded Data

After seeding:
1. Go to **Dashboard** (`/dashboard`) to see your complaints
2. Go to **Projects** page to see government projects
3. Use **Track Complaint** with any tracking ID from the seeded data

## Notes

- All seeded complaints are created under your user account (for verified submissions)
- Pseudonymous and anonymous complaints are also created for variety
- Status history is automatically created for non-submitted statuses
- Projects include realistic budget allocations and progress percentages
- All data includes proper timestamps and location information

## Troubleshooting

**Error: "Authentication required"**
- Solution: Make sure you're logged in before seeding

**Error: "Failed to seed complaints"**
- Solution: Check your Supabase connection and database schema

**No data showing in dashboard**
- Solution: Refresh the page or click the refresh button in the dashboard

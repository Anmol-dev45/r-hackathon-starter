# User-Specific Complaints Dashboard

## Overview

The dashboard now displays only complaints submitted by the currently logged-in user. This ensures privacy and allows users to manage their own complaints.

## Features

### 1. **Authentication Required**
- Dashboard is protected - requires user login
- Redirects to login page if not authenticated
- Uses server-side authentication check

### 2. **User-Specific Complaints API**
**Endpoint:** `GET /api/complaints/my-complaints`

Filters complaints to show only those submitted by the authenticated user (verified submissions only).

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `status` - Filter by status (submitted, under_review, forwarded, resolved, etc.)
- `sort_by` - Sort field (created_at, updated_at)
- `sort_order` - Sort direction (asc, desc)

**Example:**
```bash
GET /api/complaints/my-complaints?page=1&limit=10&status=submitted
```

**Response:**
```json
{
  "success": true,
  "complaints": [...],
  "total": 5,
  "page": 1,
  "limit": 10
}
```

### 3. **Dashboard Features**

#### Real-Time Statistics
- **Total Complaints**: Total number of complaints submitted by the user
- **Resolved**: Number of resolved complaints
- **Pending**: Submitted and forwarded complaints
- **In Review**: Complaints currently under review

#### Complaints Table
- **Tracking ID**: Click to view complaint details
- **Title**: Complaint title (truncated if long)
- **Category**: Formatted category name
- **Status**: Color-coded status badges
- **Location**: Province or district
- **Date**: Formatted submission date

#### Search/Filter
- Real-time filtering by tracking ID, title, or category
- Case-insensitive search

#### Empty States
- Shows message when no complaints exist
- Shows filtered message when search returns no results

## Implementation Details

### Files Created/Modified

1. **`/app/api/complaints/my-complaints/route.ts`** (NEW)
   - API endpoint for fetching user-specific complaints
   - Filters by `user_id` and `submission_type='verified'`
   - Requires authentication

2. **`/app/dashboard/layout.tsx`** (NEW)
   - Protected layout for dashboard
   - Server-side auth check
   - Redirects to login if not authenticated

3. **`/app/dashboard/page.tsx`** (MODIFIED)
   - Connects to API to fetch real complaints
   - Displays user-specific data
   - Real-time search/filter
   - Dynamic stats calculation
   - Loading and error states

### Security

✅ **Server-side authentication** - User identity verified on server
✅ **Database-level filtering** - Only user's complaints returned
✅ **No data leakage** - Cannot see other users' complaints
✅ **Protected routes** - Dashboard requires login

### User Flow

1. User logs in with verified account
2. Submits complaints as "verified" type
3. Accesses `/dashboard` to view their complaints
4. Can filter, sort, and click to view details
5. Stats update automatically based on complaint status

## Testing

### Prerequisites
1. User must be logged in
2. User must have submitted complaints as "verified" type

### Test Steps

1. **Login as a verified user:**
   ```
   Visit: http://localhost:3000/auth/login
   ```

2. **Submit a verified complaint:**
   ```
   Visit: http://localhost:3000/complaint
   Select: "Verified" submission type
   ```

3. **View dashboard:**
   ```
   Visit: http://localhost:3000/dashboard
   ```

4. **Verify:**
   - Only your complaints appear
   - Stats match your data
   - Filter works correctly
   - Click tracking ID opens complaint details

### API Testing

Use the test file: `my-complaints-tests.http`

```bash
# Get your complaints
GET http://localhost:3000/api/complaints/my-complaints

# With authentication cookie
Cookie: sb-access-token=YOUR_TOKEN
```

## Important Notes

⚠️ **Submission Type Matters**
- Dashboard only shows **"verified"** complaints
- Anonymous and pseudonymous complaints are not shown (no user_id)
- Users must be logged in when submitting to see complaints in dashboard

📝 **Future Enhancements**
- Add pagination controls in UI
- Export complaints to PDF/CSV
- Bulk actions (delete, update status)
- Email notifications for status changes
- Complaint analytics and charts

## Screenshots

### Before
- Static dummy data
- All users see the same data
- No API integration

### After
- Dynamic real data from database
- Each user sees only their complaints
- Full API integration
- Real-time filtering and stats

## Support

For issues or questions, check:
- API endpoint: `/api/complaints/my-complaints`
- Dashboard: `/dashboard`
- Authentication: `/auth/login`

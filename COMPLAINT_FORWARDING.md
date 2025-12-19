# Complaint Forwarding System

## Overview

The GunaasoNepal platform automatically forwards complaints to the appropriate government office based on:
- **Complaint Type/Category**: What the complaint is about
- **Location**: Where the complaint originated (Province, District, Municipality)

## How It Works

1. When a complaint is submitted, the system automatically determines the responsible office
2. The forwarding is based on pre-configured rules matching complaint categories to government departments
3. Location information helps route complaints to the correct provincial or district office
4. The mapping is stored as a simple JSON structure: `{ "complaint_id": "office_id" }`

## Complaint Categories & Forwarding Rules

### Corruption Complaints
**Forwarded to**: Commission for Investigation of Abuse of Authority (CIAA)
- Routes to provincial CIAA offices based on complaint location
- Default: CIAA Central Office (Bagmati Province)

### Police Misconduct
**Forwarded to**: Nepal Police Offices
- Routes to provincial police offices based on location
- Default: Nepal Police Headquarters (Bagmati Province)

### Health Services
**Forwarded to**: Ministry of Health and Population / Health Directorates
- Routes to provincial health directorates based on location
- Default: Ministry of Health Central Office

### Education
**Forwarded to**: Ministry of Education, Science and Technology / Education Directorates
- Routes to provincial education directorates based on location
- Default: Ministry of Education Central Office

### Infrastructure
**Forwarded to**: Ministry of Physical Infrastructure and Transport
- Routes to provincial infrastructure offices based on location
- Default: Ministry of Infrastructure Central Office

### Land Administration
**Forwarded to**: Ministry of Land Management / Land Revenue Offices
- Routes to provincial land revenue offices based on location
- Default: Ministry of Land Central Office

### RTI (Right to Information) Requests
**Forwarded to**: National Information Commission
- All RTI requests go to the central commission

### Public Projects
**Forwarded to**: Local Government Offices
- Routes to specific municipal offices based on district
- Falls back to generic local government office

### Service Delivery & Others
**Forwarded to**: Chief District Office or Office of the Ombudsman
- General administrative complaints go to district administration
- Unclassified complaints route to the Ombudsman

## API Endpoints

### Submit Complaint (with auto-forwarding)
```
POST /api/complaints/submit
```
**Response includes forwarding information:**
```json
{
  "success": true,
  "complaint_id": "uuid",
  "tracking_id": "GN-XXXXXX",
  "message": "Complaint submitted successfully...",
  "forwarding": {
    "office_id": "CIAA-BAGMATI",
    "office_name": "CIAA Bagmati Office"
  }
}
```

### Get Forwarding Info for a Complaint
```
GET /api/complaints/forwarding?complaint_id=uuid
```
**Response:**
```json
{
  "success": true,
  "forwarding": {
    "complaint_id": "uuid",
    "office_id": "CIAA-BAGMATI",
    "office_name": "CIAA Bagmati Office"
  }
}
```

### List All Forwardings
```
GET /api/complaints/forwarding/list
```
**Response:**
```json
{
  "success": true,
  "count": 10,
  "forwardings": [
    {
      "complaint_id": "uuid-1",
      "office_id": "CIAA-BAGMATI",
      "office_name": "CIAA Bagmati Office",
      "department": "CIAA"
    },
    {
      "complaint_id": "uuid-2",
      "office_id": "NPL-PROVINCE-1",
      "office_name": "Province 1 Police Office",
      "department": "Nepal Police"
    }
  ]
}
```

## Data Structure

### In-Memory Storage
The forwarding mappings are stored in memory as:
```typescript
{
  "complaint_id_1": "office_id_1",
  "complaint_id_2": "office_id_2",
  ...
}
```

### Office Structure
Each office has:
- `id`: Unique identifier (e.g., "CIAA-BAGMATI")
- `name`: Full office name
- `department`: Parent department/ministry
- `location`: Optional province/district information

## Example Forwarding Logic

```typescript
// Corruption complaint from Bagmati Province
forwardComplaint(
  "complaint-uuid",
  "corruption",
  { province: "Bagmati", district: "Kathmandu" }
)
// Returns: { officeId: "CIAA-BAGMATI", officeName: "CIAA Bagmati Office" }

// Education complaint from Gandaki Province
forwardComplaint(
  "complaint-uuid",
  "education",
  { province: "Gandaki" }
)
// Returns: { officeId: "MOE-GANDAKI", officeName: "Gandaki Education Directorate" }

// RTI request (no location needed)
forwardComplaint(
  "complaint-uuid",
  "rti_request",
  {}
)
// Returns: { officeId: "NIC-CENTRAL", officeName: "National Information Commission" }
```

## Adding New Offices

To add new offices or update forwarding rules, edit:
```
/lib/utils/complaint-forwarding.ts
```

Update the `OFFICES` object with new office definitions following the existing structure.

## Notes

- No database table is created for forwarding (as requested)
- Forwarding happens automatically on complaint submission
- The system uses a simple in-memory storage that can be persisted if needed
- Forwarding is based on best-match logic: Province + District → Province only → Default office
- All endpoints are type-safe with TypeScript interfaces

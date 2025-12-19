// Complaint Forwarding System
// Automatically assigns complaints to offices based on type and location

import type { ComplaintCategory } from '@/lib/types/database';

// Office/Department identifiers
export interface ForwardingOffice {
    id: string;
    name: string;
    department: string;
    location?: {
        province?: string;
        district?: string;
    };
}

// Forwarding mapping type
export interface ComplaintForwarding {
    [complaintId: string]: string; // complaint_id -> office_id
}

// Define offices/departments for different complaint categories and locations
const OFFICES: Record<string, ForwardingOffice[]> = {
    // Corruption complaints go to CIAA offices by location
    corruption: [
        { id: 'CIAA-CENTRAL', name: 'Commission for Investigation of Abuse of Authority', department: 'CIAA', location: { province: 'Bagmati' } },
        { id: 'CIAA-KOSHI', name: 'CIAA Koshi Office', department: 'CIAA', location: { province: 'Koshi' } },
        { id: 'CIAA-MADHESH', name: 'CIAA Madhesh Office', department: 'CIAA', location: { province: 'Madhesh' } },
        { id: 'CIAA-BAGMATI', name: 'CIAA Bagmati Office', department: 'CIAA', location: { province: 'Bagmati' } },
        { id: 'CIAA-GANDAKI', name: 'CIAA Gandaki Office', department: 'CIAA', location: { province: 'Gandaki' } },
        { id: 'CIAA-LUMBINI', name: 'CIAA Lumbini Office', department: 'CIAA', location: { province: 'Lumbini' } },
        { id: 'CIAA-KARNALI', name: 'CIAA Karnali Office', department: 'CIAA', location: { province: 'Karnali' } },
        { id: 'CIAA-SUDURPASHCHIM', name: 'CIAA Sudurpashchim Office', department: 'CIAA', location: { province: 'Sudurpashchim' } },
    ],

    // Police misconduct goes to Police headquarters by location
    police_misconduct: [
        { id: 'NPL-HQ', name: 'Nepal Police Headquarters', department: 'Nepal Police', location: { province: 'Bagmati' } },
        { id: 'NPL-KOSHI', name: 'Koshi Police Office', department: 'Nepal Police', location: { province: 'Koshi' } },
        { id: 'NPL-MADHESH', name: 'Madhesh Police Office', department: 'Nepal Police', location: { province: 'Madhesh' } },
        { id: 'NPL-BAGMATI', name: 'Bagmati Police Office', department: 'Nepal Police', location: { province: 'Bagmati' } },
        { id: 'NPL-GANDAKI', name: 'Gandaki Police Office', department: 'Nepal Police', location: { province: 'Gandaki' } },
        { id: 'NPL-LUMBINI', name: 'Lumbini Police Office', department: 'Nepal Police', location: { province: 'Lumbini' } },
        { id: 'NPL-KARNALI', name: 'Karnali Police Office', department: 'Nepal Police', location: { province: 'Karnali' } },
        { id: 'NPL-SUDURPASHCHIM', name: 'Sudurpashchim Police Office', department: 'Nepal Police', location: { province: 'Sudurpashchim' } },
    ],

    // Health services go to Health Ministry offices
    health_services: [
        { id: 'MOH-CENTRAL', name: 'Ministry of Health and Population', department: 'Ministry of Health', location: { province: 'Bagmati' } },
        { id: 'MOH-KOSHI', name: 'Koshi Health Directorate', department: 'Health Directorate', location: { province: 'Koshi' } },
        { id: 'MOH-MADHESH', name: 'Madhesh Health Directorate', department: 'Health Directorate', location: { province: 'Madhesh' } },
        { id: 'MOH-BAGMATI', name: 'Bagmati Health Directorate', department: 'Health Directorate', location: { province: 'Bagmati' } },
        { id: 'MOH-GANDAKI', name: 'Gandaki Health Directorate', department: 'Health Directorate', location: { province: 'Gandaki' } },
        { id: 'MOH-LUMBINI', name: 'Lumbini Health Directorate', department: 'Health Directorate', location: { province: 'Lumbini' } },
        { id: 'MOH-KARNALI', name: 'Karnali Health Directorate', department: 'Health Directorate', location: { province: 'Karnali' } },
        { id: 'MOH-SUDURPASHCHIM', name: 'Sudurpashchim Health Directorate', department: 'Health Directorate', location: { province: 'Sudurpashchim' } },
    ],

    // Education complaints go to Education Ministry
    education: [
        { id: 'MOE-CENTRAL', name: 'Ministry of Education, Science and Technology', department: 'Ministry of Education', location: { province: 'Bagmati' } },
        { id: 'MOE-KOSHI', name: 'Koshi Education Directorate', department: 'Education Directorate', location: { province: 'Koshi' } },
        { id: 'MOE-MADHESH', name: 'Madhesh Education Directorate', department: 'Education Directorate', location: { province: 'Madhesh' } },
        { id: 'MOE-BAGMATI', name: 'Bagmati Education Directorate', department: 'Education Directorate', location: { province: 'Bagmati' } },
        { id: 'MOE-GANDAKI', name: 'Gandaki Education Directorate', department: 'Education Directorate', location: { province: 'Gandaki' } },
        { id: 'MOE-LUMBINI', name: 'Lumbini Education Directorate', department: 'Education Directorate', location: { province: 'Lumbini' } },
        { id: 'MOE-KARNALI', name: 'Karnali Education Directorate', department: 'Education Directorate', location: { province: 'Karnali' } },
        { id: 'MOE-SUDURPASHCHIM', name: 'Sudurpashchim Education Directorate', department: 'Education Directorate', location: { province: 'Sudurpashchim' } },
    ],

    // Infrastructure complaints go to Physical Infrastructure Ministry
    infrastructure: [
        { id: 'MOPI-CENTRAL', name: 'Ministry of Physical Infrastructure and Transport', department: 'Ministry of Infrastructure', location: { province: 'Bagmati' } },
        { id: 'MOPI-KOSHI', name: 'Koshi Infrastructure Office', department: 'Infrastructure Office', location: { province: 'Koshi' } },
        { id: 'MOPI-MADHESH', name: 'Madhesh Infrastructure Office', department: 'Infrastructure Office', location: { province: 'Madhesh' } },
        { id: 'MOPI-BAGMATI', name: 'Bagmati Infrastructure Office', department: 'Infrastructure Office', location: { province: 'Bagmati' } },
        { id: 'MOPI-GANDAKI', name: 'Gandaki Infrastructure Office', department: 'Infrastructure Office', location: { province: 'Gandaki' } },
        { id: 'MOPI-LUMBINI', name: 'Lumbini Infrastructure Office', department: 'Infrastructure Office', location: { province: 'Lumbini' } },
        { id: 'MOPI-KARNALI', name: 'Karnali Infrastructure Office', department: 'Infrastructure Office', location: { province: 'Karnali' } },
        { id: 'MOPI-SUDURPASHCHIM', name: 'Sudurpashchim Infrastructure Office', department: 'Infrastructure Office', location: { province: 'Sudurpashchim' } },
    ],

    // Land administration goes to Land Revenue Offices
    land_administration: [
        { id: 'MOLRM-CENTRAL', name: 'Ministry of Land Management, Cooperatives and Poverty Alleviation', department: 'Ministry of Land', location: { province: 'Bagmati' } },
        { id: 'MOLRM-KOSHI', name: 'Koshi Land Revenue Office', department: 'Land Revenue Office', location: { province: 'Koshi' } },
        { id: 'MOLRM-MADHESH', name: 'Madhesh Land Revenue Office', department: 'Land Revenue Office', location: { province: 'Madhesh' } },
        { id: 'MOLRM-BAGMATI', name: 'Bagmati Land Revenue Office', department: 'Land Revenue Office', location: { province: 'Bagmati' } },
        { id: 'MOLRM-GANDAKI', name: 'Gandaki Land Revenue Office', department: 'Land Revenue Office', location: { province: 'Gandaki' } },
        { id: 'MOLRM-LUMBINI', name: 'Lumbini Land Revenue Office', department: 'Land Revenue Office', location: { province: 'Lumbini' } },
        { id: 'MOLRM-KARNALI', name: 'Karnali Land Revenue Office', department: 'Land Revenue Office', location: { province: 'Karnali' } },
        { id: 'MOLRM-SUDURPASHCHIM', name: 'Sudurpashchim Land Revenue Office', department: 'Land Revenue Office', location: { province: 'Sudurpashchim' } },
    ],

    // RTI requests go to National Information Commission
    rti_request: [
        { id: 'NIC-CENTRAL', name: 'National Information Commission', department: 'National Information Commission' },
    ],

    // Public projects go to local government by district
    public_project: [
        { id: 'LOCAL-GOV-KATHMANDU', name: 'Kathmandu Metropolitan Office', department: 'Local Government', location: { province: 'Bagmati', district: 'Kathmandu' } },
        { id: 'LOCAL-GOV-LALITPUR', name: 'Lalitpur Metropolitan Office', department: 'Local Government', location: { province: 'Bagmati', district: 'Lalitpur' } },
        { id: 'LOCAL-GOV-BHAKTAPUR', name: 'Bhaktapur Municipality Office', department: 'Local Government', location: { province: 'Bagmati', district: 'Bhaktapur' } },
        { id: 'LOCAL-GOV-GENERIC', name: 'Local Government Office', department: 'Local Government' },
    ],

    // Service delivery and other complaints go to Chief District Office
    service_delivery: [
        { id: 'CDO-GENERIC', name: 'Chief District Office', department: 'District Administration' },
    ],

    other: [
        { id: 'OMBUDSMAN', name: "Office of the Ombudsman", department: 'Ombudsman' },
    ],
};

/**
 * Determine which office should handle a complaint based on category and location
 */
export function forwardComplaint(
    complaintId: string,
    category: ComplaintCategory,
    location?: {
        province?: string | null;
        district?: string | null;
        municipality?: string | null;
    }
): { complaintId: string; officeId: string; officeName: string } {
    const offices = OFFICES[category] || OFFICES['other'];

    let selectedOffice: ForwardingOffice | undefined;

    // Try to match by province and district
    if (location?.province && location?.district) {
        const match = offices.find(
            office =>
                office.location?.province === location.province &&
                office.location?.district === location.district
        );
        if (match) {
            selectedOffice = match;
        }
    }

    // If no match, try to match by province only
    if (!selectedOffice && location?.province) {
        const match = offices.find(
            office => office.location?.province === location.province
        );
        if (match) {
            selectedOffice = match;
        }
    }

    // Fallback to first office (usually central/generic)
    if (!selectedOffice) {
        selectedOffice = offices[0];
    }

    return {
        complaintId,
        officeId: selectedOffice.id,
        officeName: selectedOffice.name,
    };
}

/**
 * Get office details by ID
 */
export function getOfficeById(officeId: string): ForwardingOffice | null {
    for (const category in OFFICES) {
        const office = OFFICES[category].find(o => o.id === officeId);
        if (office) return office;
    }
    return null;
}

/**
 * Get all available offices for a category
 */
export function getOfficesByCategory(category: ComplaintCategory): ForwardingOffice[] {
    return OFFICES[category] || OFFICES['other'];
}

// API route for getting all complaint forwarding mappings
// GET /api/complaints/forwarding/list

import { getAllForwardings } from '@/lib/utils/forwarding-storage';
import { getOfficeById } from '@/lib/utils/complaint-forwarding';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const forwardings = getAllForwardings();

        // Enrich with office details
        const enrichedForwardings = Object.entries(forwardings).map(([complaintId, officeId]) => {
            const office = getOfficeById(officeId);
            return {
                complaint_id: complaintId,
                office_id: officeId,
                office_name: office?.name || 'Unknown Office',
                department: office?.department || 'Unknown',
            };
        });

        return NextResponse.json(
            {
                success: true,
                count: enrichedForwardings.length,
                forwardings: enrichedForwardings,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error getting forwarding list:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Server error',
                message: 'An unexpected error occurred',
            },
            { status: 500 }
        );
    }
}

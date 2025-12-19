// API route for getting complaint forwarding information
// GET /api/complaints/forwarding?complaint_id=xxx

import { createClient } from '@/lib/supabase/server';
import { forwardComplaint, getOfficeById } from '@/lib/utils/complaint-forwarding';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const searchParams = request.nextUrl.searchParams;
        const complaintId = searchParams.get('complaint_id');

        if (!complaintId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing parameter',
                    message: 'complaint_id is required',
                },
                { status: 400 }
            );
        }

        // Get complaint details
        const { data: complaint, error } = await supabase
            .from('complaints')
            .select('id, category, location_province, location_district, location_municipality')
            .eq('id', complaintId)
            .single();

        if (error || !complaint) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Not found',
                    message: 'Complaint not found',
                },
                { status: 404 }
            );
        }

        // Calculate forwarding
        const forwarding = forwardComplaint(
            complaint.id,
            complaint.category,
            {
                province: complaint.location_province,
                district: complaint.location_district,
                municipality: complaint.location_municipality,
            }
        );

        return NextResponse.json(
            {
                success: true,
                forwarding: {
                    complaint_id: forwarding.complaintId,
                    office_id: forwarding.officeId,
                    office_name: forwarding.officeName,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error getting forwarding info:', error);
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

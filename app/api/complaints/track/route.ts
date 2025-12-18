// API route for tracking complaints
// GET /api/complaints/track?tracking_id=GN-2025-XXXXXX

import { createClient } from '@/lib/supabase/server';
import type {
    TrackComplaintResponse,
    ErrorResponse,
} from '@/lib/types/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest
): Promise<NextResponse<TrackComplaintResponse | ErrorResponse>> {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const trackingId = searchParams.get('tracking_id');

        if (!trackingId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing parameter',
                    message: 'Please provide a tracking_id',
                },
                { status: 400 }
            );
        }

        // Fetch complaint by tracking ID
        const { data: complaint, error: complaintError } = await supabase
            .from('complaints')
            .select('*')
            .eq('tracking_id', trackingId.toUpperCase())
            .single();

        if (complaintError || !complaint) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Complaint not found',
                    message:
                        'No complaint found with this tracking ID. Please check and try again.',
                },
                { status: 404 }
            );
        }

        // Check if user has permission to view this complaint
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // Hide sensitive contact information if not the owner
        if (complaint.user_id !== user?.id) {
            complaint.contact_phone = null;
            complaint.contact_email = null;
        }

        // Fetch status history
        const { data: statusHistory, error: historyError } = await supabase
            .from('complaint_status_history')
            .select('*')
            .eq('complaint_id', complaint.id)
            .order('created_at', { ascending: true });

        if (historyError) {
            console.error('Error fetching status history:', historyError);
        }

        // Fetch evidence files
        const { data: evidenceFiles, error: evidenceError } = await supabase
            .from('evidence_files')
            .select('*')
            .eq('complaint_id', complaint.id)
            .order('created_at', { ascending: false });

        if (evidenceError) {
            console.error('Error fetching evidence files:', evidenceError);
        }

        // Generate public URLs for evidence files
        const evidenceWithUrls =
            evidenceFiles?.map((item) => {
                const {
                    data: { publicUrl },
                } = supabase.storage
                    .from(item.storage_bucket)
                    .getPublicUrl(item.storage_path);

                return {
                    ...item,
                    file_url: publicUrl,
                };
            }) || [];

        return NextResponse.json({
            success: true,
            complaint,
            status_history: statusHistory || [],
            evidence_files: evidenceWithUrls,
        });
    } catch (error) {
        console.error('Error in complaint tracking:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Server error',
                message: 'An unexpected error occurred. Please try again later.',
            },
            { status: 500 }
        );
    }
}

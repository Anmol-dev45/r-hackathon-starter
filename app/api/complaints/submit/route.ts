// API route for submitting complaints
// POST /api/complaints/submit

import { createClient } from '@/lib/supabase/server';
import type {
    ComplaintInsert,
    SubmitComplaintRequest,
    SubmitComplaintResponse,
    ErrorResponse,
} from '@/lib/types/database';
import { validateComplaintSubmission } from '@/lib/utils/validation';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    request: NextRequest
): Promise<NextResponse<SubmitComplaintResponse | ErrorResponse>> {
    try {
        const supabase = await createClient();
        const body: SubmitComplaintRequest = await request.json();

        // Validate request data
        const validation = validateComplaintSubmission({
            submission_type: body.submission_type,
            pseudonym: body.pseudonym,
            title: body.title,
            description: body.description,
            category: body.category,
        });

        if (!validation.valid) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    message: validation.errors.join(', '),
                },
                { status: 400 }
            );
        }

        // Get authenticated user if exists
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // Validate submission type
        if (body.submission_type === 'verified' && !user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Authentication required',
                    message: 'You must be logged in to submit a verified complaint',
                },
                { status: 401 }
            );
        }

        if (body.submission_type === 'pseudonymous' && !body.pseudonym) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Pseudonym required',
                    message: 'Pseudonym is required for pseudonymous submissions',
                },
                { status: 400 }
            );
        }

        // Prepare complaint data
        const complaintData: ComplaintInsert = {
            submission_type: body.submission_type,
            user_id: body.submission_type === 'verified' ? user?.id : null,
            pseudonym:
                body.submission_type === 'pseudonymous' ? body.pseudonym : null,
            title: body.title.trim(),
            description: body.description.trim(),
            category: body.category,
            location_province: body.location?.province || null,
            location_district: body.location?.district || null,
            location_municipality: body.location?.municipality || null,
            location_ward: body.location?.ward || null,
            location_details: body.location?.details || null,
            is_public: body.is_public ?? true,
            is_sensitive: body.is_sensitive ?? false,
            language: body.language || 'ne',
            contact_phone: body.contact?.phone || null,
            contact_email: body.contact?.email || null,
            status: 'submitted',
        };

        // Insert complaint
        const { data: complaint, error: insertError } = await supabase
            .from('complaints')
            .insert(complaintData)
            .select('id, tracking_id')
            .single();

        if (insertError) {
            console.error('Error inserting complaint:', insertError);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Database error',
                    message: 'Failed to submit complaint. Please try again.',
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                complaint_id: complaint.id,
                tracking_id: complaint.tracking_id,
                message: `Complaint submitted successfully. Your tracking ID is: ${complaint.tracking_id}`,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error in complaint submission:', error);
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

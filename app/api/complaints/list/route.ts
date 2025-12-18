// API route for listing complaints
// GET /api/complaints/list?category=corruption&district=Kathmandu&page=1&limit=20

import { createClient } from '@/lib/supabase/server';
import type {
    ListComplaintsResponse,
    ErrorResponse,
    ComplaintCategory,
    ComplaintStatus,
} from '@/lib/types/database';
import { parsePaginationParams, calculateOffset } from '@/lib/utils/validation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest
): Promise<NextResponse<ListComplaintsResponse | ErrorResponse>> {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);

        // Parse query parameters
        const category = searchParams.get('category') as ComplaintCategory | null;
        const district = searchParams.get('district');
        const status = searchParams.get('status') as ComplaintStatus | null;
        const sortBy = (searchParams.get('sort_by') || 'created_at') as
            | 'created_at'
            | 'updated_at';
        const sortOrder = (searchParams.get('sort_order') || 'desc') as
            | 'asc'
            | 'desc';

        const { page, limit } = parsePaginationParams(
            searchParams.get('page') ?? undefined,
            searchParams.get('limit') ?? undefined
        );

        // Build query
        let query = supabase
            .from('complaints')
            .select('*', { count: 'exact' })
            .eq('is_public', true);

        // Apply filters
        if (category) {
            query = query.eq('category', category);
        }

        if (district) {
            query = query.eq('location_district', district);
        }

        if (status) {
            query = query.eq('status', status);
        }

        // Apply sorting and pagination
        const offset = calculateOffset(page, limit);
        query = query
            .order(sortBy, { ascending: sortOrder === 'asc' })
            .range(offset, offset + limit - 1);

        // Execute query
        const { data: complaints, error, count } = await query;

        if (error) {
            console.error('Error fetching complaints:', error);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Database error',
                    message: 'Failed to fetch complaints',
                },
                { status: 500 }
            );
        }

        // Redact sensitive contact information for public listing
        const sanitizedComplaints = complaints.map((complaint) => ({
            ...complaint,
            contact_phone: null,
            contact_email: null,
        }));

        return NextResponse.json({
            success: true,
            complaints: sanitizedComplaints,
            total: count || 0,
            page,
            limit,
        });
    } catch (error) {
        console.error('Error in complaints listing:', error);
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

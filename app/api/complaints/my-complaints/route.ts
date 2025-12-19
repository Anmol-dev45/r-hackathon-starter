// API route for listing current user's complaints
// GET /api/complaints/my-complaints?page=1&limit=20

import { createClient } from '@/lib/supabase/server';
import type {
    ListComplaintsResponse,
    ErrorResponse,
    ComplaintStatus,
} from '@/lib/types/database';
import { parsePaginationParams, calculateOffset } from '@/lib/utils/validation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest
): Promise<NextResponse<ListComplaintsResponse | ErrorResponse>> {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Authentication required',
                    message: 'You must be logged in to view your complaints',
                },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);

        // Parse query parameters
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

        // Build query - filter by user_id for verified submissions
        let query = supabase
            .from('complaints')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id)
            .eq('submission_type', 'verified');

        // Apply status filter if provided
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
            console.error('Error fetching user complaints:', error);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Database error',
                    message: 'Failed to fetch your complaints',
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            complaints: complaints || [],
            total: count || 0,
            page,
            limit,
        });
    } catch (error) {
        console.error('Error in user complaints listing:', error);
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

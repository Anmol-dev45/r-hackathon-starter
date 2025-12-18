// API route for listing public projects
// GET /api/projects/list?district=Kathmandu&status=ongoing&page=1&limit=20

import { createClient } from '@/lib/supabase/server';
import type {
    ListPublicProjectsResponse,
    ErrorResponse,
} from '@/lib/types/database';
import { parsePaginationParams, calculateOffset } from '@/lib/utils/validation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest
): Promise<NextResponse<ListPublicProjectsResponse | ErrorResponse>> {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);

        // Parse query parameters
        const district = searchParams.get('district');
        const projectType = searchParams.get('project_type');
        const status = searchParams.get('status');

        const { page, limit } = parsePaginationParams(
            searchParams.get('page') ?? undefined,
            searchParams.get('limit') ?? undefined
        );

        // Build query
        let query = supabase
            .from('public_projects')
            .select('*', { count: 'exact' });

        // Apply filters
        if (district) {
            query = query.eq('district', district);
        }

        if (projectType) {
            query = query.eq('project_type', projectType);
        }

        if (status) {
            query = query.eq('status', status);
        }

        // Apply sorting and pagination
        const offset = calculateOffset(page, limit);
        query = query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        // Execute query
        const { data: projects, error, count } = await query;

        if (error) {
            console.error('Error fetching projects:', error);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Database error',
                    message: 'Failed to fetch public projects',
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            projects: projects || [],
            total: count || 0,
            page,
            limit,
        });
    } catch (error) {
        console.error('Error in projects listing:', error);
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

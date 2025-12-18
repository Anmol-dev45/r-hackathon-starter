// API route for getting complaint categories
// GET /api/categories

import { createClient } from '@/lib/supabase/server';
import type { GetCategoriesResponse, ErrorResponse } from '@/lib/types/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest
): Promise<NextResponse<GetCategoriesResponse | ErrorResponse>> {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const language = searchParams.get('language') || 'en';

        // Fetch active categories
        const { data: categories, error } = await supabase
            .from('complaint_categories')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Database error',
                    message: 'Failed to fetch categories',
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            categories: categories || [],
        });
    } catch (error) {
        console.error('Error in categories fetch:', error);
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

// API route for getting project details
// GET /api/projects/[id]

import { createClient } from '@/lib/supabase/server';
import type { ErrorResponse } from '@/lib/types/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<any | ErrorResponse>> {
    try {
        const supabase = await createClient();
        const { id } = await params;

        // Fetch project by ID
        const { data: project, error } = await supabase
            .from('public_projects')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !project) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Project not found',
                    message: 'No public project found with this ID',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            project,
        });
    } catch (error) {
        console.error('Error fetching project:', error);
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

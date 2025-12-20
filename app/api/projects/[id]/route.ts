// API route for getting project details
// GET /api/projects/[id]

import { NextRequest, NextResponse } from 'next/server';
import projectsData from '@/lib/data/projects.json';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Find project by ID
        const project = projectsData.find(p => p.id === id);

        if (!project) {
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

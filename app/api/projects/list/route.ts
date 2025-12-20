// API route for listing public projects
// GET /api/projects/list?district=Kathmandu&status=ongoing&page=1&limit=20

import { NextRequest, NextResponse } from 'next/server';
import projectsData from '@/lib/data/projects.json';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Parse query parameters
        const district = searchParams.get('district');
        const projectType = searchParams.get('project_type');
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Filter projects
        let filteredProjects = [...projectsData];

        if (district) {
            filteredProjects = filteredProjects.filter(p => p.district === district);
        }

        if (projectType) {
            filteredProjects = filteredProjects.filter(p => p.project_type === projectType);
        }

        if (status) {
            filteredProjects = filteredProjects.filter(p => p.status === status);
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

        return NextResponse.json({
            success: true,
            projects: paginatedProjects,
            total: filteredProjects.length,
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

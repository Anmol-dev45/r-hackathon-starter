// API route for getting platform statistics
// GET /api/stats

import { createClient } from '@/lib/supabase/server';
import type { ErrorResponse } from '@/lib/types/database';
import { NextRequest, NextResponse } from 'next/server';

interface StatsResponse {
    success: boolean;
    stats: {
        total_complaints: number;
        complaints_by_status: {
            submitted: number;
            under_review: number;
            forwarded: number;
            resolved: number;
            rejected: number;
            closed: number;
        };
        complaints_by_category: Array<{
            category: string;
            count: number;
        }>;
        complaints_by_district: Array<{
            district: string;
            count: number;
        }>;
        total_evidence_files: number;
        total_public_projects: number;
    };
}

export async function GET(
    request: NextRequest
): Promise<NextResponse<StatsResponse | ErrorResponse>> {
    try {
        const supabase = await createClient();

        // Get total complaints count
        const { count: totalComplaints } = await supabase
            .from('complaints')
            .select('*', { count: 'exact', head: true })
            .eq('is_public', true);

        // Get complaints by status
        const statusPromises = [
            'submitted',
            'under_review',
            'forwarded',
            'resolved',
            'rejected',
            'closed',
        ].map(async (status) => {
            const { count } = await supabase
                .from('complaints')
                .select('*', { count: 'exact', head: true })
                .eq('status', status)
                .eq('is_public', true);
            return { status, count: count || 0 };
        });

        const statusCounts = await Promise.all(statusPromises);
        const complaintsByStatus = statusCounts.reduce(
            (acc, { status, count }) => {
                acc[status as keyof typeof acc] = count;
                return acc;
            },
            {
                submitted: 0,
                under_review: 0,
                forwarded: 0,
                resolved: 0,
                rejected: 0,
                closed: 0,
            }
        );

        // Get complaints by category
        const { data: categoryData } = await supabase
            .from('complaints')
            .select('category')
            .eq('is_public', true);

        const complaintsByCategory = categoryData
            ? Object.entries(
                categoryData.reduce(
                    (acc, { category }) => {
                        acc[category] = (acc[category] || 0) + 1;
                        return acc;
                    },
                    {} as Record<string, number>
                )
            )
                .map(([category, count]) => ({ category, count }))
                .sort((a, b) => b.count - a.count)
            : [];

        // Get complaints by district (top 10)
        const { data: districtData } = await supabase
            .from('complaints')
            .select('location_district')
            .eq('is_public', true)
            .not('location_district', 'is', null);

        const complaintsByDistrict = districtData
            ? Object.entries(
                districtData.reduce(
                    (acc, { location_district }) => {
                        acc[location_district] = (acc[location_district] || 0) + 1;
                        return acc;
                    },
                    {} as Record<string, number>
                )
            )
                .map(([district, count]) => ({ district, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
            : [];

        // Get total evidence files
        const { count: totalEvidence } = await supabase
            .from('evidence_files')
            .select('*', { count: 'exact', head: true });

        // Get total public projects
        const { count: totalProjects } = await supabase
            .from('public_projects')
            .select('*', { count: 'exact', head: true });

        return NextResponse.json({
            success: true,
            stats: {
                total_complaints: totalComplaints || 0,
                complaints_by_status: complaintsByStatus,
                complaints_by_category: complaintsByCategory,
                complaints_by_district: complaintsByDistrict,
                total_evidence_files: totalEvidence || 0,
                total_public_projects: totalProjects || 0,
            },
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Server error',
                message: 'Failed to fetch statistics',
            },
            { status: 500 }
        );
    }
}

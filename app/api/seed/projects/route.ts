// API route for seeding sample public projects
// POST /api/seed/projects

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const sampleProjects = [
    {
        project_name: 'Kathmandu Ring Road Expansion',
        project_type: 'Infrastructure',
        description: 'Major infrastructure project to expand the ring road around Kathmandu Valley. The project includes widening existing roads, building new flyovers, and improving traffic management systems. Expected to reduce traffic congestion by 40%.',
        province: 'Bagmati Province',
        district: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan City',
        budget_allocated: 1200000000,
        budget_spent: 1200000000,
        budget_currency: 'NPR',
        start_date: '2019-01-15',
        expected_completion_date: '2022-12-31',
        actual_completion_date: '2022-11-20',
        status: 'completed',
        progress_percentage: 100,
        is_verified: true,
    },
    {
        project_name: 'Smart Drinking Water Supply System - Pokhara',
        project_type: 'Water Supply',
        description: 'Installation of smart water meters and automated distribution system in Pokhara Metropolitan City. The project aims to ensure 24/7 water supply to all households and reduce water wastage through leak detection technology.',
        province: 'Gandaki Province',
        district: 'Kaski',
        municipality: 'Pokhara Metropolitan City',
        budget_allocated: 850000000,
        budget_spent: 520000000,
        budget_currency: 'NPR',
        start_date: '2023-03-01',
        expected_completion_date: '2025-12-31',
        status: 'ongoing',
        progress_percentage: 65,
        is_verified: true,
    },
    {
        project_name: 'Green City Initiative - Biratnagar',
        project_type: 'Environment',
        description: 'Comprehensive environmental project including tree plantation, waste management system, and creation of green spaces. Target of planting 50,000 trees and establishing 10 community parks across the city.',
        province: 'Province 1',
        district: 'Morang',
        municipality: 'Biratnagar Metropolitan City',
        budget_allocated: 450000000,
        budget_spent: 180000000,
        budget_currency: 'NPR',
        start_date: '2024-06-01',
        expected_completion_date: '2026-05-31',
        status: 'ongoing',
        progress_percentage: 35,
        is_verified: true,
    },
    {
        project_name: 'Digital Education Platform Rollout',
        project_type: 'Education',
        description: 'Implementation of digital learning platform in 500 government schools across 15 districts. Includes provision of tablets to students, teacher training, and high-speed internet connectivity.',
        province: 'Bagmati Province',
        district: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan City',
        budget_allocated: 2500000000,
        budget_spent: 750000000,
        budget_currency: 'NPR',
        start_date: '2024-04-01',
        expected_completion_date: '2026-03-31',
        status: 'ongoing',
        progress_percentage: 30,
        is_verified: true,
    },
    {
        project_name: 'Community Healthcare Centers Upgrade',
        project_type: 'Healthcare',
        description: 'Upgrading 25 community healthcare centers with modern medical equipment, additional staff, and telemedicine facilities. Focus on improving maternal and child health services in rural areas.',
        province: 'Lumbini Province',
        district: 'Rupandehi',
        municipality: 'Butwal Sub-Metropolitan City',
        budget_allocated: 680000000,
        budget_spent: 0,
        budget_currency: 'NPR',
        start_date: '2025-01-15',
        expected_completion_date: '2026-12-31',
        status: 'planned',
        progress_percentage: 5,
        is_verified: true,
    },
    {
        project_name: 'Solar Power Grid - Rural Electrification',
        project_type: 'Energy',
        description: 'Installation of solar power systems in 100 remote villages currently without electricity access. Each village will get a community solar grid with battery backup systems.',
        province: 'Karnali Province',
        district: 'Surkhet',
        municipality: 'Birendranagar',
        budget_allocated: 1500000000,
        budget_spent: 450000000,
        budget_currency: 'NPR',
        start_date: '2023-09-01',
        expected_completion_date: '2025-08-31',
        status: 'ongoing',
        progress_percentage: 45,
        is_verified: true,
    },
    {
        project_name: 'Agricultural Technology Center',
        project_type: 'Agriculture',
        description: 'Establishment of modern agricultural technology centers to train farmers in advanced farming techniques, provide soil testing facilities, and demonstrate use of modern equipment.',
        province: 'Sudurpashchim Province',
        district: 'Kailali',
        municipality: 'Dhangadhi Sub-Metropolitan City',
        budget_allocated: 320000000,
        budget_spent: 96000000,
        budget_currency: 'NPR',
        start_date: '2024-02-01',
        expected_completion_date: '2025-01-31',
        status: 'ongoing',
        progress_percentage: 55,
        is_verified: true,
    },
    {
        project_name: 'Tourism Infrastructure Development',
        project_type: 'Tourism',
        description: 'Development of tourist facilities including visitor centers, hiking trails, and accommodation facilities in major tourist destinations. Aims to promote sustainable tourism.',
        province: 'Gandaki Province',
        district: 'Mustang',
        municipality: 'Gharapjhong',
        budget_allocated: 950000000,
        budget_spent: 0,
        budget_currency: 'NPR',
        start_date: '2025-03-01',
        expected_completion_date: '2027-02-28',
        status: 'planned',
        progress_percentage: 0,
        is_verified: true,
    },
];

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Authentication required',
                    message: 'You must be logged in to seed projects',
                },
                { status: 401 }
            );
        }

        // Delete existing projects first
        const { error: deleteError } = await supabase
            .from('public_projects')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (deleteError) {
            console.error('Error deleting existing projects:', deleteError);
        }

        const results = [];
        const errors = [];

        console.log('Starting to insert projects. Total:', sampleProjects.length);

        for (const project of sampleProjects) {
            console.log('Attempting to insert:', project.project_name);
            const { data, error } = await supabase
                .from('public_projects')
                .insert(project)
                .select('id, project_name, status, progress_percentage')
                .single();

            if (error) {
                console.error('Insert error for project:', project.project_name, error);
                errors.push({ name: project.project_name, error: error.message, code: error.code });
            } else {
                console.log('Successfully inserted:', project.project_name);
                results.push(data);
            }
        }

        console.log('Insertion complete. Success:', results.length, 'Failed:', errors.length);

        return NextResponse.json({
            success: errors.length === 0,
            message: `Successfully created ${results.length} projects${errors.length > 0 ? `, ${errors.length} failed` : ''}`,
            projects: results,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error('Error seeding projects:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to seed projects',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

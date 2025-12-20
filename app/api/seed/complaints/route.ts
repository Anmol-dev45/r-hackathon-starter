// API route for seeding sample complaints
// POST /api/seed/complaints

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const sampleComplaints = [
    {
        submission_type: 'verified',
        title: 'Poor Road Conditions on Tribhuvan Highway',
        description: 'The road section between Naubise and Mugling has severe potholes and cracks. Multiple accidents have occurred due to poor road maintenance. The highway is a critical route connecting Kathmandu to other districts, and immediate repair work is urgently needed.',
        category: 'infrastructure',
        location_province: 'Bagmati Province',
        location_district: 'Dhading',
        location_municipality: 'Dhading Besi',
        location_ward: '3',
        status: 'under_review',
        priority: 3,
        is_public: true,
        contact_email: 'citizen@example.com',
    },
    {
        submission_type: 'pseudonymous',
        pseudonym: 'ConcernedCitizen',
        title: 'Irregular Drinking Water Supply in Local Area',
        description: 'Our ward has been experiencing irregular water supply for the past 3 months. Water is only available for 2-3 hours every alternate day. Despite multiple complaints to the local water supply office, no action has been taken. Residents are forced to buy water from tankers at high prices.',
        category: 'service_delivery',
        location_province: 'Gandaki Province',
        location_district: 'Kaski',
        location_municipality: 'Pokhara Metropolitan City',
        location_ward: '8',
        status: 'forwarded',
        priority: 2,
        is_public: true,
        contact_phone: '9841234567',
    },
    {
        submission_type: 'anonymous',
        title: 'Corruption in Land Registration Office',
        description: 'Officials at the Land Revenue Office are demanding bribes (रिश्वत) for processing land registration papers. They quoted NPR 50,000 for a service that should be free. They refuse to process applications without "extra fees". This is causing significant hardship to common citizens trying to register their property.',
        category: 'corruption',
        location_province: 'Province 1',
        location_district: 'Morang',
        location_municipality: 'Biratnagar Metropolitan City',
        location_ward: '5',
        status: 'submitted',
        priority: 4,
        is_public: true,
    },
    {
        submission_type: 'verified',
        title: 'School Infrastructure in Poor Condition',
        description: 'The local community school building is in a dangerous condition. The roof leaks during monsoon, walls have cracks, and there are no proper toilets. Despite being allocated budget for repairs two years ago, no work has been done. Students are studying in unsafe conditions.',
        category: 'education',
        location_province: 'Lumbini Province',
        location_district: 'Rupandehi',
        location_municipality: 'Butwal Sub-Metropolitan City',
        location_ward: '12',
        status: 'resolved',
        priority: 3,
        is_public: true,
        contact_email: 'parent@example.com',
        contact_phone: '9856781234',
    },
    {
        submission_type: 'pseudonymous',
        pseudonym: 'HealthcareWorker',
        title: 'Medicine Shortage at Community Health Post',
        description: 'Our local health post has been facing severe shortage of essential medicines for the last 2 months. Basic medicines like paracetamol, antibiotics, and ORS are not available. Patients are sent back without treatment. The budget was allocated but medicines have not been procured.',
        category: 'health_services',
        location_province: 'Karnali Province',
        location_district: 'Surkhet',
        location_municipality: 'Birendranagar',
        location_ward: '6',
        status: 'under_review',
        priority: 4,
        is_public: true,
    },
    {
        submission_type: 'verified',
        title: 'Illegal Construction Blocking Public Road',
        description: 'A private building construction has blocked 60% of the public road in our area. Heavy construction vehicles are using the remaining narrow passage, making it dangerous for pedestrians and two-wheelers. Multiple complaints to the municipality have been ignored. Local residents are facing daily difficulties.',
        category: 'public_project',
        location_province: 'Bagmati Province',
        location_district: 'Lalitpur',
        location_municipality: 'Lalitpur Metropolitan City',
        location_ward: '15',
        status: 'forwarded',
        priority: 2,
        is_public: true,
        contact_email: 'resident@example.com',
        contact_phone: '9812345678',
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
                    message: 'You must be logged in to seed complaints',
                },
                { status: 401 }
            );
        }

        const results = [];
        const errors = [];

        for (const complaint of sampleComplaints) {
            // Prepare complaint data
            const complaintData = {
                ...complaint,
                user_id: complaint.submission_type === 'verified' ? user.id : null,
                language: 'ne',
            };

            // Insert complaint
            const { data, error } = await supabase
                .from('complaints')
                .insert(complaintData)
                .select('id, tracking_id, title, status')
                .single();

            if (error) {
                errors.push({ title: complaint.title, error: error.message });
            } else {
                results.push(data);

                // Add status history entry for non-submitted status
                if (complaint.status !== 'submitted') {
                    await supabase
                        .from('complaint_status_history')
                        .insert({
                            complaint_id: data.id,
                            old_status: null,
                            new_status: complaint.status,
                            notes: 'Sample data - status set during seed',
                        });
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully created ${results.length} complaints`,
            complaints: results,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error('Error seeding complaints:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to seed complaints',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

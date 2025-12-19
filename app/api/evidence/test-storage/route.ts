// Test endpoint to verify storage bucket exists and is accessible
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = await createClient();

        // Test 1: List buckets
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

        if (bucketsError) {
            return NextResponse.json({
                success: false,
                test: 'list_buckets',
                error: bucketsError.message,
                details: bucketsError,
            }, { status: 500 });
        }

        // Test 2: Check if evidence bucket exists
        const evidenceBucket = buckets?.find(b => b.id === 'evidence' || b.name === 'evidence');

        if (!evidenceBucket) {
            return NextResponse.json({
                success: false,
                test: 'find_evidence_bucket',
                message: 'Evidence bucket not found',
                availableBuckets: buckets?.map(b => ({ id: b.id, name: b.name, public: b.public })),
                instructions: 'Run the SQL script at supabase/setup-storage.sql in your Supabase SQL Editor',
            }, { status: 404 });
        }

        // Test 3: Try to list files in evidence bucket
        const { data: files, error: listError } = await supabase.storage
            .from('evidence')
            .list('', { limit: 1 });

        if (listError) {
            return NextResponse.json({
                success: false,
                test: 'list_files',
                bucketExists: true,
                error: listError.message,
                details: listError,
                hint: 'The bucket exists but there may be a permissions issue. Check your RLS policies.',
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Storage bucket is properly configured',
            bucketInfo: {
                id: evidenceBucket.id,
                name: evidenceBucket.name,
                public: evidenceBucket.public,
            },
            filesCount: files?.length || 0,
        });

    } catch (error: any) {
        console.error('Storage test error:', error);
        return NextResponse.json({
            success: false,
            test: 'general_error',
            error: error.message,
            stack: error.stack,
        }, { status: 500 });
    }
}

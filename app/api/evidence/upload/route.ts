// API route for uploading evidence files
// POST /api/evidence/upload

import { createClient } from '@/lib/supabase/server';
import type {
    EvidenceFileInsert,
    UploadEvidenceResponse,
    ErrorResponse,
} from '@/lib/types/database';
import {
    validateFileSize,
    validateFileType,
    generateStoragePath,
} from '@/lib/utils/validation';
import { NextRequest, NextResponse } from 'next/server';

const EVIDENCE_BUCKET = 'evidence';

export async function POST(
    request: NextRequest
): Promise<NextResponse<UploadEvidenceResponse | ErrorResponse>> {
    try {
        const supabase = await createClient();
        const formData = await request.formData();

        const file = formData.get('file') as File | null;
        const complaintId = formData.get('complaint_id') as string | null;
        const trackingId = formData.get('tracking_id') as string | null;
        const caption = formData.get('caption') as string | null;
        const isPublic = formData.get('is_public') !== 'false'; // Default true

        // Validate required fields
        if (!file) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'File required',
                    message: 'Please provide a file to upload',
                },
                { status: 400 }
            );
        }

        if (!complaintId && !trackingId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Complaint identifier required',
                    message: 'Please provide either complaint_id or tracking_id',
                },
                { status: 400 }
            );
        }

        // Validate file size
        const sizeValidation = validateFileSize(file.size);
        if (!sizeValidation.valid) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'File size error',
                    message: sizeValidation.error!,
                },
                { status: 400 }
            );
        }

        // Validate file type
        const typeValidation = validateFileType(file.type);
        if (!typeValidation.valid) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'File type error',
                    message: typeValidation.error!,
                },
                { status: 400 }
            );
        }

        // Resolve complaint ID from tracking ID if needed
        let resolvedComplaintId = complaintId;
        if (!resolvedComplaintId && trackingId) {
            const { data: complaint, error: complaintError } = await supabase
                .from('complaints')
                .select('id')
                .eq('tracking_id', trackingId.toUpperCase())
                .single();

            if (complaintError || !complaint) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Complaint not found',
                        message: 'No complaint found with the provided tracking ID',
                    },
                    { status: 404 }
                );
            }

            resolvedComplaintId = complaint.id;
        }

        // Verify complaint exists
        const { data: complaint, error: verifyError } = await supabase
            .from('complaints')
            .select('id, tracking_id')
            .eq('id', resolvedComplaintId!)
            .single();

        if (verifyError || !complaint) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Complaint not found',
                    message: 'No complaint found with the provided ID',
                },
                { status: 404 }
            );
        }

        // Generate storage path
        const storagePath = generateStoragePath(complaint.id, file.name);

        // Upload file to Supabase Storage
        const fileBuffer = await file.arrayBuffer();
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(EVIDENCE_BUCKET)
            .upload(storagePath, fileBuffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Upload error',
                    message: 'Failed to upload file. Please try again.',
                },
                { status: 500 }
            );
        }

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from(EVIDENCE_BUCKET).getPublicUrl(storagePath);

        // Insert evidence record
        const evidenceData: EvidenceFileInsert = {
            complaint_id: complaint.id,
            file_name: file.name,
            file_type: typeValidation.evidenceType!,
            file_size: file.size,
            mime_type: file.type,
            storage_path: storagePath,
            storage_bucket: EVIDENCE_BUCKET,
            caption: caption || null,
            is_public: isPublic,
        };

        const { data: evidence, error: insertError } = await supabase
            .from('evidence_files')
            .insert(evidenceData)
            .select('id')
            .single();

        if (insertError) {
            console.error('Error inserting evidence record:', insertError);
            // Try to clean up uploaded file
            await supabase.storage.from(EVIDENCE_BUCKET).remove([storagePath]);

            return NextResponse.json(
                {
                    success: false,
                    error: 'Database error',
                    message: 'Failed to save evidence record. Please try again.',
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                evidence_id: evidence.id,
                file_url: publicUrl,
                message: 'Evidence file uploaded successfully',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error in evidence upload:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Server error',
                message: 'An unexpected error occurred. Please try again later.',
            },
            { status: 500 }
        );
    }
}

// GET endpoint to retrieve evidence for a complaint
export async function GET(
    request: NextRequest
): Promise<NextResponse<{ success: boolean; evidence: any[] } | ErrorResponse>> {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const complaintId = searchParams.get('complaint_id');
        const trackingId = searchParams.get('tracking_id');

        if (!complaintId && !trackingId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing parameter',
                    message: 'Please provide either complaint_id or tracking_id',
                },
                { status: 400 }
            );
        }

        // Resolve complaint ID from tracking ID if needed
        let resolvedComplaintId = complaintId;
        if (!resolvedComplaintId && trackingId) {
            const { data: complaint } = await supabase
                .from('complaints')
                .select('id')
                .eq('tracking_id', trackingId.toUpperCase())
                .single();

            if (!complaint) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Complaint not found',
                        message: 'No complaint found with the provided tracking ID',
                    },
                    { status: 404 }
                );
            }

            resolvedComplaintId = complaint.id;
        }

        // Fetch evidence files
        const { data: evidence, error } = await supabase
            .from('evidence_files')
            .select('*')
            .eq('complaint_id', resolvedComplaintId!)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching evidence:', error);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Database error',
                    message: 'Failed to fetch evidence files',
                },
                { status: 500 }
            );
        }

        // Generate public URLs for each evidence file
        const evidenceWithUrls = evidence.map((item) => {
            const {
                data: { publicUrl },
            } = supabase.storage
                .from(item.storage_bucket)
                .getPublicUrl(item.storage_path);

            return {
                ...item,
                file_url: publicUrl,
            };
        });

        return NextResponse.json({
            success: true,
            evidence: evidenceWithUrls,
        });
    } catch (error) {
        console.error('Error in evidence fetch:', error);
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

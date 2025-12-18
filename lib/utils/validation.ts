// Utility functions for GunaasoNepal platform

import type {
    ComplaintCategory,
    EvidenceType,
    SubmissionType,
} from '@/lib/types/database';

// File validation constants
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
];
export const ALLOWED_AUDIO_TYPES = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/m4a',
];
export const ALLOWED_VIDEO_TYPES = [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/webm',
];
export const ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
];

// Validate file size
export function validateFileSize(fileSize: number): {
    valid: boolean;
    error?: string;
} {
    if (fileSize > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        };
    }
    return { valid: true };
}

// Validate file type and return evidence type
export function validateFileType(mimeType: string): {
    valid: boolean;
    evidenceType?: EvidenceType;
    error?: string;
} {
    if (ALLOWED_IMAGE_TYPES.includes(mimeType)) {
        return { valid: true, evidenceType: 'image' };
    }
    if (ALLOWED_AUDIO_TYPES.includes(mimeType)) {
        return { valid: true, evidenceType: 'audio' };
    }
    if (ALLOWED_VIDEO_TYPES.includes(mimeType)) {
        return { valid: true, evidenceType: 'video' };
    }
    if (ALLOWED_DOCUMENT_TYPES.includes(mimeType)) {
        return { valid: true, evidenceType: 'document' };
    }
    return {
        valid: false,
        error: `File type ${mimeType} is not allowed`,
    };
}

// Sanitize file name
export function sanitizeFileName(fileName: string): string {
    // Remove special characters and spaces
    const name = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    // Limit length
    if (name.length > 200) {
        const ext = name.split('.').pop();
        const baseName = name.substring(0, 195);
        return `${baseName}.${ext}`;
    }
    return name;
}

// Generate storage path for evidence files
export function generateStoragePath(
    complaintId: string,
    fileName: string
): string {
    const timestamp = Date.now();
    const sanitized = sanitizeFileName(fileName);
    return `${complaintId}/${timestamp}-${sanitized}`;
}

// Validate complaint submission
export function validateComplaintSubmission(data: {
    submission_type: SubmissionType;
    pseudonym?: string;
    title: string;
    description: string;
    category: ComplaintCategory;
}): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate title
    if (!data.title || data.title.trim().length < 10) {
        errors.push('Title must be at least 10 characters long');
    }
    if (data.title && data.title.length > 200) {
        errors.push('Title must not exceed 200 characters');
    }

    // Validate description
    if (!data.description || data.description.trim().length < 50) {
        errors.push('Description must be at least 50 characters long');
    }
    if (data.description && data.description.length > 5000) {
        errors.push('Description must not exceed 5000 characters');
    }

    // Validate category
    const validCategories: ComplaintCategory[] = [
        'service_delivery',
        'corruption',
        'rti_request',
        'public_project',
        'police_misconduct',
        'health_services',
        'education',
        'infrastructure',
        'land_administration',
        'other',
    ];
    if (!validCategories.includes(data.category)) {
        errors.push('Invalid complaint category');
    }

    // Validate pseudonym for pseudonymous submissions
    if (data.submission_type === 'pseudonymous') {
        if (!data.pseudonym || data.pseudonym.trim().length < 3) {
            errors.push('Pseudonym must be at least 3 characters long');
        }
        if (data.pseudonym && data.pseudonym.length > 100) {
            errors.push('Pseudonym must not exceed 100 characters');
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

// Validate email format
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone number (Nepal format)
export function validateNepalPhone(phone: string): boolean {
    // Nepal phone numbers: 10 digits starting with 9
    const phoneRegex = /^9\d{9}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

// Format tracking ID for display
export function formatTrackingId(trackingId: string): string {
    // Format: GN-YYYY-XXXXXX
    return trackingId.toUpperCase();
}

// Parse tracking ID from user input
export function parseTrackingId(input: string): string {
    // Remove spaces and convert to uppercase
    return input.replace(/\s/g, '').toUpperCase();
}

// Calculate days since submission
export function daysSinceSubmission(createdAt: string): number {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Format date for Nepal timezone (NPT)
export function formatDateNPT(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-NP', {
        timeZone: 'Asia/Kathmandu',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// Redact sensitive information
export function redactSensitiveInfo(text: string): string {
    // Redact phone numbers
    let redacted = text.replace(/9\d{9}/g, '9XXXXXXXX');
    // Redact emails
    redacted = redacted.replace(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        '[EMAIL_REDACTED]'
    );
    // Redact citizenship numbers (typical Nepal format)
    redacted = redacted.replace(/\d{2}-\d{2}-\d{2}-\d{5}/g, 'XX-XX-XX-XXXXX');
    return redacted;
}

// Check if user is authenticated
export function isAuthenticated(userId: string | null | undefined): boolean {
    return userId !== null && userId !== undefined;
}

// Generate anonymous identifier
export function generateAnonymousId(): string {
    return `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Pagination helper
export interface PaginationParams {
    page: number;
    limit: number;
}

export function parsePaginationParams(
    page?: string | number,
    limit?: string | number
): PaginationParams {
    const parsedPage = Number(page) || 1;
    const parsedLimit = Math.min(Number(limit) || 20, 100); // Max 100 per page

    return {
        page: Math.max(parsedPage, 1),
        limit: Math.max(parsedLimit, 1),
    };
}

export function calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
}

// Error formatting
export function formatError(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unknown error occurred';
}

// Generate complaint summary for SEO/sharing
export function generateComplaintSummary(
    title: string,
    description: string,
    maxLength: number = 160
): string {
    const summary = `${title} - ${description}`;
    if (summary.length <= maxLength) {
        return summary;
    }
    return summary.substring(0, maxLength - 3) + '...';
}

'use client';

// Track Complaint Page
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { LoadingInline, LoadingPage } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { Alert } from '@/components/ui/alert';
import type { TrackComplaintResponse } from '@/lib/types/database';
import { formatDateNPT } from '@/lib/utils/validation';

export default function TrackComplaintPage() {
    const searchParams = useSearchParams();
    const [trackingId, setTrackingId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<TrackComplaintResponse | null>(null);


    useEffect(() => {
        setError('');
        setTrackingId('');
    }, []);

    // Auto-load tracking details if trackingId is present in URL
    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            setTrackingId(id.toUpperCase());
            // Simulate form submit to auto-load details
            (async () => {
                setLoading(true);
                setError('');
                setResult(null);
                try {
                    const response = await fetch(`/api/complaints/track?tracking_id=${id.toUpperCase()}`);
                    const data = await response.json();
                    if (!response.ok) {
                        setError(data.message || 'Complaint not found');
                        return;
                    }
                    setResult(data);
                } catch (err) {
                    setError('Failed to track complaint. Please try again.');
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [searchParams]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingId.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch(
                `/api/complaints/track?tracking_id=${trackingId.toUpperCase()}`
            );
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Complaint not found');
                return;
            }

            setResult(data);
            console.log(result?.evidence_files)
        } catch (err) {
            setError('Failed to track complaint. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background px-4 py-6 sm:py-8 md:py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-6 sm:mb-8 text-center">
                    <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-foreground">
                        Track Your Complaint
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Enter your tracking ID to view complaint status
                    </p>
                </div>

                {/* Search Form */}
                <Card className="mb-6 sm:mb-8 p-4 sm:p-6">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div>
                            <label htmlFor="tracking-id" className="mb-2 block text-sm sm:text-base font-medium">
                                Tracking ID
                            </label>
                            <Input
                                id="tracking-id"
                                type="text"
                                placeholder="GN-2025-XXXXXX"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                                className="font-mono"
                                disabled={loading}
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                                Format: GN-YYYY-XXXXXX (e.g., GN-2025-A3B7F1)
                            </p>
                        </div>
                        <Button type="submit" className="w-full h-11 sm:h-12 text-base sm:text-lg touch-manipulation" disabled={loading}>
                            {loading ? <LoadingInline message="Searching..." /> : '🔍 Track Complaint'}
                        </Button>
                    </form>
                </Card>

                {/* Error Message */}
                {error && (
                    <Alert variant="error" className="mb-8">
                        {error}
                    </Alert>
                )}

                {/* Results */}
                {result && (
                    <>
                        <div className="space-y-4 sm:space-y-6">
                            {/* Complaint Details */}
                            <Card className="p-4 sm:p-6">
                                <div className="mb-4 flex flex-col sm:flex-row items-start sm:justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg sm:text-xl font-semibold break-words">{result.complaint.title}</h2>
                                        <p className="text-xs sm:text-sm text-muted-foreground break-all">
                                            Tracking ID: {result.complaint.tracking_id}
                                        </p>
                                    </div>
                                    <StatusBadge status={result.complaint.status} />
                                </div>

                                <div className="space-y-3 border-t pt-4 text-sm">
                                    <div>
                                        <span className="font-medium">Category:</span>{' '}
                                        <span className="text-muted-foreground">
                                            {result.complaint.category.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Submitted:</span>{' '}
                                        <span className="text-muted-foreground">
                                            {formatDateNPT(result.complaint.created_at)}
                                        </span>
                                    </div>
                                    {result.complaint.location_district && (
                                        <div>
                                            <span className="font-medium">Location:</span>{' '}
                                            <span className="text-muted-foreground">
                                                {result.complaint.location_district}
                                                {result.complaint.location_municipality &&
                                                    `, ${result.complaint.location_municipality}`}
                                            </span>
                                        </div>
                                    )}
                                    <div className="pt-2">
                                        <p className="font-medium">Description:</p>
                                        <p className="mt-1 text-muted-foreground">
                                            {result.complaint.description}
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            {/* Status Timeline */}
                            {result.status_history && result.status_history.length > 0 && (
                                <Card className="p-4 sm:p-6">
                                    <h3 className="mb-4 text-base sm:text-lg font-semibold">Status History</h3>
                                    <div className="space-y-4">
                                        {result.status_history.map((history, index) => (
                                            <div key={history.id} className="flex gap-3 sm:gap-4">
                                                <div className="flex flex-col items-center flex-shrink-0">
                                                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                                        {result.status_history.length - index}
                                                    </div>
                                                    {index < result.status_history.length - 1 && (
                                                        <div className="h-full w-0.5 bg-border"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <StatusBadge status={history.new_status} />
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {formatDateNPT(history.created_at)}
                                                    </p>
                                                    {history.notes && (
                                                        <p className="mt-2 text-sm text-muted-foreground">
                                                            {history.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* Evidence Files */}
                            {result.evidence_files && result.evidence_files.length > 0 && (
                                <Card className="p-4 sm:p-6">
                                    <h3 className="mb-4 text-base sm:text-lg font-semibold">Evidence Files</h3>
                                    <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                                        {result.evidence_files.map((file) => (
                                            <a
                                                key={file.id}
                                                href={file.storage_path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
                                            >
                                                <div className="text-2xl">
                                                    {file.file_type === 'image' && '🖼️'}
                                                    {file.file_type === 'document' && '📄'}
                                                    {file.file_type === 'audio' && '🎵'}
                                                    {file.file_type === 'video' && '🎥'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="truncate text-sm font-medium group-hover:text-primary">
                                                        {file.file_name}
                                                    </p>
                                                    {file.caption && (
                                                        <p className="truncate text-xs text-muted-foreground">
                                                            {file.caption}
                                                        </p>
                                                    )}
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </div>
                        <div className="mt-6 sm:mt-8 flex justify-center px-4">
                            <a href="/complaint" className="w-full sm:w-auto">
                                <Button className="rounded-xl bg-[#1f3a8a] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white hover:bg-[#1e40af] active:bg-[#1e3a8a] transition-all w-full sm:w-64 touch-manipulation">
                                    File Another Complaint
                                </Button>
                            </a>
                        </div>
                    </>
                )}

                {/* Help Text */}
                {!result && !loading && (
                    <div className="mt-8 text-center text-sm text-muted-foreground">
                        <p>Don't have a tracking ID?</p>
                        <a href="/complaint" className="text-primary hover:underline">
                            Submit a new complaint
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

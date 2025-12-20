'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

export default function SeedDataPage() {
    const [loading, setLoading] = useState(false);
    const [complaintsResult, setComplaintsResult] = useState<any>(null);
    const [projectsResult, setProjectsResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const seedComplaints = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/seed/complaints', {
                method: 'POST',
            });
            const data = await response.json();

            if (data.success) {
                setComplaintsResult(data);
            } else {
                setError(data.message || 'Failed to seed complaints');
            }
        } catch (err) {
            setError('Failed to seed complaints');
        } finally {
            setLoading(false);
        }
    };

    const seedProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/seed/projects', {
                method: 'POST',
            });
            const data = await response.json();

            if (data.success) {
                setProjectsResult(data);
            } else {
                setError(data.message || 'Failed to seed projects');
            }
        } catch (err) {
            setError('Failed to seed projects');
        } finally {
            setLoading(false);
        }
    };

    const seedAll = async () => {
        await seedComplaints();
        await seedProjects();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Seed Sample Data</h1>

                {error && (
                    <Alert variant="error" className="mb-6">
                        {error}
                    </Alert>
                )}

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Sample Complaints
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Create 6 sample complaints with different statuses
                        </p>
                        <Button
                            onClick={seedComplaints}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Creating...' : 'Seed Complaints'}
                        </Button>

                        {complaintsResult && (
                            <div className="mt-4 p-4 bg-green-50 rounded-lg">
                                <p className="text-sm font-medium text-green-900">
                                    ✓ {complaintsResult.message}
                                </p>
                                {complaintsResult.complaints && (
                                    <ul className="mt-2 text-xs text-green-700 space-y-1">
                                        {complaintsResult.complaints.map((c: any) => (
                                            <li key={c.id}>
                                                {c.tracking_id} - {c.title}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Public Projects
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Create 8 sample government projects
                        </p>
                        <Button
                            onClick={seedProjects}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Creating...' : 'Seed Projects'}
                        </Button>

                        {projectsResult && (
                            <div className={`mt-4 p-4 rounded-lg ${projectsResult.errors ? 'bg-yellow-50' : 'bg-green-50'}`}>
                                <p className={`text-sm font-medium ${projectsResult.errors ? 'text-yellow-900' : 'text-green-900'}`}>
                                    {projectsResult.errors ? '⚠️' : '✓'} {projectsResult.message}
                                </p>
                                {projectsResult.projects && projectsResult.projects.length > 0 && (
                                    <ul className="mt-2 text-xs text-green-700 space-y-1">
                                        {projectsResult.projects.map((p: any) => (
                                            <li key={p.id}>
                                                {p.project_name} - {p.status}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {projectsResult.errors && (
                                    <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                                        <p className="text-xs font-semibold text-red-900 mb-1">Errors:</p>
                                        <ul className="text-xs text-red-700 space-y-1">
                                            {projectsResult.errors.map((e: any, i: number) => (
                                                <li key={i}>
                                                    <strong>{e.name}:</strong> {e.error} {e.code && `(${e.code})`}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                </div>

                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Seed All Data
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Create both complaints and projects at once
                    </p>
                    <Button
                        onClick={seedAll}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? 'Creating All Data...' : 'Seed All Data'}
                    </Button>
                </Card>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">
                        📝 Note:
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• You must be logged in to seed data</li>
                        <li>• Complaints will be created with various statuses: submitted, under_review, forwarded, resolved</li>
                        <li>• Projects will include completed, ongoing, and planned statuses</li>
                        <li>• You can view the seeded data in your dashboard</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

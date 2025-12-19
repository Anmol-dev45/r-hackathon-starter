"use client";

import { Clock, CheckCircle, AlertCircle, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

interface Activity {
    id: string;
    type: "status_change" | "new_complaint" | "comment" | "forwarded";
    title: string;
    description: string;
    timestamp: string;
    complaint_id?: string;
    tracking_id?: string;
}

interface ActivityTimelineProps {
    activities: Activity[];
    loading?: boolean;
}

const activityIcons = {
    status_change: CheckCircle,
    new_complaint: FileText,
    comment: AlertCircle,
    forwarded: ArrowRight,
};

const activityColors = {
    status_change: "text-green-600 bg-green-100",
    new_complaint: "text-blue-600 bg-blue-100",
    comment: "text-purple-600 bg-purple-100",
    forwarded: "text-yellow-600 bg-yellow-100",
};

export function ActivityTimeline({ activities, loading = false }: ActivityTimelineProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-gray-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No recent activity</p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {activities.map((activity, index) => {
                const Icon = activityIcons[activity.type];
                const colorClass = activityColors[activity.type];

                return (
                    <div
                        key={activity.id}
                        className="group flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full ${colorClass} flex items-center justify-center`}>
                            <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {activity.title}
                                </p>
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {formatTimeAgo(activity.timestamp)}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                                {activity.description}
                            </p>

                            {activity.tracking_id && (
                                <Link
                                    href={`/track?id=${activity.tracking_id}`}
                                    className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-flex items-center gap-1 group/link"
                                >
                                    View complaint
                                    <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

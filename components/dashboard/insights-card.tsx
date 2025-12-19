"use client";

import { Lightbulb, TrendingUp, Clock, Target } from "lucide-react";

interface Insight {
    type: "tip" | "trend" | "performance" | "goal";
    title: string;
    description: string;
}

interface InsightsCardProps {
    insights: Insight[];
    loading?: boolean;
}

const insightIcons = {
    tip: Lightbulb,
    trend: TrendingUp,
    performance: Clock,
    goal: Target,
};

const insightColors = {
    tip: "text-yellow-600 bg-yellow-100",
    trend: "text-blue-600 bg-blue-100",
    performance: "text-purple-600 bg-purple-100",
    goal: "text-green-600 bg-green-100",
};

export function InsightsCard({ insights, loading = false }: InsightsCardProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                        <div className="h-10 w-10 rounded-lg bg-gray-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (insights.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Lightbulb className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No tips available yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {insights.map((insight, index) => {
                const Icon = insightIcons[insight.type];
                const colorClass = insightColors[insight.type];

                return (
                    <div
                        key={index}
                        className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:shadow-md transition-shadow"
                    >
                        <div className={`flex-shrink-0 h-10 w-10 rounded-lg ${colorClass} flex items-center justify-center`}>
                            <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                {insight.title}
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {insight.description}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

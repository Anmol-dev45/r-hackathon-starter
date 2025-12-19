"use client";

import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: "blue" | "green" | "yellow" | "purple" | "red" | "indigo";
    loading?: boolean;
}

const colorClasses = {
    blue: {
        bg: "from-blue-50 to-blue-100/50",
        icon: "text-blue-600",
        trend: "text-blue-600",
    },
    green: {
        bg: "from-green-50 to-green-100/50",
        icon: "text-green-600",
        trend: "text-green-600",
    },
    yellow: {
        bg: "from-yellow-50 to-yellow-100/50",
        icon: "text-yellow-600",
        trend: "text-yellow-600",
    },
    purple: {
        bg: "from-purple-50 to-purple-100/50",
        icon: "text-purple-600",
        trend: "text-purple-600",
    },
    red: {
        bg: "from-red-50 to-red-100/50",
        icon: "text-red-600",
        trend: "text-red-600",
    },
    indigo: {
        bg: "from-indigo-50 to-indigo-100/50",
        icon: "text-indigo-600",
        trend: "text-indigo-600",
    },
};

export function StatCard({
    title,
    value,
    icon,
    trend,
    color = "blue",
    loading = false,
}: StatCardProps) {
    const colors = colorClasses[color];

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-50 group-hover:opacity-70 transition-opacity`} />

            <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-white shadow-sm ${colors.icon}`}>
                        {icon}
                    </div>

                    {trend && (
                        <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {trend.value === 0 ? (
                                <Minus className="h-4 w-4" />
                            ) : trend.isPositive ? (
                                <TrendingUp className="h-4 w-4" />
                            ) : (
                                <TrendingDown className="h-4 w-4" />
                            )}
                            <span>{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>

                <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>

                {loading ? (
                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
                ) : (
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                )}
            </div>
        </div>
    );
}

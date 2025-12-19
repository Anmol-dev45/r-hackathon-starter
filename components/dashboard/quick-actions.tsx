"use client";

import { FileText, Search, BarChart3, Download, Share2, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuickAction {
    icon: React.ReactNode;
    label: string;
    description: string;
    action: () => void;
    color: string;
    bgColor: string;
}

export function QuickActions() {
    const router = useRouter();

    const actions: QuickAction[] = [
        {
            icon: <FileText className="h-6 w-6" />,
            label: "Submit New Complaint",
            description: "Report a new issue or problem",
            action: () => router.push("/complaint"),
            color: "text-blue-600",
            bgColor: "bg-blue-50 hover:bg-blue-100",
        },
        {
            icon: <Search className="h-6 w-6" />,
            label: "Check Status",
            description: "See where your complaint is",
            action: () => router.push("/track"),
            color: "text-purple-600",
            bgColor: "bg-purple-50 hover:bg-purple-100",
        },
        {
            icon: <BarChart3 className="h-6 w-6" />,
            label: "View Statistics",
            description: "See your complaint summary",
            action: () => document.getElementById("analytics")?.scrollIntoView({ behavior: "smooth" }),
            color: "text-green-600",
            bgColor: "bg-green-50 hover:bg-green-100",
        },
        {
            icon: <Download className="h-6 w-6" />,
            label: "Download Records",
            description: "Save complaint details to file",
            action: () => handleExport(),
            color: "text-orange-600",
            bgColor: "bg-orange-50 hover:bg-orange-100",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action, index) => (
                <button
                    key={index}
                    onClick={action.action}
                    className={`group p-5 rounded-2xl ${action.bgColor} border border-gray-200 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-left`}
                >
                    <div className={`${action.color} mb-3 group-hover:scale-110 transition-transform`}>
                        {action.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{action.label}</h4>
                    <p className="text-xs text-gray-600">{action.description}</p>
                </button>
            ))}
        </div>
    );
}

function handleExport() {
    // Export functionality - implement CSV download
    alert("Export functionality will download your complaint data as CSV");
}

"use client";

import { Download, FileText, FileSpreadsheet, FileJson } from "lucide-react";
import { useState } from "react";

interface ExportMenuProps {
    onExport: (format: "csv" | "json" | "pdf") => void;
}

export function ExportMenu({ onExport }: ExportMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const exportOptions = [
        { format: "csv" as const, label: "Export as CSV", icon: FileSpreadsheet },
        { format: "json" as const, label: "Export as JSON", icon: FileJson },
        { format: "pdf" as const, label: "Export as PDF", icon: FileText },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
                <Download className="h-4 w-4" />
                Export
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-1">
                        {exportOptions.map(option => {
                            const Icon = option.icon;
                            return (
                                <button
                                    key={option.format}
                                    onClick={() => {
                                        onExport(option.format);
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                                >
                                    <Icon className="h-4 w-4 text-gray-600" />
                                    <span className="text-sm text-gray-700">{option.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

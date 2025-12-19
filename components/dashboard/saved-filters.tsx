"use client";

import { X } from "lucide-react";
import { useState } from "react";

export interface Filter {
    id: string;
    name: string;
    searchFilter: string;
    statusFilter: string;
    categoryFilter: string;
    dateRange?: { start: string; end: string };
}

interface SavedFiltersProps {
    onApplyFilter: (filter: Filter) => void;
}

export function SavedFilters({ onApplyFilter }: SavedFiltersProps) {
    const [filters, setFilters] = useState<Filter[]>([
        {
            id: "1",
            name: "⏳ Waiting for Response",
            searchFilter: "",
            statusFilter: "submitted",
            categoryFilter: "all",
        },
        {
            id: "2",
            name: "✅ Completed",
            searchFilter: "",
            statusFilter: "resolved",
            categoryFilter: "all",
        },
    ]);

    const [showSaveDialog, setShowSaveDialog] = useState(false);

    const deleteFilter = (id: string) => {
        setFilters(filters.filter(f => f.id !== id));
    };

    return (
        <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
                <button
                    key={filter.id}
                    onClick={() => onApplyFilter(filter)}
                    className="group inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm font-medium transition-colors"
                >
                    <span>{filter.name}</span>
                    <X
                        className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteFilter(filter.id);
                        }}
                    />
                </button>
            ))}

            <button
                className="px-3 py-1.5 border-2 border-dashed border-gray-300 hover:border-blue-400 text-gray-600 hover:text-blue-600 rounded-full text-sm font-medium transition-colors"
                onClick={() => setShowSaveDialog(true)}
            >
                + Save Current Filter
            </button>
        </div>
    );
}

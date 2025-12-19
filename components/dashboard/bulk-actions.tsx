"use client";

import { CheckSquare, Square } from "lucide-react";

interface BulkActionsProps {
    selectedCount: number;
    totalCount: number;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    onDelete?: () => void;
    onExport?: () => void;
    onMarkResolved?: () => void;
}

export function BulkActions({
    selectedCount,
    totalCount,
    onSelectAll,
    onDeselectAll,
    onDelete,
    onExport,
    onMarkResolved,
}: BulkActionsProps) {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-up">
            <div className="flex items-center gap-2">
                <button
                    onClick={selectedCount === totalCount ? onDeselectAll : onSelectAll}
                    className="hover:text-blue-400 transition-colors"
                >
                    {selectedCount === totalCount ? (
                        <CheckSquare className="h-5 w-5" />
                    ) : (
                        <Square className="h-5 w-5" />
                    )}
                </button>
                <span className="text-sm font-medium">
                    {selectedCount} selected
                </span>
            </div>

            <div className="h-6 w-px bg-gray-700" />

            <div className="flex items-center gap-2">
                {onExport && (
                    <button
                        onClick={onExport}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        Export Selected
                    </button>
                )}

                {onMarkResolved && (
                    <button
                        onClick={onMarkResolved}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        Mark as Resolved
                    </button>
                )}

                {onDelete && (
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        Delete
                    </button>
                )}

                <button
                    onClick={onDeselectAll}
                    className="px-4 py-2 hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

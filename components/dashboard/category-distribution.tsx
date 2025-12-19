"use client";

interface CategoryData {
    category: string;
    count: number;
    color: string;
}

interface CategoryDistributionProps {
    data: CategoryData[];
    loading?: boolean;
}

export function CategoryDistribution({ data, loading = false }: CategoryDistributionProps) {
    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-8 bg-gray-200 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    const total = data.reduce((sum, item) => sum + item.count, 0);

    if (total === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No data available</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {data.map((item, index) => {
                const percentage = (item.count / total) * 100;

                return (
                    <div key={index} className="group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                {formatCategory(item.category)}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                                {item.count} ({percentage.toFixed(1)}%)
                            </span>
                        </div>

                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500 ease-out group-hover:opacity-80"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundColor: item.color,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function formatCategory(category: string): string {
    return category
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

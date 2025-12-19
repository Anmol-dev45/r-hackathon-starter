"use client";

interface MiniChartProps {
    data: number[];
    color?: string;
    height?: number;
}

export function MiniChart({ data, color = "#4366d0", height = 40 }: MiniChartProps) {
    if (data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
    });

    return (
        <svg width="100%" height={height} className="overflow-visible">
            <defs>
                <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                </linearGradient>
            </defs>

            {/* Area */}
            <path
                d={`M 0,${height} L ${points.join(" L ")} L 100,${height} Z`}
                fill={`url(#gradient-${color})`}
            />

            {/* Line */}
            <polyline
                points={points.join(" ")}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Dots */}
            {points.map((point, i) => {
                const [x, y] = point.split(",");
                return (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="3"
                        fill={color}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                );
            })}
        </svg>
    );
}

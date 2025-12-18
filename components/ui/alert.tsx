// Alert Component for messages
import { type ReactNode } from 'react';

interface AlertProps {
    variant?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    children: ReactNode;
    className?: string;
}

const variantStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    error: 'bg-red-50 border-red-200 text-red-900',
};

const iconStyles = {
    info: '🔵',
    success: '✅',
    warning: '⚠️',
    error: '❌',
};

export function Alert({
    variant = 'info',
    title,
    children,
    className = '',
}: AlertProps) {
    return (
        <div
            className={`rounded-lg border p-4 ${variantStyles[variant]} ${className}`}
            role="alert"
        >
            <div className="flex gap-3">
                <span className="text-lg" aria-hidden="true">
                    {iconStyles[variant]}
                </span>
                <div className="flex-1">
                    {title && <h4 className="mb-1 font-semibold">{title}</h4>}
                    <div className="text-sm">{children}</div>
                </div>
            </div>
        </div>
    );
}

// Loading Spinner Component
interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
};

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
    return (
        <div
            className={`${sizeClasses[size]} animate-spin rounded-full border-primary border-t-transparent ${className}`}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}

// Full Page Loading
export function LoadingPage({ message = 'Loading...' }: { message?: string }) {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
}

// Inline Loading
export function LoadingInline({ message }: { message?: string }) {
    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoadingSpinner size="sm" />
            {message && <span>{message}</span>}
        </div>
    );
}

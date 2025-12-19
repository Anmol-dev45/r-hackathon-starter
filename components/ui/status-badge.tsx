// Status Badge Component for GunaasoNepal
import { type ComplaintStatus } from '@/lib/types/database';

interface StatusBadgeProps {
    status: ComplaintStatus;
    className?: string;
}

const statusConfig: Record<
    ComplaintStatus,
    { label: string; labelNe: string; color: string }
> = {
    submitted: {
        label: 'Submitted',
        labelNe: 'पेश गरिएको',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    under_review: {
        label: 'Under Review',
        labelNe: 'समीक्षाधीन',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    },
    forwarded: {
        label: 'Forwarded',
        labelNe: 'फर्वार्ड गरिएको',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
    },
    resolved: {
        label: 'Resolved',
        labelNe: 'समाधान भएको',
        color: 'bg-green-100 text-green-700 border-green-200',
    },
    rejected: {
        label: 'Rejected',
        labelNe: 'अस्वीकृत',
        color: 'bg-red-100 text-red-700 border-red-200',
    },
    closed: {
        label: 'Closed',
        labelNe: 'बन्द',
        color: 'bg-gray-100 text-gray-700 border-gray-200',
    },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color} ${className}`}
        >
            {config.label}
        </span>
    );
}

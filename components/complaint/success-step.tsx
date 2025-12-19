// Success Step Component
// Step 4: Confirmation with tracking ID and forwarding information

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface SuccessStepProps {
    trackingId: string;
    forwardedTo?: {
        id: string;
        name: string;
        category: string;
    };
    onNewComplaint?: () => void;
}

export function SuccessStep({ trackingId, forwardedTo, onNewComplaint }: SuccessStepProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(trackingId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
            <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-green-500" />

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-merriweather">
                    Complaint Submitted Successfully
                </h2>

                <p className="text-muted-foreground">
                    Your complaint has been received and is being processed
                </p>
            </div>

            {/* Tracking ID */}
            <div className="space-y-2">
                <h3 className="font-semibold text-sm sm:text-base">Your Tracking ID</h3>
                <div className="flex items-center gap-2 p-3 sm:p-4 bg-muted rounded-lg">
                    <code className="flex-1 font-mono text-sm sm:text-base md:text-lg break-all">{trackingId}</code>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCopy}
                        className="shrink-0"
                    >
                        {copied ? (
                            <span className="text-green-600">Copied!</span>
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Save this ID to track your complaint status
                </p>
            </div>

            {/* Forwarding Information */}
            {forwardedTo && (
                <div className="space-y-2 border-t pt-4">
                    <h3 className="font-semibold text-sm">Forwarded To</h3>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="font-medium">{forwardedTo.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Category: {forwardedTo.category}
                        </p>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2 sm:pt-4">
                <Link href={`/track?id=${trackingId}`} className="w-full">
                    <Button className="w-full h-11 sm:h-12 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white touch-manipulation">
                        Track Complaint <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                </Link>

                <Button
                    variant="outline"
                    className="w-full h-11 sm:h-12 touch-manipulation"
                    onClick={onNewComplaint}
                >
                    Submit Another Complaint
                </Button>

                <Link href="/" className="w-full">
                    <Button variant="ghost" className="w-full h-11 sm:h-12 touch-manipulation">
                        Back to Home
                    </Button>
                </Link>
            </div>
        </Card>
    );
}

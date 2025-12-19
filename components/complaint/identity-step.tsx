// Identity Step Component
// Step 1: Choose submission type (Anonymous/Pseudonymous/Verified)

import { Shield, User, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SubmissionType } from '@/lib/types/database';

interface IdentityStepProps {
    submissionType: SubmissionType;
    setSubmissionType: (type: SubmissionType) => void;
    pseudonym: string;
    setPseudonym: (value: string) => void;
    onNext: () => void;
}

export function IdentityStep({
    submissionType,
    setSubmissionType,
    pseudonym,
    setPseudonym,
    onNext,
}: IdentityStepProps) {
    const identityOptions = [
        {
            type: 'anonymous' as SubmissionType,
            icon: Shield,
            title: 'Anonymous',
            description: 'Submit without any identity. Maximum privacy.',
        },
        {
            type: 'pseudonymous' as SubmissionType,
            icon: User,
            title: 'Pseudonymous',
            description: 'Use a pseudonym. Balance between privacy and identity.',
        },
        {
            type: 'verified' as SubmissionType,
            icon: BadgeCheck,
            title: 'Verified (Login Required)',
            description: 'Submit with your account. Most credibility.',
        },
    ];

    return (
        <Card className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            <h2 className="mb-4 sm:mb-6 md:mb-8 text-xl sm:text-2xl font-bold tracking-tight text-foreground font-merriweather">
                Choose Identity Type
            </h2>

            <div className="space-y-4 sm:space-y-6">
                {identityOptions.map(({ type, icon: Icon, title, description }) => (
                    <div key={type}>
                        <button
                            type="button"
                            onClick={() => setSubmissionType(type)}
                            className={`w-full rounded-lg border-2 p-4 sm:p-5 text-left transition-colors touch-manipulation ${submissionType === type
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50 active:border-primary/50'
                                }`}
                        >
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="text-2xl flex-shrink-0">
                                    <Icon className="text-black w-6 h-6 sm:w-7 sm:h-7" aria-label={title} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
                                </div>
                                <div
                                    className={`h-5 w-5 rounded-full border-2 transition-colors ${submissionType === type ? 'border-primary bg-primary' : 'border-border'
                                        }`}
                                />
                            </div>
                        </button>

                        {/* Pseudonym Input */}
                        {submissionType === 'pseudonymous' && type === 'pseudonymous' && (
                            <div className="ml-11 mt-4">
                                <Label htmlFor="pseudonym">Choose a pseudonym</Label>
                                <Input
                                    id="pseudonym"
                                    type="text"
                                    placeholder="e.g., ConcernedCitizen123"
                                    value={pseudonym}
                                    onChange={(e) => setPseudonym(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <Button onClick={onNext} className="mt-6 sm:mt-8 w-full h-11 sm:h-12 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-base sm:text-lg touch-manipulation">
                Continue →
            </Button>
        </Card>
    );
}

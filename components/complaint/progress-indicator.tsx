// Progress Indicator Component
// Shows current step in multi-step form

import React from 'react';

interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
    labels: string[];
}

export function ProgressIndicator({ currentStep, totalSteps, labels }: ProgressIndicatorProps) {
    return (
        <div className="mb-6 sm:mb-8 px-2 sm:px-0">
            <div className="flex flex-col items-center w-full">
                <div className="flex items-center w-full max-w-md mx-auto">
                    {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNumber, index) => (
                        <React.Fragment key={stepNumber}>
                            {/* Step Circle */}
                            <div className="flex flex-col items-center flex-shrink-0">
                                <div
                                    className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 font-semibold text-sm sm:text-base transition-colors ${
                                        currentStep >= stepNumber
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border bg-background text-muted-foreground'
                                    }`}
                                >
                                    {stepNumber}
                                </div>
                                <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground font-medium text-center">
                                    {labels[index]}
                                </span>
                            </div>
                            {/* Connector Line */}
                            {index < totalSteps - 1 && (
                                <div
                                    className={`flex-1 h-0.5 transition-colors ${
                                        currentStep > stepNumber ? 'bg-primary' : 'bg-border'
                                    }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}

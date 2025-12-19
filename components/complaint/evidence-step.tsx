// Evidence Step Component
// Step 3: Optional file upload for evidence

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileUpload } from '@/components/file-upload';

interface EvidenceStepProps {
    files: File[];
    setFiles: (files: File[]) => void;
    onNext: () => void;
    onBack: () => void;
}

export function EvidenceStep({ files, setFiles, onNext, onBack }: EvidenceStepProps) {
    return (
        <Card className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
            <div>
                <h2 className="mb-2 text-xl sm:text-2xl font-bold tracking-tight text-foreground font-merriweather">
                    📎 Add Supporting Files (Optional)
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                    Upload photos, documents, or videos that show the problem. This helps the authorities understand your complaint better.
                </p>
            </div>

            <FileUpload onFilesChange={setFiles} />

            {files.length > 0 && (
                <div className="text-sm text-muted-foreground">
                    {files.length} file(s) selected
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <Button type="button" variant="outline" onClick={onBack} className="w-full sm:flex-1 h-11 sm:h-12 touch-manipulation">
                    ← Back
                </Button>
                <Button onClick={onNext} className="w-full sm:flex-1 h-11 sm:h-12 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold touch-manipulation">
                    {files.length > 0 ? 'Continue →' : 'Skip →'}
                </Button>
            </div>
        </Card>
    );
}

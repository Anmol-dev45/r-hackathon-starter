'use client';

// File Upload Component for Evidence
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

interface FileUploadProps {
    onFilesChange: (files: File[]) => void;
    maxFiles?: number;
    maxSize?: number; // in MB
}

export function FileUpload({ onFilesChange, maxFiles = 5, maxSize = 50 }: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const acceptedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/heic',
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/ogg',
        'audio/m4a',
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/webm',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setError('');

        // Check max files
        if (files.length + selectedFiles.length > maxFiles) {
            setError(`Maximum ${maxFiles} files allowed`);
            return;
        }

        // Validate each file
        for (const file of selectedFiles) {
            // Check size
            if (file.size > maxSize * 1024 * 1024) {
                setError(`${file.name} exceeds ${maxSize}MB limit`);
                return;
            }

            // Check type
            if (!acceptedTypes.includes(file.type)) {
                setError(`${file.name} is not a supported file type`);
                return;
            }
        }

        const newFiles = [...files, ...selectedFiles];
        setFiles(newFiles);
        onFilesChange(newFiles);
    };

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onFilesChange(newFiles);
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return '🖼️';
        if (type.startsWith('audio/')) return '🎵';
        if (type.startsWith('video/')) return '🎥';
        return '📄';
    };

    return (
        <div className="space-y-4">
            {/* Upload Button */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    disabled={files.length >= maxFiles}
                    className="w-full sm:w-auto"
                >
                    📎 Add Evidence
                </Button>
                <input
                    ref={inputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept={acceptedTypes.join(',')}
                    multiple
                    className="hidden"
                />
            </div>

            {/* Help Text */}
            <p className="text-xs text-muted-foreground">
                Accepted: Images (JPG, PNG, WebP, HEIC), Audio (MP3, WAV, OGG, M4A), Video (MP4, WebM), Documents (PDF, DOC, DOCX, TXT) - max {maxSize}MB per file, up to {maxFiles} files
            </p>

            {/* Error */}
            {error && <Alert variant="error">{error}</Alert>}

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border bg-card p-3"
                        >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <span className="text-xl">{getFileIcon(file.type)}</span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-destructive hover:text-destructive"
                            >
                                ✕
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

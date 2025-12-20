// Complaint Details Step Component
// Step 2: Title, description, category, and optional location

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CategorySelector } from './category-selector';
import { LocationSelector } from './location-selector';
import { ContactSection } from './contact-section';

interface ComplaintDetailsStepProps {
    title: string;
    setTitle: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    category: string;
    setCategory: (value: string) => void;
    includeLocation: boolean;
    setIncludeLocation: (value: boolean) => void;
    province: string;
    setProvince: (value: string) => void;
    district: string;
    setDistrict: (value: string) => void;
    municipality: string;
    setMunicipality: (value: string) => void;
    ward: string;
    setWard: (value: string) => void;
    includeContact: boolean;
    setIncludeContact: (value: boolean) => void;
    email: string;
    setEmail: (value: string) => void;
    phone: string;
    setPhone: (value: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export function ComplaintDetailsStep({
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    includeLocation,
    setIncludeLocation,
    province,
    setProvince,
    district,
    setDistrict,
    municipality,
    setMunicipality,
    ward,
    setWard,
    includeContact,
    setIncludeContact,
    email,
    setEmail,
    phone,
    setPhone,
    onNext,
    onBack,
}: ComplaintDetailsStepProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleProvinceChange = (value: string) => {
        setProvince(value);
        setDistrict('');
        setMunicipality('');
        setWard('');
    };

    const handleDistrictChange = (value: string) => {
        setDistrict(value);
        setMunicipality('');
        setWard('');
    };

    const handleMunicipalityChange = (value: string) => {
        setMunicipality(value);
        setWard('');
    };

    const validateAndContinue = () => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        } else if (title.length < 10) {
            newErrors.title = 'Title must be at least 10 characters';
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        } else if (description.length < 50) {
            newErrors.description = 'Description must be at least 50 characters';
        }

        if (!category) {
            newErrors.category = 'Please select a category';
        }

        // Location is now required
        if (!province) newErrors.location = 'Province is required';
        if (!district) newErrors.location = 'District is required';
        if (!municipality) newErrors.location = 'Municipality is required';
        if (!ward) newErrors.location = 'Ward is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        onNext();
    };

    return (
        <Card className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 border-gray-200 shadow-lg">
            <div>
                <h2 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900">
                    Tell us about your complaint
                </h2>
                <p className="text-sm text-gray-600">Provide details so we can help resolve your issue</p>
            </div>

            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold">What's the problem? (Short summary) *</Label>
                <Input
                    id="title"
                    type="text"
                    placeholder="Example: Broken street light on Main Road for 2 weeks"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={errors.title ? 'border-red-500 text-base' : 'text-base'}
                />
                <div className="flex justify-between text-xs">
                    {errors.title && <span className="text-red-500">{errors.title}</span>}
                    <span className={`ml-auto ${title.length < 10 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {title.length}/200 (min 10)
                    </span>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">Describe the problem in detail *</Label>
                <p className="text-sm text-gray-600">Explain what happened, when it happened, and who was involved</p>
                <Textarea
                    id="description"
                    placeholder="Tell us the full story... Include dates, times, names (if known), and any details that will help us understand and resolve your problem."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className={errors.description ? 'border-red-500 text-base' : 'text-base'}
                />
                <div className="flex justify-between text-xs">
                    {errors.description && <span className="text-red-500">{errors.description}</span>}
                    <span className={`ml-auto ${description.length < 50 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {description.length}/2000 (min 50)
                    </span>
                </div>
            </div>

            {/* Category */}
            <div>
                <CategorySelector value={category} onChange={setCategory} />
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>

            {/* Location Toggle */}
            <div className="space-y-4 border-t pt-4">
                <div className="flex items-start space-x-3">
                    <Checkbox
                        id="includeLocation"
                        checked={includeLocation}
                        onCheckedChange={(checked) => setIncludeLocation(checked as boolean)}
                        className="mt-1"
                    />
                    <div>
                        <Label htmlFor="includeLocation" className="cursor-pointer font-semibold">
                            Add location where problem occurred *
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">Required to help us forward to the right office</p>
                    </div>
                </div>

                {includeLocation && (
                    <div>
                        <LocationSelector
                            province={province}
                            district={district}
                            municipality={municipality}
                            ward={ward}
                            onProvinceChange={handleProvinceChange}
                            onDistrictChange={handleDistrictChange}
                            onMunicipalityChange={handleMunicipalityChange}
                            onWardChange={setWard}
                        />
                        {errors.location && <p className="text-xs text-red-500 mt-2">{errors.location}</p>}
                    </div>
                )}
            </div>

            {/* Contact Toggle */}
            <div className="space-y-4 border-t pt-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="includeContact"
                        checked={includeContact}
                        onCheckedChange={(checked) => setIncludeContact(checked as boolean)}
                    />
                    <Label htmlFor="includeContact" className="cursor-pointer">
                        Include contact information (optional)
                    </Label>
                </div>

                {includeContact && (
                    <ContactSection
                        email={email}
                        phone={phone}
                        onEmailChange={setEmail}
                        onPhoneChange={setPhone}
                    />
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <Button type="button" variant="outline" onClick={onBack} className="w-full sm:flex-1 h-11 sm:h-12 touch-manipulation">
                    ← Back
                </Button>
                <Button onClick={validateAndContinue} className="w-full sm:flex-1 h-11 sm:h-12 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold touch-manipulation">
                    Continue →
                </Button>
            </div>
        </Card>
    );
}

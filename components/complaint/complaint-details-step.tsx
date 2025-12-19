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

        if (includeLocation) {
            if (!province) newErrors.location = 'Province is required when location is included';
            if (!district) newErrors.location = 'District is required when location is included';
            if (!municipality) newErrors.location = 'Municipality is required when location is included';
            if (!ward) newErrors.location = 'Ward is required when location is included';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        onNext();
    };

    return (
        <Card className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
            <h2 className="mb-2 sm:mb-4 text-xl sm:text-2xl font-bold tracking-tight text-foreground font-merriweather">
                Complaint Details
            </h2>

            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                    id="title"
                    type="text"
                    placeholder="Brief summary of your complaint"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={errors.title ? 'border-red-500' : ''}
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
                <Label htmlFor="description">Description *</Label>
                <Textarea
                    id="description"
                    placeholder="Provide detailed information about the issue..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className={errors.description ? 'border-red-500' : ''}
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
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="includeLocation"
                        checked={includeLocation}
                        onCheckedChange={(checked) => setIncludeLocation(checked as boolean)}
                    />
                    <Label htmlFor="includeLocation" className="cursor-pointer">
                        Include location information (optional)
                    </Label>
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

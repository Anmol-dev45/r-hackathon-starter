// Location Selector Component
// Cascading dropdown for Nepal administrative structure (Province → District → Municipality → Ward)

'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    NEPAL_ADMINISTRATIVE_DATA,
    getDistrictsByProvince,
    getMunicipalitiesByDistrict,
    getWardsByMunicipality,
} from '@/lib/data/nepal-administrative';

interface LocationSelectorProps {
    province: string;
    district: string;
    municipality: string;
    ward: string;
    onProvinceChange: (value: string) => void;
    onDistrictChange: (value: string) => void;
    onMunicipalityChange: (value: string) => void;
    onWardChange: (value: string) => void;
}

export function LocationSelector({
    province,
    district,
    municipality,
    ward,
    onProvinceChange,
    onDistrictChange,
    onMunicipalityChange,
    onWardChange,
}: LocationSelectorProps) {
    const districts = province ? getDistrictsByProvince(province) : [];
    const municipalities = district ? getMunicipalitiesByDistrict(province, district) : [];
    const wardCount = municipality ? getWardsByMunicipality(province, district, municipality) : 0;
    const wards = typeof wardCount === 'number' ? Array.from({ length: wardCount }, (_, i) => i + 1) : [];

    return (
        <div className="space-y-4">
            {/* Province */}
            <div className="space-y-2">
                <Label htmlFor="province">Province *</Label>
                <Select value={province} onValueChange={onProvinceChange}>
                    <SelectTrigger id="province">
                        <SelectValue placeholder="Select Province" />
                    </SelectTrigger>
                    <SelectContent>
                        {NEPAL_ADMINISTRATIVE_DATA.map((p) => (
                            <SelectItem key={p.name} value={p.name}>
                                {p.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* District */}
            {province && (
                <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Select value={district} onValueChange={onDistrictChange}>
                        <SelectTrigger id="district">
                            <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                            {districts.map((d) => (
                                <SelectItem key={d.name} value={d.name}>
                                    {d.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Municipality */}
            {district && (
                <div className="space-y-2">
                    <Label htmlFor="municipality">Municipality *</Label>
                    <Select value={municipality} onValueChange={onMunicipalityChange}>
                        <SelectTrigger id="municipality">
                            <SelectValue placeholder="Select Municipality" />
                        </SelectTrigger>
                        <SelectContent>
                            {municipalities.map((m) => (
                                <SelectItem key={m.name} value={m.name}>
                                    {m.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Ward */}
            {municipality && (
                <div className="space-y-2">
                    <Label htmlFor="ward">Ward *</Label>
                    <Select value={ward} onValueChange={onWardChange}>
                        <SelectTrigger id="ward">
                            <SelectValue placeholder="Select Ward" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.isArray(wards) && wards.map((w) => (
                                <SelectItem key={w} value={w.toString()}>
                                    Ward {w}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
}

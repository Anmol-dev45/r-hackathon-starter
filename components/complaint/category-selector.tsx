// Category Selector Component
// Dropdown with complaint categories and descriptions

import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const COMPLAINT_CATEGORIES = [
    {
        value: 'corruption',
        label: 'Corruption',
        description: 'Bribery, embezzlement, misuse of public funds',
    },
    {
        value: 'infrastructure',
        label: 'Infrastructure Issues',
        description: 'Roads, water supply, electricity, public buildings',
    },
    {
        value: 'service_delivery',
        label: 'Public Services',
        description: 'Healthcare, education, administrative services',
    },
    {
        value: 'health_services',
        label: 'Health Services',
        description: 'Hospital, clinic, or healthcare issues',
    },
    {
        value: 'education',
        label: 'Education',
        description: 'School, teacher, or education system problems',
    },
    {
        value: 'police_misconduct',
        label: 'Police Misconduct',
        description: 'Police abuse or misconduct',
    },
    {
        value: 'land_administration',
        label: 'Land & Property',
        description: 'Land disputes, illegal construction',
    },
    {
        value: 'rti_request',
        label: 'Right to Information',
        description: 'Request for public information',
    },
    {
        value: 'public_project',
        label: 'Public Projects',
        description: 'Public construction or development projects',
    },
    {
        value: 'other',
        label: 'Other',
        description: 'Any other civic issues',
    },
];

interface CategorySelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
    const selectedCategory = COMPLAINT_CATEGORIES.find((cat) => cat.value === value);

    return (
        <div className="space-y-2">
            <Label htmlFor="category">📂 What category does this fall under? *</Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger id="category">
                    <SelectValue placeholder="Choose the category that best matches your complaint" />
                </SelectTrigger>
                <SelectContent>
                    {COMPLAINT_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                            <div>
                                <div className="font-medium">{category.label}</div>
                                <div className="text-xs text-muted-foreground">{category.description}</div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export { COMPLAINT_CATEGORIES };

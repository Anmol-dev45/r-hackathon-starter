// Contact Section Component
// Optional email and phone input fields

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactSectionProps {
    email: string;
    phone: string;
    onEmailChange: (value: string) => void;
    onPhoneChange: (value: string) => void;
}

export function ContactSection({ email, phone, onEmailChange, onPhoneChange }: ContactSectionProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">📧 Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                    We'll send you updates about your complaint here
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">📱 Phone Number</Label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="98XXXXXXXX"
                    value={phone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                    In case we need to reach you quickly
                </p>
            </div>
        </div>
    );
}

'use client';

// Complaint Submission Form - GunaasoNepal
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { LoadingInline } from '@/components/ui/loading';
import { FileUpload } from '@/components/file-upload';
import type { SubmissionType, ComplaintCategory } from '@/lib/types/database';
import { Label } from '@/components/ui/label';

const NEPAL_DISTRICTS = [
  'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Kavrepalanchok', 'Dhading',
  'Pokhara', 'Chitwan', 'Dharan', 'Biratnagar', 'Birgunj', 'Butwal',
];

const COMPLAINT_CATEGORIES: Array<{ value: ComplaintCategory; label: string; labelNe: string }> = [
  { value: 'corruption', label: 'Corruption', labelNe: 'भ्रष्टाचार' },
  { value: 'infrastructure', label: 'Infrastructure', labelNe: 'पूर्वाधार' },
  { value: 'service_delivery', label: 'Service Delivery', labelNe: 'सेवा प्रवाह' },
  { value: 'health_services', label: 'Health Services', labelNe: 'स्वास्थ्य सेवा' },
  { value: 'education', label: 'Education', labelNe: 'शिक्षा' },
  { value: 'rti_request', label: 'Right to Information', labelNe: 'सूचनाको हक' },
  { value: 'public_project', label: 'Public Projects', labelNe: 'सार्वजनिक परियोजना' },
  { value: 'police_misconduct', label: 'Police Misconduct', labelNe: 'प्रहरी दुर्व्यवहार' },
  { value: 'land_administration', label: 'Land Administration', labelNe: 'भूमि प्रशासन' },
  { value: 'other', label: 'Other', labelNe: 'अन्य' },
];

export default function ComplaintFormPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingId, setTrackingId] = useState('');

  // Form state
  const [submissionType, setSubmissionType] = useState<SubmissionType>('anonymous');
  const [pseudonym, setPseudonym] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('corruption');
  const [district, setDistrict] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [ward, setWard] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Submit complaint
      const complaintData = {
        submission_type: submissionType,
        ...(submissionType === 'pseudonymous' && { pseudonym }),
        title,
        description,
        category,
        location: {
          district: district || undefined,
          municipality: municipality || undefined,
          ward: ward || undefined,
          details: locationDetails || undefined,
        },
        is_public: isPublic,
        language: 'en',
        contact: {
          email: contactEmail || undefined,
          phone: contactPhone || undefined,
        },
      };

      const response = await fetch('/api/complaints/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to submit complaint');
        return;
      }

      const complaintId = data.complaint_id;
      setTrackingId(data.tracking_id);

      // Upload files if any
      if (files.length > 0) {
        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('complaint_id', complaintId);
          formData.append('is_public', isPublic.toString());

          await fetch('/api/evidence/upload', {
            method: 'POST',
            body: formData,
          });
        }
      }

      setStep(4); // Success step
    } catch (err) {
      setError('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (submissionType === 'pseudonymous' && !pseudonym.trim()) {
        setError('Pseudonym is required for pseudonymous submissions');
        return false;
      }
    }
    if (currentStep === 2) {
      if (title.length < 10) {
        setError('Title must be at least 10 characters');
        return false;
      }
      if (description.length < 50) {
        setError('Description must be at least 50 characters');
        return false;
      }
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Submit a Complaint</h1>
          <p className="text-muted-foreground">
            Report governance issues safely and transparently
          </p>
        </div>

        {/* Progress Indicator */}
        {step < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-1 items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors ${s <= step
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground'
                      }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`h-1 flex-1 transition-colors ${s < step ? 'bg-primary' : 'bg-border'
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Identity</span>
              <span>Details</span>
              <span>Evidence</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Step 1: Identity Choice */}
        {step === 1 && (
          <Card className="p-6">
            <h2 className="mb-6 text-xl font-semibold">Choose Identity Type</h2>
            <div className="space-y-4">
              {/* Anonymous */}
              <button
                type="button"
                onClick={() => setSubmissionType('anonymous')}
                className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${submissionType === 'anonymous'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🔒</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Anonymous</h3>
                    <p className="text-sm text-muted-foreground">
                      Submit without any identity. Maximum privacy.
                    </p>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border-2 transition-colors ${submissionType === 'anonymous'
                        ? 'border-primary bg-primary'
                        : 'border-border'
                      }`}
                  />
                </div>
              </button>

              {/* Pseudonymous */}
              <button
                type="button"
                onClick={() => setSubmissionType('pseudonymous')}
                className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${submissionType === 'pseudonymous'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">👤</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Pseudonymous</h3>
                    <p className="text-sm text-muted-foreground">
                      Use a pseudonym. Balance between privacy and identity.
                    </p>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border-2 transition-colors ${submissionType === 'pseudonymous'
                        ? 'border-primary bg-primary'
                        : 'border-border'
                      }`}
                  />
                </div>
              </button>

              {submissionType === 'pseudonymous' && (
                <div className="ml-11 mt-2">
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

              {/* Verified */}
              <button
                type="button"
                onClick={() => setSubmissionType('verified')}
                className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${submissionType === 'verified'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">✅</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Verified (Login Required)</h3>
                    <p className="text-sm text-muted-foreground">
                      Submit with your account. Most credibility.
                    </p>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border-2 transition-colors ${submissionType === 'verified'
                        ? 'border-primary bg-primary'
                        : 'border-border'
                      }`}
                  />
                </div>
              </button>
            </div>

            <Button onClick={nextStep} className="mt-6 w-full">
              Continue →
            </Button>
          </Card>
        )}

        {/* Step 2: Complaint Details */}
        {step === 2 && (
          <Card className="p-6">
            <h2 className="mb-6 text-xl font-semibold">Complaint Details</h2>
            <div className="space-y-4">
              {/* Category */}
              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {COMPLAINT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label} ({cat.labelNe})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Title * (min 10 characters)</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Brief summary of the issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {title.length}/200 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">
                  Detailed Description * (min 50 characters)
                </Label>
                <textarea
                  id="description"
                  placeholder="Provide detailed information about the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {description.length} characters
                </p>
              </div>

              {/* Location */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="district">District</Label>
                  <select
                    id="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select district</option>
                    {NEPAL_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="municipality">Municipality</Label>
                  <Input
                    id="municipality"
                    type="text"
                    placeholder="e.g., Kathmandu Metropolitan City"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="ward">Ward Number</Label>
                  <Input
                    id="ward"
                    type="text"
                    placeholder="e.g., 5"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="location-details">Specific Location</Label>
                  <Input
                    id="location-details"
                    type="text"
                    placeholder="e.g., Near Ratna Park"
                    value={locationDetails}
                    onChange={(e) => setLocationDetails(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Contact (Optional) */}
              <div className="rounded-lg border p-4">
                <h3 className="mb-3 font-medium">Contact Information (Optional)</h3>
                <p className="mb-3 text-xs text-muted-foreground">
                  Provide contact details if you want to be reached for updates. This will be
                  kept private.
                </p>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9841234567"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Public/Private */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is-public"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="is-public" className="cursor-pointer">
                  Make this complaint public
                </Label>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                ← Back
              </Button>
              <Button onClick={nextStep} className="flex-1">
                Continue →
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Evidence Upload */}
        {step === 3 && (
          <Card className="p-6">
            <h2 className="mb-2 text-xl font-semibold">Add Evidence (Optional)</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Upload photos, documents, audio, or video evidence to support your complaint
            </p>

            <FileUpload onFilesChange={setFiles} />

            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                ← Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1"
              >
                {loading ? <LoadingInline message="Submitting..." /> : 'Submit Complaint'}
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <Card className="p-8 text-center">
            <div className="mb-6 text-6xl">✅</div>
            <h2 className="mb-4 text-2xl font-bold text-green-600">
              Complaint Submitted Successfully!
            </h2>
            <div className="mb-6 rounded-lg bg-muted p-4">
              <p className="mb-2 text-sm font-medium">Your Tracking ID:</p>
              <p className="text-2xl font-mono font-bold text-primary">{trackingId}</p>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Save this tracking ID to monitor your complaint status. You can track it anytime
              without logging in.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => router.push(`/track?id=${trackingId}`)}
                className="flex-1"
              >
                Track This Complaint
              </Button>
              <Button onClick={() => router.push('/')} className="flex-1">
                Return Home
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
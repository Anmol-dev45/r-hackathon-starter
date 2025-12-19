'use client';

// Refactored Complaint Submission Form - GunaasoNepal
import { useState } from 'react';
import type { SubmissionType, ComplaintCategory } from '@/lib/types/database';
import { ProgressIndicator } from '@/components/complaint/progress-indicator';
import { IdentityStep } from '@/components/complaint/identity-step';
import { ComplaintDetailsStep } from '@/components/complaint/complaint-details-step';
import { EvidenceStep } from '@/components/complaint/evidence-step';
import { SuccessStep } from '@/components/complaint/success-step';
import { Alert } from '@/components/ui/alert';


export default function ComplaintFormPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingId, setTrackingId] = useState('');

  // Form state
  const [submissionType, setSubmissionType] = useState<SubmissionType>('anonymous');
  const [pseudonym, setPseudonym] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('corruption');
  const [includeLocation, setIncludeLocation] = useState(false);
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [ward, setWard] = useState('');
  const [includeContact, setIncludeContact] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [forwardingInfo, setForwardingInfo] = useState<{
    id: string;
    name: string;
    category: string;
  } | null>(null);

  // Reset form to initial state
  const resetForm = () => {
    setStep(1);
    setLoading(false);
    setError('');
    setTrackingId('');
    setSubmissionType('anonymous');
    setPseudonym('');
    setTitle('');
    setDescription('');
    setCategory('corruption');
    setIncludeLocation(false);
    setProvince('');
    setDistrict('');
    setMunicipality('');
    setWard('');
    setIncludeContact(false);
    setEmail('');
    setPhone('');
    setFiles([]);
    setForwardingInfo(null);
  };

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
        ...(includeLocation && {
          location: {
            province,
            district,
            municipality,
            ward: ward ? parseInt(ward) : undefined,
          }
        }),
        ...(includeContact && {
          contact: {
            email: email || undefined,
            phone: phone || undefined,
          }
        }),
        is_public: true,
      };

      const response = await fetch('/api/complaints/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit complaint');
      }

      const result = await response.json();
      setTrackingId(result.tracking_id);

      // Store forwarding info
      if (result.forwarding) {
        setForwardingInfo({
          id: result.forwarding.office_id,
          name: result.forwarding.office_name,
          category: result.forwarding.category || 'Government Office',
        });
      }

      // Upload evidence if any
      if (files.length > 0) {
        try {
          // Upload each file individually
          const uploadPromises = files.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('complaint_id', result.complaint_id);
            formData.append('is_public', 'true');

            console.log('Uploading file:', {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              complaintId: result.complaint_id
            });

            const uploadResponse = await fetch('/api/evidence/upload', {
              method: 'POST',
              body: formData,
            });

            const responseData = await uploadResponse.json();
            console.log('Upload response:', {
              status: uploadResponse.status,
              ok: uploadResponse.ok,
              data: responseData
            });

            if (!uploadResponse.ok) {
              console.error('File upload failed:', {
                fileName: file.name,
                error: responseData.message || responseData.error,
                fullError: responseData
              });
              throw new Error(responseData.message || responseData.error || 'Failed to upload file');
            }

            return responseData;
          });

          await Promise.all(uploadPromises);
        } catch (uploadError: any) {
          console.error('Evidence upload error:', uploadError);
          // Show a warning to the user but don't block the success screen
          setError(`Complaint submitted successfully, but some files failed to upload: ${uploadError.message}`);
          // Clear error after showing success
          setTimeout(() => setError(''), 5000);
        }
      }

      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ['Identity', 'Details', 'Evidence', 'Success'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-6 sm:py-8 md:py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground font-merriweather">
            Submit a Complaint
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Report issues and hold public officials accountable
          </p>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        {step < 4 && (
          <ProgressIndicator
            currentStep={step}
            totalSteps={4}
            labels={stepLabels}
          />
        )}

        {step === 1 && (
          <IdentityStep
            submissionType={submissionType}
            setSubmissionType={setSubmissionType}
            pseudonym={pseudonym}
            setPseudonym={setPseudonym}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <ComplaintDetailsStep
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            category={category}
            setCategory={setCategory}
            includeLocation={includeLocation}
            setIncludeLocation={setIncludeLocation}
            province={province}
            setProvince={setProvince}
            district={district}
            setDistrict={setDistrict}
            municipality={municipality}
            setMunicipality={setMunicipality}
            ward={ward}
            setWard={setWard}
            includeContact={includeContact}
            setIncludeContact={setIncludeContact}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <EvidenceStep
            files={files}
            setFiles={setFiles}
            onNext={handleSubmit}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && trackingId && (
          <SuccessStep
            trackingId={trackingId}
            forwardedTo={forwardingInfo || undefined}
            onNewComplaint={resetForm}
          />
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-4" />
              <p className="text-base sm:text-lg font-semibold">Submitting your complaint...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
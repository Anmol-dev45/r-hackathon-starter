// GunaasoNepal Home Page
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            गुनासो नेपाल
            <span className="mt-2 block text-primary">GunaasoNepal</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Empowering citizens to report governance issues, track complaints
            transparently, and hold authorities accountable.
          </p>
          <p className="mx-auto mb-10 max-w-2xl text-sm text-muted-foreground">
            नागरिकहरूलाई शासकीय समस्याहरू रिपोर्ट गर्न, गुनासोहरू पारदर्शी रूपमा ट्र्याक गर्न,
            र अधिकारीहरूलाई जवाफदेही बनाउन सशक्तीकरण।
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/complaint">
              <Button size="lg" className="w-full sm:w-auto">
                📝 Submit Complaint
              </Button>
            </Link>
            <Link href="/track">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                🔍 Track Complaint
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            🔒 Anonymous reporting allowed • No login required
          </p>
        </div>
      </section>

      {/* Why Use GunaasoNepal */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Why Use GunaasoNepal?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 text-center shadow-sm">
              <div className="mb-4 text-4xl">🔒</div>
              <h3 className="mb-2 font-semibold">Safe & Anonymous</h3>
              <p className="text-sm text-muted-foreground">
                Report issues anonymously or with your identity. Your privacy is
                protected.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-center shadow-sm">
              <div className="mb-4 text-4xl">📊</div>
              <h3 className="mb-2 font-semibold">Transparent Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Track your complaint status anytime with a unique tracking ID.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-center shadow-sm">
              <div className="mb-4 text-4xl">⚖️</div>
              <h3 className="mb-2 font-semibold">Accountability</h3>
              <p className="text-sm text-muted-foreground">
                Public complaints create transparency and encourage action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complaint Categories */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
            What Can You Report?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.key}
                className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
              >
                <div className="text-2xl">{category.icon}</div>
                <div>
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-xs text-muted-foreground">{category.nameNe}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <h3 className="mb-2 font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary px-4 py-16 text-primary-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Make a Difference?</h2>
          <p className="mb-8 text-lg opacity-90">
            Your voice matters. Report governance issues and help build a more
            accountable Nepal.
          </p>
          <Link href="/complaint">
            <Button size="lg" variant="secondary">
              Submit Your Complaint Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

const categories = [
  { key: 'corruption', name: 'Corruption', nameNe: 'भ्रष्टाचार', icon: '⚠️' },
  { key: 'infrastructure', name: 'Infrastructure', nameNe: 'पूर्वाधार', icon: '🏗️' },
  { key: 'service_delivery', name: 'Service Delivery', nameNe: 'सेवा प्रवाह', icon: '🏢' },
  { key: 'health_services', name: 'Health Services', nameNe: 'स्वास्थ्य सेवा', icon: '🏥' },
  { key: 'education', name: 'Education', nameNe: 'शिक्षा', icon: '📚' },
  { key: 'rti_request', name: 'Right to Information', nameNe: 'सूचनाको हक', icon: 'ℹ️' },
];

const steps = [
  {
    title: 'Submit',
    description: 'Fill out a simple form with your complaint details',
  },
  {
    title: 'Track',
    description: 'Get a unique tracking ID to monitor progress',
  },
  {
    title: 'Evidence',
    description: 'Upload photos, documents, or audio as proof',
  },
  {
    title: 'Resolution',
    description: 'Watch as your complaint is reviewed and addressed',
  },
];

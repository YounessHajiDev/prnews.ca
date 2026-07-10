'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TiptapEditor } from './tiptap-editor';
import {
  ChevronRight,
  ChevronLeft,
  FileText,
  PenLine,
  ImageIcon,
  Send,
  Mail,
  Eye,
} from 'lucide-react';

interface SubmissionWizardProps {
  initialData?: {
    headline?: string;
    headlineFr?: string;
    body?: string;
    bodyFr?: string;
    summary?: string;
    category?: string;
    language?: 'en' | 'fr' | 'both';
    dateline?: string;
    keywords?: string[];
    embargoAt?: string;
  };
  onSubmit: (data: any) => void;
}

type Step = 'basics' | 'body' | 'media' | 'distribution' | 'contact' | 'review';

const STEPS: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: 'basics', label: 'Basics', icon: FileText },
  { key: 'body', label: 'Body', icon: PenLine },
  { key: 'media', label: 'Media', icon: ImageIcon },
  { key: 'distribution', label: 'Distribution', icon: Send },
  { key: 'contact', label: 'Contact', icon: Mail },
  { key: 'review', label: 'Review', icon: Eye },
];

const CATEGORIES = [
  'Business', 'Technology', 'Health', 'Finance & Economy',
  'Government & Politics', 'Environment', 'Consumer Products',
  'Company Earnings', 'Nonprofit & Public Interest',
  'Sports & Entertainment', 'Real Estate', 'Energy & Mining',
  'Indigenous Affairs & Reconciliation', 'Cannabis',
];

const PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
  'Prince Edward Island', 'Quebec', 'Saskatchewan',
  'Northwest Territories', 'Nunavut', 'Yukon',
];

export function SubmissionWizard({ initialData, onSubmit }: SubmissionWizardProps) {
  const t = useTranslations('auth.signup');
  const [step, setStep] = useState<Step>('basics');
  const [data, setData] = useState({
    headline: initialData?.headline ?? '',
    headlineFr: initialData?.headlineFr ?? '',
    body: initialData?.body ?? '',
    bodyFr: initialData?.bodyFr ?? '',
    summary: initialData?.summary ?? '',
    category: initialData?.category ?? '',
    language: initialData?.language ?? 'en' as const,
    dateline: initialData?.dateline ?? '',
    keywords: initialData?.keywords ?? [],
    embargoAt: initialData?.embargoAt ?? '',
    mediaContactName: '',
    mediaContactEmail: '',
    mediaContactPhone: '',
    images: [] as File[],
    videos: [] as string[],
    pdf: null as File | null,
  });

  const updateField = useCallback(
    (field: string, value: any) => {
      setData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);
  const canGoBack = currentStepIndex > 0;
  const canGoForward = currentStepIndex < STEPS.length - 1;
  const isLastStep = step === 'review';

  const nextStep = () => {
    if (canGoForward) {
      setStep(STEPS[currentStepIndex + 1].key);
    }
  };

  const prevStep = () => {
    if (canGoBack) {
      setStep(STEPS[currentStepIndex - 1].key);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setStep(s.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                i === currentStepIndex
                  ? 'bg-wire-amber text-white'
                  : i < currentStepIndex
                    ? 'bg-wire-amber/20 text-wire-amber'
                    : 'text-wire-muted hover:text-wire-charcoal'
              }`}
            >
              <s.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>
        <div className="h-1 bg-wire-border rounded-full overflow-hidden">
          <div
            className="h-full bg-wire-amber rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="card p-8">
        {step === 'basics' && (
          <div className="space-y-6">
            <h2 className="heading-md">Release Basics</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Headline (English)</label>
              <Input
                value={data.headline}
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder="Your press release headline"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Headline (French)</label>
              <Input
                value={data.headlineFr}
                onChange={(e) => updateField('headlineFr', e.target.value)}
                placeholder="Titre du communiqué (optionnel)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Summary / Lead</label>
              <Input
                value={data.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                placeholder="A brief summary of your release"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={data.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full rounded-md border border-wire-border px-3 py-2 text-sm"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  value={data.language}
                  onChange={(e) => updateField('language', e.target.value)}
                  className="w-full rounded-md border border-wire-border px-3 py-2 text-sm"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="both">Bilingual (EN + FR)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dateline (City, Province)</label>
              <Input
                value={data.dateline}
                onChange={(e) => updateField('dateline', e.target.value)}
                placeholder="TORONTO, ON"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Keywords (comma separated)</label>
              <Input
                value={data.keywords.join(', ')}
                onChange={(e) => updateField('keywords', e.target.value.split(',').map((k: string) => k.trim()))}
                placeholder="AI, technology, funding"
              />
            </div>
          </div>
        )}

        {step === 'body' && (
          <div className="space-y-6">
            <h2 className="heading-md">Release Body</h2>
            <div>
              <label className="block text-sm font-medium mb-1">English Body</label>
              <TiptapEditor
                value={data.body}
                onChange={(val) => updateField('body', val)}
                placeholder="Write your press release body..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">French Body</label>
              <TiptapEditor
                value={data.bodyFr}
                onChange={(val) => updateField('bodyFr', val)}
                placeholder="Rédigez le corps de votre communiqué..."
              />
            </div>
          </div>
        )}

        {step === 'media' && (
          <div className="space-y-6">
            <h2 className="heading-md">Media Assets</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Images</label>
              <div className="border-2 border-dashed border-wire-border rounded-lg p-8 text-center">
                <p className="text-wire-muted">Drag and drop images here, or click to browse</p>
                <p className="text-xs text-wire-muted mt-2">JPG, PNG, WebP supported</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Video URLs</label>
              <Input
                placeholder="YouTube or Vimeo URL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">PDF / Media Kit</label>
              <div className="border-2 border-dashed border-wire-border rounded-lg p-8 text-center">
                <p className="text-wire-muted">Upload PDF media kit</p>
              </div>
            </div>
          </div>
        )}

        {step === 'distribution' && (
          <div className="space-y-6">
            <h2 className="heading-md">Distribution</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Distribution Tier</label>
              <select className="w-full rounded-md border border-wire-border px-3 py-2 text-sm">
                <option>National Distribution</option>
                <option>Regional Distribution</option>
                <option>Provincial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target Provinces</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {PROVINCES.map((prov) => (
                  <label key={prov} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    {prov}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Schedule / Embargo</label>
              <Input type="datetime-local" value={data.embargoAt} onChange={(e) => updateField('embargoAt', e.target.value)} />
            </div>
          </div>
        )}

        {step === 'contact' && (
          <div className="space-y-6">
            <h2 className="heading-md">Media Contact</h2>
            <p className="text-sm text-wire-muted">This information is visible only to journalists and will not appear in the published release.</p>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Name</label>
              <Input
                value={data.mediaContactName}
                onChange={(e) => updateField('mediaContactName', e.target.value)}
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Email</label>
              <Input
                type="email"
                value={data.mediaContactEmail}
                onChange={(e) => updateField('mediaContactEmail', e.target.value)}
                placeholder="jane@company.ca"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Phone</label>
              <Input
                value={data.mediaContactPhone}
                onChange={(e) => updateField('mediaContactPhone', e.target.value)}
                placeholder="416-555-0100"
              />
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-6">
            <h2 className="heading-md">Review &amp; Submit</h2>
            <div className="bg-wire-bg rounded-lg p-6 border border-wire-border">
              <h3 className="font-semibold mb-2">{data.headline || '(No headline)'}</h3>
              {data.summary && <p className="text-sm text-wire-muted mb-4">{data.summary}</p>}
              <div className="text-sm space-y-1">
                <p><strong>Category:</strong> {data.category || 'Not selected'}</p>
                <p><strong>Language:</strong> {data.language}</p>
                <p><strong>Word count:</strong> {data.body?.split(/\s+/).length || 0} words</p>
                <p><strong>Contact:</strong> {data.mediaContactName || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-wire-amber/10 border border-wire-amber/30">
              <p className="text-sm text-wire-muted">
                Submitting this release will enter it into our editorial review queue.
                Expected turnaround: under 2 business hours.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-wire-border">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={!canGoBack}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          {isLastStep ? (
            <Button onClick={() => onSubmit(data)}>Submit for Review</Button>
          ) : (
            <Button onClick={nextStep}>
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

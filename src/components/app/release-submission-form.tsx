'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TiptapEditor } from '@/components/editor/tiptap-editor';
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

const STEP_ICONS: Record<Step, React.ElementType> = {
  basics: FileText,
  body: PenLine,
  media: ImageIcon,
  distribution: Send,
  contact: Mail,
  review: Eye,
};

interface Option {
  value: string;
  label: string;
}

export function SubmissionWizard({ initialData, onSubmit }: SubmissionWizardProps) {
  const t = useTranslations('submission');
  const steps = t.raw('steps') as Array<{ key: Step; label: string }>;
  const categories = t.raw('categories') as Option[];
  const provinces = t.raw('provinces') as Option[];
  const languageOptions = t.raw('languageOptions') as Option[];
  const distributionTiers = t.raw('distributionTiers') as Option[];

  const [step, setStep] = useState<Step>('basics');
  const [data, setData] = useState({
    headline: initialData?.headline ?? '',
    headlineFr: initialData?.headlineFr ?? '',
    body: initialData?.body ?? '',
    bodyFr: initialData?.bodyFr ?? '',
    summary: initialData?.summary ?? '',
    category: initialData?.category ?? '',
    language: initialData?.language ?? ('en' as const),
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

  const updateField = useCallback((field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const currentStepIndex = steps.findIndex((s) => s.key === step);
  const canGoBack = currentStepIndex > 0;
  const canGoForward = currentStepIndex < steps.length - 1;
  const isLastStep = step === 'review';

  const nextStep = () => {
    if (canGoForward) {
      setStep(steps[currentStepIndex + 1].key);
    }
  };

  const prevStep = () => {
    if (canGoBack) {
      setStep(steps[currentStepIndex - 1].key);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((s, i) => {
            const StepIcon = STEP_ICONS[s.key];
            return (
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
                <StepIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>
        <div className="h-1 bg-wire-border rounded-full overflow-hidden">
          <div
            className="h-full bg-wire-amber rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="card p-8">
        {step === 'basics' && (
          <div className="space-y-6">
            <h2 className="heading-md">{t('basics.title')}</h2>
            <div>
              <label className="block text-sm font-medium mb-1">{t('basics.headlineEn')}</label>
              <Input
                value={data.headline}
                onChange={(e) => updateField('headline', e.target.value)}
                placeholder={t('basics.headlineEnPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('basics.headlineFr')}</label>
              <Input
                value={data.headlineFr}
                onChange={(e) => updateField('headlineFr', e.target.value)}
                placeholder={t('basics.headlineFrPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('basics.summary')}</label>
              <Input
                value={data.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                placeholder={t('basics.summaryPlaceholder')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('basics.category')}</label>
                <select
                  value={data.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full rounded-md border border-wire-border px-3 py-2 text-sm"
                >
                  <option value="">{t('basics.categoryPlaceholder')}</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('basics.language')}</label>
                <select
                  value={data.language}
                  onChange={(e) => updateField('language', e.target.value)}
                  className="w-full rounded-md border border-wire-border px-3 py-2 text-sm"
                >
                  {languageOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('basics.dateline')}</label>
              <Input
                value={data.dateline}
                onChange={(e) => updateField('dateline', e.target.value)}
                placeholder={t('basics.datelinePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('basics.keywords')}</label>
              <Input
                value={data.keywords.join(', ')}
                onChange={(e) => updateField('keywords', e.target.value.split(',').map((k: string) => k.trim()))}
                placeholder={t('basics.keywordsPlaceholder')}
              />
            </div>
          </div>
        )}

        {step === 'body' && (
          <div className="space-y-6">
            <h2 className="heading-md">{t('body.title')}</h2>
            <div>
              <label className="block text-sm font-medium mb-1">{t('body.englishBody')}</label>
              <TiptapEditor
                value={data.body}
                onChange={(val: string) => updateField('body', val)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('body.frenchBody')}</label>
              <TiptapEditor
                value={data.bodyFr}
                onChange={(val: string) => updateField('bodyFr', val)}
              />
            </div>
          </div>
        )}

        {step === 'media' && (
          <div className="space-y-6">
            <h2 className="heading-md">{t('media.title')}</h2>
            <div>
              <label className="block text-sm font-medium mb-1">{t('media.images')}</label>
              <div className="border-2 border-dashed border-wire-border rounded-lg p-8 text-center">
                <p className="text-wire-muted">{t('media.dragDropImages')}</p>
                <p className="text-xs text-wire-muted mt-2">{t('media.imageFormats')}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('media.videoUrl')}</label>
              <Input
                placeholder={t('media.videoPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('media.pdf')}</label>
              <div className="border-2 border-dashed border-wire-border rounded-lg p-8 text-center">
                <p className="text-wire-muted">{t('media.pdfPlaceholder')}</p>
              </div>
            </div>
          </div>
        )}

        {step === 'distribution' && (
          <div className="space-y-6">
            <h2 className="heading-md">{t('distribution.title')}</h2>
            <div>
              <label className="block text-sm font-medium mb-1">{t('distribution.tier')}</label>
              <select className="w-full rounded-md border border-wire-border px-3 py-2 text-sm">
                {distributionTiers.map((tier) => (
                  <option key={tier.value} value={tier.value}>{tier.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('distribution.targetProvinces')}</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {provinces.map((prov) => (
                  <label key={prov.value} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    {prov.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('distribution.schedule')}</label>
              <Input type="datetime-local" value={data.embargoAt} onChange={(e) => updateField('embargoAt', e.target.value)} />
            </div>
          </div>
        )}

        {step === 'contact' && (
          <div className="space-y-6">
            <h2 className="heading-md">{t('contact.title')}</h2>
            <p className="text-sm text-wire-muted">{t('contact.note')}</p>
            <div>
              <label className="block text-sm font-medium mb-1">{t('contact.name')}</label>
              <Input
                value={data.mediaContactName}
                onChange={(e) => updateField('mediaContactName', e.target.value)}
                placeholder={t('contact.namePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('contact.email')}</label>
              <Input
                type="email"
                value={data.mediaContactEmail}
                onChange={(e) => updateField('mediaContactEmail', e.target.value)}
                placeholder={t('contact.emailPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('contact.phone')}</label>
              <Input
                value={data.mediaContactPhone}
                onChange={(e) => updateField('mediaContactPhone', e.target.value)}
                placeholder={t('contact.phonePlaceholder')}
              />
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-6">
            <h2 className="heading-md">{t('review.title')}</h2>
            <div className="bg-wire-bg rounded-lg p-6 border border-wire-border">
              <h3 className="font-semibold mb-2">{data.headline || t('review.noHeadline')}</h3>
              {data.summary && <p className="text-sm text-wire-muted mb-4">{data.summary}</p>}
              <div className="text-sm space-y-1">
                <p><strong>{t('review.category')}:</strong> {categories.find((c) => c.value === data.category)?.label || t('review.notSelected')}</p>
                <p><strong>{t('review.language')}:</strong> {languageOptions.find((l) => l.value === data.language)?.label || data.language}</p>
                <p><strong>{t('review.wordCount')}:</strong> {data.body?.split(/\s+/).length || 0} {t('review.words')}</p>
                <p><strong>{t('review.contact')}:</strong> {data.mediaContactName || t('review.notSet')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-wire-amber/10 border border-wire-amber/30">
              <p className="text-sm text-wire-muted">{t('review.turnaround')}</p>
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
            <ChevronLeft className="w-4 h-4 mr-1" /> {t('navigation.back')}
          </Button>
          {isLastStep ? (
            <Button onClick={() => onSubmit(data)}>{t('navigation.submit')}</Button>
          ) : (
            <Button onClick={nextStep}>
              {t('navigation.continue')} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

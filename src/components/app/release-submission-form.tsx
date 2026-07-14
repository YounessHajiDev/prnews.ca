'use client';

import { useState, useCallback, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  Loader2,
  X,
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
  onSubmit: (data: any) => Promise<{ success?: boolean; error?: string; releaseId?: string }>;
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
    imageUrls: [] as string[],
    videoUrls: [] as string[],
    pdfUrl: null as string | null,
  });

  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const updateField = useCallback((field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const uploadFiles = useCallback(async (files: FileList | null, type: 'image' | 'pdf') => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError('');
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || 'Upload failed');
        }
        newUrls.push(json.url);
      }
      if (type === 'image') {
        setData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ...newUrls] }));
      } else if (type === 'pdf') {
        setData((prev) => ({ ...prev, pdfUrl: newUrls[0] || null }));
      }
    } catch (err: any) {
      setUploadError(t('media.uploadError'));
    } finally {
      setUploading(false);
    }
  }, [t]);

  const removeImage = useCallback((url: string) => {
    setData((prev) => ({ ...prev, imageUrls: prev.imageUrls.filter((u) => u !== url) }));
  }, []);

  const addVideo = useCallback(() => {
    setData((prev) => ({ ...prev, videoUrls: [...prev.videoUrls, ''] }));
  }, []);

  const updateVideo = useCallback((index: number, value: string) => {
    setData((prev) => {
      const urls = [...prev.videoUrls];
      urls[index] = value;
      return { ...prev, videoUrls: urls };
    });
  }, []);

  const removeVideo = useCallback((index: number) => {
    setData((prev) => {
      const urls = [...prev.videoUrls];
      urls.splice(index, 1);
      return { ...prev, videoUrls: urls };
    });
  }, []);

  const removePdf = useCallback(() => {
    setData((prev) => ({ ...prev, pdfUrl: null }));
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
                    ? 'bg-wire-brass-dark text-white'
                    : i < currentStepIndex
                      ? 'bg-wire-brass/20 text-wire-brass-dark'
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
            className="h-full bg-wire-brass-dark rounded-full transition-all duration-300"
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
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => uploadFiles(e.target.files, 'image')}
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-wire-border rounded-lg p-6 text-center hover:bg-wire-bg transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <span className="inline-flex items-center gap-2 text-wire-muted">
                    <Loader2 className="w-4 h-4 animate-spin" /> {t('media.uploading')}
                  </span>
                ) : (
                  <>
                    <p className="text-wire-muted">{t('media.dragDropImages')}</p>
                    <p className="text-xs text-wire-muted mt-2">{t('media.imageFormats')}</p>
                  </>
                )}
              </button>
              {data.imageUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {data.imageUrls.map((url) => (
                    <div key={url} className="relative group aspect-square rounded-lg border border-wire-border overflow-hidden bg-wire-bg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="absolute top-1 right-1 p-1 bg-wire-ink text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={t('media.remove')}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t('media.videoUrl')}</label>
              {data.videoUrls.map((url, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <Input
                    value={url}
                    onChange={(e) => updateVideo(i, e.target.value)}
                    placeholder={t('media.videoPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => removeVideo(i)}
                    className="p-2 text-wire-muted hover:text-wire-error"
                    aria-label={t('media.remove')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addVideo}>
                {t('media.addVideo')}
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t('media.pdf')}</label>
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => uploadFiles(e.target.files, 'pdf')}
              />
              {data.pdfUrl ? (
                <div className="flex items-center justify-between p-3 rounded-lg border border-wire-border bg-wire-bg">
                  <a href={data.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-wire-brass-dark hover:underline truncate">
                    {data.pdfUrl.split('/').pop()}
                  </a>
                  <button
                    type="button"
                    onClick={removePdf}
                    className="text-sm text-wire-muted hover:text-wire-ink"
                  >
                    {t('media.changePdf')}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full border-2 border-dashed border-wire-border rounded-lg p-6 text-center hover:bg-wire-bg transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="inline-flex items-center gap-2 text-wire-muted">
                      <Loader2 className="w-4 h-4 animate-spin" /> {t('media.uploading')}
                    </span>
                  ) : (
                    <p className="text-wire-muted">{t('media.pdfPlaceholder')}</p>
                  )}
                </button>
              )}
            </div>

            {uploadError && (
              <p className="text-sm text-red-600" role="alert">{uploadError}</p>
            )}
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
                {data.imageUrls.length > 0 && <p><strong>{t('media.images')}:</strong> {data.imageUrls.length}</p>}
                {data.videoUrls.length > 0 && <p><strong>{t('media.videoUrl')}:</strong> {data.videoUrls.length}</p>}
                {data.pdfUrl && <p><strong>{t('media.pdf')}:</strong> {data.pdfUrl.split('/').pop()}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-wire-brass/10 border border-wire-brass/30">
              <p className="text-sm text-wire-muted">{t('review.turnaround')}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-wire-border">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={!canGoBack || isPending}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> {t('navigation.back')}
          </Button>
          {isLastStep ? (
            <Button
              onClick={() => {
                setSubmitError('');
                setSubmitSuccess(false);
                startTransition(async () => {
                  const result = await onSubmit(data);
                  if (result?.error) {
                    setSubmitError(result.error);
                  } else if (result?.success) {
                    setSubmitSuccess(true);
                    setTimeout(() => router.push('/app/releases'), 1500);
                  }
                });
              }}
              disabled={isPending}
            >
              {isPending ? 'Submitting...' : t('navigation.submit')}
            </Button>
          ) : (
            <Button onClick={nextStep} disabled={isPending}>
              {t('navigation.continue')} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
        {submitError && (
          <p className="mt-4 text-sm text-red-600" role="alert">{submitError}</p>
        )}
        {submitSuccess && (
          <p className="mt-4 text-sm text-green-600" role="status">
            Submitted for review. Redirecting...
          </p>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface WebsiteOptions {
  websiteName: string;
  colorScheme: string;
  wordCount: number;
  emailCaptureEnabled: boolean;
  affiliateEnabled: boolean;
}

const COLOR_OPTIONS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Green', value: '#10b981' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Pink', value: '#ec4899' },
];

const WORD_COUNT_OPTIONS = [500, 1000, 1500, 2000, 2500, 3000];

interface WebsiteBuilderAdvancedProps {
  onGenerate: (options: WebsiteOptions & { htmlContent: string }) => Promise<void>;
  isGenerating?: boolean;
}

export function WebsiteBuilderAdvanced({
  onGenerate,
  isGenerating = false,
}: WebsiteBuilderAdvancedProps) {
  const [options, setOptions] = useState<WebsiteOptions>({
    websiteName: '',
    colorScheme: '#3b82f6',
    wordCount: 1500,
    emailCaptureEnabled: true,
    affiliateEnabled: true,
  });
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!options.websiteName.trim()) {
      setError('Please enter a website name');
      return;
    }

    setError('');
    setGenerating(true);

    try {
      // Generate HTML from Gemini with these options
      const response = await fetch('/api/website/generate-advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate website');
      }

      const { htmlContent } = await response.json();

      await onGenerate({
        ...options,
        htmlContent,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to generate website');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Build Your Unique Website
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Customize every aspect of your AI-generated website. Your header, footer, and affiliate section are included automatically.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Website Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Website Name</label>
          <Input
            placeholder="e.g., Digital Marketing Tips"
            value={options.websiteName}
            onChange={(e) =>
              setOptions({ ...options, websiteName: e.target.value })
            }
            disabled={generating || isGenerating}
          />
          <p className="text-xs text-gray-500 mt-1">
            Used for your site title and branding
          </p>
        </div>

        {/* Color Scheme */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Color Theme
          </label>
          <div className="grid grid-cols-4 gap-2">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color.value}
                onClick={() =>
                  setOptions({ ...options, colorScheme: color.value })
                }
                disabled={generating || isGenerating}
                className={`p-3 rounded-lg border-2 transition-all ${
                  options.colorScheme === color.value
                    ? 'border-gray-900'
                    : 'border-gray-200'
                }`}
                title={color.name}
              >
                <div
                  className="w-full h-6 rounded"
                  style={{ backgroundColor: color.value }}
                />
                <p className="text-xs mt-1 text-center text-gray-600">
                  {color.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Word Count */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Content Length
          </label>
          <div className="grid grid-cols-3 gap-2">
            {WORD_COUNT_OPTIONS.map((count) => (
              <button
                key={count}
                onClick={() =>
                  setOptions({ ...options, wordCount: count })
                }
                disabled={generating || isGenerating}
                className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  options.wordCount === count
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200'
                }`}
              >
                {count.toLocaleString()} words
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            More words = deeper content (takes longer to generate)
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium">Included Features</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.emailCaptureEnabled}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    emailCaptureEnabled: e.target.checked,
                  })
                }
                disabled={generating || isGenerating}
              />
              <label>Email capture form (for lead generation)</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.affiliateEnabled}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    affiliateEnabled: e.target.checked,
                  })
                }
                disabled={generating || isGenerating}
              />
              <label>Affiliate commission section</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked disabled />
              <label>Your header & footer for legal compliance</label>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={generating || isGenerating || !options.websiteName.trim()}
        className="w-full"
        size="lg"
      >
        {generating || isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Your Website...
          </>
        ) : (
          'Generate Website'
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Generation typically takes 30-60 seconds depending on content length
      </p>
    </Card>
  );
}

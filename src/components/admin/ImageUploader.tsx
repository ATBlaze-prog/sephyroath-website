'use client';

import { useEffect, useMemo, useState } from 'react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helpText?: string;
}

export default function ImageUploader({ label, value, onChange, helpText }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(value || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setPreviewUrl(value || '');
  }, [value]);

  const objectUrl = useMemo(() => {
    return previewUrl.startsWith('blob:') ? previewUrl : undefined;
  }, [previewUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPG, JPEG, PNG, and WEBP images are supported.');
      return;
    }

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Upload failed');
        return;
      }

      onChange(data.data.url);
      setPreviewUrl(data.data.url);
    } catch (uploadError) {
      setError('Failed to upload image.');
      console.error(uploadError);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-so-gray-200">{label}</label>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-start">
        <div className="rounded-2xl border border-so-primary/20 bg-so-dark/80 p-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-40 w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-so-primary/40 bg-so-darker text-sm text-so-gray-400">
              No preview available
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="block rounded-2xl border border-so-primary/20 bg-so-dark/80 p-4 text-sm text-so-gray-300 hover:border-so-primary transition-colors cursor-pointer">
            <span className="block font-medium text-white">Upload Image</span>
            <span className="block text-xs text-so-gray-400">JPG, JPEG, PNG or WEBP</span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {uploading ? (
            <div className="rounded-2xl bg-so-primary/10 px-4 py-3 text-sm text-so-primary">Uploading image…</div>
          ) : (
            <p className="text-sm text-so-gray-400">{helpText || 'Upload an image to automatically generate a hosted URL.'}</p>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste an existing image URL"
        className="w-full rounded-2xl border border-so-primary/20 bg-so-dark/80 px-4 py-3 text-sm text-so-gray-100"
      />
    </div>
  );
}

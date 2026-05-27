'use client';

import { DragEvent, useMemo, useState } from 'react';
import { AlertTriangle, ImagePlus, UploadCloud, X } from 'lucide-react';
import { useImageUpload } from '@/lib/useImageUpload';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helpText?: string;
  required?: boolean;
}

export default function ImageUploader({
  label,
  value,
  onChange,
  helpText,
  required = false,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { assets, loading, error, isLibraryOpen, setIsLibraryOpen, uploadFile } = useImageUpload();
  const [localPreview, setLocalPreview] = useState<string>('');

  const previewUrl = localPreview || value;
  const isValidUrl = typeof previewUrl === 'string' && previewUrl.length > 0;

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await handleFileUpload(file);
  };

  const handleFileUpload = async (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return;
    }

    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);

    try {
      const asset = await uploadFile(file);
      onChange(asset.url);
      setLocalPreview(asset.url);
    } catch (uploadError) {
      console.error(uploadError);
    }
  };

  const objectUrl = useMemo(() => {
    return previewUrl?.startsWith('blob:') ? previewUrl : undefined;
  }, [previewUrl]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-so-gray-200">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setIsLibraryOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl border border-so-primary/20 bg-so-dark/80 px-4 py-2 text-sm text-so-gray-200 hover:border-so-primary transition-colors"
        >
          <ImagePlus size={16} />
          Select from library
        </button>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-3xl border-2 ${
          isDragging ? 'border-so-primary/80 bg-so-primary/10' : 'border-dashed border-so-primary/30 bg-so-dark/80'
        } p-6 transition-all duration-200`}
      >
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-so-darker text-so-primary">
            <UploadCloud size={28} />
          </div>
          <div className="space-y-2">
            <p className="font-medium text-white">Drag & drop an image here</p>
            <p className="text-sm text-so-gray-400">or select a file from your device</p>
          </div>
          <label className="inline-flex cursor-pointer items-center rounded-2xl border border-so-primary/20 bg-so-darker px-4 py-2 text-sm text-so-gray-100 hover:border-so-primary transition-colors">
            Choose file
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (file) await handleFileUpload(file);
              }}
            />
          </label>
        </div>
      </div>

      {previewUrl ? (
        <div className="relative overflow-hidden rounded-3xl border border-so-primary/20 bg-so-dark/80">
          <img
            src={previewUrl}
            alt="Upload preview"
            className="h-64 w-full object-cover"
          />
          <button
            type="button"
            onClick={() => {
              onChange('');
              setLocalPreview('');
            }}
            className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white hover:bg-black/90"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="rounded-3xl border border-so-primary/20 bg-so-dark/80 p-6 text-center text-so-gray-400">
          Image preview will appear here after upload.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste an existing image URL"
          className="w-full rounded-2xl border border-so-primary/20 bg-so-dark/80 px-4 py-3 text-sm text-so-gray-100"
        />
        <button
          type="button"
          onClick={() => {
            onChange('');
            setLocalPreview('');
          }}
          className="rounded-2xl border border-so-primary/20 bg-so-dark/80 px-4 py-3 text-sm text-so-gray-100 hover:bg-so-primary/10 transition-colors"
        >
          Clear
        </button>
      </div>

      {loading && <p className="text-sm text-so-primary">Uploading image…</p>}
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </p>
      )}

      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4">
          <div className="mx-auto w-full max-w-4xl rounded-3xl bg-so-dark p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">Select previously uploaded media</h3>
                <p className="text-sm text-so-gray-400">Choose an existing asset from your Cloudinary library.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="rounded-full border border-so-primary/20 bg-so-dark/80 p-3 text-so-gray-100 hover:bg-so-primary/10"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {assets.length === 0 ? (
                <div className="rounded-3xl border border-so-primary/20 bg-so-darker p-8 text-center text-so-gray-400">
                  No assets found. Upload a new image first.
                </div>
              ) : (
                assets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      onChange(asset.url);
                      setLocalPreview(asset.url);
                      setIsLibraryOpen(false);
                    }}
                    className="group overflow-hidden rounded-3xl border border-so-primary/20 bg-so-darker text-left transition hover:border-so-primary"
                  >
                    <div className="relative h-40 overflow-hidden bg-black/10">
                      <img src={asset.url} alt={asset.filename} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-white truncate">{asset.filename}</p>
                      <p className="text-sm text-so-gray-400">{new Date(asset.createdAt).toLocaleDateString()}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {helpText && <p className="text-sm text-so-gray-400">{helpText}</p>}
    </div>
  );
}

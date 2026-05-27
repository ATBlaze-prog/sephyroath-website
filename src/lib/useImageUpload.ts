'use client';

import { useCallback, useEffect, useState } from 'react';

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export function useImageUpload() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const fetchAssets = useCallback(async () => {
    setError('');
    try {
      const res = await fetch('/api/media');
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to load media library');
      }
      setAssets(json.data || []);
    } catch (err) {
      setError('Unable to load uploaded media.');
      console.error(err);
    }
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Upload failed');
      }

      const asset: MediaAsset = json.data;
      setAssets((current) => [asset, ...current]);
      return asset;
    } catch (uploadError) {
      setError('Upload failed. Please try a different image.');
      console.error(uploadError);
      throw uploadError;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLibraryOpen && assets.length === 0) {
      fetchAssets();
    }
  }, [isLibraryOpen, assets.length, fetchAssets]);

  return {
    assets,
    loading,
    error,
    isLibraryOpen,
    setIsLibraryOpen,
    fetchAssets,
    uploadFile,
  };
}

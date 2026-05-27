'use client';

import { useEffect, useMemo, useState } from 'react';
import ImageUploader from '@/components/admin/ImageUploader';
import { Trash2 } from 'lucide-react';

interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSearch, setSelectedSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load media assets.');
      setAssets(data.data || []);
    } catch (err) {
      setError('Unable to load media assets.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = useMemo(
    () =>
      assets.filter((asset) =>
        asset.filename.toLowerCase().includes(selectedSearch.toLowerCase())
      ),
    [assets, selectedSearch]
  );

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const pageAssets = filteredAssets.slice((page - 1) * pageSize, page * pageSize);

  const removeAsset = async (id: string) => {
    if (!confirm('Delete this media asset?')) return;
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setAssets((current) => current.filter((asset) => asset.id !== id));
    } catch (err) {
      setError('Failed to delete media asset.');
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">Media Library</h1>
          <p className="mt-2 text-so-gray-300 max-w-2xl">
            Upload, preview, and manage website media assets. All uploads persist in the cloud.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(420px,_1fr)_420px]">
        <div className="rounded-3xl border border-so-primary/20 bg-so-dark/80 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Library</h2>
              <p className="text-so-gray-400">Search all uploaded images and manage them instantly.</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search media..."
                value={selectedSearch}
                onChange={(event) => {
                  setSelectedSearch(event.target.value);
                  setPage(1);
                }}
                className="rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100 w-full min-w-[220px]"
              />
            </div>
          </div>

          {loading ? (
            <div className="mt-8 text-so-gray-300">Loading assets…</div>
          ) : filteredAssets.length === 0 ? (
            <div className="mt-8 text-so-gray-400">No media assets found.</div>
          ) : (
            <div className="mt-8 grid gap-4">
              {pageAssets.map((asset) => (
                <div key={asset.id} className="rounded-3xl border border-so-primary/20 bg-so-darker p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-3xl bg-gray-700">
                      <img src={asset.url} alt={asset.filename} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{asset.filename}</p>
                      <p className="text-sm text-so-gray-400">{asset.mimeType}, {Math.round(asset.size / 1024)} KB</p>
                      <p className="text-sm text-so-gray-400">Uploaded {new Date(asset.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => removeAsset(asset.id)}
                      className="rounded-full border border-red-500 p-3 text-red-300 hover:bg-red-500/10 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3 text-so-gray-300">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="rounded-2xl border border-so-primary/20 px-4 py-2 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                className="rounded-2xl border border-so-primary/20 px-4 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-so-primary/20 bg-so-dark/80 p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Upload New Image</h2>
          <ImageUploader
            label="Media Upload"
            value={imageUrl}
            onChange={setImageUrl}
            helpText="Upload an image to receive a permanent hosted URL for events, announcements, tournaments, and profiles."
          />
          <button
            type="button"
            onClick={() => setImageUrl('')}
            className="mt-4 rounded-2xl border border-so-primary/20 px-5 py-3 text-sm text-so-gray-100 hover:bg-so-primary/10"
          >
            Reset URL
          </button>
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          {uploading && <p className="mt-4 text-sm text-so-primary">Uploading...</p>}
        </div>
      </div>
    </div>
  );
}

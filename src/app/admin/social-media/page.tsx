/**
 * Social Media Links Management Panel
 */

'use client';

import { useEffect, useState } from 'react';
import { Trash2, Edit2, Plus, Eye, EyeOff } from 'lucide-react';

interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
  isEnabled: boolean;
  order: number;
}

const PLATFORMS = [
  { value: 'FACEBOOK', label: 'Facebook' },
  { value: 'DISCORD', label: 'Discord' },
  { value: 'TIKTOK', label: 'TikTok' },
  { value: 'YOUTUBE', label: 'YouTube' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'TWITCH', label: 'Twitch' },
  { value: 'WEBSITE', label: 'Official Website' },
];

export default function SocialMediaPanel() {
  const [links, setLinks] = useState<SocialMediaLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    platform: 'DISCORD',
    url: '',
    isEnabled: true,
    order: 0,
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/social-media');
      const data = await res.json();
      setLinks(data.data || []);
    } catch (error) {
      console.error('Error fetching social media links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId ? `/api/social-media/${editingId}` : '/api/social-media';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save link');
      }

      fetchLinks();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        platform: 'DISCORD',
        url: '',
        isEnabled: true,
        order: 0,
      });
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to save link');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (link: SocialMediaLink) => {
    setEditingId(link.id);
    setFormData({
      platform: link.platform,
      url: link.url,
      isEnabled: link.isEnabled,
      order: link.order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const res = await fetch(`/api/social-media/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete link');
      fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('Failed to delete link');
    }
  };

  const toggleEnabled = async (link: SocialMediaLink) => {
    try {
      const res = await fetch(`/api/social-media/${link.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: link.url,
          isEnabled: !link.isEnabled,
          order: link.order,
        }),
      });
      if (!res.ok) throw new Error('Failed to update link');
      fetchLinks();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update link');
    }
  };

  const getPlatformLabel = (platform: string) => {
    return PLATFORMS.find((p) => p.value === platform)?.label || platform;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Social Media Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              platform: 'DISCORD',
              url: '',
              isEnabled: true,
              order: 0,
            });
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add Link
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingId ? 'Edit' : 'Add'} Social Media Link
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Platform</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                disabled={!!editingId}
              >
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="url"
              placeholder="https://..."
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            />

            <input
              type="number"
              placeholder="Order"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            />

            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={formData.isEnabled}
                onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                className="w-4 h-4"
              />
              Enabled
            </label>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Update' : 'Add'} Link
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-white">Loading...</div>
      ) : links.length === 0 ? (
        <div className="text-gray-400">No social media links configured yet.</div>
      ) : (
        <div className="grid gap-4">
          {links
            .sort((a, b) => a.order - b.order)
            .map((link) => (
              <div key={link.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-white">{getPlatformLabel(link.platform)}</h3>
                    <p className="text-gray-400 text-sm mt-1">{link.url}</p>
                    <p className="text-gray-500 text-xs mt-2">Order: {link.order}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleEnabled(link)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                      title={link.isEnabled ? 'Disable' : 'Enable'}
                    >
                      {link.isEnabled ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <button
                      onClick={() => handleEdit(link)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

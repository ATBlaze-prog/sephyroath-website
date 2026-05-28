/**
 * Global Announcements Management Panel
 */

'use client';

import { useEffect, useState } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface GlobalAnnouncement {
  id: string;
  title: string;
  content: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const SEVERITY_OPTIONS = [
  { value: 'INFO', label: 'Info', color: 'bg-blue-600' },
  { value: 'WARNING', label: 'Warning', color: 'bg-yellow-600' },
  { value: 'CRITICAL', label: 'Critical', color: 'bg-red-600' },
];

export default function GlobalAnnouncementsPanel() {
  const [announcements, setAnnouncements] = useState<GlobalAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    severity: 'INFO',
    isActive: true,
    expiresAt: '',
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      // Fetch all announcements (not just active) for admin view
      const res = await fetch('/api/global-announcements?admin=true');
      if (!res.ok) {
        // Fallback to regular endpoint if admin endpoint doesn't exist
        const fallback = await fetch('/api/global-announcements');
        const data = await fallback.json();
        setAnnouncements(data.data || []);
      } else {
        const data = await res.json();
        setAnnouncements(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/global-announcements/${editingId}` : '/api/global-announcements';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        }),
      });

      if (!res.ok) throw new Error('Failed to save announcement');

      fetchAnnouncements();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        content: '',
        severity: 'INFO',
        isActive: true,
        expiresAt: '',
      });
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save announcement');
    }
  };

  const handleEdit = (announcement: GlobalAnnouncement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      severity: announcement.severity,
      isActive: announcement.isActive,
      expiresAt: announcement.expiresAt
        ? new Date(announcement.expiresAt).toISOString().slice(0, 16)
        : '',
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const res = await fetch(`/api/global-announcements/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete announcement');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement');
    }
  };

  const toggleActive = async (announcement: GlobalAnnouncement) => {
    try {
      const res = await fetch(`/api/global-announcements/${announcement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...announcement,
          isActive: !announcement.isActive,
        }),
      });
      if (!res.ok) throw new Error('Failed to update announcement');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error updating announcement:', error);
      alert('Failed to update announcement');
    }
  };

  const getSeverityColor = (severity: string) => {
    return SEVERITY_OPTIONS.find((s) => s.value === severity)?.color || 'bg-gray-600';
  };

  const getSeverityLabel = (severity: string) => {
    return SEVERITY_OPTIONS.find((s) => s.value === severity)?.label || severity;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Global Announcements</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              title: '',
              content: '',
              severity: 'INFO',
              isActive: true,
              expiresAt: '',
            });
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Create Announcement
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingId ? 'Edit Announcement' : 'Create New Announcement'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Announcement Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
              required
            />

            <textarea
              placeholder="Announcement Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 h-32"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
              >
                {SEVERITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <input
                type="datetime-local"
                placeholder="Expires At (optional)"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
              />
            </div>

            <label className="flex items-center gap-3 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Active (visible to public)</span>
            </label>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Update' : 'Create'} Announcement
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-white">Loading announcements...</div>
      ) : (
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              No announcements. Create one to get started!
            </div>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{announcement.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getSeverityColor(announcement.severity)}`}>
                        {getSeverityLabel(announcement.severity)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${announcement.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {announcement.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{announcement.content}</p>
                    {announcement.expiresAt && (
                      <p className="text-gray-500 text-xs">
                        Expires: {new Date(announcement.expiresAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Events Management Panel
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/admin/ImageUploader';
import { Event } from '@prisma/client';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface EventWithCreator extends Event {
  creator?: {
    id: string;
    email: string;
  };
}

export default function EventsPanel() {
  const [events, setEvents] = useState<EventWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'MEETING',
    startTime: '',
    endTime: '',
    location: '',
    bannerUrl: '',
    status: 'DRAFT',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/events/${editingId}` : '/api/events';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save event');

      fetchEvents();
      try { router.refresh(); } catch {}
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        eventType: 'MEETING',
        startTime: '',
        endTime: '',
        location: '',
        bannerUrl: '',
        status: 'DRAFT',
      });
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    }
  };

  const handleEdit = (event: EventWithCreator) => {
    setFormData({
      title: event.title,
      description: event.description || '',
      eventType: event.eventType,
      startTime: new Date(event.startTime).toISOString().slice(0, 16),
      endTime: event.endTime ? new Date(event.endTime).toISOString().slice(0, 16) : '',
      location: event.location || '',
      bannerUrl: event.bannerUrl || '',
      status: event.status as string,
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete event');
      fetchEvents();
      try { router.refresh(); } catch {}
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Events Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              title: '',
              description: '',
              eventType: 'MEETING',
              startTime: '',
              endTime: '',
              location: '',
              bannerUrl: '',
              status: 'DRAFT',
            });
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Create Event
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingId ? 'Edit Event' : 'Create New Event'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Event Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                required
              />
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
              >
                <option value="MEETING">Meeting</option>
                <option value="SCRIM">Scrim</option>
                <option value="PRACTICE">Practice</option>
                <option value="TOURNAMENT">Tournament</option>
                <option value="GIVEAWAY">Giveaway</option>
              </select>
            </div>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                required
              />
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
              />
              <ImageUploader
                label="Banner Image"
                value={formData.bannerUrl}
                onChange={(url) => setFormData({ ...formData, bannerUrl: url })}
                helpText="Upload or select a banner for this event"
              />
            </div>

            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Update' : 'Create'} Event
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
        <div className="text-white">Loading events...</div>
      ) : (
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              No events found. Create one to get started!
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{event.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{event.eventType}</p>
                    {event.description && (
                      <p className="text-gray-300 mt-2">{event.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(event.startTime).toLocaleDateString()} - Status:{' '}
                      <span className="text-purple-400">{event.status}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
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

/**
 * Tournaments Management Panel
 */

'use client';

import { useEffect, useState } from 'react';
import ImageUploader from '@/components/admin/ImageUploader';
import { Tournament } from '@prisma/client';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface TournamentWithCreator extends Tournament {
  creator?: {
    id: string;
    email: string;
  };
}

export default function TournamentsPanel() {
  const [tournaments, setTournaments] = useState<TournamentWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'UPCOMING',
    startDate: '',
    bannerUrl: '',
    prizePool: '',
    maxTeams: '',
    rules: '',
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const res = await fetch('/api/tournaments');
      const data = await res.json();
      setTournaments(data.data || []);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/tournaments/${editingId}` : '/api/tournaments';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save tournament');

      fetchTournaments();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        status: 'UPCOMING',
        startDate: '',
        bannerUrl: '',
        prizePool: '',
        maxTeams: '',
        rules: '',
      });
    } catch (error) {
      console.error('Error saving tournament:', error);
      alert('Failed to save tournament');
    }
  };

  const handleEdit = (tournament: TournamentWithCreator) => {
    setFormData({
      title: tournament.title,
      description: tournament.description || '',
      status: tournament.status,
      startDate: new Date(tournament.startDate).toISOString().slice(0, 16),
      bannerUrl: tournament.bannerUrl || '',
      prizePool: tournament.prizePool || '',
      maxTeams: tournament.maxTeams?.toString() || '',
      rules: tournament.rules || '',
    });
    setEditingId(tournament.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tournament?')) return;

    try {
      const res = await fetch(`/api/tournaments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete tournament');
      fetchTournaments();
    } catch (error) {
      console.error('Error deleting tournament:', error);
      alert('Failed to delete tournament');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Tournaments Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              title: '',
              description: '',
              status: 'UPCOMING',
              startDate: '',
              bannerUrl: '',
              prizePool: '',
              maxTeams: '',
              rules: '',
            });
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Create Tournament
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingId ? 'Edit Tournament' : 'Create New Tournament'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Tournament Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
              required
            />

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Prize Pool"
                value={formData.prizePool}
                onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
              />
              <input
                type="number"
                placeholder="Max Teams"
                value={formData.maxTeams}
                onChange={(e) => setFormData({ ...formData, maxTeams: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
              />
            </div>

            <ImageUploader
              label="Banner Image"
              value={formData.bannerUrl}
              onChange={(url) => setFormData({ ...formData, bannerUrl: url })}
              helpText="Upload or select a banner image for the tournament."
            />

            <textarea
              placeholder="Rules (optional)"
              value={formData.rules}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            />

            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Update' : 'Create'} Tournament
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
        <div className="text-white">Loading tournaments...</div>
      ) : (
        <div className="space-y-4">
          {tournaments.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              No tournaments found. Create one to get started!
            </div>
          ) : (
            tournaments.map((tournament) => (
              <div key={tournament.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{tournament.title}</h3>
                    {tournament.description && (
                      <p className="text-gray-300 mt-2">{tournament.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(tournament.startDate).toLocaleDateString()} - Status:{' '}
                      <span className="text-purple-400">{tournament.status}</span>
                    </p>
                    {tournament.prizePool && (
                      <p className="text-sm text-gray-400 mt-1">Prize Pool: {tournament.prizePool}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(tournament)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(tournament.id)}
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

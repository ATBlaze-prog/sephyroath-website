/**
 * Hall of Fame Management Panel
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/admin/ImageUploader';
import { HallOfFameAchievement, MemberProfile } from '@prisma/client';
import { Trash2, Edit2, Plus } from 'lucide-react';

const CATEGORIES = [
  { value: 'MAJOR_TOURNAMENT_CHAMPION', label: 'Major Tournament Champion' },
  { value: 'SCRIMMAGE_CHAMPION', label: 'Scrimmage Champion' },
  { value: 'HOME_SCRIM_CHAMPION', label: 'Home Scrim Champion' },
  { value: 'MVP', label: 'MVP' },
  { value: 'BEST_RECRUITER', label: 'Best Recruiter' },
  { value: 'CLAN_CONTRIBUTOR', label: 'Clan Contributor' },
  { value: 'CLAN_VETERAN', label: 'Clan Veteran' },
  { value: 'SPECIAL_RECOGNITION', label: 'Special Recognition' },
];

interface Achievement extends HallOfFameAchievement {
  memberProfile?: Partial<MemberProfile>;
  awardedByUser?: {
    id: string;
    email: string;
  };
}

export default function HallOfFamePanel() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [members, setMembers] = useState<Partial<MemberProfile>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    memberProfileId: '',
    category: 'MAJOR_TOURNAMENT_CHAMPION',
    title: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchAchievements();
    fetchMembers();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/hall-of-fame');
      const data = await res.json();
      setAchievements(data.data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      // This would need an API endpoint to fetch members
      // For now, we'll fetch from the members API if it exists
      const res = await fetch('/api/members');
      const data = await res.json();
      if (data.success) {
        setMembers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/hall-of-fame/${editingId}` : '/api/hall-of-fame';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save achievement');

      fetchAchievements();
      try { router.refresh(); } catch {}
      setShowForm(false);
      setEditingId(null);
      setFormData({
        memberProfileId: '',
        category: 'MAJOR_TOURNAMENT_CHAMPION',
        title: '',
        description: '',
        imageUrl: '',
      });
    } catch (error) {
      console.error('Error saving achievement:', error);
      alert('Failed to save achievement');
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setFormData({
      memberProfileId: achievement.memberProfileId,
      category: achievement.category,
      title: achievement.title,
      description: achievement.description || '',
      imageUrl: achievement.imageUrl || '',
    });
    setEditingId(achievement.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;

    try {
      const res = await fetch(`/api/hall-of-fame/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete achievement');
      fetchAchievements();
      try { router.refresh(); } catch {}
    } catch (error) {
      console.error('Error deleting achievement:', error);
      alert('Failed to delete achievement');
    }
  };

  const getCategoryLabel = (category: string) => {
    return CATEGORIES.find((c) => c.value === category)?.label || category;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Hall of Fame Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              memberProfileId: '',
              category: 'MAJOR_TOURNAMENT_CHAMPION',
              title: '',
              description: '',
              imageUrl: '',
            });
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Achievement
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingId ? 'Edit Achievement' : 'Add New Achievement'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={formData.memberProfileId}
              onChange={(e) => setFormData({ ...formData, memberProfileId: e.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
              required
            >
              <option value="">Select Member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.inGameName}
                </option>
              ))}
            </select>

            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Achievement Title"
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

            <ImageUploader
              label="Achievement Image"
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              helpText="Upload or select an image for this achievement"
            />

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Update' : 'Add'} Achievement
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
        <div className="text-white">Loading achievements...</div>
      ) : (
        <div className="space-y-4">
          {achievements.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              No achievements found. Add one to get started!
            </div>
          ) : (
            achievements.map((achievement) => (
              <div key={achievement.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{achievement.title}</h3>
                    <p className="text-purple-400 text-sm mt-1">
                      {getCategoryLabel(achievement.category)}
                    </p>
                    {achievement.description && (
                      <p className="text-gray-300 mt-2">{achievement.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Member: <span className="text-gray-300">{achievement.memberProfile?.inGameName}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Awarded: {new Date(achievement.awardedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(achievement)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(achievement.id)}
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

/**
 * Admin Dashboard - Main Page
 */

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface DashboardStats {
  totalEvents: number;
  totalTournaments: number;
  totalAchievements: number;
  totalAnnouncements: number;
  totalMembers: number;
  socialMediaLinks: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalTournaments: 0,
    totalAchievements: 0,
    totalAnnouncements: 0,
    totalMembers: 0,
    socialMediaLinks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [eventsRes, tournamentsRes, hallOfFameRes, announcementsRes, membersRes, socialRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/tournaments'),
        fetch('/api/hall-of-fame'),
        fetch('/api/announcements'),
        fetch('/api/members'),
        fetch('/api/social-media'),
      ]);

      const eventsData = await eventsRes.json();
      const tournamentsData = await tournamentsRes.json();
      const hallOfFameData = await hallOfFameRes.json();
      const announcementsData = await announcementsRes.json();
      const membersData = await membersRes.json();
      const socialData = await socialRes.json();

      setStats({
        totalEvents: eventsData.data?.length || 0,
        totalTournaments: tournamentsData.data?.length || 0,
        totalAchievements: hallOfFameData.data?.length || 0,
        totalAnnouncements: announcementsData.data?.length || 0,
        totalMembers: membersData.data?.length || 0,
        socialMediaLinks: socialData.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back, {session?.user?.name || 'Admin'}</p>
      </div>

      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Events Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-gray-400 text-sm font-medium">Total Events</h3>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalEvents}</p>
              <a
                href="/admin/events"
                className="text-purple-400 hover:text-purple-300 text-sm mt-4 inline-block"
              >
                Manage Events →
              </a>
            </div>

            {/* Tournaments Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-gray-400 text-sm font-medium">Total Tournaments</h3>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalTournaments}</p>
              <a
                href="/admin/tournaments"
                className="text-purple-400 hover:text-purple-300 text-sm mt-4 inline-block"
              >
                Manage Tournaments →
              </a>
            </div>

            {/* Hall of Fame Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-gray-400 text-sm font-medium">Hall of Fame Entries</h3>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalAchievements}</p>
              <a
                href="/admin/hall-of-fame"
                className="text-purple-400 hover:text-purple-300 text-sm mt-4 inline-block"
              >
                Manage Achievements →
              </a>
            </div>

            {/* Announcements Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-gray-400 text-sm font-medium">Total Announcements</h3>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalAnnouncements}</p>
              <a
                href="/admin/announcements"
                className="text-purple-400 hover:text-purple-300 text-sm mt-4 inline-block"
              >
                Manage Announcements →
              </a>
            </div>

            {/* Members Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-gray-400 text-sm font-medium">Total Members</h3>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalMembers}</p>
              <a
                href="/admin/members"
                className="text-purple-400 hover:text-purple-300 text-sm mt-4 inline-block"
              >
                Manage Members →
              </a>
            </div>

            {/* Social Media Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-gray-400 text-sm font-medium">Social Media Links</h3>
              <p className="text-3xl font-bold text-white mt-2">{stats.socialMediaLinks}</p>
              <a
                href="/admin/social-media"
                className="text-purple-400 hover:text-purple-300 text-sm mt-4 inline-block"
              >
                Manage Links →
              </a>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/admin/events"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors text-center"
              >
                Create New Event
              </a>
              <a
                href="/admin/tournaments"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors text-center"
              >
                Create New Tournament
              </a>
              <a
                href="/admin/hall-of-fame"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors text-center"
              >
                Add Hall of Fame Entry
              </a>
              <a
                href="/admin/announcements"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors text-center"
              >
                Create Announcement
              </a>
              <a
                href="/admin/members"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors text-center"
              >
                Add Member
              </a>
              <a
                href="/admin/social-media"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors text-center"
              >
                Manage Social Media
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

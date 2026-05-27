/**
 * Admin Members Management Page
 */

'use client';

import { useEffect, useState } from 'react';

export default function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      setMembers(data.data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Members Management</h1>

      {loading ? (
        <div className="text-white">Loading members...</div>
      ) : (
        <div className="space-y-4">
          {members.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              No members found.
            </div>
          ) : (
            members.map((member: any) => (
              <div key={member.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white">{member.inGameName}</h3>
                <p className="text-gray-400 text-sm mt-1">Rank: {member.clanRank}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

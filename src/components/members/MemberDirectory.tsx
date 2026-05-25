'use client';

import { FormEvent, useMemo, useState } from 'react';

interface MemberItem {
  id: string;
  ign: string;
  gender: string;
  joinedAt: string;
  game: { title: string } | null;
}

interface MemberDirectoryProps {
  initialMembers: MemberItem[];
  games: { id: string; title: string }[];
  canManage: boolean;
}

export default function MemberDirectory({ initialMembers, games, canManage }: MemberDirectoryProps) {
  const [members, setMembers] = useState<MemberItem[]>(initialMembers);
  const [search, setSearch] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterGame, setFilterGame] = useState('');
  const [newMember, setNewMember] = useState({ ign: '', gender: 'Male', gameId: '', joinedAt: '' });
  const [error, setError] = useState('');

  const filtered = useMemo(
    () =>
      members.filter((member) => {
        const searchMatch = member.ign.toLowerCase().includes(search.toLowerCase());
        const genderMatch = filterGender ? member.gender === filterGender : true;
        const gameMatch = filterGame ? member.game?.title === filterGame : true;
        return searchMatch && genderMatch && gameMatch;
      }),
    [members, search, filterGender, filterGame]
  );

  const handleDelete = async (id: string) => {
    const response = await fetch('/api/members', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      setError('Failed to remove member.');
      return;
    }

    setMembers((current) => current.filter((member) => member.id !== id));
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const response = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMember),
    });

    if (!response.ok) {
      setError('Failed to add member.');
      return;
    }

    const created = await response.json();
    setMembers((current) => [created, ...current]);
    setNewMember({ ign: '', gender: 'Male', gameId: '', joinedAt: '' });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-so-primary/20 bg-so-dark/80 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-so-gold">Members Directory</h2>
            <p className="text-so-gray-300">Browse active members without exposing private information.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search IGN"
              className="rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
            />
            <select
              value={filterGender}
              onChange={(event) => setFilterGender(event.target.value)}
              className="rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
            <select
              value={filterGame}
              onChange={(event) => setFilterGame(event.target.value)}
              className="rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
            >
              <option value="">All Games</option>
              {games.map((game) => (
                <option key={game.id} value={game.title}>
                  {game.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="overflow-hidden rounded-3xl border border-so-primary/20 bg-so-darker">
        <table className="w-full min-w-full border-separate border-spacing-0 text-left">
          <thead className="bg-so-darkest">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-so-gray-300">IGN</th>
              <th className="px-6 py-4 text-sm font-semibold text-so-gray-300">Gender</th>
              <th className="px-6 py-4 text-sm font-semibold text-so-gray-300">Game Played</th>
              <th className="px-6 py-4 text-sm font-semibold text-so-gray-300">Date Joined</th>
              {canManage && <th className="px-6 py-4 text-sm font-semibold text-so-gray-300">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => (
              <tr key={member.id} className="border-t border-so-primary/10 last:border-b last:border-so-primary/10">
                <td className="px-6 py-4 text-sm text-so-gray-100">{member.ign}</td>
                <td className="px-6 py-4 text-sm text-so-gray-300">{member.gender}</td>
                <td className="px-6 py-4 text-sm text-so-gray-300">{member.game?.title ?? '—'}</td>
                <td className="px-6 py-4 text-sm text-so-gray-300">{new Date(member.joinedAt).toLocaleDateString()}</td>
                {canManage && (
                  <td className="px-6 py-4 text-sm text-so-gray-300">
                    <button
                      type="button"
                      onClick={() => handleDelete(member.id)}
                      className="rounded-full border border-red-500 px-3 py-2 text-red-300 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {canManage && (
        <div className="rounded-3xl border border-so-primary/20 bg-so-dark/80 p-6">
          <h3 className="text-xl font-semibold text-so-gray-100 mb-4">Add New Member</h3>
          <form onSubmit={handleCreate} className="grid gap-4 lg:grid-cols-4">
            <input
              type="text"
              placeholder="IGN"
              value={newMember.ign}
              onChange={(event) => setNewMember((current) => ({ ...current, ign: event.target.value }))}
              className="rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
              required
            />
            <select
              value={newMember.gender}
              onChange={(event) => setNewMember((current) => ({ ...current, gender: event.target.value }))}
              className="rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
            <select
              value={newMember.gameId}
              onChange={(event) => setNewMember((current) => ({ ...current, gameId: event.target.value }))}
              className="rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
              required
            >
              <option value="">Select Game</option>
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.title}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={newMember.joinedAt}
              onChange={(event) => setNewMember((current) => ({ ...current, joinedAt: event.target.value }))}
              className="rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
              required
            />
            <button
              type="submit"
              className="rounded-2xl bg-so-primary px-5 py-3 text-sm font-semibold text-white hover:bg-so-primary/90 lg:col-span-4"
            >
              Add Member
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

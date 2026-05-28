'use client';

import { FormEvent, useMemo, useState } from 'react';
import ImageUploader from '@/components/admin/ImageUploader';

interface GameCard {
  id: string;
  title: string;
  bannerUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
}

interface GameGridProps {
  initialGames: GameCard[];
  canManage: boolean;
}

export default function GameGrid({ initialGames, canManage }: GameGridProps) {
  const [games, setGames] = useState<GameCard[]>(initialGames);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    bannerUrl: '',
    websiteUrl: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const openModal = () => {
    setForm({ title: '', bannerUrl: '', websiteUrl: '', description: '' });
    setIsOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const response = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!response.ok) {
      setError('Could not add new game.');
      return;
    }

    const created = await response.json();
    setGames((current) => [created, ...current]);
    setIsOpen(false);
  };

  const handleDelete = async (id: string) => {
    const response = await fetch('/api/games', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      setError('Failed to delete game.');
      return;
    }

    setGames((current) => current.filter((game) => game.id !== id));
  };

  const emptyState = useMemo(
    () => games.length === 0,
    [games]
  );

  return (
    <div className="space-y-8">
      {canManage && (
        <div className="flex flex-col gap-3 rounded-3xl border border-so-primary/20 bg-so-dark/80 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-so-gold">Game Management</h2>
            <p className="text-so-gray-300">Add, edit, or remove active game entries.</p>
          </div>
          <button
            type="button"
            onClick={openModal}
            className="rounded-2xl bg-gradient-fire px-5 py-3 text-sm font-semibold text-white shadow-glow-red-lg hover:brightness-110"
          >
            Add New Game
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {emptyState ? (
        <div className="rounded-3xl border border-so-primary/20 bg-so-darker p-10 text-center text-so-gray-300">
          No game entries found yet. Add a new game to populate the grid.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {games.map((game) => (
            <div key={game.id} className="group overflow-hidden rounded-3xl border border-so-primary/20 bg-so-dark/80 transition hover:shadow-2xl hover:shadow-so-primary/10">
              <a
                href={game.websiteUrl ?? '#'}
                target="_blank"
                rel="noreferrer"
                className="block h-56 w-full overflow-hidden bg-so-darker"
              >
                {game.bannerUrl ? (
                  <img src={game.bannerUrl} alt={game.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-so-primary/10 text-so-gray-400">No Banner</div>
                )}
              </a>
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-so-gray-100">{game.title}</h3>
                    <p className="mt-2 text-sm text-so-gray-400">{game.description ?? 'No description available.'}</p>
                  </div>
                </div>
                <a
                  href={game.websiteUrl ?? '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-sm font-medium text-so-primary hover:text-so-gold"
                >
                  Visit Official Site
                </a>
                {canManage && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(game.id)}
                      className="rounded-2xl border border-red-500 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-so-primary/20 bg-so-darker p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-so-gold mb-4">Add New Game</h3>
            <form onSubmit={handleSubmit} className="grid gap-5">
              <label className="space-y-2 text-sm text-so-gray-200">
                Game Name
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))}
                  className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
                  required
                />
              </label>
              <ImageUploader
                label="Banner Image"
                value={form.bannerUrl}
                onChange={(url) => setForm((value) => ({ ...value, bannerUrl: url }))}
                helpText="Upload or paste a banner image for the game"
              />
              <label className="space-y-2 text-sm text-so-gray-200">
                Official Website URL
                <input
                  type="url"
                  value={form.websiteUrl}
                  onChange={(event) => setForm((value) => ({ ...value, websiteUrl: event.target.value }))}
                  className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
                />
              </label>
              <label className="space-y-2 text-sm text-so-gray-200">
                Description
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))}
                  className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
                  rows={4}
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-so-primary px-5 py-3 text-sm font-semibold text-white hover:bg-so-primary/90 disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Create Game'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl border border-so-primary px-5 py-3 text-sm text-so-gray-200 hover:bg-so-primary/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

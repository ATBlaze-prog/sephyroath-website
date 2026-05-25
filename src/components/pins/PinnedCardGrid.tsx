'use client';

import { useState } from 'react';

interface PinItem {
  id: string;
  title: string;
  description: string | null;
  bannerUrl: string | null;
  startDate?: string;
  isPinned: boolean;
}

interface PinnedCardGridProps {
  items: PinItem[];
  canManage: boolean;
  resource: 'events' | 'tournaments';
}

export default function PinnedCardGrid({ items, canManage, resource }: PinnedCardGridProps) {
  const [cards, setCards] = useState(items);
  const [busy, setBusy] = useState<string | null>(null);

  const togglePin = async (id: string, isPinned: boolean) => {
    setBusy(id);
    const response = await fetch(`/api/${resource}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isPinned }),
    });
    setBusy(null);

    if (!response.ok) {
      return;
    }

    setCards((current) =>
      current.map((card) => (card.id === id ? { ...card, isPinned } : card))
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`overflow-hidden rounded-3xl border p-0 shadow-lg transition ${
            card.isPinned ? 'border-so-primary bg-so-dark/95 ring-2 ring-so-primary/20' : 'border-so-primary/10 bg-so-darker'
          }`}
        >
          <div className="h-56 overflow-hidden bg-so-darker">
            {card.bannerUrl ? (
              <img src={card.bannerUrl} alt={card.title} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
            ) : (
              <div className="flex h-full items-center justify-center bg-so-primary/10 text-so-gray-400">No image</div>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-so-gray-100">{card.title}</h3>
                {card.startDate && (
                  <p className="mt-2 text-sm text-so-gray-400">{new Date(card.startDate).toLocaleDateString()}</p>
                )}
              </div>
              {card.isPinned && (
                <span className="rounded-full bg-so-primary/15 px-3 py-1 text-xs font-semibold uppercase text-so-primary">Pinned</span>
              )}
            </div>
            <p className="mt-4 text-sm leading-6 text-so-gray-300">{card.description ?? 'No additional details available.'}</p>
            {canManage && (
              <div className="mt-6 flex flex-wrap gap-3">
                <label className="inline-flex items-center gap-2 rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-200">
                  <input
                    type="checkbox"
                    checked={card.isPinned}
                    disabled={busy === card.id}
                    onChange={(event) => togglePin(card.id, event.target.checked)}
                    className="h-4 w-4 rounded border-so-primary/50 bg-so-darker"
                  />
                  Pin to Top
                </label>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

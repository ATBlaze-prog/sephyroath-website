'use client';

import { useState } from 'react';

interface AdminUser {
  id: string;
  email: string;
  realName: string | null;
  age: number | null;
  joinedAt: string | null;
  role: string;
  accountStatus: string;
  createdAt: string;
}

interface OwnerAccountManagerProps {
  admins: AdminUser[];
}

export default function OwnerAccountManager({ admins }: OwnerAccountManagerProps) {
  const [items, setItems] = useState<AdminUser[]>(admins);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const updateUser = async (userId: string, action: 'approve' | 'suspend' | 'delete') => {
    setBusy(userId);
    setError('');

    const response = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action }),
    });

    setBusy(null);

    if (!response.ok) {
      setError('Failed to update admin account.');
      return;
    }

    if (action === 'delete') {
      setItems((current) => current.filter((item) => item.id !== userId));
      return;
    }

    const status = action === 'approve' ? 'ACTIVE' : 'SUSPENDED';
    setItems((current) =>
      current.map((item) =>
        item.id === userId ? { ...item, accountStatus: status } : item
      )
    );
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-so-primary/20 bg-so-dark/80 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-so-gold">Owner Panel</h2>
            <p className="text-so-gray-300">Review admin accounts and control application status.</p>
          </div>
        </div>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>

      <div className="grid gap-6">
        {items.map((admin) => (
          <div key={admin.id} className="rounded-3xl border border-so-primary/20 bg-so-darker p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-so-gray-400">{admin.role}</p>
                <h3 className="text-2xl font-semibold text-so-gray-100">{admin.realName ?? admin.email}</h3>
                <p className="text-sm text-so-gray-400">
                  Email: {admin.email} · Age: {admin.age ?? 'N/A'} · Joined: {admin.joinedAt ? new Date(admin.joinedAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-so-primary/10 px-3 py-1 text-sm font-medium text-so-primary">
                  {admin.accountStatus}
                </span>
                <button
                  type="button"
                  onClick={() => updateUser(admin.id, 'approve')}
                  disabled={busy === admin.id || admin.accountStatus === 'ACTIVE'}
                  className="rounded-2xl border border-so-primary px-4 py-2 text-sm text-so-gray-100 hover:bg-so-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => updateUser(admin.id, 'suspend')}
                  disabled={busy === admin.id || admin.accountStatus === 'SUSPENDED'}
                  className="rounded-2xl border border-red-500 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Suspend
                </button>
                <button
                  type="button"
                  onClick={() => updateUser(admin.id, 'delete')}
                  disabled={busy === admin.id || admin.role === 'OWNER'}
                  className="rounded-2xl border border-so-gray-500 px-4 py-2 text-sm text-so-gray-300 hover:bg-so-gray-600/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delete
                </button>
                {admin.role === 'OWNER' && (
                  <span className="ml-2 rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
                    Protected
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { formatDateTime } from '@/lib/utils';

interface Application {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  location: string;
  discordUsername: string | null;
  facebookProfileUrl: string;
  tiktokProfileUrl: string;
  facebookProofUrl: string;
  tiktokProofUrl: string;
  currentIgn: string;
  status: string;
  appliedAt: string;
  game: { title: string } | null;
}

interface ApplicationInboxProps {
  initialApplications: Application[];
}

export default function ApplicationInbox({ initialApplications }: ApplicationInboxProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [activeEdit, setActiveEdit] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFieldChange = (id: string, field: keyof Application, value: string) => {
    setApplications((current) =>
      current.map((application) => {
        if (application.id !== id) return application;
        if (field === 'age') {
          return { ...application, age: Number(value) || 0 };
        }
        return { ...application, [field]: value };
      })
    );
  };

  const handleSave = async (id: string) => {
    const application = applications.find((item) => item.id === id);
    if (!application) return;

    setError('');
    setSuccess('');

    const response = await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        updates: {
          fullName: application.fullName,
          age: application.age,
          gender: application.gender,
          location: application.location,
          facebookProfileUrl: application.facebookProfileUrl,
          tiktokProfileUrl: application.tiktokProfileUrl,
          currentIgn: application.currentIgn,
        },
      }),
    });

    if (!response.ok) {
      setError('Failed to save application updates.');
      return;
    }

    setSuccess('Application fields saved.');
    setActiveEdit(null);
  };

  const handleApprove = async (id: string) => {
    const application = applications.find((item) => item.id === id);
    if (!application) return;

    setError('');
    setSuccess('');

    const response = await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        action: 'approve',
        updates: {
          fullName: application.fullName,
          age: application.age,
          gender: application.gender,
          location: application.location,
          currentIgn: application.currentIgn,
        },
      }),
    });

    if (!response.ok) {
      setError('Failed to approve and onboard application.');
      return;
    }

    setApplications((current) => current.filter((application) => application.id !== id));
    setSuccess('Application approved and member onboarded.');
  };

  const pendingCount = useMemo(() => applications.length, [applications]);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-so-primary/20 bg-so-dark/80 p-6">
        <h2 className="text-3xl font-bold text-so-gold">Admin Application Inbox</h2>
        <p className="mt-2 text-so-gray-300">Review applications, edit details, and onboard members directly.</p>
        <p className="mt-4 text-sm text-so-gray-400">Current applications: {pendingCount}</p>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        {success && <p className="mt-3 text-sm text-green-400">{success}</p>}
      </div>

      <div className="grid gap-6">
        {applications.map((application) => (
          <div
            key={application.id}
            className="rounded-3xl border border-so-primary/20 bg-so-darker p-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-so-gray-400">{application.game?.title ?? 'Unknown Game'}</p>
                <h3 className="text-2xl font-semibold text-so-gray-100">{application.fullName}</h3>
                <p className="text-so-gray-400">Applied: {formatDateTime(application.appliedAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveEdit(application.id === activeEdit ? null : application.id)}
                  className="rounded-2xl border border-so-primary px-4 py-2 text-sm text-so-gray-100 hover:bg-so-primary/10"
                >
                  {activeEdit === application.id ? 'Close Edit' : 'Edit Application Data'}
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(application.id)}
                  className="rounded-2xl border border-so-primary px-4 py-2 text-sm text-so-white bg-so-primary hover:bg-so-primary/90"
                >
                  Approve and Onboard
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-so-gray-400">Age</p>
                  {activeEdit === application.id ? (
                    <input
                      type="number"
                      value={application.age}
                      onChange={(event) => handleFieldChange(application.id, 'age', event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
                    />
                  ) : (
                    <p className="text-so-gray-200">{application.age}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-so-gray-400">Gender</p>
                  {activeEdit === application.id ? (
                    <input
                      value={application.gender}
                      onChange={(event) => handleFieldChange(application.id, 'gender', event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
                    />
                  ) : (
                    <p className="text-so-gray-200">{application.gender}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-so-gray-400">Location</p>
                  {activeEdit === application.id ? (
                    <input
                      value={application.location}
                      onChange={(event) => handleFieldChange(application.id, 'location', event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
                    />
                  ) : (
                    <p className="text-so-gray-200">{application.location}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-so-gray-400">Current IGN</p>
                  {activeEdit === application.id ? (
                    <input
                      value={application.currentIgn}
                      onChange={(event) => handleFieldChange(application.id, 'currentIgn', event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
                    />
                  ) : (
                    <p className="text-so-gray-200">{application.currentIgn}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-so-gray-400">Facebook Link</p>
                  {activeEdit === application.id ? (
                    <input
                      type="url"
                      value={application.facebookProfileUrl}
                      onChange={(event) => handleFieldChange(application.id, 'facebookProfileUrl', event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
                    />
                  ) : (
                    <a href={application.facebookProfileUrl} target="_blank" rel="noreferrer" className="text-so-primary">
                      {application.facebookProfileUrl}
                    </a>
                  )}
                </div>
                <div>
                  <p className="text-sm text-so-gray-400">TikTok Link</p>
                  {activeEdit === application.id ? (
                    <input
                      type="url"
                      value={application.tiktokProfileUrl}
                      onChange={(event) => handleFieldChange(application.id, 'tiktokProfileUrl', event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100"
                    />
                  ) : (
                    <a href={application.tiktokProfileUrl} target="_blank" rel="noreferrer" className="text-so-primary">
                      {application.tiktokProfileUrl}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {activeEdit === application.id && (
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleSave(application.id)}
                  className="rounded-2xl bg-so-primary px-5 py-3 text-sm font-semibold text-white hover:bg-so-primary/90"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEdit(null)}
                  className="rounded-2xl border border-so-primary px-5 py-3 text-sm text-so-gray-200 hover:bg-so-primary/10"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

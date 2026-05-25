'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminSignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [realName, setRealName] = useState('');
  const [age, setAge] = useState('');
  const [joinedAt, setJoinedAt] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        realName,
        age: Number(age),
        password,
        passwordConfirmation,
        joinedAt,
      }),
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      const message = Array.isArray(payload.error)
        ? payload.error.map((item: any) => item.message).join(', ')
        : payload.error || 'Failed to register. Please try again.';
      setError(message);
      return;
    }

    setSuccess('Admin account created. Account is pending owner approval.');
    setTimeout(() => router.push('/auth/login'), 2000);
  };

  return (
    <div className="min-h-screen py-24 bg-so-darker">
      <div className="container-primary">
        <div className="max-w-3xl mx-auto rounded-3xl border border-so-primary/20 bg-so-dark/90 p-10 shadow-2xl shadow-so-black/40">
          <h1 className="text-4xl font-bold text-so-gold mb-4">Admin Sign-Up</h1>
          <p className="text-so-gray-300 mb-8">
            Register an admin application. New accounts default to pending approval.
          </p>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <label className="space-y-2 text-sm text-so-gray-200">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100 focus:outline-none focus:ring-2 focus:ring-so-primary"
                  required
                />
              </label>
              <label className="space-y-2 text-sm text-so-gray-200">
                Full Name
                <input
                  type="text"
                  value={realName}
                  onChange={(event) => setRealName(event.target.value)}
                  className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100 focus:outline-none focus:ring-2 focus:ring-so-primary"
                  required
                />
              </label>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <label className="space-y-2 text-sm text-so-gray-200">
                Age
                <input
                  type="number"
                  min="13"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100 focus:outline-none focus:ring-2 focus:ring-so-primary"
                  required
                />
              </label>
              <label className="space-y-2 text-sm text-so-gray-200">
                Date Joined
                <input
                  type="date"
                  value={joinedAt}
                  onChange={(event) => setJoinedAt(event.target.value)}
                  className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100 focus:outline-none focus:ring-2 focus:ring-so-primary"
                  required
                />
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <label className="space-y-2 text-sm text-so-gray-200">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100 focus:outline-none focus:ring-2 focus:ring-so-primary"
                  required
                />
              </label>
              <label className="space-y-2 text-sm text-so-gray-200">
                Confirm Password
                <input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(event) => setPasswordConfirmation(event.target.value)}
                  className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100 focus:outline-none focus:ring-2 focus:ring-so-primary"
                  required
                />
              </label>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && <p className="text-sm text-green-400">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-fire px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Request Admin Access'}
            </button>
          </form>
          <div className="mt-6 text-sm text-so-gray-400">
            <p>
              Already registered?{' '}
              <Link href="/auth/login" className="text-so-primary hover:text-so-gold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

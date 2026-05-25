'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      if (result.error.includes('pending owner approval')) {
        setError('Account pending owner approval.');
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
      return;
    }

    router.push('/');
  };

  return (
    <div className="min-h-screen py-24 bg-so-darker">
      <div className="container-primary">
        <div className="max-w-2xl mx-auto rounded-3xl border border-so-primary/20 bg-so-dark/80 p-10 shadow-2xl shadow-so-black/40">
          <h1 className="text-4xl font-bold text-so-gold mb-4">Admin Login</h1>
          <p className="text-so-gray-300 mb-8">
            Secure access for admins, owners, and moderators.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-so-gray-200 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100 focus:outline-none focus:ring-2 focus:ring-so-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-so-gray-200 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-so-primary/30 bg-so-darker px-4 py-3 text-sm text-so-gray-100 focus:outline-none focus:ring-2 focus:ring-so-primary"
                required
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-fire px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 text-sm text-so-gray-400">
            <p>
              Need an admin account?{' '}
              <Link href="/auth/admin-signup" className="text-so-primary hover:text-so-gold">
                Request access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

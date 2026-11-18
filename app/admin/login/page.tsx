'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, Lock, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Default master password for initial setup & local authoring
    const masterPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'rafi2026';

    if (password === masterPass) {
      localStorage.setItem('rafi_admin_auth', 'authenticated');
      document.cookie = 'rafi_admin_session=valid; path=/; max-age=86400';
      router.push('/admin');
    } else {
      setError('Incorrect password. Please verify and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-xl border border-paper-300 dark:border-ink-800 bg-paper-100/70 dark:bg-ink-900/60 shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-accent/15 text-accent mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-medium text-paper-900 dark:text-ink-100">
            Admin Sanctuary
          </h1>
          <p className="text-xs text-paper-700 dark:text-ink-300 font-serif mt-1">
            Private authoring portal for Rafi
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-ink-300 mb-1.5">
              Access Key / Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password (default: rafi2026)"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-paper-300 dark:border-ink-800 bg-paper-50 dark:bg-ink-950 text-paper-900 dark:text-ink-100 text-sm focus:outline-none focus:border-accent"
                required
              />
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-paper-700 dark:text-ink-400" />
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-sans">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-accent text-white dark:text-ink-950 font-medium text-sm hover:bg-accent-hover transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Enter Sanctuary'}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-paper-700 dark:text-ink-400 font-mono">
          Default master key: <span className="text-accent font-semibold">rafi2026</span>
        </p>
      </div>
    </div>
  );
}

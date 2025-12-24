'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin() {
    setError('');

    try {
      const res = await fetch('/api/gas?path=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        setError(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      router.push('/dashboard');

    } catch {
      setError('Network error');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-sm p-6">

        {/* TITLE */}
        <div className="mb-6 text-center">
          <h1 className="text-lg font-semibold">
            Monitoring Tunggakan
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Silakan login untuk melanjutkan
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="space-y-4">

          {/* USER ID */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              RBM
            </label>
            <input
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="Masukkan RBM"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-2 rounded text-sm font-medium active:scale-[0.99]"
          >
            Login
          </button>
        </div>

        {/* FOOTER */}
        <p className="mt-6 text-xs text-center text-gray-400">
          © {new Date().getFullYear()} Internal System
        </p>
      </div>
    </main>
  );
}

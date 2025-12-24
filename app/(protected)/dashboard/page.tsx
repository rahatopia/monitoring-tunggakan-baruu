'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type DashboardData = {
  rbm: string;
  summary: {
    totalPelanggan: number;
    lunas: number;
    belumLunas: number;
  };
  nominal: {
    outstanding: number;
    target: number;
  };
  performance: number;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  async function loadDashboard(forceRefresh = false) {
    const token = localStorage.getItem('token');
    if (!token) return;

    forceRefresh ? setRefreshing(true) : setLoading(true);

    try {
      const res = await fetch(
        `/api/gas?path=dashboard${forceRefresh ? '&refresh=1' : ''}&token=${token}`
      );
      const json = await res.json();

      if (json?.error) {
        setError(json.error);
      } else {
        setData(json);
      }
    } catch {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard(false);
  }, []);

  if (loading) {
    return (
      <main className="p-4">
        <p className="text-sm text-gray-500">Loading dashboard…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-4">
        <p className="text-sm text-red-600">{error}</p>
      </main>
    );
  }

  if (!data) return null;

  const { outstanding, target } = data.nominal;
  const p = data.performance;

  let statusText = '';
  let statusClass = '';

  if (p >= 200) {
    statusText = '🎉 SEMPURNA — Semua pelanggan lunas';
    statusClass = 'text-green-600';
  } else if (p >= 150) {
    statusText = '🟢 Sangat baik';
    statusClass = 'text-green-500';
  } else if (p >= 120) {
    statusText = '🟡 Cukup';
    statusClass = 'text-yellow-500';
  } else if (p >= 100) {
    statusText = '🟠 Perlu perhatian';
    statusClass = 'text-orange-500';
  } else if (p >= 0) {
    statusText = '🔴 Buruk';
    statusClass = 'text-red-500';
  } else {
    statusText = '⛔ KRITIS — Outstanding jauh di atas target';
    statusClass = 'text-red-800';
  }

  return (
    <main className="p-4 max-w-3xl mx-auto space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Dashboard</h1>

        <button
          onClick={() => loadDashboard(true)}
          disabled={refreshing}
          className="text-sm px-3 py-1.5 border rounded disabled:opacity-50"
        >
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* RBM */}
      <div className="text-sm text-gray-600">
        RBM: <span className="font-medium text-gray-900">{data.rbm}</span>
      </div>

      {/* SUMMARY CARD */}
      <div className="bg-white border rounded-lg p-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-700">
          Ringkasan Pelanggan
        </h3>

        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div>
            <div className="text-gray-500 text-xs">Total</div>
            <div className="font-semibold">{data.summary.totalPelanggan}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Lunas</div>
            <div className="font-semibold text-green-600">
              {data.summary.lunas}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Belum</div>
            <div className="font-semibold text-red-600">
              {data.summary.belumLunas}
            </div>
          </div>
        </div>
      </div>

      {/* PRIMARY ACTION */}
      <Link href="/sisa" className="block">
        <button className="w-full bg-black text-white py-2 rounded text-sm font-medium">
          Lihat Sisa Pelanggan
        </button>
      </Link>

      {/* NOMINAL CARD */}
      <div className="bg-white border rounded-lg p-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-700">
          Nominal (Rp)
        </h3>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Target</span>
          <span className="font-medium">{rupiah(target)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Sisa Belum Lunas</span>
          <span className="font-medium text-red-600">
            {rupiah(outstanding)}
          </span>
        </div>
      </div>

      {/* PERFORMANCE */}
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-700">
          Performance Index
        </h3>

        <p className={`text-sm font-semibold ${statusClass}`}>
          {p}% — {statusText}
        </p>

        <progress
          value={Math.max(0, Math.min(p, 200))}
          max={200}
          className="w-full h-2"
        />

        <p className="text-xs text-gray-400">
          100% = outstanding = target • 200% = outstanding = 0 • &lt; 0% = KRITIS
        </p>
      </div>
    </main>
  );
}

function rupiah(v: number) {
  return v.toLocaleString('id-ID');
}

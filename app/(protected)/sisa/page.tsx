'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Pelanggan = {
  idpel: string;
  namaPelanggan: string;
  tarifDaya: string;
  garduTiang: string;
  langkah: string;
  hariBaca: string;
  rptag: number;
  rpbk: number;
};

type SisaResponse = {
  total: number;
  page: number;
  limit: number;
  data: Pelanggan[];
};

const PAGE_SIZE = 50;

export default function SisaPage() {
  const [data, setData] = useState<Pelanggan[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchData() {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `/api/gas?path=sisalist&page=${page}&limit=${PAGE_SIZE}&q=${encodeURIComponent(
          search
        )}&token=${token}`
      );

      const json: SisaResponse = await res.json();

      if ((json as any)?.error) {
        setError((json as any).error);
      } else {
        setData(json.data);
        setTotal(json.total);
      }
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [page, search]);

  function handleSearch() {
    setPage(1);
    setSearch(searchInput.trim());
  }

  function clearSearch() {
    setSearchInput('');
    setSearch('');
    setPage(1);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="p-4 max-w-7xl mx-auto space-y-4">

      {/* BACK NAV */}
      <div>
        <Link href="/dashboard" className="text-sm text-gray-600 hover:text-black">
          ← Back to Dashboard
        </Link>
      </div>

      {/* TITLE */}
      <h1 className="text-lg font-semibold">Sisa Pelanggan</h1>

      {/* SEARCH */}
      <div className="flex gap-2 items-center">
        <input
          placeholder="Cari IDPEL"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSearch();
          }}
          className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
        />

        <button
          onClick={handleSearch}
          className="px-3 py-2 bg-black text-white rounded text-sm"
        >
          Search
        </button>

        {search && (
          <button
            onClick={clearSearch}
            className="px-3 py-2 border rounded text-sm"
          >
            Clear
          </button>
        )}
      </div>

      {/* STATUS */}
      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* ================= MOBILE VIEW ================= */}
      {!loading && data.length > 0 && (
        <div className="space-y-3 md:hidden">
          {data.map(row => (
            <div
              key={row.idpel}
              className="border rounded-lg p-3 bg-white shadow-sm"
            >
              <div className="flex justify-between">
                <div>
                  <Link
                    href={`/pelanggan/${row.idpel}`}
                    className="font-medium text-blue-600"
                  >
                    {row.idpel}
                  </Link>
                  <div className="text-sm">{row.namaPelanggan}</div>
                </div>
                <div className="text-xs text-gray-500">{row.tarifDaya}</div>
              </div>

              <div className="text-xs text-gray-500 mt-1">
                {row.garduTiang}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Langkah</div>
                  <div>{row.langkah}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Hari Baca</div>
                  <div>{row.hariBaca}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">RPTAG</div>
                  <div className="font-medium">
                    {row.rptag.toLocaleString('id-ID')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">RPBK</div>
                  <div>
                    {row.rpbk.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= DESKTOP TABLE ================= */}
      {!loading && data.length > 0 && (
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-2 text-left">IDPEL</th>
                <th className="px-2 py-2 text-left">Nama</th>
                <th className="px-2 py-2">Tarif/Daya</th>
                <th className="px-2 py-2">Gardu/Tiang</th>
                <th className="px-2 py-2">Langkah</th>
                <th className="px-2 py-2">Hari Baca</th>
                <th className="px-2 py-2 text-right">RPTAG</th>
                <th className="px-2 py-2 text-right">RPBK</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.idpel} className="border-t hover:bg-gray-50">
                  <td className="px-2 py-2 font-medium">
                    <Link
                      href={`/pelanggan/${row.idpel}`}
                      className="text-blue-600"
                    >
                      {row.idpel}
                    </Link>
                  </td>
                  <td className="px-2 py-2">{row.namaPelanggan}</td>
                  <td className="px-2 py-2 text-center">{row.tarifDaya}</td>
                  <td className="px-2 py-2">{row.garduTiang}</td>
                  <td className="px-2 py-2 text-center">{row.langkah}</td>
                  <td className="px-2 py-2 text-center">{row.hariBaca}</td>
                  <td className="px-2 py-2 text-right">
                    {row.rptag.toLocaleString('id-ID')}
                  </td>
                  <td className="px-2 py-2 text-right">
                    {row.rpbk.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && data.length === 0 && (
        <p className="text-sm text-gray-500">No data found.</p>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border rounded text-sm disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border rounded text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}

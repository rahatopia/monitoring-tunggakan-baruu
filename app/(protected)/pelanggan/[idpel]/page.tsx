'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type DetailData = {
  idpel: string;
  namaPelanggan: string;
  tarifDaya: string;
  alamat: string;
  rptag: number;
  status: string;
  galang?: string;
  catatan?: string;
};

export default function DetailPage() {
  const router = useRouter();
  const params = useParams();

  const rawIdpel = params?.idpel;
  const idpel = Array.isArray(rawIdpel) ? rawIdpel[0] : rawIdpel;

  const [data, setData] = useState<DetailData | null>(null);
  const [catatanList, setCatatanList] = useState<string[]>([]);
  const [status, setStatus] = useState('Belum Lunas');
  const [galang, setGalang] = useState('');
  const [catatan, setCatatan] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!idpel) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);

    Promise.all([
      fetch(
        `/api/gas?path=detail&idpel=${encodeURIComponent(idpel)}&token=${token}`
      ).then(r => r.json()),

      fetch(
        `/api/gas?path=catatanlist&token=${token}`
      ).then(r => r.json())
    ])
      .then(([detailRes, catatanRes]) => {
        if (detailRes?.error) {
          setError(detailRes.error);
          return;
        }

        setData(detailRes);
        setStatus(detailRes.status || 'Belum Lunas');
        setGalang(detailRes.galang || '');
        setCatatan(detailRes.catatan || '');

        setCatatanList(catatanRes?.data || []);
      })
      .catch(() => setError('Failed to load detail'))
      .finally(() => setLoading(false));
  }, [idpel]);

  async function save() {
    if (!idpel) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    setSaving(true);

    try {
      const res = await fetch(
        `/api/gas?path=updatepelanggan&token=${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idpel,
            status,
            galang,
            catatan
          })
        }
      );

      const result = await res.json();

      if (result?.error) {
        alert(result.error);
      } else {
        alert('Data berhasil diperbarui');
        router.push('/sisa');
      }
    } catch {
      alert('Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="p-4">
        <p className="text-sm text-gray-500">
          Loading detail pelanggan…
        </p>
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

  return (
    <main className="p-4 max-w-2xl mx-auto space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Detail Pelanggan</h1>
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-black"
        >
          ← Back
        </button>
      </div>

      {/* INFO CARD */}
      <div className="bg-white border rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">IDPEL</span>
          <span className="font-medium">{data.idpel}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Nama</span>
          <span className="font-medium text-right">
            {data.namaPelanggan}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Tarif / Daya</span>
          <span>{data.tarifDaya}</span>
        </div>

        <div>
          <div className="text-gray-500 text-xs mb-1">Alamat</div>
          <div className="text-sm">{data.alamat}</div>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">RPTAG</span>
          <span className="font-semibold text-red-600">
            {data.rptag.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span className="font-medium">{data.status}</span>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white border rounded-lg p-4 space-y-4">

        {/* GALANG */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Galang
          </label>
          <select
            value={galang}
            onChange={e => setGalang(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">-</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* CATATAN */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Catatan
          </label>
          <select
            value={catatan}
            onChange={e => setCatatan(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">-</option>
            {catatanList.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 bg-black text-white py-2 rounded text-sm font-medium disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>

          <button
            onClick={() => router.push('/sisa')}
            className="flex-1 border py-2 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}

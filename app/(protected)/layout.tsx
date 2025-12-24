'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  function logout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (
    <div>
      <header
        style={{
          padding: '12px 20px',
          background: '#222',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <strong>Monitoring Tunggakan</strong>
        <button onClick={logout}>Logout</button>
      </header>

      <main>{children}</main>
    </div>
  );
}

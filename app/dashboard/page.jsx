'use client';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('@/components/dashboard'), { 
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#080b14' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(196,125,142,.2)', borderTopColor: '#c47d8e', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  ),
});

export default function DashboardPage() {
  useEffect(() => {
    const nav = performance.getEntriesByType?.("navigation")?.[0];
    if (nav?.type === "back_forward") {
      fetch('/api/auth/me').then(r => { if (r.status === 401) window.location.replace('/?logout=1'); });
    }
  }, []);

  return <Dashboard />;
}

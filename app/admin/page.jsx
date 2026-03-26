'use client';
import { useEffect, useState, useRef } from 'react';
import LoadingScreen from '@/components/loading-screen';

export default function AdminPage() {
  const [ready, setReady] = useState(false);
  const [minWait, setMinWait] = useState(false);
  const CompRef = useRef(null);

  useEffect(() => {
    // Back-button auth check
    if (window.performance && window.performance.navigation.type === 2) {
      fetch('/api/auth/admin/me').then(r => { if (r.status === 401) window.location.replace('/admin/login?logout=1'); });
    }
    const timer = setTimeout(() => setMinWait(true), 500);
    import('@/components/admin-panel').then(mod => {
      CompRef.current = mod.default;
      setReady(true);
    });
    return () => clearTimeout(timer);
  }, []);

  if (!ready || !minWait || !CompRef.current) return <LoadingScreen />;
  const AdminPanel = CompRef.current;
  return <AdminPanel />;
}

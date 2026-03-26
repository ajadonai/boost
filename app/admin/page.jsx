'use client';
import { useEffect } from 'react';
import AdminPanel from '@/components/admin-panel';

export default function AdminPage() {
  useEffect(() => {
    if (window.performance && window.performance.navigation.type === 2) {
      fetch('/api/auth/admin/me').then(r => { if (r.status === 401) window.location.replace('/admin/login?logout=1'); });
    }
  }, []);

  return <AdminPanel />;
}

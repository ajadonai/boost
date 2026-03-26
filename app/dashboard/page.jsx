'use client';
import { useEffect } from 'react';
import SMMPanel from '@/components/smm-panel';

export default function DashboardPage() {
  useEffect(() => {
    if (window.performance && window.performance.navigation.type === 2) {
      fetch('/api/auth/me').then(r => { if (r.status === 401) window.location.replace('/?logout=1'); });
    }
  }, []);

  return <SMMPanel />;
}

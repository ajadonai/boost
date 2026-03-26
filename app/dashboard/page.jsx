'use client';
import { useEffect, useState, useRef } from 'react';
import LoadingScreen from '@/components/loading-screen';

export default function DashboardPage() {
  const [ready, setReady] = useState(false);
  const [minWait, setMinWait] = useState(false);
  const PanelRef = useRef(null);

  useEffect(() => {
    // Back-button auth check
    if (window.performance && window.performance.navigation.type === 2) {
      fetch('/api/auth/me').then(r => { if (r.status === 401) window.location.replace('/?logout=1'); });
    }
    const timer = setTimeout(() => setMinWait(true), 500);
    import('@/components/smm-panel').then(mod => {
      PanelRef.current = mod.default;
      setReady(true);
    });
    return () => clearTimeout(timer);
  }, []);

  if (!ready || !minWait || !PanelRef.current) return <LoadingScreen />;
  const SMMPanel = PanelRef.current;
  return <SMMPanel />;
}

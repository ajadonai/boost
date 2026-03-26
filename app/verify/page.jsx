'use client';
import { useEffect, useState, useRef } from 'react';
import LoadingScreen from '@/components/loading-screen';

export default function VerifyPage() {
  const [ready, setReady] = useState(false);
  const [minWait, setMinWait] = useState(false);
  const VerifyRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setMinWait(true), 500);
    import('@/components/verify').then(mod => {
      VerifyRef.current = mod.default;
      setReady(true);
    });
    return () => clearTimeout(timer);
  }, []);

  if (!ready || !minWait || !VerifyRef.current) return <LoadingScreen />;
  const VerifyAccount = VerifyRef.current;
  return <VerifyAccount />;
}

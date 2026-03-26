'use client';
import dynamic from 'next/dynamic';

const Landing = dynamic(() => import('@/components/landing-page'), { ssr: false });

export default function HomePage() {
  return <Landing />;
}

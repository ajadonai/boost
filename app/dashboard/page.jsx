export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard — Nitro',
};

import SMMPanel from '@/components/smm-panel';
import { headers } from 'next/headers';

export default async function DashboardPage() {
  const h = await headers();
  // Prevent browser from caching this page (back button after logout fix)
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `
        if (window.performance && window.performance.navigation.type === 2) {
          fetch('/api/auth/me').then(r => { if (r.status === 401) window.location.href = '/?logout=1'; });
        }
      `}} />
      <SMMPanel />
    </>
  );
}

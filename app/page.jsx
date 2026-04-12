import dynamic from 'next/dynamic';

const HomePage = dynamic(() => import('@/components/landing-page'), {
  loading: () => {
    const LoadingScreen = require('@/components/loading-screen').default;
    return <LoadingScreen />;
  },
  ssr: false,
});

export const metadata = {
  title: 'Nitro — #1 SMM Panel in Nigeria | Buy Followers, Views & Likes',
  description: 'Buy Instagram followers, TikTok views, YouTube subscribers and more. Instant delivery, real engagement, Nigerian targeting. 35+ platforms, cheapest rates.',
  alternates: { canonical: 'https://nitro.ng' },
};

export default function Page() {
  return <HomePage />;
}

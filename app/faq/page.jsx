import FAQ from '@/components/faq';

export const metadata = {
  title: 'FAQ — Frequently Asked Questions',
  description: 'Got questions about Nitro? Find answers about orders, payments, delivery times, refunds, and supported platforms.',
  alternates: { canonical: 'https://nitro.ng/faq' },
};

export default function FAQPage() {
  return <FAQ />;
}

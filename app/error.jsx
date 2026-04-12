'use client';

export default function Error({ error, reset }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080b14', fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px', maxWidth: 400 }}>
        <div style={{ width: 48, height: 48, borderRadius: 13, background: 'linear-gradient(135deg, #c47d8e, #8b5e6b)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#fff', fontSize: 26, fontWeight: 800 }}>N</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Something went wrong</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', lineHeight: 1.6, marginBottom: 24 }}>
          An unexpected error occurred. Please try again or contact support if the issue persists.
        </p>
        <button
          onClick={() => reset()}
          style={{ padding: '10px 28px', borderRadius: 10, background: '#c47d8e', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginRight: 8 }}
        >
          Try again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          style={{ padding: '10px 28px', borderRadius: 10, background: 'none', color: 'rgba(255,255,255,.5)', border: '1px solid rgba(255,255,255,.1)', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Go home
        </button>
      </div>
    </div>
  );
}

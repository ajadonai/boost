'use client';
import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('nitro-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('nitro-cookie-consent', 'accepted');
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem('nitro-cookie-consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-inner">
        <div className="cookie-text">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c47d8e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <p>We use cookies to keep you signed in and improve your experience. <a href="/cookie">Cookie policy</a></p>
        </div>
        <div className="cookie-actions">
          <button onClick={decline} className="cookie-decline">Decline</button>
          <button onClick={accept} className="cookie-accept">Accept</button>
        </div>
      </div>
    </div>
  );
}

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
          <span className="cookie-icon">🍪</span>
          <p>We use cookies to improve your experience. By continuing, you agree to our <a href="/cookie">Cookie Policy</a>.</p>
        </div>
        <div className="cookie-actions">
          <button onClick={decline} className="cookie-decline">Decline</button>
          <button onClick={accept} className="cookie-accept">Accept</button>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect, useCallback } from "react";

const TOUR_STEPS = [
  {
    title: "Fund your wallet",
    desc: "Add funds to get started. We support bank transfers and card payments.",
    navId: "add-funds",
    bottomId: "add-funds",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/><circle cx="16" cy="15" r="1.5"/></svg>,
  },
  {
    title: "Browse & order",
    desc: "Pick a platform, choose your service tier, enter your link — and you're set.",
    navId: "services",
    bottomId: "services",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  },
  {
    title: "Track your orders",
    desc: "Watch real-time status updates. Orders start processing within seconds.",
    navId: "orders",
    bottomId: "orders",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    title: "Need help?",
    desc: "Our support team is here for you. Create a ticket anytime from the menu.",
    navId: "support",
    bottomId: "more",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  },
];

export default function TourGuide({ dark, onComplete, onNavigate }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay so dashboard renders first
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const finish = useCallback(() => {
    setVisible(false);
    try { localStorage.setItem("nitro-tour-done", "1"); } catch {}
    setTimeout(() => onComplete?.(), 300);
  }, [onComplete]);

  const next = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      finish();
    }
  };

  const s = TOUR_STEPS[step];

  // Highlight the target nav item
  useEffect(() => {
    if (!visible) return;
    // Add highlight class to sidebar nav item
    const sidebarItem = document.querySelector(`[data-nav="${s.navId}"]`);
    const bottomItem = document.querySelector(`[data-tab="${s.bottomId}"]`);
    sidebarItem?.classList.add("tour-highlight");
    bottomItem?.classList.add("tour-highlight");
    return () => {
      sidebarItem?.classList.remove("tour-highlight");
      bottomItem?.classList.remove("tour-highlight");
    };
  }, [step, visible, s.navId, s.bottomId]);

  if (!visible) return null;

  const accent = "#c47d8e";
  const bg = dark ? "#161b2e" : "#ffffff";
  const border = dark ? "rgba(196,125,142,0.25)" : "rgba(0,0,0,0.08)";
  const text = dark ? "#fff" : "#1a1a1a";
  const sub = dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const skip = dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";
  const dotOff = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";

  return (
    <>
      <style>{`
        @keyframes tourFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes tourPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(196,125,142,0.4); } 70% { box-shadow: 0 0 0 8px rgba(196,125,142,0); } }
        .tour-highlight { position: relative; z-index: 52; animation: tourPulse 2s ease-in-out infinite; border-radius: 8px; }
      `}</style>

      {/* Overlay */}
      <div onClick={finish} style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(2px)",
        transition: "opacity 0.3s",
      }} />

      {/* Tooltip */}
      <div className="tour-tooltip" style={{
        position: "fixed", zIndex: 53,
        background: bg, border: `1.5px solid ${border}`, borderRadius: 16,
        padding: "20px 22px", maxWidth: 340, width: "calc(100% - 32px)",
        boxShadow: dark ? "0 12px 40px rgba(0,0,0,0.5)" : "0 12px 40px rgba(0,0,0,0.1)",
        animation: "tourFadeIn 0.3s ease",
        left: "50%", bottom: 90, transform: "translateX(-50%)",
      }}>
        {/* Step badge + icon */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: dark ? "rgba(196,125,142,0.1)" : "rgba(196,125,142,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center", color: accent,
          }}>{s.icon}</div>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: accent }}>
            Step {step + 1} of {TOUR_STEPS.length}
          </span>
        </div>

        {/* Title + description */}
        <div style={{ fontSize: 17, fontWeight: 700, color: text, marginBottom: 6 }}>{s.title}</div>
        <div style={{ fontSize: 13, lineHeight: 1.6, color: sub, marginBottom: 20 }}>{s.desc}</div>

        {/* Footer: dots + actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 5 }}>
            {TOUR_STEPS.map((_, i) => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: "50%",
                background: i === step ? accent : i < step ? (dark ? "rgba(196,125,142,0.3)" : "rgba(196,125,142,0.2)") : dotOff,
                transition: "background 0.3s",
              }} />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={finish} style={{ background: "none", border: "none", fontSize: 12, fontWeight: 500, color: skip, cursor: "pointer", fontFamily: "inherit", padding: 0 }}>Skip</button>
            <button onClick={next} style={{
              padding: "8px 22px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: accent, color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit",
            }}>
              {step === TOUR_STEPS.length - 1 ? "Got it!" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function shouldShowTour() {
  if (typeof window === "undefined") return false;
  try { return !localStorage.getItem("nitro-tour-done"); } catch { return false; }
}

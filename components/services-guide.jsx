'use client';
import { useState } from "react";

export default function ServicesGuide({ dark, t, collapsed = true }) {
  const [open, setOpen] = useState(!collapsed);

  const pill = (bg, color, text) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 6, background: bg, color, fontSize: 12, fontWeight: 600 }}>{text}</span>
  );

  return (
    <div style={{ borderRadius: 14, background: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.02)", border: `1px solid ${dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)"}`, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "none", border: "none", cursor: "pointer", color: t.text }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>📖 How Our Services Work</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {open && (
        <div style={{ padding: "0 18px 18px", fontSize: 13, lineHeight: 1.8, color: t.textMuted }}>

          {/* What are tiers */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 6 }}>Choose Your Tier</div>
            <p style={{ margin: "0 0 8px" }}>Every service comes in up to 3 quality tiers. Pick the one that fits your budget and goals:</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              {pill(dark ? "rgba(224,164,88,.1)" : "rgba(224,164,88,.08)", "#e0a458", "💰 Budget")}
              {pill(dark ? "rgba(96,165,250,.1)" : "rgba(96,165,250,.08)", "#60a5fa", "⚡ Standard")}
              {pill(dark ? "rgba(167,139,250,.1)" : "rgba(167,139,250,.08)", "#a78bfa", "👑 Premium")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
              <span><b style={{ color: "#e0a458" }}>Budget</b> — Lowest price. Good for testing or when you just need numbers fast.</span>
              <span><b style={{ color: "#60a5fa" }}>Standard</b> — Best value. Reliable quality with refill guarantee on most services.</span>
              <span><b style={{ color: "#a78bfa" }}>Premium</b> — Highest quality. Real-looking accounts, best retention, fastest speeds.</span>
            </div>
          </div>

          {/* Nigerian services */}
          <div style={{ marginBottom: 16, padding: 14, borderRadius: 10, background: dark ? "rgba(74,222,128,.05)" : "rgba(22,163,74,.03)", border: `1px solid ${dark ? "rgba(74,222,128,.1)" : "rgba(22,163,74,.08)"}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: dark ? "#4ade80" : "#16a34a", marginBottom: 6 }}>🇳🇬 Nigerian Services</div>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.7 }}>
              Look for the <span style={{ color: dark ? "#4ade80" : "#16a34a", fontWeight: 600 }}>🇳🇬</span> flag! These services are tailored for the Nigerian market — Nigerian followers, Nigerian engagement, Nigerian audiences. Perfect for building real local influence. Whether you're a Naija creator, business, or brand, these give you the engagement that actually matters to your audience.
            </p>
          </div>

          {/* How it works */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 6 }}>How To Order</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
              <span><span style={{ fontFamily: "'JetBrains Mono',monospace", color: t.accent || "#c47d8e", fontWeight: 700 }}>1.</span> Pick a platform (Instagram, TikTok, YouTube, etc.)</span>
              <span><span style={{ fontFamily: "'JetBrains Mono',monospace", color: t.accent || "#c47d8e", fontWeight: 700 }}>2.</span> Choose a service (Followers, Likes, Views, etc.)</span>
              <span><span style={{ fontFamily: "'JetBrains Mono',monospace", color: t.accent || "#c47d8e", fontWeight: 700 }}>3.</span> Select your tier (Budget, Standard, or Premium)</span>
              <span><span style={{ fontFamily: "'JetBrains Mono',monospace", color: t.accent || "#c47d8e", fontWeight: 700 }}>4.</span> Enter the link to your post/profile and quantity</span>
              <span><span style={{ fontFamily: "'JetBrains Mono',monospace", color: t.accent || "#c47d8e", fontWeight: 700 }}>5.</span> Pay and watch your order get delivered!</span>
            </div>
          </div>

          {/* Tips */}
          <div style={{ padding: 14, borderRadius: 10, background: dark ? "rgba(196,125,142,.06)" : "rgba(196,125,142,.03)", border: `1px solid ${dark ? "rgba(196,125,142,.1)" : "rgba(196,125,142,.08)"}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.accent || "#c47d8e", marginBottom: 6 }}>💡 Pro Tips</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
              <span>• <b style={{ color: t.text }}>Refill = free replacement.</b> If the count drops, we top it up automatically.</span>
              <span>• <b style={{ color: t.text }}>Start small.</b> Test a Budget tier first, then scale up if you like the quality.</span>
              <span>• <b style={{ color: t.text }}>Don't order from multiple providers at once</b> for the same link — it can cause conflicts.</span>
              <span>• <b style={{ color: t.text }}>Make your profile public</b> before ordering followers or likes.</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

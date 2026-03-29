'use client';
import { useState, useEffect } from "react";

export default function HowToPage({ dark, t }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetch("/api/blog?howto=true")
      .then(r => r.json())
      .then(d => setPosts(d.posts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fD = (d) => new Date(d).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" });

  return (
    <>
      <div className="svc-header">
        <div className="svc-title" style={{ color: t.text }}>How To</div>
        <div className="svc-subtitle" style={{ color: t.textMuted }}>Learn how to use Nitro with step-by-step guides and tutorials</div>
        <div className="page-divider" style={{ background: t.cardBorder }} />
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: t.textMuted }}>Loading tutorials...</div>
      ) : posts.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: .4 }}>📖</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 6 }}>Tutorials coming soon</div>
          <div style={{ fontSize: 13, color: t.textMuted }}>We're working on guides to help you get the most out of Nitro.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {posts.map(p => (
            <div key={p.id} onClick={() => setExpanded(expanded === p.id ? null : p.id)} style={{ borderRadius: 14, borderWidth: 1, borderStyle: "solid", borderColor: expanded === p.id ? t.accent : t.cardBorder, background: t.cardBg, overflow: "hidden", cursor: "pointer", transition: "border-color .2s" }}>
              {/* Thumbnail */}
              {p.thumbnail ? (
                <div style={{ height: 140, background: `url(${p.thumbnail}) center/cover`, borderBottom: `1px solid ${t.cardBorder}` }} />
              ) : (
                <div style={{ height: 100, background: dark ? "rgba(196,125,142,.06)" : "rgba(196,125,142,.04)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${t.cardBorder}` }}>
                  <span style={{ fontSize: 36, opacity: .3 }}>{p.category === "Tutorials" ? "📖" : p.category === "Tips & Tricks" ? "💡" : p.category === "Announcements" ? "📢" : "📄"}</span>
                </div>
              )}

              <div style={{ padding: 14 }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#c47d8e", background: dark ? "rgba(196,125,142,.1)" : "rgba(196,125,142,.06)", padding: "2px 8px", borderRadius: 4 }}>{p.category}</span>
                  <span style={{ fontSize: 10, color: t.textMuted }}>{fD(p.createdAt)}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: t.text, margin: "0 0 6px", lineHeight: 1.4 }}>{p.title}</h3>
                {p.excerpt && <p style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.5, margin: 0 }}>{p.excerpt}</p>}

                {/* Expanded: show full content */}
                {expanded === p.id && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${t.cardBorder}` }}>
                    <div style={{ fontSize: 13, color: t.textSoft, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: p.content || "" }} />
                  </div>
                )}

                <div style={{ marginTop: 10, fontSize: 12, color: t.accent, fontWeight: 500 }}>{expanded === p.id ? "Click to collapse ↑" : "Read more →"}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// Right sidebar for How To
export function HowToSidebar({ dark, t }) {
  return (
    <>
      <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Quick Links</div>
      {[
        ["How to place an order", "📦"],
        ["How to add funds", "💳"],
        ["Understanding tiers", "💡"],
        ["Referral program", "🎁"],
      ].map(([label, icon]) => (
        <div key={label} style={{ padding: "10px 12px", borderRadius: 10, background: dark ? "rgba(255,255,255,.04)" : "rgba(255,255,255,.8)", borderWidth: 1, borderStyle: "solid", borderColor: dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)", marginBottom: 6, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span style={{ fontSize: 13, color: t.text, fontWeight: 450 }}>{label}</span>
        </div>
      ))}

      <div style={{ height: 1, background: t.sidebarBorder, margin: "16px 0" }} />

      <div style={{ padding: "12px 14px", borderRadius: 10, background: dark ? "rgba(196,125,142,.06)" : "rgba(196,125,142,.04)", borderWidth: 1, borderStyle: "solid", borderColor: dark ? "rgba(196,125,142,.12)" : "rgba(196,125,142,.08)" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 4 }}>Need more help?</div>
        <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.5 }}>Visit our full blog for detailed guides and updates.</div>
      </div>
    </>
  );
}

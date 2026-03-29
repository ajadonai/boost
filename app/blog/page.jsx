'use client';
import { useState, useEffect } from "react";

const fD = (d) => new Date(d).toLocaleDateString("en-NG", { month: "long", day: "numeric", year: "numeric" });

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);

  // Theme — check localStorage then system preference
  useEffect(() => {
    const saved = localStorage.getItem("nitro-blog-theme");
    if (saved === "dark") setDark(true);
    else if (saved === "light") setDark(false);
    else setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("nitro-blog-theme", next ? "dark" : "light");
  };

  // Fetch posts
  useEffect(() => {
    fetch("/api/blog").then(r => r.json()).then(d => {
      setPosts(d.posts || []);
      setCategories(d.categories || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const loadPost = async (slug) => {
    const res = await fetch(`/api/blog?slug=${slug}`);
    const d = await res.json();
    if (d.post) { setSelectedPost(d.post); window.scrollTo(0, 0); }
  };

  const filtered = activeCat === "all" ? posts : posts.filter(p => p.category === activeCat);

  const bg = dark ? "#080b14" : "#f4f1ed";
  const cardBg = dark ? "rgba(255,255,255,.04)" : "#fff";
  const cardBorder = dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)";
  const text = dark ? "#e5e5e5" : "#1a1a1a";
  const textMuted = dark ? "#888" : "#666";
  const textSoft = dark ? "#aaa" : "#999";
  const accent = "#c47d8e";

  // ── Single post view ──
  if (selectedPost) return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Outfit', sans-serif" }}>
      <header className="blog-header" style={{ borderBottom: `1px solid ${cardBorder}` }}>
        <a href="/blog" onClick={e => { e.preventDefault(); setSelectedPost(null); }} className="blog-logo">
          <div className="blog-logo-mark">N</div>
          <span style={{ fontSize: 18, fontWeight: 600, color: text }}>Nitro <span style={{ fontWeight: 400, color: textSoft }}>Blog</span></span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={toggleTheme} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", padding: 4 }}>{dark ? "☀" : "☾"}</button>
          <a href="/" style={{ fontSize: 13, color: textMuted, textDecoration: "none" }}>← Nitro</a>
        </div>
      </header>
      <article className="blog-article" style={{ color: text }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2, color: accent, marginBottom: 14 }}>{selectedPost.category}</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 600, lineHeight: 1.2, margin: "0 0 14px", color: text }}>{selectedPost.title}</h1>
        <div style={{ fontSize: 13, color: textSoft, marginBottom: 32, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span>{selectedPost.authorName || "Nitro Team"}</span>
          <span>·</span>
          <span>{fD(selectedPost.createdAt)}</span>
          <span>·</span>
          <span>{selectedPost.views || 0} views</span>
        </div>
        {selectedPost.thumbnail && <div style={{ height: "clamp(200px, 30vw, 340px)", borderRadius: 14, backgroundImage: `url(${selectedPost.thumbnail})`, backgroundSize: "cover", backgroundPosition: "center", marginBottom: 32, backgroundColor: dark ? "#111" : "#eee" }} />}
        <div className="blog-article-body" style={{ color: dark ? "#ccc" : "#333" }} dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
        <button onClick={() => setSelectedPost(null)} style={{ display: "inline-block", marginTop: 40, padding: "10px 20px", borderRadius: 8, border: `1px solid ${cardBorder}`, background: "none", color: textMuted, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>← Back to all posts</button>
      </article>
      <footer style={{ textAlign: "center", padding: "30px 20px", borderTop: `1px solid ${cardBorder}` }}>
        <p style={{ fontSize: 13, color: textSoft, margin: 0 }}>© {new Date().getFullYear()} Nitro — Premium SMM Services</p>
      </footer>
    </div>
  );

  // ── Post list view ──
  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Outfit', sans-serif" }}>
      <header className="blog-header" style={{ borderBottom: `1px solid ${cardBorder}` }}>
        <a href="/blog" className="blog-logo">
          <div className="blog-logo-mark">N</div>
          <span style={{ fontSize: 18, fontWeight: 600, color: text }}>Nitro <span style={{ fontWeight: 400, color: textSoft }}>Blog</span></span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={toggleTheme} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", padding: 4 }}>{dark ? "☀" : "☾"}</button>
          <a href="/" style={{ fontSize: 13, color: textMuted, textDecoration: "none" }}>← Nitro</a>
        </div>
      </header>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "clamp(30px, 5vw, 60px) 20px clamp(20px, 3vw, 36px)", maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 600, margin: "0 0 12px", color: text }}>The Nitro Blog</h1>
        <p style={{ fontSize: 16, color: textMuted, lineHeight: 1.6, margin: 0 }}>Tips, guides, and updates to help you grow your social media presence.</p>
      </div>

      {/* Category filter */}
      {categories.length > 1 && (
        <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "0 20px 28px", flexWrap: "wrap" }}>
          <button onClick={() => setActiveCat("all")} style={{ padding: "6px 16px", borderRadius: 20, border: `1px solid ${activeCat === "all" ? accent : cardBorder}`, background: activeCat === "all" ? accent : "transparent", color: activeCat === "all" ? "#fff" : textMuted, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>All</button>
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCat(c)} style={{ padding: "6px 16px", borderRadius: 20, border: `1px solid ${activeCat === c ? accent : cardBorder}`, background: activeCat === c ? accent : "transparent", color: activeCat === c ? "#fff" : textMuted, fontSize: 13, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>{c}</button>
          ))}
        </div>
      )}

      {/* Posts grid */}
      <div className="blog-grid" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px, 3vw, 40px) 60px" }}>
        {loading ? (
          <div className="blog-empty" style={{ color: textMuted }}>Loading posts...</div>
        ) : filtered.length > 0 ? filtered.map(p => (
          <article key={p.id} onClick={() => loadPost(p.slug)} style={{ background: cardBg, borderRadius: 14, overflow: "hidden", cursor: "pointer", border: `1px solid ${cardBorder}`, transition: "box-shadow .2s, transform .2s" }} className="blog-card">
            {p.thumbnail && <div style={{ height: 180, backgroundImage: `url(${p.thumbnail})`, backgroundSize: "cover", backgroundPosition: "center", backgroundColor: dark ? "#111" : "#eee" }} />}
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: .8, color: accent, marginBottom: 8 }}>{p.category}</div>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 8px", color: text, lineHeight: 1.3 }}>{p.title}</h2>
              <p style={{ fontSize: 14, color: textMuted, lineHeight: 1.5, margin: "0 0 12px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.excerpt}</p>
              <div style={{ fontSize: 12, color: textSoft }}>{p.authorName || "Nitro Team"} · {fD(p.createdAt)}</div>
            </div>
          </article>
        )) : (
          <div className="blog-empty" style={{ color: textMuted }}>No posts yet — check back soon.</div>
        )}
      </div>

      <footer style={{ textAlign: "center", padding: "30px 20px", borderTop: `1px solid ${cardBorder}` }}>
        <p style={{ fontSize: 13, color: textSoft, margin: 0 }}>© {new Date().getFullYear()} Nitro — Premium SMM Services</p>
      </footer>
    </div>
  );
}

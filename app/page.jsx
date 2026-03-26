'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

function LoadingScreen() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    try {
      const s = localStorage.getItem("nitro-theme");
      if (s === "night") setDark(true);
      else if (s === "day") setDark(false);
      else { const h = new Date().getHours(), m = new Date().getMinutes(); setDark(h >= 19 || h < 6 || (h === 6 && m < 30) || (h === 18 && m >= 30)); }
    } catch { const h = new Date().getHours(); setDark(h >= 19 || h < 6); }
  }, []);
  const bg = dark ? "#060810" : "#f4f1ed";
  const accent = "#c47d8e";
  const glow = dark ? "rgba(196,125,142,.25)" : "rgba(196,125,142,.2)";
  const ring = dark ? "rgba(196,125,142,.1)" : "rgba(196,125,142,.06)";
  const ring2 = dark ? "rgba(196,125,142,.05)" : "rgba(196,125,142,.03)";
  const ring3 = dark ? "rgba(196,125,142,.025)" : "rgba(196,125,142,.015)";
  const track = dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)";
  const muted = dark ? "#555250" : "#b0ada8";
  const text = dark ? "#eae7e2" : "#1c1b19";
  const orbA = dark ? "rgba(196,125,142,.06)" : "rgba(196,125,142,.04)";
  const orbB = dark ? "rgba(110,160,230,.04)" : "rgba(110,160,230,.03)";
  const particle = dark ? "rgba(196,125,142,.15)" : "rgba(196,125,142,.1)";

  return (
    <div style={{ height:"100dvh", display:"flex", alignItems:"center", justifyContent:"center", background:bg, position:"relative", overflow:"hidden", fontFamily:"'Outfit',sans-serif" }}>
      <style>{`
        @keyframes breathe{0%,100%{transform:scale(1);filter:brightness(1)}50%{transform:scale(1.05);filter:brightness(1.15)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.3}50%{transform:scale(1.15);opacity:.08}100%{transform:scale(1);opacity:.3}}
        @keyframes float1{0%,100%{transform:translate(0,0)}50%{transform:translate(12px,-8px)}}
        @keyframes float2{0%,100%{transform:translate(0,0)}50%{transform:translate(-10px,12px)}}
        @keyframes float3{0%,100%{transform:translate(0,0)}50%{transform:translate(8px,12px)}}
        @keyframes dotPulse{0%,80%,100%{opacity:.3}40%{opacity:1}}
        @keyframes progressFill{0%{width:0}100%{width:85%}}
      `}</style>

      {/* Ambient orbs */}
      <div style={{position:"absolute",top:"15%",left:"-10%",width:300,height:300,borderRadius:"50%",background:orbA,filter:"blur(80px)",animation:"float1 20s ease-in-out infinite",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"10%",right:"-15%",width:250,height:250,borderRadius:"50%",background:orbB,filter:"blur(70px)",animation:"float2 25s ease-in-out infinite",pointerEvents:"none"}}/>

      {/* Particles */}
      {[["20%","75%",3,0],["45%","15%",4,1],["70%","80%",3,.5],["80%","25%",4,1.5]].map(([t2,l,s,d],i)=>(
        <div key={i} style={{position:"absolute",top:t2,left:l,width:s,height:s,borderRadius:"50%",background:particle,animation:`float3 ${3.5+i}s ease-in-out infinite ${d}s`,pointerEvents:"none"}}/>
      ))}

      {/* Pulse rings */}
      <div style={{position:"absolute",width:160,height:160,borderRadius:"50%",border:`1px solid ${ring}`,animation:"pulse-ring 3s ease-in-out infinite",pointerEvents:"none"}}/>
      <div style={{position:"absolute",width:220,height:220,borderRadius:"50%",border:`1px solid ${ring2}`,animation:"pulse-ring 3s ease-in-out infinite .5s",pointerEvents:"none"}}/>
      <div style={{position:"absolute",width:280,height:280,borderRadius:"50%",border:`1px solid ${ring3}`,animation:"pulse-ring 3s ease-in-out infinite 1s",pointerEvents:"none"}}/>

      {/* Content */}
      <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{width:64,height:64,borderRadius:18,background:"linear-gradient(135deg,#c47d8e,#8b5e6b)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 12px 40px ${glow}`,animation:"breathe 4s ease-in-out infinite",marginBottom:24}}>
          <svg width="28" height="28" viewBox="0 0 20 20" fill="none"><path d="M4,16 L4,4 L16,16 L16,4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span style={{fontSize:20,fontWeight:800,color:text,letterSpacing:3,marginBottom:6}}>NITRO</span>
        <span style={{fontSize:12,fontWeight:400,color:muted,letterSpacing:1,marginBottom:40}}>Loading your experience</span>
        <div style={{width:200,height:3,borderRadius:2,background:track,overflow:"hidden",position:"relative",marginBottom:12}}>
          <div style={{width:"85%",height:"100%",borderRadius:2,background:`linear-gradient(90deg,${accent},#a3586b)`,animation:"progressFill 2s ease-out forwards",boxShadow:`0 0 8px ${dark?"rgba(196,125,142,.3)":"rgba(196,125,142,.2)"}`}}/>
        </div>
        <div style={{display:"flex",gap:4,marginTop:4}}>
          {[0,1,2].map(i=><div key={i} style={{width:4,height:4,borderRadius:"50%",background:accent,animation:`dotPulse 1.4s ease-in-out infinite ${i*.2}s`}}/>)}
        </div>
      </div>
    </div>
  );
}

const Landing = dynamic(() => import('@/components/landing-page'), { ssr: false, loading: () => <LoadingScreen /> });

export default function HomePage() {
  return <Landing />;
}

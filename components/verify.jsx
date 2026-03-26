'use client';
import { useState, useEffect, useRef } from "react";

export default function VerifyAccount(){
  const getAuto=()=>{const h=new Date().getHours();return h>=7&&h<18?false:true;};
  const [dark,setDark]=useState(getAuto);
  const [mo,setMo]=useState(false);
  const toggleTheme=()=>{setMo(true);setDark(d=>!d);};
  useEffect(()=>{if(mo)return;const iv=setInterval(()=>setDark(getAuto()),60000);return()=>clearInterval(iv);},[mo]);

  const [code,setCode]=useState(["","","","","",""]);
  const [verifying,setVerifying]=useState(false);
  const [error,setError]=useState("");
  const [resendTimer,setResendTimer]=useState(60);
  const [verified,setVerified]=useState(false);
  const [userEmail,setUserEmail]=useState("");
  const inputs=useRef([]);

  useEffect(()=>{fetch("/api/auth/me").then(r=>r.json()).then(d=>{if(d.user?.email)setUserEmail(d.user.email);}).catch(()=>{});},[]);
  useEffect(()=>{if(resendTimer<=0)return;const iv=setInterval(()=>setResendTimer(p=>p-1),1000);return()=>clearInterval(iv);},[resendTimer]);

  const submitCode=async(codeStr)=>{
    setVerifying(true);setError("");
    try{
      const res=await fetch("/api/auth/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:codeStr})});
      const data=await res.json();
      if(!res.ok){setError(data.error||"Invalid code");setVerifying(false);return;}
      setVerified(true);
    }catch{setError("Something went wrong. Please try again.");setVerifying(false);}
  };

  const resendCode=async()=>{
    setResendTimer(60);
    try{const res=await fetch("/api/auth/verify",{method:"PUT"});const data=await res.json();if(!res.ok)setError(data.error||"Failed to resend");}catch{setError("Failed to resend code");}
  };

  const handleChange=(i,val)=>{
    if(!/^\d*$/.test(val))return;
    const next=[...code];next[i]=val.slice(-1);setCode(next);setError("");
    if(val&&i<5)inputs.current[i+1]?.focus();
    if(next.every(d=>d)&&next.join("").length===6){setVerifying(true);submitCode(next.join(""));}
  };
  const handleKeyDown=(i,e)=>{if(e.key==="Backspace"&&!code[i]&&i>0)inputs.current[i-1]?.focus();};
  const handlePaste=(e)=>{
    e.preventDefault();const pasted=e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if(!pasted.length)return;const next=[...code];for(let i=0;i<6;i++)next[i]=pasted[i]||"";
    setCode(next);inputs.current[Math.min(pasted.length,5)]?.focus();
    if(next.every(d=>d)){setVerifying(true);submitCode(next.join(""));}
  };
  const resend=()=>{if(resendTimer<=0){resendCode();setError("");setCode(["","","","","",""]);inputs.current[0]?.focus();}};

  const t={
    bg:dark?"#090c15":"#f0ede8",text:dark?"#eae7e2":"#1c1b19",soft:dark?"#a8a4a0":"#5c5955",muted:dark?"#6d6965":"#a09c97",
    accent:"#c47d8e",grad:"linear-gradient(135deg,#c47d8e,#a3586b)",green:dark?"#6ee7b7":"#059669",red:dark?"#fca5a5":"#dc2626",
    surface:dark?"rgba(15,19,35,.55)":"rgba(255,255,255,.5)",surfaceBrd:dark?"rgba(255,255,255,.07)":"rgba(0,0,0,.05)",
    inputBg:dark?"#0d1020":"#fff",inputBorder:dark?"rgba(255,255,255,.08)":"rgba(0,0,0,.1)",
    btnPrimary:"linear-gradient(135deg,#c47d8e,#a3586b)",
  };

  return(
    <div style={{minHeight:"100dvh",background:t.bg,fontFamily:"'Outfit',system-ui,sans-serif",transition:"background .5s ease",display:"flex",flexDirection:"column"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;450;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        button,a{cursor:pointer;font-family:inherit;border:none;text-decoration:none}
        .serif{font-family:'Cormorant Garamond',serif}
        .m{font-family:'JetBrains Mono',monospace}
        @keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
        @keyframes pop{0%{transform:scale(0.8);opacity:0}50%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
        .code-input{width:48px;height:56px;max-width:calc((100vw - 140px)/6);text-align:center;font-size:24px;font-weight:700;border-radius:12px;outline:none;transition:border-color .2s,box-shadow .2s}
        .code-input:focus{border-color:#c47d8e!important;box-shadow:0 0 0 3px rgba(196,125,142,.15)}
        @media(max-width:768px){.code-input{width:42px;height:48px;font-size:20px;border-radius:10px}.verify-card{padding:28px 24px!important;border-radius:18px!important;height:auto!important;max-height:85dvh!important}}
        @media(max-width:1024px){.verify-card{height:540px!important;padding:32px 28px!important}}
      `}</style>

      {/* Nav */}
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",height:56,background:dark?"rgba(9,12,21,.9)":"rgba(240,237,232,.9)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${t.surfaceBrd}`,flexShrink:0,position:"sticky",top:0,zIndex:50}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,borderRadius:7,background:t.grad,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M4,16 L4,4 L16,16 L16,4" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{fontSize:16,fontWeight:700,color:t.text,letterSpacing:1.5}}>NITRO</span>
        </a>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={toggleTheme} style={{width:44,height:24,borderRadius:12,background:dark?"#c47d8e":"rgba(0,0,0,0.08)",position:"relative",transition:"all .3s",flexShrink:0}}><div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:dark?23:3,transition:"left .3s cubic-bezier(.2,.8,.2,1)",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/></button>
          <a href="/" style={{fontSize:13,fontWeight:550,color:t.soft,display:"flex",alignItems:"center",gap:4}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.muted} strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </a>
        </div>
      </nav>

      {/* Center card */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div className="verify-card" style={{width:"100%",maxWidth:440,height:580,maxHeight:"90dvh",overflow:"hidden",background:dark?"rgba(17,22,40,0.98)":"rgba(255,255,255,0.98)",border:`1px solid ${t.surfaceBrd}`,borderRadius:20,padding:"36px 32px",boxShadow:dark?"0 20px 60px rgba(0,0,0,0.5)":"0 20px 60px rgba(0,0,0,0.1)",backdropFilter:"blur(20px)",textAlign:"center",display:"flex",flexDirection:"column",justifyContent:"center"}}>

          {!verified?<>
            {/* Logo */}
            <div style={{marginBottom:20}}><div style={{width:38,height:38,borderRadius:10,background:t.grad,display:"inline-flex",alignItems:"center",justifyContent:"center"}}><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4,16 L4,4 L16,16 L16,4" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></div></div>

            <h2 style={{fontSize:24,fontWeight:700,color:t.text,marginBottom:4}}>Verify Your Account</h2>
            <p style={{fontSize:14,color:t.soft,marginBottom:4,fontWeight:430}}>We sent a 6-digit code to</p>
            <p className="m" style={{fontSize:13,color:t.accent,fontWeight:600,marginBottom:28}}>{userEmail||"your email"}</p>

            {/* Error */}
            {error&&<div style={{padding:"10px 14px",borderRadius:10,background:dark?"rgba(220,38,38,0.1)":"#fef2f2",border:`1px solid ${dark?"rgba(220,38,38,0.2)":"#fecaca"}`,color:t.red,fontSize:13,marginBottom:16}}>⚠️ {error}</div>}

            {/* Code inputs */}
            <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:28}}>
              {code.map((digit,i)=>(
                <input key={i} ref={el=>inputs.current[i]=el} className="code-input m" type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={e=>handleChange(i,e.target.value)} onKeyDown={e=>handleKeyDown(i,e)} onPaste={i===0?handlePaste:undefined} disabled={verifying}
                  style={{background:t.inputBg,border:`1px solid ${digit?t.accent:t.inputBorder}`,color:t.text,opacity:verifying?.5:1}}
                />
              ))}
            </div>

            {/* Verifying spinner */}
            {verifying&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:20,color:t.accent}}>
              <span style={{width:16,height:16,border:"2px solid rgba(196,125,142,.3)",borderTopColor:t.accent,borderRadius:"50%",animation:"spin .6s linear infinite",display:"inline-block"}}/>
              <span style={{fontSize:14,fontWeight:500}}>Verifying...</span>
            </div>}

            {/* Resend */}
            <div style={{fontSize:13,color:t.muted,marginBottom:24}}>
              {resendTimer>0?<span>Resend code in <span className="m" style={{color:t.accent,fontWeight:600}}>{resendTimer}s</span></span>
              :<button onClick={resend} style={{background:"none",color:t.accent,fontWeight:600,fontSize:13}}>Resend Code</button>}
            </div>

            <div style={{paddingTop:16,borderTop:`1px solid ${t.surfaceBrd}`,fontSize:12,color:t.muted,lineHeight:1.6}}>
              Check your spam folder if you don't see it.<br/>Code expires in 15 minutes.
            </div>
          </>:<>
            {/* Success */}
            <div style={{animation:"pop .4s ease"}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:dark?"rgba(110,231,183,.1)":"rgba(5,150,105,.08)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:32,marginBottom:16,border:`2px solid ${t.green}`}}>✓</div>
              <h2 style={{fontSize:24,fontWeight:700,color:t.text,marginBottom:8}}>Verified!</h2>
              <p style={{fontSize:14,color:t.soft,marginBottom:28,fontWeight:430}}>Your account has been verified successfully. You're all set to start using Nitro.</p>
              <a href="/dashboard" style={{display:"inline-block",padding:"14px 40px",borderRadius:12,background:t.btnPrimary,color:"#fff",fontSize:15,fontWeight:700}}>Go to Dashboard</a>
            </div>
          </>}
        </div>
      </div>

      {/* Footer */}
      <footer style={{borderTop:`1px solid ${t.surfaceBrd}`,padding:"20px 24px"}}>
        <div style={{maxWidth:780,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <span style={{fontSize:12,color:t.muted}}>© 2026 Nitro. All rights reserved.</span>
          <div style={{display:"flex",gap:16}}>
            {[["Terms","/terms"],["Privacy","/privacy"],["Refund","/refund"],["Cookie","/cookie"]].map(([l,h])=><a key={l} href={h} style={{fontSize:11,color:t.muted}}>{l}</a>)}
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';
import { useState, useEffect } from "react";

export default function Refund(){
  const getAuto=()=>{const h=new Date().getHours();return h>=7&&h<18?false:true;};
  const [dark,setDark]=useState(getAuto);
  const [mo,setMo]=useState(false);
  const toggleTheme=()=>{setMo(true);setDark(d=>!d);};
  useEffect(()=>{if(mo)return;const iv=setInterval(()=>setDark(getAuto()),60000);return()=>clearInterval(iv);},[mo]);

  const t={bg:dark?"#090c15":"#f0ede8",text:dark?"#eae7e2":"#1c1b19",soft:dark?"#a8a4a0":"#5c5955",muted:dark?"#6d6965":"#a09c97",accent:"#c47d8e",grad:"linear-gradient(135deg,#c47d8e,#a3586b)",surface:dark?"rgba(15,19,35,.55)":"rgba(255,255,255,.5)",surfaceBrd:dark?"rgba(255,255,255,.07)":"rgba(0,0,0,.05)"};

  const sections=[
    ["Overview","Nitro is committed to delivering every order to your satisfaction. This refund policy outlines the circumstances under which you may be eligible for a refund or wallet credit. All refunds are processed to your Nitro wallet balance unless otherwise stated."],
    ["Eligible Refunds","You may request a refund in the following cases: the order was not delivered at all within the stated delivery time, the order was only partially delivered (you will be refunded for the undelivered portion), you were charged incorrectly due to a system error, or the service delivered was fundamentally different from what was described."],
    ["Non-Refundable Cases","Refunds will not be issued in the following situations: natural follower or engagement drops after successful delivery (services with refill guarantees will be refilled instead), orders where the provided link was incorrect or the account was set to private, orders for accounts that were deleted, suspended, or changed username after the order was placed, or dissatisfaction with the speed of delivery when delivery is still within the stated timeframe."],
    ["Refill Guarantee","Services marked with a refill guarantee will automatically be replenished if followers, likes, or other engagement drops within the stated guarantee period (typically 30 days). Refill requests are processed automatically and do not require a support ticket. Refills are not available for services not marked with a refill guarantee."],
    ["How to Request a Refund","To request a refund, open a support ticket from your dashboard with the subject line \"Refund Request\" and include your order ID. Our team will review your request within 24-48 hours. If approved, the refund will be credited to your Nitro wallet immediately."],
    ["Wallet Balance Refunds","All refunds are credited to your Nitro wallet balance. We do not process refunds directly to payment methods (cards, bank accounts). Wallet balances can be used for future orders on the platform."],
    ["Deposit Refunds","Deposits to your wallet are non-refundable once credited. If a deposit fails or is not credited to your account, please contact support with your payment reference for investigation. Failed deposits that were debited from your bank will be resolved with the payment processor."],
    ["Processing Time","Refund requests are typically reviewed within 24-48 hours. Once approved, wallet credits are applied instantly. For disputed transactions involving payment processors, resolution may take 5-10 business days."],
    ["Contact","For refund-related questions, open a support ticket from your dashboard or contact us at support@thenitro.ng"],
  ];

  return <LegalPage dark={dark} t={t} toggleTheme={toggleTheme} label="Policy" title="Refund" titleAccent="Policy" date="March 23, 2026" sections={sections} emailField="support@thenitro.ng" relatedLinks={[["Terms of Service","/terms"],["Privacy Policy","/privacy"],["Cookie Policy","/cookie"]]}/>;
}

function LegalPage({dark,t,toggleTheme,label,title,titleAccent,date,sections,emailField,relatedLinks}){
  return(
    <div style={{minHeight:"100dvh",background:t.bg,fontFamily:"'Outfit',system-ui,sans-serif",transition:"background .5s ease",display:"flex",flexDirection:"column"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;450;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        button,a{cursor:pointer;font-family:inherit;border:none;text-decoration:none}
        .serif{font-family:'Cormorant Garamond',serif}
        .m{font-family:'JetBrains Mono',monospace}
      `}</style>

      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",height:56,background:dark?"rgba(9,12,21,.9)":"rgba(240,237,232,.9)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${t.surfaceBrd}`,flexShrink:0,position:"sticky",top:0,zIndex:50}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,borderRadius:7,background:t.grad,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M4,16 L4,4 L16,16 L16,4" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
          <span style={{fontSize:16,fontWeight:700,color:t.text,letterSpacing:1.5}}>NITRO</span>
        </a>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={toggleTheme} style={{width:44,height:24,borderRadius:12,background:dark?"#c47d8e":"rgba(0,0,0,0.08)",position:"relative",transition:"all .3s",flexShrink:0}}><div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:dark?23:3,transition:"left .3s cubic-bezier(.2,.8,.2,1)",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/></button>
          <a href="/" style={{fontSize:13,fontWeight:550,color:t.soft,display:"flex",alignItems:"center",gap:4}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.muted} strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Back</a>
        </div>
      </nav>

      <div style={{flex:1,maxWidth:780,margin:"0 auto",width:"100%",padding:"48px 24px 60px"}}>
        <div style={{marginBottom:40}}>
          <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:3,color:t.accent,marginBottom:10}}>{label}</div>
          <h1 style={{fontSize:"clamp(32px,5vw,44px)",fontWeight:800,color:t.text,letterSpacing:-.5,lineHeight:1.1,marginBottom:8}}>{title} <span className="serif" style={{fontWeight:400,fontStyle:"italic",color:t.accent,fontSize:"clamp(36px,5.5vw,50px)"}}>{titleAccent}</span></h1>
          <p className="m" style={{fontSize:12,color:t.muted,fontWeight:500}}>Last updated: {date}</p>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {sections.map(([sTitle,content],i)=>(
            <div key={i} style={{padding:"24px 24px",borderRadius:18,background:t.surface,border:`1px solid ${t.surfaceBrd}`,backdropFilter:"blur(16px)",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,width:"25%",height:2,background:t.accent,opacity:.3}}/>
              <div style={{display:"flex",alignItems:"flex-start",gap:16}}>
                <span className="m" style={{fontSize:12,fontWeight:600,color:t.accent,flexShrink:0,marginTop:2,width:24}}>{String(i+1).padStart(2,"0")}</span>
                <div style={{flex:1}}>
                  <h2 style={{fontSize:17,fontWeight:700,color:t.text,marginBottom:10,letterSpacing:-.2}}>{sTitle}</h2>
                  <p style={{fontSize:14,color:t.soft,lineHeight:1.85,fontWeight:430}}>
                    {emailField&&content.includes(emailField)?<>{content.split(emailField)[0]}<a href={`mailto:${emailField}`} style={{color:t.accent}}>{emailField}</a>{content.split(emailField)[1]||""}</>:content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginTop:40,display:"flex",gap:16,flexWrap:"wrap"}}>
          {relatedLinks.map(([l,h])=><a key={l} href={h} style={{fontSize:13,color:t.accent,fontWeight:550}}>{l}</a>)}
        </div>
      </div>

      <footer style={{borderTop:`1px solid ${t.surfaceBrd}`,padding:"20px 24px"}}>
        <div style={{maxWidth:780,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <span style={{fontSize:12,color:t.muted}}>© 2026 Nitro. All rights reserved.</span>
          <div style={{display:"flex",gap:16}}>{[["Terms","/terms"],["Privacy","/privacy"],["Refund","/refund"],["Cookie","/cookie"]].map(([l,h])=><a key={l} href={h} style={{fontSize:11,color:t.muted}}>{l}</a>)}</div>
        </div>
      </footer>
    </div>
  );
}

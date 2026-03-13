import { useState, useEffect, useRef, useCallback } from "react";
import { CURRICULUM, getQuizBank, getUnits, getSubjectColor } from "./curriculum";
import { LESSON_VISUALS, useNarration, NarrationBtn } from "./lesson-visuals";

// ─── DESIGN TOKENS ────────────────────────────────────────────────
const C = {
  bg:"#F0F4FF", card:"#FFFFFF", cardHover:"#F8FAFF",
  border:"rgba(27,63,171,0.12)", borderHi:"rgba(27,63,171,0.28)",
  navy:"#1B3FAB", navyDark:"#0F2880", navyLight:"#EEF2FF",
  blue:"#3B82F6", blueLight:"#DBEAFE",
  purple:"#6C3FC5", purpleBright:"#7C3AED", purpleLight:"#EDE9FE",
  teal:"#0F9D75", tealLight:"#DCFCE7",
  cyan:"#0EA5E9", cyanLight:"#E0F2FE",
  gold:"#F59E0B", goldLight:"#FEF3C7", goldBright:"#FFD93D",
  orange:"#F97316", orangeLight:"#FEF0E8",
  pink:"#EC4899", pinkLight:"#FCE7F3",
  red:"#EF4444", redLight:"#FEE2E2",
  green:"#22C55E", greenLight:"#DCFCE7",
  text:"#1E2A4A", muted:"#64748B", dim:"#94A3B8",
  labelGreen:"#065F46", labelGold:"#78350F", labelCyan:"#0C4A6E",
  labelPurple:"#4C1D95", labelPink:"#831843", labelOrange:"#7C2D12",
  labelNavy:"#1B3FAB", labelBlue:"#1D4ED8",
};
const ff="'Nunito',sans-serif", fn="'DM Sans',sans-serif";

// ─── RESPONSIVE HOOK ──────────────────────────────────────────────
function useIsTablet() {
  const [tablet, setTablet] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );
  useEffect(() => {
    const onResize = () => setTablet(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return tablet;
}

// ─── TEACHER DATA ─────────────────────────────────────────────────
const CLASSES = [
  { id:"c1", name:"Ms. Johnson's 2nd Grade", grade:"2-3", students:[
    {id:"s1",name:"Alex",avatar:"🧒",xp:1840,streak:9,rank:3,mathScore:87,sciScore:72,lastActive:"Today",adaptLevel:2},
    {id:"s2",name:"Zara",avatar:"👧",xp:2840,streak:12,rank:1,mathScore:95,sciScore:88,lastActive:"Today",adaptLevel:3},
    {id:"s3",name:"Leo",avatar:"👦",xp:2650,streak:9,rank:2,mathScore:82,sciScore:79,lastActive:"Yesterday",adaptLevel:2},
    {id:"s4",name:"Nia",avatar:"👧",xp:1200,streak:3,rank:8,mathScore:61,sciScore:55,lastActive:"3 days ago",adaptLevel:1},
    {id:"s5",name:"Sam",avatar:"🧒",xp:980,streak:2,rank:12,mathScore:48,sciScore:60,lastActive:"1 week ago",adaptLevel:1},
  ]},
];

const ASSIGNMENTS = [
  {id:"a1",title:"Fractions Unit Quiz",subject:"Math",dueDate:"Mar 5",assigned:"Feb 28",completedBy:3,totalStudents:5,avgScore:78},
  {id:"a2",title:"Solar System Test",subject:"Science",dueDate:"Mar 10",assigned:"Mar 1",completedBy:1,totalStudents:5,avgScore:92},
];

// ─── MOCK PROFILES ─── (2nd Grade for testing curriculum + visuals) ──
const PROFILES = [
  {id:"s1",name:"Alex",avatar:"🧒",grade:"2-3",gradeLabel:"2nd Grade",coins:420,xp:1840,streak:9,rank:3,
   adaptLevel:2,adaptHistory:[1,1,2,2,2,3],completedTopics:["Numbers to 1,000","Add & Subtract"],
   badges:["Math Wizard","Speed Demon","Star Gazer"]},
  {id:"s2",name:"Mia",avatar:"👧",grade:"2-3",gradeLabel:"2nd Grade",coins:210,xp:980,streak:5,rank:8,
   adaptLevel:1,adaptHistory:[1,1,1,1,2],completedTopics:["Numbers to 1,000"],badges:["Star Gazer"]},
];

const GIVE_BACK = [
  {id:"tree",name:"Plant a Tree",emoji:"🌳",coins:100,org:"One Tree Planted",impact:"1 tree planted"},
  {id:"animal",name:"Feed a Shelter Animal",emoji:"🐶",coins:80,org:"ASPCA",impact:"5 meals donated"},
  {id:"ocean",name:"Clean the Ocean",emoji:"🌊",coins:120,org:"Ocean Conservancy",impact:"1 lb removed"},
];

const STORE_ITEMS = [
  {id:1,name:"Roblox 400 Robux",emoji:"🎮",coins:500,category:"Gaming",badge:"🔥"},
  {id:2,name:"Amazon $5 Gift Card",emoji:"🛍️",coins:600,category:"Shopping",badge:""},
  {id:3,name:"Ice Cream Voucher",emoji:"🍦",coins:150,category:"Food",badge:"⭐"},
  {id:4,name:"Pizza Night",emoji:"🍕",coins:200,category:"Food",badge:""},
  {id:5,name:"LEGO Mini Set",emoji:"🧱",coins:800,category:"Toys",badge:""},
  {id:6,name:"Minecraft Card",emoji:"⛏️",coins:700,category:"Gaming",badge:"🔥"},
];

// ─── LETZKOOL LOGO ────────────────────────────────────────────────
// Matches the uploaded logo: teal→blue gradient bg, "LS" letters, rocket, atom, science symbols
function LetzSkoolLogo({size=32,showText=true,dark=false}){
  const rx=Math.round(size*0.22);
  return(
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <img
        src="/letzkool-logo.png"
        alt="LetzSkool"
        style={{width:size,height:size,borderRadius:rx,display:"block"}}
      />
      {showText&&<span style={{color:dark?"white":C.navy,fontWeight:900,fontSize:Math.round(size*0.5),fontFamily:ff,letterSpacing:"-0.3px"}}>LetzSkool</span>}
    </div>
  );
}

// ─── SHARED UI ────────────────────────────────────────────────────
function PBar({v,c,h=6}){return <div style={{background:"rgba(27,63,171,0.1)",borderRadius:99,height:h,overflow:"hidden"}}><div style={{width:`${Math.min(v,100)}%`,background:c,height:"100%",borderRadius:99,transition:"width 0.8s ease"}}/></div>}
function Pill({ch,c,bg,onClick,style={}}){return <span onClick={onClick} style={{background:bg||`${c}18`,color:c||C.text,borderRadius:99,padding:"3px 10px",fontSize:10,fontWeight:700,fontFamily:fn,display:"inline-block",cursor:onClick?"pointer":"default",border:`1px solid ${c}30`,...style}}>{ch}</span>}
function Btn({ch,onClick,grad,style={},sm,disabled}){return <button onClick={disabled?undefined:onClick} style={{background:disabled?"#E2E8F0":grad||`linear-gradient(135deg,${C.navy},${C.blue})`,border:"none",borderRadius:12,padding:sm?"8px 14px":"13px 20px",color:disabled?C.dim:"white",fontWeight:800,fontSize:sm?11:14,fontFamily:ff,cursor:disabled?"not-allowed":"pointer",display:"block",opacity:disabled?0.6:1,boxShadow:disabled?"none":`0 2px 12px ${C.navy}30`,...style}}>{ch}</button>}
function Card({children,style={},glow,onClick}){return <div onClick={onClick} style={{background:C.card,borderRadius:16,padding:16,border:`1px solid ${glow?glow+"30":C.border}`,cursor:onClick?"pointer":"default",boxShadow:"0 1px 6px rgba(27,63,171,0.06)",...style}}>{children}</div>}
function STitle({ch,sub}){return <div style={{marginBottom:sub?10:12}}><div style={{color:C.text,fontSize:16,fontWeight:800,fontFamily:ff}}>{ch}</div>{sub&&<div style={{color:C.muted,fontSize:12,fontFamily:fn,marginTop:2}}>{sub}</div>}</div>}
function Bg(){
  return <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,background:"linear-gradient(160deg,#EEF2FF 0%,#F0F4FF 40%,#E8F4F8 100%)"}}>
    <div style={{position:"absolute",top:-80,right:-80,width:320,height:320,borderRadius:"50%",background:"rgba(59,130,246,0.06)"}}/>
    <div style={{position:"absolute",bottom:-60,left:-60,width:240,height:240,borderRadius:"50%",background:"rgba(108,63,197,0.05)"}}/>
    <div style={{position:"absolute",top:"40%",left:"60%",width:180,height:180,borderRadius:"50%",background:"rgba(15,157,117,0.05)"}}/>
  </div>;
}
function Badge({level}){
  const map={1:{label:"Beginner",color:C.teal,bg:C.tealLight,icon:"🌱"},2:{label:"Intermediate",color:C.blue,bg:C.blueLight,icon:"⚡"},3:{label:"Advanced",color:C.purple,bg:C.purpleLight,icon:"🔥"}};
  const b=map[level]||map[1];
  return <span style={{background:b.bg,color:b.color,borderRadius:99,padding:"3px 10px",fontSize:10,fontWeight:700,fontFamily:fn,border:`1px solid ${b.color}30`}}>{b.icon} {b.label}</span>;
}

// ─── COPPA CONSENT SCREEN ─────────────────────────────────────────
function CoppaScreen({onAccept}){
  const [step,setStep]=useState("splash");
  const [age,setAge]=useState("");
  const [checks,setChecks]=useState({data:false,noSell:false,delete:false,review:false});
  const [parentEmail,setParentEmail]=useState("");
  const allChecked=Object.values(checks).every(Boolean);

  if(step==="splash") return(
    <div style={{padding:"30px 20px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100%"}}>
      <div style={{width:80,height:80,borderRadius:24,background:`linear-gradient(135deg,${C.teal},${C.blue})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,marginBottom:16,boxShadow:`0 8px 32px ${C.teal}30`}}>🛡️</div>
      <div style={{color:C.text,fontSize:24,fontWeight:900,fontFamily:ff,marginBottom:8}}>Your Privacy is Protected</div>
      <div style={{color:C.muted,fontSize:13,fontFamily:fn,lineHeight:1.6,marginBottom:28,maxWidth:280}}>LetzSkool is fully COPPA compliant. We protect children's data with the highest standards. Let's take 60 seconds to set this up.</div>
      <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",marginBottom:24}}>
        {[["🔒","No ads, ever","We never show ads to children"],["🚫","We never sell data","Your child's data stays private"],["👨‍👩‍👧","Parent controls","You approve everything"],["🗑️","Delete anytime","Full data deletion on request"]].map(([icon,title,sub])=>(
          <div key={title} style={{background:C.navyLight,borderRadius:14,padding:"12px 16px",display:"flex",gap:12,alignItems:"center",border:`1px solid ${C.border}`,textAlign:"left"}}>
            <div style={{fontSize:24,flexShrink:0}}>{icon}</div>
            <div><div style={{color:C.text,fontWeight:700,fontSize:13,fontFamily:fn}}>{title}</div><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>{sub}</div></div>
          </div>
        ))}
      </div>
      <Btn ch="Let's Set Up Privacy →" onClick={()=>setStep("age")} style={{width:"100%"}} grad={`linear-gradient(135deg,${C.teal},${C.blue})`}/>
    </div>
  );

  if(step==="age") return(
    <div style={{padding:"30px 20px"}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:48,marginBottom:10}}>🎂</div>
        <div style={{color:C.text,fontSize:20,fontWeight:800,fontFamily:ff,marginBottom:6}}>How old are you?</div>
        <div style={{color:C.muted,fontSize:13,fontFamily:fn}}>We're required by law to ask.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:24}}>
        {["5","6","7","8","9","10","11","12+"].map(a=>(
          <div key={a} onClick={()=>setAge(a)} style={{background:age===a?`linear-gradient(135deg,${C.navy},${C.blue})`:C.card,borderRadius:14,padding:"16px 8px",textAlign:"center",cursor:"pointer",border:`1px solid ${age===a?C.navy:C.border}`,color:age===a?"white":C.text,fontWeight:800,fontSize:16,fontFamily:ff,transition:"all 0.2s",boxShadow:age===a?`0 4px 16px ${C.navy}30`:"none"}}>
            {a}
          </div>
        ))}
      </div>
      {age&&parseInt(age)<13&&(
        <Card style={{marginBottom:16,background:C.goldLight,border:`1px solid ${C.gold}44`}}>
          <div style={{color:C.labelGold,fontWeight:700,fontSize:13,fontFamily:fn}}>👨‍👩‍👧 Since you're under 13, we need a parent or guardian to set up your account. This is required by COPPA law to protect kids like you!</div>
        </Card>
      )}
      <Btn ch={age&&parseInt(age)<13?"Get Parent to Continue →":"Continue →"} onClick={()=>age&&(parseInt(age)<13?setStep("parent"):setStep("privacy"))} disabled={!age} style={{width:"100%"}} grad={`linear-gradient(135deg,${C.navy},${C.blue})`}/>
    </div>
  );

  if(step==="parent") return(
    <div style={{padding:"30px 20px"}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:48,marginBottom:10}}>👨‍👩‍👧</div>
        <div style={{color:C.text,fontSize:20,fontWeight:800,fontFamily:ff,marginBottom:6}}>Parent / Guardian Setup</div>
        <div style={{color:C.muted,fontSize:13,fontFamily:fn,lineHeight:1.5}}>Please have a parent or guardian enter their email. We'll send them a verification link — required by COPPA for children under 13.</div>
      </div>
      <div style={{marginBottom:16}}>
        <div style={{color:C.muted,fontSize:12,fontFamily:fn,marginBottom:6}}>Parent/Guardian Email</div>
        <input value={parentEmail} onChange={e=>setParentEmail(e.target.value)} placeholder="parent@example.com" style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 16px",color:C.text,fontSize:14,fontFamily:fn,outline:"none",boxSizing:"border-box"}}/>
      </div>
      <Card style={{marginBottom:20,background:C.tealLight,border:`1px solid ${C.teal}33`}}>
        <div style={{color:C.labelGreen,fontSize:12,fontFamily:fn,lineHeight:1.6}}>
          <div style={{fontWeight:800,marginBottom:4}}>📧 We will email the parent to:</div>
          <div>• Verify they are the parent/guardian</div>
          <div>• Explain what data we collect</div>
          <div>• Give them full control of the account</div>
          <div>• Allow data deletion at any time</div>
        </div>
      </Card>
      <Btn ch="Send Verification Email →" onClick={()=>parentEmail.includes("@")&&setStep("privacy")} disabled={!parentEmail.includes("@")} style={{width:"100%"}} grad={`linear-gradient(135deg,${C.teal},${C.blue})`}/>
    </div>
  );

  if(step==="privacy") return(
    <div style={{padding:"24px 20px"}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:40,marginBottom:8}}>📋</div>
        <div style={{color:C.text,fontSize:20,fontWeight:800,fontFamily:ff,marginBottom:4}}>Privacy Agreement</div>
        <div style={{color:C.muted,fontSize:12,fontFamily:fn}}>Please read and accept each item</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
        {[
          {key:"data",title:"Data Collection",desc:"We only collect: name, age, grade, quiz scores, and learning progress. We never collect location, contacts, photos, or browsing history."},
          {key:"noSell",title:"No Data Selling",desc:"We will NEVER sell, rent, or share your child's personal data with advertisers, data brokers, or third parties for commercial purposes."},
          {key:"delete",title:"Right to Delete",desc:"You can request full deletion of all your child's data at any time by emailing privacy@letzkool.com. We will delete within 30 days."},
          {key:"review",title:"Parental Review",desc:"Parents can review all data we have collected about their child at any time. We will provide a full data export within 5 business days."},
        ].map(item=>(
          <div key={item.key} onClick={()=>setChecks(c=>({...c,[item.key]:!c[item.key]}))} style={{background:checks[item.key]?C.tealLight:C.card,borderRadius:16,padding:"14px 16px",cursor:"pointer",border:`1px solid ${checks[item.key]?C.teal+"55":C.border}`,display:"flex",gap:14,alignItems:"flex-start",transition:"all 0.2s"}}>
            <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${checks[item.key]?C.teal:C.dim}`,background:checks[item.key]?C.teal:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2,fontSize:13,color:"white",transition:"all 0.2s"}}>
              {checks[item.key]&&"✓"}
            </div>
            <div>
              <div style={{color:C.text,fontWeight:700,fontSize:13,fontFamily:fn,marginBottom:3}}>{item.title}</div>
              <div style={{color:C.muted,fontSize:11,fontFamily:fn,lineHeight:1.5}}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <Btn ch={allChecked?"I Agree — Let's Start! 🚀":"Please accept all items above"} onClick={()=>allChecked&&setStep("done")} disabled={!allChecked} style={{width:"100%"}} grad={`linear-gradient(135deg,${C.teal},${C.blue})`}/>
    </div>
  );

  if(step==="done") return(
    <div style={{padding:"40px 20px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100%"}}>
      <div style={{width:80,height:80,borderRadius:24,background:`linear-gradient(135deg,${C.teal},${C.blue})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,marginBottom:16,boxShadow:`0 8px 32px ${C.teal}30`}}>✅</div>
      <div style={{color:C.text,fontSize:24,fontWeight:900,fontFamily:ff,marginBottom:8}}>All Set!</div>
      <div style={{color:C.muted,fontSize:13,fontFamily:fn,marginBottom:8,lineHeight:1.6}}>Your account is COPPA compliant and fully protected.</div>
      <div style={{background:C.tealLight,border:`1px solid ${C.teal}33`,borderRadius:14,padding:"10px 20px",marginBottom:28}}>
        <div style={{color:C.labelGreen,fontSize:12,fontWeight:700,fontFamily:fn}}>🛡️ Privacy ID: #LZ-{Math.floor(Math.random()*90000+10000)}</div>
        <div style={{color:C.teal,fontSize:10,fontFamily:fn,marginTop:2}}>Keep this for your records</div>
      </div>
      <Btn ch="Start Learning! 🚀" onClick={onAccept} style={{width:"100%"}} grad={`linear-gradient(135deg,${C.navy},${C.blue})`}/>
    </div>
  );
}

// ─── ADAPTIVE QUIZ ENGINE ─────────────────────────────────────────
function AdaptiveQuiz({profile,onComplete}){
  const [level,setLevel]=useState(profile.adaptLevel||1);
  const [streak,setStreak]=useState(0);
  const [history,setHistory]=useState([]); // {correct,level,topic}
  const [qIdx,setQIdx]=useState(0);
  const [selected,setSelected]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [score,setScore]=useState(0);
  const [levelUp,setLevelUp]=useState(null);
  const [done,setDone]=useState(false);
  const [subject,setSubject]=useState("Math");
  const [started,setStarted]=useState(false);

  const bank = getQuizBank(profile.grade, subject).filter(q => q.diff === level);
  const getQuestion=()=>{
    const pool=bank.filter(q=>q.diff===level);
    const used=history.map(h=>h.id);
    const fresh=pool.filter(q=>!used.includes(q.id));
    const source=fresh.length>0?fresh:pool;
    return source[qIdx%source.length]||bank[0];
  };
  const q=getQuestion();
  const totalQ=6;

  const handleAnswer=(i)=>{
    if(answered)return;
    setSelected(i);setAnswered(true);
    const correct=i===q.answer;
    const newStreak=correct?streak+1:0;
    setStreak(newStreak);
    if(correct)setScore(s=>s+1);
    setHistory(h=>[...h,{id:q.id,correct,level,topic:q.topic}]);

    // Adaptive logic: level up after 3 correct in a row, level down after 2 wrong
    if(correct&&newStreak>=3&&level<3){
      setTimeout(()=>{setLevel(l=>Math.min(l+1,3));setLevelUp("up");setTimeout(()=>setLevelUp(null),2500);},400);
    } else if(!correct&&history.slice(-1)[0]?.correct===false&&level>1){
      setTimeout(()=>{setLevel(l=>Math.max(l-1,1));setLevelUp("down");setTimeout(()=>setLevelUp(null),2500);},400);
    }
  };

  const next=()=>{
    if(history.length>=totalQ){setDone(true);}
    else{setQIdx(i=>i+1);setSelected(null);setAnswered(false);}
  };

  if(!started) return(
    <div style={{padding:"20px 16px"}}>
      <STitle ch="Adaptive Practice 🧠" sub="Questions adjust to your skill level automatically!"/>
      <Card style={{marginBottom:16,background:`linear-gradient(135deg,rgba(108,63,197,0.07),${C.blue}08)`}}>
        <div style={{color:C.text,fontWeight:800,fontSize:14,fontFamily:ff,marginBottom:10}}>How Adaptive Learning Works</div>
        {[["🌱","Starts at your level","Questions match where you are right now"],["⬆️","Gets harder as you improve","3 correct in a row = level up!"],["⬇️","Adjusts if you struggle","Never gets stuck — always finds your zone"],["🎯","Tracks your weak spots","Focuses extra time on topics you need most"]].map(([icon,t,s])=>(
          <div key={t} style={{display:"flex",gap:12,marginBottom:10}}>
            <div style={{fontSize:20,flexShrink:0}}>{icon}</div>
            <div><div style={{color:C.text,fontWeight:700,fontSize:12,fontFamily:fn}}>{t}</div><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>{s}</div></div>
          </div>
        ))}
      </Card>
      <div style={{marginBottom:16}}>
        <div style={{color:C.muted,fontSize:12,fontFamily:fn,marginBottom:8}}>Choose subject:</div>
        <div style={{display:"flex",gap:8}}>
          {["Math","Science"].map(s=>(
            <div key={s} onClick={()=>setSubject(s)} style={{flex:1,padding:"12px",borderRadius:14,background:subject===s?`linear-gradient(135deg,${C.navy},${C.blue})`:C.card,color:subject===s?"white":C.text,fontWeight:800,fontSize:14,fontFamily:ff,textAlign:"center",cursor:"pointer",border:`1px solid ${subject===s?C.navy:C.border}`}}>
              {s==="Math"?"🔢 Math":"🔬 Science"}
            </div>
          ))}
        </div>
      </div>
      <Card style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>Your current level</div><div style={{color:C.text,fontSize:16,fontWeight:800,fontFamily:ff,marginTop:2}}><Badge level={level}/></div></div>
          <div style={{textAlign:"right"}}><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>{totalQ} questions</div><div style={{color:C.labelGold,fontSize:13,fontWeight:800,fontFamily:fn,marginTop:2}}>+{totalQ*30} XP possible</div></div>
        </div>
      </Card>
      <Btn ch="Start Adaptive Quiz! 🚀" onClick={()=>setStarted(true)} style={{width:"100%"}}/>
    </div>
  );

  if(done){
    const pct=Math.round((score/history.length)*100);
    const newLevel=level;
    return(
      <div style={{padding:"30px 16px",textAlign:"center"}}>
        <div style={{fontSize:70,marginBottom:12}}>{pct>=80?"🧠":pct>=60?"⭐":"💪"}</div>
        <div style={{color:C.text,fontSize:26,fontWeight:800,fontFamily:ff,marginBottom:6}}>{pct>=80?"Incredible!":pct>=60?"Great Work!":"Keep Practicing!"}</div>
        <div style={{color:C.muted,fontSize:13,fontFamily:fn,marginBottom:20}}>{score}/{history.length} correct · Ended at <Badge level={newLevel}/></div>
        <Card glow={C.gold} style={{marginBottom:14,background:C.goldLight}}>
          <div style={{color:C.labelGold,fontSize:26,fontWeight:800,fontFamily:ff}}>+{score*30} XP &nbsp; +{score*15} ⭐</div>
        </Card>
        {/* Topic breakdown */}
        <Card style={{marginBottom:16,textAlign:"left"}}>
          <div style={{color:C.text,fontWeight:800,fontSize:13,fontFamily:ff,marginBottom:10}}>Topic Breakdown</div>
          {[...new Set(history.map(h=>h.topic))].map(topic=>{
            const topicQ=history.filter(h=>h.topic===topic);
            const correct=topicQ.filter(h=>h.correct).length;
            const pctT=Math.round((correct/topicQ.length)*100);
            return(
              <div key={topic} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <div style={{color:C.text,fontSize:12,fontFamily:fn}}>{topic}</div>
                  <div style={{color:pctT>=70?C.green:pctT>=50?C.gold:C.red,fontWeight:700,fontSize:12,fontFamily:fn}}>{pctT}%</div>
                </div>
                <PBar v={pctT} c={pctT>=70?C.green:pctT>=50?C.gold:C.red}/>
              </div>
            );
          })}
        </Card>
        <Btn ch="Practice Again" onClick={()=>{setDone(false);setQIdx(0);setSelected(null);setAnswered(false);setScore(0);setHistory([]);setStreak(0);setStarted(false);}} style={{width:"100%"}}/>
        {onComplete&&<div onClick={()=>onComplete({level,score,total:history.length})} style={{color:C.muted,fontSize:12,fontFamily:fn,marginTop:12,cursor:"pointer",textDecoration:"underline"}}>Done for now</div>}
      </div>
    );
  }

  const diffColor={1:C.green,2:C.blue,3:C.gold}[level];
  const diffLabel={1:"Easy",2:"Medium",3:"Hard"}[level];

  return(
    <div style={{padding:"16px"}}>
      {/* Level up/down notification */}
      {levelUp&&(
        <div style={{position:"absolute",top:70,left:"50%",transform:"translateX(-50%)",background:levelUp==="up"?`linear-gradient(135deg,${C.gold},${C.orange})`:`linear-gradient(135deg,${C.teal},${C.blue})`,borderRadius:14,padding:"10px 20px",color:"white",fontWeight:800,fontSize:13,fontFamily:ff,zIndex:50,whiteSpace:"nowrap",animation:"fadeIn 0.3s ease",boxShadow:"0 8px 30px rgba(27,63,171,0.15)"}}>
          {levelUp==="up"?"🔥 Level Up! Getting Harder!":"💙 Adjusting... You've Got This!"}
        </div>
      )}

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <div style={{background:`${diffColor}22`,color:diffColor,borderRadius:99,padding:"4px 12px",fontSize:11,fontWeight:800,fontFamily:fn}}>
            {diffLabel}
          </div>
          {streak>=2&&<div style={{background:`${C.orange}22`,color:C.orange,borderRadius:99,padding:"4px 10px",fontSize:11,fontWeight:800,fontFamily:fn}}>🔥 {streak} streak</div>}
        </div>
        <div style={{color:C.muted,fontSize:12,fontFamily:fn}}>{history.length+1}/{totalQ}</div>
      </div>
      <PBar v={((history.length)/totalQ)*100} c={`linear-gradient(90deg,${C.purple},${C.blue})`} h={6}/>

      {/* Difficulty indicator */}
      <div style={{display:"flex",gap:4,justifyContent:"center",margin:"10px 0"}}>
        {[1,2,3].map(l=>(
          <div key={l} style={{width:28,height:6,borderRadius:3,background:l<=level?diffColor:C.dim,transition:"all 0.4s ease"}}/>
        ))}
      </div>

      <Card style={{margin:"10px 0 14px",textAlign:"center",padding:"22px 18px"}}>
        <div style={{color:C.dim,fontSize:10,fontFamily:fn,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>{q.topic}</div>
        <div style={{color:C.text,fontSize:18,fontWeight:800,fontFamily:ff,lineHeight:1.4}}>{q.q}</div>
      </Card>

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {q.opts.map((opt,i)=>{
          let bg=C.card,border=`1px solid ${C.border}`;
          if(answered){
            if(i===q.answer){bg=`${C.green}22`;border=`1px solid ${C.green}`;}
            else if(i===selected&&i!==q.answer){bg=`${C.red}22`;border=`1px solid ${C.red}`;}
          } else if(selected===i){border=`1px solid ${C.navy}`;}
          return(
            <div key={i} onClick={()=>handleAnswer(i)} style={{background:bg,border,borderRadius:13,padding:"13px 16px",color:C.text,fontWeight:700,fontSize:14,fontFamily:fn,cursor:answered?"default":"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.15s"}}>
              <span>{opt}</span>
              <div style={{display:"flex",gap:6}}>
                {answered&&i===q.answer&&<span>✅</span>}
                {answered&&i===selected&&i!==q.answer&&<span>❌</span>}
              </div>
            </div>
          );
        })}
      </div>

      {answered&&(
        <div>
          <Card style={{marginTop:12,background:selected===q.answer?`${C.green}0a`:`${C.red}0a`,border:`1px solid ${selected===q.answer?C.green+"44":C.red+"44"}`}}>
            <div style={{color:selected===q.answer?C.green:C.red,fontWeight:700,fontSize:13,fontFamily:fn}}>
              {selected===q.answer?"✅ Correct! ":"❌ Not quite — "}{selected!==q.answer&&<span style={{color:C.text}}>the answer is <strong>{q.opts[q.answer]}</strong></span>}
            </div>
            {streak>=2&&selected===q.answer&&<div style={{color:C.orange,fontSize:12,fontFamily:fn,marginTop:3}}>🔥 {streak} correct in a row!</div>}
          </Card>
          <Btn ch={history.length+1>=totalQ?"See Results 🎉":"Next Question →"} onClick={next} style={{width:"100%",marginTop:10}}/>
        </div>
      )}
    </div>
  );
}

// ─── TEACHER PORTAL ───────────────────────────────────────────────
function TeacherPortal(){
  const [sub,setSub]=useState("dashboard");
  const cls=CLASSES[0];
  const [showAssign,setShowAssign]=useState(false);
  const [assignTitle,setAssignTitle]=useState("");
  const [assignSubject,setAssignSubject]=useState("Math");
  const [selectedStudent,setSelectedStudent]=useState(null);

  const avgXP=Math.round(cls.students.reduce((a,s)=>a+s.xp,0)/cls.students.length);
  const activeToday=cls.students.filter(s=>s.lastActive==="Today").length;
  const struggling=cls.students.filter(s=>s.mathScore<65||s.sciScore<65);

  return(
    <div style={{padding:"0 16px 16px",position:"relative"}}>
      {/* Student detail modal */}
      {selectedStudent&&(
        <div style={{position:"absolute",inset:0,background:C.card,zIndex:30,overflowY:"auto",padding:"16px"}}>
          <div onClick={()=>setSelectedStudent(null)} style={{color:C.muted,fontSize:13,fontFamily:fn,marginBottom:16,cursor:"pointer"}}>← Back to Class</div>
          <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:20}}>
            <div style={{width:54,height:54,borderRadius:"50%",background:`linear-gradient(135deg,${C.navy},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{selectedStudent.avatar}</div>
            <div>
              <div style={{color:C.text,fontSize:18,fontWeight:800,fontFamily:ff}}>{selectedStudent.name}</div>
              <div style={{color:C.muted,fontSize:12,fontFamily:fn}}>{cls.grade} · Last active: {selectedStudent.lastActive}</div>
              <Badge level={selectedStudent.adaptLevel}/>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[["⚡ Total XP",selectedStudent.xp.toLocaleString()],["🏆 Rank",`#${selectedStudent.rank}`],["🔢 Math",`${selectedStudent.mathScore}%`],["🔬 Science",`${selectedStudent.sciScore}%`]].map(([l,v])=>(
              <Card key={l}><div style={{color:C.muted,fontSize:10,fontFamily:fn}}>{l}</div><div style={{color:C.text,fontWeight:800,fontSize:18,fontFamily:ff}}>{v}</div></Card>
            ))}
          </div>
          <Card style={{marginBottom:14}}>
            <div style={{color:C.text,fontWeight:800,fontSize:13,fontFamily:ff,marginBottom:12}}>Adaptive Level Progress</div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div style={{color:C.muted,fontSize:12,fontFamily:fn}}>Current Level</div>
              <Badge level={selectedStudent.adaptLevel}/>
            </div>
            <div style={{display:"flex",gap:4}}>
              {selectedStudent.adaptHistory.map((l,i)=>(
                <div key={i} style={{flex:1,height:28,borderRadius:6,background:{1:`${C.green}33`,2:`${C.blue}33`,3:`${C.gold}33`}[l],border:`1px solid ${{1:C.green,2:C.blue,3:C.gold}[l]}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:{1:C.teal,2:C.blue,3:C.gold}[l],fontWeight:800}}>{["E","M","H"][l-1]}</div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-around",marginTop:4}}>
              {[["E","Easy",C.green],["M","Med",C.blue],["H","Hard",C.gold]].map(([k,l,c])=>(
                <div key={k} style={{fontSize:10,color:c,fontFamily:fn}}>{l}</div>
              ))}
            </div>
          </Card>
          <Card>
            <div style={{color:C.text,fontWeight:800,fontSize:13,fontFamily:ff,marginBottom:12}}>Subject Performance</div>
            {[{s:"Math",p:selectedStudent.mathScore,c:C.orange},{s:"Science",p:selectedStudent.sciScore,c:C.blue}].map(x=>(
              <div key={x.s} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <div style={{color:C.text,fontSize:12,fontFamily:fn}}>{x.s}</div>
                  <div style={{color:x.p>=70?C.green:x.p>=50?C.gold:C.red,fontWeight:800,fontSize:12,fontFamily:fn}}>{x.p}%</div>
                </div>
                <PBar v={x.p} c={x.p>=70?C.green:x.p>=50?C.gold:C.red}/>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Assign modal */}
      {showAssign&&(
        <div style={{position:"absolute",inset:0,background:"rgba(30,42,74,0.55)",zIndex:20,display:"flex",alignItems:"flex-end"}}>
          <div style={{background:C.card,borderRadius:"24px 24px 0 0",padding:24,width:"100%",border:`1px solid ${C.border}`}}>
            <div style={{color:C.text,fontSize:18,fontWeight:800,fontFamily:ff,marginBottom:16}}>New Assignment 📋</div>
            <div style={{marginBottom:12}}>
              <div style={{color:C.muted,fontSize:11,fontFamily:fn,marginBottom:6}}>Title</div>
              <input value={assignTitle} onChange={e=>setAssignTitle(e.target.value)} placeholder="e.g. Fractions Quiz" style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.text,fontSize:14,fontFamily:fn,outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{color:C.muted,fontSize:11,fontFamily:fn,marginBottom:6}}>Subject</div>
              <div style={{display:"flex",gap:8}}>
                {["Math","Science"].map(s=>(
                  <div key={s} onClick={()=>setAssignSubject(s)} style={{flex:1,padding:"10px",borderRadius:12,background:assignSubject===s?`linear-gradient(135deg,${C.navy},${C.blue})`:C.card,color:assignSubject===s?"white":C.text,fontWeight:800,fontSize:13,fontFamily:ff,textAlign:"center",cursor:"pointer"}}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <Btn ch="Cancel" onClick={()=>setShowAssign(false)} grad={`linear-gradient(135deg,${C.red},${C.pink})`} style={{flex:1}}/>
              <Btn ch="Assign to Class ✓" onClick={()=>setShowAssign(false)} style={{flex:1}}/>
            </div>
          </div>
        </div>
      )}

      <div style={{padding:"18px 0 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{color:C.text,fontSize:20,fontWeight:800,fontFamily:ff}}>Teacher Portal 🏫</div>
          <div style={{color:C.muted,fontSize:11,fontFamily:fn}}>{cls.name}</div>
        </div>
        <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${C.teal},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>👩‍🏫</div>
      </div>

      {/* Sub-tabs */}
      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
        {[["dashboard","📊"],["students","👥"],["assignments","📋"],["reports","📈"]].map(([t,icon])=>(
          <div key={t} onClick={()=>setSub(t)} style={{flexShrink:0,padding:"8px 14px",borderRadius:12,background:sub===t?`linear-gradient(135deg,${C.teal},${C.green})`:C.card,color:sub===t?"white":C.text,fontSize:11,fontWeight:700,fontFamily:fn,cursor:"pointer",border:`1px solid ${sub===t?C.teal:C.border}`}}>
            {icon} {t[0].toUpperCase()+t.slice(1)}
          </div>
        ))}
      </div>

      {sub==="dashboard"&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[
              {label:"Students",value:cls.students.length,icon:"👥",color:C.blue},
              {label:"Active Today",value:activeToday,icon:"🟢",color:C.green},
              {label:"Avg XP",value:avgXP.toLocaleString(),icon:"⚡",color:C.gold},
              {label:"Need Help",value:struggling.length,icon:"⚠️",color:C.red},
            ].map(s=>(
              <Card key={s.label} glow={s.color} style={{textAlign:"center",background:`${s.color}08`}}>
                <div style={{fontSize:26,marginBottom:4}}>{s.icon}</div>
                <div style={{color:s.color,fontSize:24,fontWeight:800,fontFamily:ff}}>{s.value}</div>
                <div style={{color:C.muted,fontSize:10,fontFamily:fn}}>{s.label}</div>
              </Card>
            ))}
          </div>

          {struggling.length>0&&(
            <Card glow={C.red} style={{marginBottom:14,background:`${C.red}08`}}>
              <div style={{color:C.red,fontWeight:800,fontSize:13,fontFamily:ff,marginBottom:10}}>⚠️ Students Needing Attention</div>
              {struggling.map(s=>(
                <div key={s.id} onClick={()=>setSelectedStudent(s)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <div style={{fontSize:22}}>{s.avatar}</div>
                    <div><div style={{color:C.text,fontWeight:700,fontSize:13,fontFamily:fn}}>{s.name}</div><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>Last active: {s.lastActive}</div></div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{color:C.red,fontSize:12,fontWeight:800,fontFamily:fn}}>Math: {s.mathScore}%</div>
                    <div style={{color:C.orange,fontSize:12,fontWeight:800,fontFamily:fn}}>Sci: {s.sciScore}%</div>
                  </div>
                </div>
              ))}
            </Card>
          )}

          <Card style={{marginBottom:14}}>
            <div style={{color:C.text,fontWeight:800,fontSize:13,fontFamily:ff,marginBottom:12}}>Class Performance</div>
            {[{s:"Math",avg:Math.round(cls.students.reduce((a,st)=>a+st.mathScore,0)/cls.students.length),c:C.orange},
              {s:"Science",avg:Math.round(cls.students.reduce((a,st)=>a+st.sciScore,0)/cls.students.length),c:C.blue}].map(x=>(
              <div key={x.s} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <div style={{color:C.text,fontSize:12,fontFamily:fn}}>{x.s} — Class Average</div>
                  <div style={{color:x.avg>=70?C.green:x.avg>=50?C.gold:C.red,fontWeight:800,fontSize:12,fontFamily:fn}}>{x.avg}%</div>
                </div>
                <PBar v={x.avg} c={x.avg>=70?C.green:x.avg>=50?C.gold:C.red}/>
              </div>
            ))}
          </Card>
          <Btn ch="+ Create Assignment" onClick={()=>setShowAssign(true)} grad={`linear-gradient(135deg,${C.teal},${C.green})`} style={{width:"100%"}}/>
        </>
      )}

      {sub==="students"&&(
        <>
          <div style={{color:C.muted,fontSize:12,fontFamily:fn,marginBottom:12}}>Tap a student to see detailed progress</div>
          {cls.students.map(s=>(
            <div key={s.id} onClick={()=>setSelectedStudent(s)} style={{background:C.card,borderRadius:16,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:14,border:`1px solid ${C.border}`,cursor:"pointer"}}>
              <div style={{position:"relative"}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${C.navy},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{s.avatar}</div>
                <div style={{position:"absolute",bottom:0,right:0,width:12,height:12,borderRadius:"50%",background:s.lastActive==="Today"?C.green:s.lastActive==="Yesterday"?C.gold:"#666",border:`2px solid ${C.card}`}}/>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{color:C.text,fontWeight:700,fontSize:14,fontFamily:fn}}>{s.name}</div>
                  <Badge level={s.adaptLevel}/>
                </div>
                <div style={{color:C.muted,fontSize:11,fontFamily:fn,marginBottom:5}}>Last active: {s.lastActive} · 🔥{s.streak} streak</div>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1}}>
                    <div style={{color:C.muted,fontSize:9,fontFamily:fn}}>Math</div>
                    <PBar v={s.mathScore} c={s.mathScore>=70?C.green:s.mathScore>=50?C.gold:C.red}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{color:C.muted,fontSize:9,fontFamily:fn}}>Science</div>
                    <PBar v={s.sciScore} c={s.sciScore>=70?C.green:s.sciScore>=50?C.gold:C.red}/>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {sub==="assignments"&&(
        <>
          <Btn ch="+ New Assignment" onClick={()=>setShowAssign(true)} grad={`linear-gradient(135deg,${C.teal},${C.green})`} style={{width:"100%",marginBottom:14}}/>
          {ASSIGNMENTS.map(a=>(
            <Card key={a.id} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{color:C.text,fontWeight:800,fontSize:14,fontFamily:ff}}>{a.title}</div>
                  <div style={{color:C.muted,fontSize:11,fontFamily:fn}}>📅 Due {a.dueDate} · Assigned {a.assigned}</div>
                </div>
                <Pill ch={a.subject} c={a.subject==="Math"?C.orange:C.blue}/>
              </div>
              <div style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <div style={{color:C.muted,fontSize:11,fontFamily:fn}}>Completed: {a.completedBy}/{a.totalStudents}</div>
                  <div style={{color:C.green,fontSize:11,fontWeight:700,fontFamily:fn}}>Avg: {a.avgScore}%</div>
                </div>
                <PBar v={(a.completedBy/a.totalStudents)*100} c={C.green}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Pill ch="📊 View Results" c={C.navy}/>
                <Pill ch="✏️ Edit" c={C.muted}/>
                <Pill ch="🗑️ Delete" c={C.red}/>
              </div>
            </Card>
          ))}
        </>
      )}

      {sub==="reports"&&(
        <>
          <Card glow={C.blue} style={{marginBottom:14,background:`${C.blue}08`}}>
            <div style={{color:C.text,fontWeight:800,fontSize:13,fontFamily:ff,marginBottom:4}}>📧 Weekly Parent Reports</div>
            <div style={{color:C.muted,fontSize:12,fontFamily:fn,marginBottom:12}}>Auto-send weekly progress digests to all parents every Sunday.</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderTop:`1px solid ${C.border}`}}>
              <div style={{color:C.text,fontSize:13,fontFamily:fn}}>Auto-send enabled</div>
              <div style={{width:44,height:24,borderRadius:99,background:`linear-gradient(135deg,${C.green},${C.teal})`,display:"flex",alignItems:"center",justifyContent:"flex-end",padding:"0 3px"}}>
                <div style={{width:18,height:18,borderRadius:"50%",background:"white"}}/>
              </div>
            </div>
          </Card>

          <Card style={{marginBottom:14}}>
            <div style={{color:C.text,fontWeight:800,fontSize:13,fontFamily:ff,marginBottom:12}}>Adaptive Level Distribution</div>
            <div style={{display:"flex",gap:10}}>
              {[{l:1,label:"Beginner",c:C.green},{l:2,label:"Inter.",c:C.blue},{l:3,label:"Advanced",c:C.gold}].map(item=>{
                const count=cls.students.filter(s=>s.adaptLevel===item.l).length;
                return(
                  <div key={item.l} style={{flex:1,background:`${item.c}11`,borderRadius:14,padding:"12px 8px",textAlign:"center",border:`1px solid ${item.c}33`}}>
                    <div style={{color:item.c,fontSize:24,fontWeight:800,fontFamily:ff}}>{count}</div>
                    <div style={{color:C.muted,fontSize:10,fontFamily:fn}}>{item.label}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card style={{marginBottom:14}}>
            <div style={{color:C.text,fontWeight:800,fontSize:13,fontFamily:ff,marginBottom:12}}>Common Core Alignment</div>
            {[{standard:"CCSS.MATH.3.NF.A.1",desc:"Fractions as parts of whole",pct:72,c:C.orange},
              {standard:"CCSS.MATH.3.OA.A.1",desc:"Multiplication & division",pct:85,c:C.purple},
              {standard:"NGSS.3-ESS2",desc:"Earth's systems",pct:61,c:C.blue}].map(s=>(
              <div key={s.standard} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <div><div style={{color:C.text,fontSize:11,fontFamily:fn}}>{s.desc}</div><div style={{color:C.dim,fontSize:9,fontFamily:fn}}>{s.standard}</div></div>
                  <div style={{color:s.pct>=70?C.green:s.pct>=50?C.gold:C.red,fontWeight:800,fontSize:12,fontFamily:fn}}>{s.pct}%</div>
                </div>
                <PBar v={s.pct} c={s.pct>=70?C.green:s.pct>=50?C.gold:C.red}/>
              </div>
            ))}
          </Card>

          <Btn ch="📥 Export Full Report (PDF)" grad={`linear-gradient(135deg,${C.teal},${C.green})`} style={{width:"100%"}} onClick={()=>alert("In the real app, this downloads a full PDF report!")}/>
        </>
      )}
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────
function HomeScreen({profile,setTab}){
  const content=getQuizBank[profile.grade];
  return(
    <div style={{padding:"0 16px 16px"}}>
      {/* Hero header */}
      <div style={{background:`linear-gradient(135deg,${C.navy},${C.blue})`,borderRadius:20,padding:"18px 20px",margin:"14px 0",boxShadow:`0 4px 24px ${C.navy}30`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{color:"rgba(255,255,255,0.8)",fontSize:12,fontFamily:fn,fontWeight:600}}>Good morning! ✨</div>
            <div style={{color:"white",fontSize:22,fontWeight:900,fontFamily:ff,marginTop:2}}>{profile.name}'s Dashboard</div>
            <div style={{display:"flex",gap:6,marginTop:8}}>
              <span style={{background:"rgba(255,255,255,0.2)",color:"white",borderRadius:99,padding:"3px 10px",fontSize:10,fontWeight:700,fontFamily:fn}}>{profile.gradeLabel}</span>
              <Badge level={profile.adaptLevel}/>
            </div>
          </div>
          <div style={{width:52,height:52,borderRadius:16,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,border:"2px solid rgba(255,255,255,0.3)"}}>{profile.avatar}</div>
        </div>
        <div style={{marginTop:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <div style={{color:"rgba(255,255,255,0.8)",fontSize:11,fontFamily:fn}}>XP Progress</div>
            <div style={{color:C.goldBright,fontSize:11,fontWeight:700,fontFamily:fn}}>{profile.xp} XP</div>
          </div>
          <div style={{background:"rgba(255,255,255,0.2)",borderRadius:99,height:8}}>
            <div style={{width:`${Math.min((profile.xp%500)/5,100)}%`,background:`linear-gradient(90deg,${C.goldBright},${C.gold})`,height:8,borderRadius:99,transition:"width 0.8s ease"}}/>
          </div>
        </div>
      </div>

      {/* Coins */}
      <div onClick={()=>setTab("store")} style={{background:`linear-gradient(135deg,${C.goldLight},#FEF9C3)`,borderRadius:16,padding:"13px 16px",marginBottom:14,cursor:"pointer",border:`1px solid ${C.gold}44`,display:"flex",alignItems:"center",gap:12,boxShadow:`0 2px 12px ${C.gold}20`}}>
        <div style={{fontSize:30}}>⭐</div>
        <div style={{flex:1}}>
          <div style={{color:C.labelGold,fontSize:20,fontWeight:900,fontFamily:ff}}>{profile.coins} Star Coins</div>
          <div style={{color:C.labelGold,fontSize:11,fontFamily:fn,opacity:0.7}}>Earn more → redeem real gifts!</div>
        </div>
        <div style={{background:`linear-gradient(135deg,${C.gold},${C.orange})`,borderRadius:10,padding:"7px 12px",color:"white",fontWeight:800,fontSize:12,fontFamily:ff}}>Shop →</div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
        {[{l:"XP",v:profile.xp.toLocaleString(),i:"⚡",c:C.blue},{l:"Streak",v:`${profile.streak}🔥`,i:"🔥",c:C.orange},{l:"Rank",v:`#${profile.rank}`,i:"🏆",c:C.green}].map(s=>(
          <div key={s.l} style={{background:C.card,borderRadius:14,padding:"10px 6px",textAlign:"center",border:`1px solid ${C.border}`}}>
            <div style={{fontSize:16,marginBottom:2}}>{s.i}</div>
            <div style={{color:C.text,fontWeight:800,fontSize:15,fontFamily:ff}}>{s.v}</div>
            <div style={{color:C.dim,fontSize:10,fontFamily:fn}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Feature Grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {[
          {tab:"adaptive",icon:"🧠",title:"Adaptive Practice",sub:"AI adjusts to you!",c:C.purple,badge:"NEW ✨"},
          {tab:"compete",icon:"⚔️",title:"Weekly Quiz",sub:"Win 200 coins!",c:C.pink,badge:"2d left"},
          {tab:"duel",icon:"🤺",title:"Friend Duels",sub:"2 online now",c:C.blue,badge:"LIVE"},
          {tab:"giveback",icon:"💚",title:"Give Back",sub:"Donate coins",c:C.green,badge:"4 causes"},
        ].map(f=>(
          <div key={f.tab} onClick={()=>setTab(f.tab)} style={{background:C.card,borderRadius:16,padding:14,cursor:"pointer",border:`1px solid ${f.c}33`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:6,right:8,background:`${f.c}22`,color:f.c,borderRadius:99,padding:"2px 7px",fontSize:9,fontWeight:800,fontFamily:fn}}>{f.badge}</div>
            <div style={{fontSize:28,marginBottom:6}}>{f.icon}</div>
            <div style={{color:C.text,fontWeight:800,fontSize:13,fontFamily:ff}}>{f.title}</div>
            <div style={{color:C.muted,fontSize:10,fontFamily:fn,marginTop:2}}>{f.sub}</div>
          </div>
        ))}
      </div>

      {/* COPPA shield */}
      <Card style={{marginBottom:14,background:`${C.green}08`,border:`1px solid ${C.green}22`}}>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{fontSize:24}}>🛡️</div>
          <div style={{flex:1}}>
            <div style={{color:C.green,fontWeight:800,fontSize:12,fontFamily:fn}}>COPPA Protected Account</div>
            <div style={{color:C.muted,fontSize:10,fontFamily:fn}}>No ads · No data selling · Parent-controlled</div>
          </div>
          <Pill ch="✓ Verified" c={C.green}/>
        </div>
      </Card>

      <div style={{color:C.text,fontWeight:800,fontSize:14,fontFamily:ff,marginBottom:10}}>Continue Learning 📚</div>
      {(getQuizBank(profile.grade,"Math")).slice(0,2).map((q,i)=>(
        <div key={q.id} style={{background:C.card,borderRadius:16,padding:13,display:"flex",alignItems:"center",gap:12,marginBottom:10,border:`1px solid ${C.border}`}}>
          <div style={{width:44,height:44,borderRadius:12,background:`${[C.orange,C.blue][i]}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{["🔢","🔬"][i]}</div>
          <div style={{flex:1}}>
            <div style={{color:C.text,fontWeight:700,fontSize:13,fontFamily:fn}}>{q.topic}</div>
            <div style={{color:C.muted,fontSize:11,fontFamily:fn,marginBottom:5}}>Math · <Badge level={q.diff}/></div>
            <PBar v={[75,40][i]} c={[C.orange,C.blue][i]}/>
          </div>
        </div>
      ))}
    </div>
  );
}


function LearnScreen({ profile, onAskBrainBot }) {
  const [subject, setSubject] = useState("Math");
  const [activeUnit, setActiveUnit] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonStep, setLessonStep] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const { enabled: audioOn, speaking, speak, stop: stopSpeech, toggle: toggleAudio } = useNarration();

  const units = getUnits(profile.grade, subject);
  const subjectColor = subject === "Math" ? C.navy : C.teal;

  // Get 5 quiz questions for this unit
  const getUnitQuiz = (unit) => (unit.quiz || []).slice(0, 5);

  const openLesson = (unit, lesson) => {
    setActiveUnit(unit);
    setActiveLesson(lesson);
    setLessonStep(0);
    setQuizMode(false);
    setQuizDone(false);
    setQIdx(0);
    setSel(null);
    setAnswered(false);
    setScore(0);
    setAnswers([]);
  };

  const closeLesson = () => {
    stopSpeech();
    setActiveUnit(null);
    setActiveLesson(null);
    setLessonStep(0);
    setQuizMode(false);
    setQuizDone(false);
    setQIdx(0);
    setSel(null);
    setAnswered(false);
    setScore(0);
    setAnswers([]);
  };

  // Auto-narrate step text
  useEffect(() => {
    if (!activeLesson || quizMode || !audioOn) return;
    const stepText = activeLesson.steps?.[lessonStep];
    if (stepText) speak(stepText);
  }, [lessonStep, activeLesson?.id, quizMode]);

  useEffect(() => () => stopSpeech(), []);

  const unitColor = activeUnit?.color || subjectColor;

  // ── Letter grade helper ──
  const getGrade = (pct) => {
    if (pct === 100) return { letter:"S+", color:C.gold,   msg:"Perfect score! Outstanding! 🏆" };
    if (pct >= 80)   return { letter:"A",  color:C.green,  msg:"Excellent work! ⭐" };
    if (pct >= 60)   return { letter:"B",  color:C.blue,   msg:"Good job! Review what you missed." };
    if (pct >= 40)   return { letter:"C",  color:C.orange, msg:"Keep practising — you're getting there! 💪" };
    return               { letter:"D",  color:C.red,    msg:"Review the lesson and try again! 📚" };
  };

  // ── Audio bar ──
  const AudioBar = ({ text }) => (
    <div style={{ display:"flex", alignItems:"center", gap:10, background:C.navyLight, borderRadius:14, padding:"10px 14px", marginBottom:12, border:`1px solid ${speaking ? C.navy+"66" : C.border}` }}>
      <div style={{ display:"flex", gap:3, alignItems:"center", flexShrink:0 }}>
        {[1,2,3,4].map(b=>(
          <div key={b} style={{ width:3, borderRadius:99, background:speaking?C.navy:C.dim, height:speaking?`${6+b*4}px`:"5px", transition:"height 0.15s" }}/>
        ))}
      </div>
      <div style={{ flex:1, color:speaking?C.navy:C.muted, fontSize:11, fontFamily:fn, fontWeight:speaking?700:400 }}>
        {speaking ? "🔊 Reading aloud..." : audioOn ? "Tap ▶ to hear" : "🔇 Audio off"}
      </div>
      <div style={{ display:"flex", gap:6 }}>
        {audioOn && <div onClick={()=>speaking?stopSpeech():speak(text)} style={{ background:speaking?`${C.red}22`:`${C.navy}22`, color:speaking?C.red:C.navy, borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:800, fontFamily:fn, cursor:"pointer" }}>{speaking?"⏹ Stop":"▶ Play"}</div>}
        <div onClick={toggleAudio} style={{ background:audioOn?`${C.green}22`:`${C.dim}22`, color:audioOn?C.green:C.muted, borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:800, fontFamily:fn, cursor:"pointer" }}>{audioOn?"ON":"OFF"}</div>
      </div>
    </div>
  );

  // ── Quiz done screen ──
  if (activeLesson && quizDone) {
    const quiz = getUnitQuiz(activeUnit);
    const pct = Math.round((score / quiz.length) * 100);
    const grade = getGrade(pct);
    return (
      <div style={{ padding:"20px 16px", textAlign:"center" }}>
        <div style={{ background:`linear-gradient(135deg,${C.navy},${C.blue})`, borderRadius:20, padding:"24px 20px", marginBottom:16, color:"white" }}>
          <div style={{ fontSize:60, marginBottom:8 }}>{pct===100?"🏆":pct>=80?"⭐":pct>=60?"👍":"💪"}</div>
          <div style={{ fontSize:48, fontWeight:900, fontFamily:ff, color:grade.color }}>{grade.letter}</div>
          <div style={{ fontSize:20, fontWeight:800, fontFamily:ff, marginTop:4 }}>{score}/{quiz.length} correct</div>
          <div style={{ fontSize:13, fontFamily:fn, opacity:0.85, marginTop:6 }}>{grade.msg}</div>
        </div>
        <Card glow={C.gold} style={{ marginBottom:12, background:C.goldLight, textAlign:"center" }}>
          <div style={{ color:C.labelGold, fontSize:22, fontWeight:900, fontFamily:ff }}>
            +{activeUnit.xp} XP &nbsp; +{Math.round(activeUnit.xp/4)} ⭐
          </div>
          <div style={{ color:C.labelGold, fontSize:11, fontFamily:fn, marginTop:4 }}>Lesson complete!</div>
        </Card>
        {/* Answer review */}
        <div style={{ marginBottom:16, textAlign:"left" }}>
          <div style={{ color:C.text, fontWeight:800, fontSize:13, fontFamily:ff, marginBottom:8 }}>Answer Review</div>
          {answers.map((a,i)=>(
            <Card key={i} style={{ marginBottom:8, background:a.correct?C.greenLight:C.redLight, border:`1px solid ${a.correct?C.green:C.red}30` }}>
              <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                <div style={{ fontSize:16, flexShrink:0 }}>{a.correct?"✅":"❌"}</div>
                <div>
                  <div style={{ color:C.text, fontSize:12, fontFamily:fn, fontWeight:700, marginBottom:3 }}>{a.qObj.q}</div>
                  <div style={{ color:a.correct?C.labelGreen:C.red, fontSize:11, fontFamily:fn }}>Your answer: <strong>{a.qObj.opts[a.selected]}</strong></div>
                  {!a.correct&&<div style={{ color:C.labelGreen, fontSize:11, fontFamily:fn, marginTop:2 }}>Correct: <strong>{a.qObj.opts[a.qObj.ans]}</strong></div>}
                  {a.qObj.explain&&<div style={{ color:C.muted, fontSize:11, fontFamily:fn, marginTop:3, lineHeight:1.5 }}>💡 {a.qObj.explain}</div>}
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Btn ch="← Back to Lessons" onClick={closeLesson} style={{ width:"100%" }}/>
      </div>
    );
  }

  // ── Quiz mode ──
  if (activeLesson && quizMode) {
    const quiz = getUnitQuiz(activeUnit);
    const q = quiz[qIdx];
    if (!q) { setQuizDone(true); return null; }
    return (
      <div style={{ padding:"0 16px 16px" }}>
        {/* Quiz header */}
        <div style={{ background:`linear-gradient(135deg,${unitColor},${unitColor === C.teal ? C.green : C.blue})`, borderRadius:"0 0 20px 20px", padding:"14px 16px 18px", marginBottom:16, marginLeft:-16, marginRight:-16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div onClick={()=>setQuizMode(false)} style={{ color:"rgba(255,255,255,0.85)", fontSize:12, fontFamily:fn, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>← Lesson</div>
            <div style={{ color:"white", fontSize:12, fontFamily:fn, fontWeight:700 }}>Question {qIdx+1} of {quiz.length}</div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {quiz.map((_,i)=>(
              <div key={i} style={{ flex:1, height:5, borderRadius:99, background:i<qIdx?"white":i===qIdx?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.3)", transition:"background 0.3s" }}/>
            ))}
          </div>
          <div style={{ color:"rgba(255,255,255,0.85)", fontSize:11, fontFamily:fn, marginTop:8 }}>
            📝 {activeUnit.title} — Quiz
          </div>
        </div>

        {q.topic && <div style={{ color:C.muted, fontSize:10, fontFamily:fn, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>{q.topic}</div>}
        <Card style={{ marginBottom:14, padding:"20px 16px" }}>
          <div style={{ color:C.text, fontSize:17, fontWeight:800, fontFamily:ff, lineHeight:1.5 }}>{q.q}</div>
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {q.opts.map((opt, i) => {
            const isCorrect = i === q.ans;
            const isSelected = i === sel;
            let bg = C.card, border = `1px solid ${C.border}`, textColor = C.text;
            if (answered) {
              if (isCorrect)       { bg = C.greenLight; border = `1px solid ${C.green}`; textColor = C.labelGreen; }
              else if (isSelected) { bg = C.redLight;   border = `1px solid ${C.red}`;  textColor = C.red; }
              else                 { bg = C.card; textColor = C.dim; }
            }
            return (
              <div key={i} onClick={()=>{ if(!answered){ setSel(i); setAnswered(true); const ok=i===q.ans; if(ok)setScore(s=>s+1); setAnswers(p=>[...p,{qObj:q,selected:i,correct:ok}]); }}}
                style={{ background:bg, border, borderRadius:12, padding:"13px 16px", color:textColor, fontWeight:700, fontSize:14, fontFamily:fn, cursor:answered?"default":"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", transition:"all 0.15s" }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ width:26, height:26, borderRadius:6, border:`2px solid ${answered&&isCorrect?C.green:answered&&isSelected?C.red:C.border}`, background:answered&&isCorrect?C.green:answered&&isSelected?C.red:"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"white", fontWeight:800, flexShrink:0 }}>
                    {answered?(isCorrect?"✓":isSelected?"✗":String.fromCharCode(65+i)):String.fromCharCode(65+i)}
                  </div>
                  <span>{opt}</span>
                </div>
              </div>
            );
          })}
        </div>
        {answered && (
          <div style={{ marginTop:12 }}>
            <Card style={{ marginBottom:10, background:sel===q.ans?C.greenLight:C.redLight, border:`1px solid ${sel===q.ans?C.green:C.red}30` }}>
              <div style={{ color:sel===q.ans?C.labelGreen:C.red, fontWeight:700, fontSize:12, fontFamily:fn, marginBottom:q.explain?6:0 }}>
                {sel===q.ans?"✅ Correct!":"❌ Not quite — correct answer: "+q.opts[q.ans]}
              </div>
              {q.explain&&<div style={{ color:C.text, fontSize:12, fontFamily:fn, lineHeight:1.6 }}>💡 {q.explain}</div>}
            </Card>
            <Btn ch={qIdx+1>=quiz.length?"See Results 🎉":"Next Question →"} onClick={()=>{ if(qIdx+1>=quiz.length){setQuizDone(true);}else{setQIdx(x=>x+1);setSel(null);setAnswered(false);}}} style={{ width:"100%" }}/>
          </div>
        )}
      </div>
    );
  }

  // ── Active lesson view ──
  if (activeLesson) {
    const steps = activeLesson.steps || [];
    const currentStepText = steps[lessonStep] || "";
    const visualEntry = LESSON_VISUALS[activeLesson.id];
    const VisualComponent = visualEntry?.component || null;

    return (
      <div style={{ padding:"0 16px 16px" }}>
        {/* Gradient header */}
        <div style={{ background:`linear-gradient(135deg,${unitColor},${unitColor===C.teal?C.green:C.blue})`, borderRadius:"0 0 20px 20px", padding:"14px 16px 18px", marginBottom:16, marginLeft:-16, marginRight:-16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div onClick={closeLesson} style={{ width:32, height:32, borderRadius:10, background:"rgba(255,255,255,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, cursor:"pointer", color:"white" }}>←</div>
            <div style={{ flex:1 }}>
              <div style={{ color:"white", fontWeight:900, fontSize:15, fontFamily:ff }}>{activeUnit.emoji} {activeUnit.title}</div>
              <div style={{ color:"rgba(255,255,255,0.8)", fontSize:11, fontFamily:fn }}>{subject} · {activeUnit.standard}</div>
            </div>
            <NarrationBtn enabled={audioOn} speaking={speaking} onToggle={toggleAudio}/>
          </div>
          {/* Step progress bar */}
          <div style={{ display:"flex", gap:5, marginTop:12 }}>
            {steps.map((_,i)=>(
              <div key={i} onClick={()=>setLessonStep(i)} style={{ flex:1, height:5, borderRadius:99, background:i<lessonStep?"white":i===lessonStep?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.3)", cursor:"pointer", transition:"background 0.3s" }}/>
            ))}
          </div>
          <div style={{ color:"rgba(255,255,255,0.8)", fontSize:11, fontFamily:fn, marginTop:8 }}>
            {activeLesson.emoji} {activeLesson.title} · Step {lessonStep+1} of {steps.length}
          </div>
        </div>

        {/* Audio bar */}
        <AudioBar text={currentStepText}/>

        {/* Visual component */}
        {VisualComponent && (
          <div style={{ background:C.navyLight, border:`1px solid ${unitColor}30`, borderRadius:14, padding:14, marginBottom:12, overflow:"hidden" }}>
            <div style={{ color:unitColor, fontSize:11, fontWeight:700, fontFamily:fn, marginBottom:8 }}>{visualEntry.label}</div>
            <VisualComponent step={lessonStep} color={unitColor}/>
          </div>
        )}

        {/* Speech bubble content card */}
        <div style={{ display:"flex", gap:10, marginBottom:14, alignItems:"flex-start" }}>
          <div style={{ fontSize:32, flexShrink:0, marginTop:4 }}>{subject==="Math"?"🤖":"🔬"}</div>
          <Card glow={unitColor} style={{ flex:1, background:`${unitColor}08`, position:"relative" }}>
            {/* Speech bubble pointer */}
            <div style={{ position:"absolute", left:-8, top:16, width:0, height:0, borderTop:"7px solid transparent", borderBottom:"7px solid transparent", borderRight:`8px solid ${unitColor}30` }}/>
            <div style={{ color:C.text, fontSize:15, fontWeight:700, fontFamily:fn, lineHeight:1.8 }}>
              {currentStepText}
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <div style={{ display:"flex", gap:10, marginBottom:12 }}>
          {lessonStep > 0 && <Btn ch="← Prev" onClick={()=>{stopSpeech();setLessonStep(s=>s-1);}} grad={`linear-gradient(135deg,${C.navyLight},${C.blueLight})`} style={{ flex:1, color:C.navy }}/>}
          {lessonStep < steps.length-1
            ? <Btn ch="Next Step →" onClick={()=>{stopSpeech();setLessonStep(s=>s+1);}} style={{ flex:3 }}/>
            : <Btn ch="📝 Take Quiz!" onClick={()=>{stopSpeech();setQuizMode(true);}} grad={`linear-gradient(135deg,${C.gold},${C.orange})`} style={{ flex:3 }}/>
          }
        </div>

        {/* Ask BrainBot */}
        <div onClick={()=>onAskBrainBot&&onAskBrainBot({subject,topic:activeUnit.title,emoji:activeUnit.emoji})}
          style={{ display:"flex", alignItems:"center", gap:10, background:C.navyLight, border:`1px solid ${C.border}`, borderRadius:14, padding:"12px 16px", cursor:"pointer" }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${C.navy},${C.blue})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🧠</div>
          <div style={{ flex:1 }}>
            <div style={{ color:C.text, fontWeight:800, fontSize:13, fontFamily:ff }}>Ask BrainBot! ✨</div>
            <div style={{ color:C.muted, fontSize:11, fontFamily:fn }}>Still confused? I'll explain it differently!</div>
          </div>
          <div style={{ color:C.navy, fontSize:18 }}>›</div>
        </div>
        <div style={{ textAlign:"center", marginTop:10, color:C.muted, fontSize:11, fontFamily:fn }}>
          Complete to earn <span style={{ color:C.labelGold, fontWeight:800 }}>+{activeUnit.xp} XP</span>
        </div>
      </div>
    );
  }

  // ── Unit list (lesson picker) ──
  if (activeUnit) {
    // Show lesson list for picked unit
    return (
      <div style={{ padding:"0 16px 16px" }}>
        <div style={{ background:`linear-gradient(135deg,${unitColor},${unitColor===C.teal?C.green:C.blue})`, borderRadius:"0 0 20px 20px", padding:"14px 16px 18px", marginBottom:16, marginLeft:-16, marginRight:-16 }}>
          <div onClick={()=>setActiveUnit(null)} style={{ color:"rgba(255,255,255,0.85)", fontSize:12, fontFamily:fn, cursor:"pointer", marginBottom:10 }}>← All {subject} Units</div>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <div style={{ width:48, height:48, borderRadius:14, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{activeUnit.emoji}</div>
            <div>
              <div style={{ color:"white", fontWeight:900, fontSize:16, fontFamily:ff }}>{activeUnit.title}</div>
              <div style={{ color:"rgba(255,255,255,0.8)", fontSize:11, fontFamily:fn }}>{activeUnit.standard}</div>
            </div>
          </div>
        </div>
        <STitle ch="Choose a Lesson" sub="Complete all lessons, then take the quiz!"/>
        {(activeUnit.lessons||[]).map((lesson, i)=>(
          <div key={lesson.id} onClick={()=>openLesson(activeUnit,lesson)}
            style={{ background:C.card, borderRadius:16, padding:"14px 16px", marginBottom:10, cursor:"pointer", border:`1px solid ${unitColor}30`, boxShadow:"0 1px 6px rgba(27,63,171,0.06)", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:`${unitColor}15`, border:`2px solid ${unitColor}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{lesson.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ color:C.text, fontWeight:800, fontSize:14, fontFamily:ff }}>{lesson.title}</div>
              <div style={{ color:C.muted, fontSize:11, fontFamily:fn, marginTop:2 }}>{(lesson.steps||[]).length} steps · {LESSON_VISUALS[lesson.id]?LESSON_VISUALS[lesson.id].label:"Text lesson"}</div>
            </div>
            <div style={{ color:unitColor, fontSize:18 }}>›</div>
          </div>
        ))}
        <Card glow={C.gold} style={{ background:C.goldLight, textAlign:"center", cursor:"pointer" }} onClick={()=>{
          const fakeLesson={id:`quiz-${activeUnit.id}`,title:"Unit Quiz",emoji:"📝",steps:["Let's test what you've learned!"]};
          openLesson(activeUnit,fakeLesson);
          setTimeout(()=>setQuizMode(true),50);
        }}>
          <div style={{ color:C.labelGold, fontWeight:900, fontSize:14, fontFamily:ff }}>📝 Take the Unit Quiz</div>
          <div style={{ color:C.labelGold, fontSize:11, fontFamily:fn, marginTop:2 }}>+{activeUnit.xp} XP on completion</div>
        </Card>
      </div>
    );
  }

  // ── Main subject/unit list ──
  return (
    <div style={{ padding:"0 16px 16px" }}>
      <div style={{ padding:"14px 0 6px" }}>
        <STitle ch="My Curriculum 📚" sub={`${profile.gradeLabel} · 2nd Grade Standards`}/>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {["Math","Science"].map(s=>(
          <div key={s} onClick={()=>setSubject(s)}
            style={{ flex:1, padding:"12px", borderRadius:14, background:subject===s?`linear-gradient(135deg,${s==="Math"?C.navy:C.teal},${s==="Math"?C.blue:C.green})`:`${C.card}`, color:subject===s?"white":C.text, fontWeight:800, fontSize:14, fontFamily:ff, textAlign:"center", cursor:"pointer", border:`1px solid ${subject===s?"transparent":C.border}`, boxShadow:subject===s?`0 2px 12px ${s==="Math"?C.navy:C.teal}30`:"none", transition:"all 0.2s" }}>
            {s==="Math"?"🔢 Math":"🔬 Science"}
          </div>
        ))}
      </div>

      <Card style={{ marginBottom:16, background:subject==="Math"?C.blueLight:C.tealLight, border:`1px solid ${subjectColor}30` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <div style={{ color:C.text, fontWeight:800, fontSize:13, fontFamily:ff }}>{subject} Overview</div>
          <div style={{ color:subjectColor, fontWeight:800, fontSize:13, fontFamily:fn }}>{units.length} units · {units.reduce((a,u)=>(u.quiz?.length||0)+a,0)} quiz questions</div>
        </div>
        <div style={{ color:C.muted, fontSize:11, fontFamily:fn }}>2nd Grade · CCSS & NGSS aligned · Tap a unit to start</div>
      </Card>

      {units.map((unit, idx)=>(
        <div key={unit.id} onClick={()=>setActiveUnit(unit)}
          style={{ background:C.card, borderRadius:18, padding:16, marginBottom:12, border:`1px solid ${unit.color}30`, boxShadow:"0 1px 8px rgba(27,63,171,0.07)", cursor:"pointer" }}>
          <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
            <div style={{ width:54, height:54, borderRadius:16, background:`${unit.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0, border:`2px solid ${unit.color}30` }}>
              {unit.emoji}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                <div style={{ color:C.text, fontWeight:800, fontSize:15, fontFamily:ff }}>{unit.title}</div>
                <Pill ch={`+${unit.xp} XP`} c={unit.color}/>
              </div>
              <div style={{ color:C.muted, fontSize:10, fontFamily:fn, marginBottom:8 }}>{unit.standard} · {unit.weeks}</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {(unit.lessons||[]).slice(0,4).map((ls,i)=>(
                  <div key={i} style={{ background:`${unit.color}12`, borderRadius:6, padding:"3px 8px", fontSize:10, color:unit.color, fontFamily:fn, fontWeight:700, border:`1px solid ${unit.color}25` }}>
                    {ls.emoji} {ls.title.split(" ").slice(0,3).join(" ")}
                  </div>
                ))}
                {(unit.lessons||[]).length>4&&<div style={{ fontSize:10, color:C.muted, fontFamily:fn, padding:"3px 0" }}>+{(unit.lessons||[]).length-4} more</div>}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
            <div style={{ color:C.muted, fontSize:11, fontFamily:fn }}>{(unit.lessons||[]).length} lessons · {(unit.quiz||[]).length} quiz questions</div>
            <div style={{ color:unit.color, fontSize:12, fontWeight:700, fontFamily:fn }}>Start →</div>
          </div>
        </div>
      ))}
    </div>
  );
}


// ─── COMPETE SCREEN ───────────────────────────────────────────────
function CompeteScreen({profile}){
  const [started,setStarted]=useState(false);
  // Use real curriculum quiz questions from 2nd grade Math
  const qs=useCallback(()=>getQuizBank(profile.grade,"Math").filter(q=>q.diff<=2).slice(0,3),[profile.grade])();
  const [qIdx,setQIdx]=useState(0);
  const [sel,setSel]=useState(null);
  const [ans,setAns]=useState(false);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const total=Math.min(3,qs.length);
  const q=qs[qIdx]||qs[0];

  if(!started) return(
    <div style={{padding:"0 16px"}}>
      <div style={{padding:"18px 0 10px"}}><STitle ch="Weekly Competition ⚔️" sub={`${profile.gradeLabel} challenge · Win 200 coins!`}/></div>
      <Card glow={C.purple} style={{marginBottom:14,background:`rgba(108,63,197,0.05)`}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {[["⏰","Ends in","2d 14h"],["👥","Students","1,247"],["❓","Questions","3"],["🏆","Prize","200 coins"]].map(([i,l,v])=>(
            <div key={l} style={{background:C.bg,borderRadius:12,padding:"10px"}}>
              <div style={{color:C.muted,fontSize:10,fontFamily:fn}}>{i} {l}</div>
              <div style={{color:C.text,fontWeight:800,fontSize:14,fontFamily:fn}}>{v}</div>
            </div>
          ))}
        </div>
        <Btn ch="Start Quiz! 🚀" onClick={()=>setStarted(true)} style={{width:"100%"}}/>
      </Card>
      <STitle ch="Leaderboard 🌟"/>
      {[{n:"Zara M.",p:2840,b:"🥇",s:12},{n:"Leo K.",p:2650,b:"🥈",s:9},{n:profile.name,p:profile.xp,b:"⭐",s:profile.streak,me:true},{n:"Nia T.",p:2200,b:"🥉",s:7}].map(s=>(
        <div key={s.n} style={{background:s.me?C.navyLight:C.card,borderRadius:14,padding:"12px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:12,border:s.me?`1px solid rgba(108,63,197,0.33)`:`1px solid ${C.border}`}}>
          <div style={{fontSize:20}}>{s.b}</div>
          <div style={{flex:1}}><div style={{color:C.text,fontWeight:700,fontSize:13,fontFamily:fn}}>{s.n}{s.me&&<span style={{color:C.blue}}> (You)</span>}</div><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>🔥{s.s}</div></div>
          <div style={{color:C.labelGold,fontWeight:800,fontSize:13,fontFamily:ff}}>{s.p.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );

  if(done) return(
    <div style={{padding:"40px 16px",textAlign:"center"}}>
      <div style={{fontSize:70,marginBottom:12}}>{score===total?"🏆":score>=2?"🌟":"💪"}</div>
      <div style={{color:C.text,fontSize:26,fontWeight:800,fontFamily:ff,marginBottom:20}}>{score}/{total} Correct!</div>
      <Card glow={C.gold} style={{marginBottom:20,background:C.goldLight}}>
        <div style={{color:C.labelGold,fontSize:24,fontWeight:800,fontFamily:ff}}>+{score*50} XP &nbsp; +{score*20} ⭐</div>
      </Card>
      <Btn ch="Done" onClick={()=>{setStarted(false);setDone(false);setQIdx(0);setSel(null);setAns(false);setScore(0);}} style={{width:"100%"}}/>
    </div>
  );

  if(!q) return <div style={{padding:20,textAlign:"center",color:C.muted,fontFamily:fn}}>Loading questions...</div>;

  return(
    <div style={{padding:"20px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><Pill ch={`Q ${qIdx+1}/${total}`} c={C.muted}/><Pill ch={`⭐ ${score*20}`} c={C.gold}/></div>
      <PBar v={(qIdx/total)*100} c={C.navy} h={6}/>
      {q.topic&&<div style={{color:C.muted,fontSize:10,fontFamily:fn,marginTop:8,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>{q.topic}</div>}
      <Card style={{margin:"10px 0 14px",textAlign:"center",padding:"22px 18px"}}><div style={{color:C.text,fontSize:17,fontWeight:800,fontFamily:ff,lineHeight:1.5}}>{q.q}</div></Card>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {q.opts.map((opt,i)=>{
          let bg=C.card,border=`1px solid ${C.border}`,textColor=C.text;
          if(ans){if(i===q.ans){bg=C.greenLight;border=`1px solid ${C.green}`;textColor=C.labelGreen;}else if(i===sel&&i!==q.ans){bg=C.redLight;border=`1px solid ${C.red}`;textColor=C.red;}}
          return <div key={i} onClick={()=>{if(!ans){setSel(i);setAns(true);if(i===q.ans)setScore(s=>s+1);}}} style={{background:bg,border,borderRadius:13,padding:"13px 16px",color:textColor,fontWeight:700,fontSize:14,fontFamily:fn,cursor:ans?"default":"pointer",display:"flex",justifyContent:"space-between",transition:"all 0.15s"}}>
            <span>{opt}</span>{ans&&i===q.ans&&<span>✅</span>}{ans&&i===sel&&i!==q.ans&&<span>❌</span>}
          </div>;
        })}
      </div>
      {ans&&q.explain&&<Card style={{marginTop:10,background:sel===q.ans?C.greenLight:C.redLight,border:`1px solid ${sel===q.ans?C.green:C.red}30`}}><div style={{color:C.text,fontSize:12,fontFamily:fn,lineHeight:1.6}}>💡 {q.explain}</div></Card>}
      {ans&&<Btn ch={qIdx+1>=total?"Results 🎉":"Next →"} onClick={()=>{if(qIdx+1>=total){setDone(true);}else{setQIdx(x=>x+1);setSel(null);setAns(false);}}} style={{width:"100%",marginTop:12}}/>}
    </div>
  );


  if(!started) return(
    <div style={{padding:"0 16px"}}>
      <div style={{padding:"18px 0 10px"}}><STitle ch="Weekly Competition ⚔️" sub={`${profile.gradeLabel} challenge · Win 200 coins!`}/></div>
      <Card glow={C.purple} style={{marginBottom:14,background:`rgba(108,63,197,0.05)`}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {[["⏰","Ends in","2d 14h"],["👥","Students","1,247"],["❓","Questions","3"],["🏆","Prize","200 coins"]].map(([i,l,v])=>(
            <div key={l} style={{background:C.bg,borderRadius:12,padding:"10px"}}>
              <div style={{color:C.muted,fontSize:10,fontFamily:fn}}>{i} {l}</div>
              <div style={{color:C.text,fontWeight:800,fontSize:14,fontFamily:fn}}>{v}</div>
            </div>
          ))}
        </div>
        <Btn ch="Start Quiz! 🚀" onClick={()=>setStarted(true)} style={{width:"100%"}}/>
      </Card>
      <STitle ch="Leaderboard 🌟"/>
      {[{n:"Zara M.",p:2840,b:"🥇",s:12},{n:"Leo K.",p:2650,b:"🥈",s:9},{n:profile.name,p:profile.xp,b:"⭐",s:profile.streak,me:true},{n:"Nia T.",p:2200,b:"🥉",s:7}].map(s=>(
        <div key={s.n} style={{background:s.me?C.navyLight:C.card,borderRadius:14,padding:"12px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:12,border:s.me?`1px solid rgba(108,63,197,0.33)`:`1px solid ${C.border}`}}>
          <div style={{fontSize:20}}>{s.b}</div>
          <div style={{flex:1}}><div style={{color:C.text,fontWeight:700,fontSize:13,fontFamily:fn}}>{s.n}{s.me&&<span style={{color:C.blue}}> (You)</span>}</div><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>🔥{s.s}</div></div>
          <div style={{color:C.labelGold,fontWeight:800,fontSize:13,fontFamily:ff}}>{s.p.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );

  if(done) return(
    <div style={{padding:"40px 16px",textAlign:"center"}}>
      <div style={{fontSize:70,marginBottom:12}}>{score===total?"🏆":score>=2?"🌟":"💪"}</div>
      <div style={{color:C.text,fontSize:26,fontWeight:800,fontFamily:ff,marginBottom:20}}>{score}/{total} Correct!</div>
      <Card glow={C.gold} style={{marginBottom:20,background:C.goldLight}}>
        <div style={{color:C.labelGold,fontSize:24,fontWeight:800,fontFamily:ff}}>+{score*50} XP &nbsp; +{score*20} ⭐</div>
      </Card>
      <Btn ch="Done" onClick={()=>{setStarted(false);setDone(false);setQIdx(0);setSel(null);setAns(false);setScore(0);}} style={{width:"100%"}}/>
    </div>
  );

  return(
    <div style={{padding:"20px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><Pill ch={`Q ${qIdx+1}/${total}`} c={C.muted}/><Pill ch={`⭐ ${score*20}`} c={C.goldLight}/></div>
      <PBar v={(qIdx/total)*100} c={C.navy} h={6}/>
      <Card style={{margin:"14px 0",textAlign:"center",padding:"22px 18px"}}><div style={{color:C.text,fontSize:18,fontWeight:800,fontFamily:ff,lineHeight:1.4}}>{q.q}</div></Card>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {q.opts.map((opt,i)=>{
          let bg=C.card,border=`1px solid ${C.border}`;
          if(ans){if(i===q.answer){bg=`${C.green}22`;border=`1px solid ${C.green}`;}else if(i===sel&&i!==q.answer){bg=`${C.red}22`;border=`1px solid ${C.red}`;}}
          return <div key={i} onClick={()=>{if(!ans){setSel(i);setAns(true);if(i===q.answer)setScore(s=>s+1);}}} style={{background:bg,border,borderRadius:13,padding:"13px 16px",color:C.text,fontWeight:700,fontSize:14,fontFamily:fn,cursor:ans?"default":"pointer",display:"flex",justifyContent:"space-between"}}>
            <span>{opt}</span>{ans&&i===q.answer&&<span>✅</span>}{ans&&i===sel&&i!==q.answer&&<span>❌</span>}
          </div>;
        })}
      </div>
      {ans&&<Btn ch={qIdx+1>=total?"Results 🎉":"Next →"} onClick={()=>{if(qIdx+1>=total){setDone(true);}else{setQIdx(x=>x+1);setSel(null);setAns(false);}}} style={{width:"100%",marginTop:14}}/>}
    </div>
  );
}

// ─── STORE ────────────────────────────────────────────────────────
function StoreScreen({profile,onPurchase,pendingIds}){
  const [conf,setConf]=useState(null);
  if(conf) return(
    <div style={{padding:"30px 16px",textAlign:"center"}}>
      <div style={{fontSize:60,marginBottom:12}}>{conf.emoji}</div>
      <div style={{color:C.text,fontSize:20,fontWeight:800,fontFamily:ff,marginBottom:6}}>Redeem {conf.name}?</div>
      <div style={{color:C.labelGold,fontSize:28,fontWeight:800,fontFamily:ff,marginBottom:20}}>⭐ {conf.coins}</div>
      <Card style={{marginBottom:20}}><div style={{fontSize:24,marginBottom:6}}>👨‍👩‍👧</div><div style={{color:C.text,fontWeight:700,fontSize:13,fontFamily:fn}}>Needs parent approval before it's sent.</div></Card>
      <div style={{display:"flex",gap:10}}><Btn ch="Cancel" onClick={()=>setConf(null)} grad={`linear-gradient(135deg,${C.red},${C.pink})`} style={{flex:1}}/><Btn ch="Request! 🎁" onClick={()=>{onPurchase(conf);setConf(null);}} grad={`linear-gradient(135deg,${C.gold},${C.orange})`} style={{flex:1}}/></div>
    </div>
  );
  return(
    <div style={{padding:"0 16px 16px"}}>
      <div style={{padding:"18px 0 6px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <STitle ch="Reward Store 🛍️" sub="Spend your Star Coins!"/>
        <div style={{background:`${C.gold}22`,borderRadius:12,padding:"8px 12px",border:`1px solid ${C.gold}33`}}>
          <div style={{color:C.labelGold,fontWeight:800,fontSize:15,fontFamily:ff}}>⭐ {profile.coins}</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {STORE_ITEMS.map(r=>{
          const can=profile.coins>=r.coins,pend=pendingIds.includes(r.id);
          return(
            <div key={r.id} style={{background:C.card,borderRadius:16,padding:14,border:`1px solid ${pend?C.gold+"44":C.border}`}}>
              {r.badge&&<div style={{color:C.navy,fontSize:9,fontWeight:800,fontFamily:fn,marginBottom:4}}>{r.badge}</div>}
              <div style={{fontSize:32,textAlign:"center",marginBottom:8}}>{r.emoji}</div>
              <div style={{color:C.text,fontWeight:700,fontSize:12,fontFamily:fn,textAlign:"center",marginBottom:5,lineHeight:1.3}}>{r.name}</div>
              <div style={{textAlign:"center",marginBottom:8}}><span style={{color:C.labelGold,fontWeight:800,fontSize:13,fontFamily:ff}}>⭐ {r.coins}</span></div>
              {pend?<div style={{background:`${C.gold}22`,borderRadius:10,padding:"7px",textAlign:"center",color:C.gold,fontSize:10,fontWeight:800,fontFamily:fn}}>⏳ Pending</div>
                :<Btn ch={can?"Redeem 🎁":"Need ⭐"} onClick={()=>can&&setConf(r)} grad={can?`linear-gradient(135deg,${C.gold},${C.orange})`:"#1a1a2e"} sm style={{width:"100%",opacity:can?1:0.4}}/>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── GIVE BACK ────────────────────────────────────────────────────
function GiveBackScreen({profile,donated,onDonate}){
  const [conf,setConf]=useState(null);
  const [success,setSuccess]=useState(null);
  const handle=(c)=>{onDonate(c);setConf(null);setSuccess(c);setTimeout(()=>setSuccess(null),3000);};
  return(
    <div style={{padding:"0 16px 16px",position:"relative"}}>
      {success&&<div style={{position:"absolute",inset:0,background:"rgba(6,8,15,0.95)",zIndex:40,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:24}}>
        <div style={{fontSize:80,marginBottom:12}}>{success.emoji}</div>
        <div style={{color:C.green,fontSize:24,fontWeight:800,fontFamily:ff,marginBottom:8}}>Thank You! 💚</div>
        <div style={{color:C.muted,fontSize:13,fontFamily:fn}}>{success.impact} via {success.org}</div>
      </div>}
      {conf&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.9)",zIndex:40,padding:24,display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:60}}>{conf.emoji}</div><div style={{color:C.text,fontSize:18,fontWeight:800,fontFamily:ff,marginTop:8}}>{conf.name}</div><div style={{color:C.labelGold,fontSize:24,fontWeight:800,fontFamily:ff,marginTop:4}}>⭐ {conf.coins} coins</div><div style={{color:C.teal,fontSize:12,fontFamily:fn,marginTop:4}}>{conf.impact}</div></div>
        <div style={{display:"flex",gap:10}}><Btn ch="Cancel" onClick={()=>setConf(null)} grad={`linear-gradient(135deg,${C.red},${C.pink})`} style={{flex:1}}/><Btn ch="Donate! 💚" onClick={()=>handle(conf)} grad={`linear-gradient(135deg,${C.green},${C.teal})`} style={{flex:1}}/></div>
      </div>}
      <div style={{padding:"18px 0 6px"}}><STitle ch="Give Back 💚" sub="Use coins to make a real difference!"/></div>
      <Card glow={C.green} style={{marginBottom:14,textAlign:"center",background:`${C.green}08`}}>
        <div style={{display:"flex",justifyContent:"space-around"}}>
          {[["🌳","2","Trees"],["🐶","10","Meals"],["🌊","1lb","Ocean"]].map(([e,v,l])=>(
            <div key={l}><div style={{fontSize:22}}>{e}</div><div style={{color:C.green,fontWeight:800,fontSize:18,fontFamily:ff}}>{v}</div><div style={{color:C.muted,fontSize:9,fontFamily:fn}}>{l}</div></div>
          ))}
        </div>
      </Card>
      {GIVE_BACK.map(c=>{
        const can=profile.coins>=c.coins,done=donated.includes(c.id);
        return <Card key={c.id} style={{marginBottom:12,border:`1px solid ${done?C.green+"55":C.border}`}}>
          <div style={{display:"flex",gap:14,alignItems:"center"}}>
            <div style={{width:50,height:50,borderRadius:14,background:`${C.green}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{c.emoji}</div>
            <div style={{flex:1}}><div style={{color:C.text,fontWeight:800,fontSize:14,fontFamily:ff}}>{c.name}</div><div style={{color:C.teal,fontSize:11,fontFamily:fn}}>{c.org} · {c.impact}</div></div>
            <Pill ch={`⭐ ${c.coins}`} c={C.goldLight}/>
          </div>
          <div style={{marginTop:10}}>
            {done?<div style={{background:`${C.green}22`,borderRadius:10,padding:"8px",textAlign:"center",color:C.green,fontSize:11,fontWeight:800,fontFamily:fn}}>💚 Donated!</div>
              :<Btn ch={can?"Donate 💚":"Need ⭐"} onClick={()=>can&&setConf(c)} grad={can?`linear-gradient(135deg,${C.green},${C.teal})`:"#1a1a2e"} sm style={{width:"100%",opacity:can?1:0.4}}/>}
          </div>
        </Card>;
      })}
    </div>
  );
}

// ─── DUEL SCREEN (simplified) ─────────────────────────────────────
function DuelScreen({profile}){
  const [phase,setPhase]=useState("lobby");
  const [opp,setOpp]=useState(null);
  const [count,setCount]=useState(3);
  const [qIdx,setQIdx]=useState(0);
  const [mySel,setMySel]=useState(null);
  const [opSel,setOpSel]=useState(null);
  const [rev,setRev]=useState(false);
  const [myS,setMyS]=useState(0);
  const [opS,setOpS]=useState(0);
  const [done,setDone]=useState(false);
  const friends=[{id:"f1",name:"Jordan",avatar:"👦",online:true},{id:"f2",name:"Priya",avatar:"👧",online:true},{id:"f3",name:"Marcus",avatar:"🧒",online:false}];
  const qs=getQuizBank(profile.grade,"Math");
  const q=qs[qIdx%qs.length];
  const total=3;
  const timerRef=useRef();

  useEffect(()=>{if(phase==="waiting"){timerRef.current=setTimeout(()=>{setPhase("countdown");setCount(3);},1500);}return()=>clearTimeout(timerRef.current);},[phase]);
  useEffect(()=>{
    if(phase==="countdown"){
      if(count>0){timerRef.current=setTimeout(()=>setCount(c=>c-1),1000);}
      else setPhase("duel");
    }
    return()=>clearTimeout(timerRef.current);
  },[phase,count]);

  const handleAns=(i)=>{
    if(mySel!==null)return;
    setMySel(i);
    if(i===q.answer)setMyS(s=>s+1);
    setTimeout(()=>{
      const opC=Math.random()>0.45;
      const opA=opC?q.answer:(q.answer+1)%q.opts.length;
      setOpSel(opA);setRev(true);
      if(opA===q.answer)setOpS(s=>s+1);
    },Math.random()*1800+600);
  };

  const nextQ=()=>{if(qIdx+1>=total){setDone(true);}else{setQIdx(x=>x+1);setMySel(null);setOpSel(null);setRev(false);}};

  if(phase==="lobby") return(
    <div style={{padding:"0 16px 16px"}}>
      <div style={{padding:"18px 0 6px"}}><STitle ch="Friend Duels 🤺" sub="Challenge a classmate to a live quiz battle!"/></div>
      <Card style={{marginBottom:14,background:`rgba(108,63,197,0.05)`}}>
        {[["⚡","Same question, same time","Race to answer first!"],["🏆","Winner gets bonus coins","Loser still earns 40 coins"],["📈","Both learn together","Win or lose, you improve!"]].map(([i,t,s])=>(
          <div key={t} style={{display:"flex",gap:10,marginBottom:10}}><div style={{fontSize:18}}>{i}</div><div><div style={{color:C.text,fontWeight:700,fontSize:12,fontFamily:fn}}>{t}</div><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>{s}</div></div></div>
        ))}
      </Card>
      <STitle ch="Friends 🟢"/>
      {friends.map(f=>(
        <div key={f.id} style={{background:C.card,borderRadius:16,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12,border:`1px solid ${f.online?C.green+"33":C.border}`}}>
          <div style={{position:"relative"}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${C.navy},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{f.avatar}</div>
            <div style={{position:"absolute",bottom:0,right:0,width:10,height:10,borderRadius:"50%",background:f.online?C.green:"#555",border:`2px solid ${C.card}`}}/>
          </div>
          <div style={{flex:1}}><div style={{color:C.text,fontWeight:700,fontSize:13,fontFamily:fn}}>{f.name}</div><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>{f.online?"🟢 Online":"⚫ Offline"}</div></div>
          {f.online?<Btn ch="Challenge!" onClick={()=>{setOpp(f);setPhase("waiting");}} sm grad={`linear-gradient(135deg,${C.navy},${C.blue})`}/>:<Pill ch="Offline" c={C.dim}/>}
        </div>
      ))}
    </div>
  );
  if(phase==="waiting") return <div style={{padding:"60px 24px",textAlign:"center"}}><div style={{fontSize:60,marginBottom:12}}>{opp.avatar}</div><div style={{color:C.text,fontSize:20,fontWeight:800,fontFamily:ff}}>Challenging {opp.name}...</div><div style={{color:C.muted,fontSize:13,fontFamily:fn,marginTop:6}}>Waiting for acceptance</div></div>;
  if(phase==="countdown") return <div style={{padding:"60px 24px",textAlign:"center"}}><div style={{color:C.text,fontSize:16,fontFamily:fn,marginBottom:16}}>{opp.name} accepted! Get ready!</div><div style={{fontSize:100,fontWeight:800,fontFamily:ff,color:count>0?C.gold:C.green,lineHeight:1}}>{count>0?count:"GO!"}</div></div>;

  if(done){
    const won=myS>opS,tied=myS===opS;
    return <div style={{padding:"30px 20px",textAlign:"center"}}>
      <div style={{fontSize:70,marginBottom:12}}>{won?"🏆":tied?"🤝":"💪"}</div>
      <div style={{color:C.text,fontSize:26,fontWeight:800,fontFamily:ff,marginBottom:6}}>{won?"You Won!":tied?"It's a Tie!":"Good Fight!"}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <Card><div style={{fontSize:28,textAlign:"center"}}>{profile.avatar}</div><div style={{color:C.text,fontWeight:800,fontSize:26,fontFamily:ff,textAlign:"center"}}>{myS}</div><div style={{color:C.muted,fontSize:11,fontFamily:fn,textAlign:"center"}}>You</div></Card>
        <Card><div style={{fontSize:28,textAlign:"center"}}>{opp.avatar}</div><div style={{color:C.text,fontWeight:800,fontSize:26,fontFamily:ff,textAlign:"center"}}>{opS}</div><div style={{color:C.muted,fontSize:11,fontFamily:fn,textAlign:"center"}}>{opp.name}</div></Card>
      </div>
      <Card glow={C.gold} style={{marginBottom:16,background:C.goldLight}}><div style={{color:C.labelGold,fontSize:24,fontWeight:800,fontFamily:ff}}>+{won?150:tied?80:40} ⭐ Coins!</div></Card>
      <Btn ch="Back to Friends" onClick={()=>{setPhase("lobby");setDone(false);setQIdx(0);setMyS(0);setOpS(0);setMySel(null);setOpSel(null);setRev(false);}} style={{width:"100%"}}/>
    </div>;
  }

  return <div style={{padding:"16px"}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center",marginBottom:14}}>
      <Card style={{textAlign:"center",background:`rgba(108,63,197,0.07)`}}><div style={{fontSize:20}}>{profile.avatar}</div><div style={{color:C.text,fontWeight:800,fontSize:20,fontFamily:ff}}>{myS}</div><div style={{color:C.muted,fontSize:10,fontFamily:fn}}>You</div></Card>
      <div style={{color:C.muted,fontWeight:800,fontFamily:ff,fontSize:14,textAlign:"center"}}>VS</div>
      <Card style={{textAlign:"center",background:`${C.pink}11`}}><div style={{fontSize:20}}>{opp.avatar}</div><div style={{color:C.text,fontWeight:800,fontSize:20,fontFamily:ff}}>{opS}</div><div style={{color:C.muted,fontSize:10,fontFamily:fn}}>{opp.name}</div></Card>
    </div>
    <PBar v={(qIdx/total)*100} c={C.purple} h={6}/>
    <Card style={{margin:"12px 0",textAlign:"center",padding:"20px 16px"}}><div style={{color:C.text,fontSize:17,fontWeight:800,fontFamily:ff,lineHeight:1.4}}>{q.q}</div></Card>
    <div style={{display:"flex",flexDirection:"column",gap:9}}>
      {q.opts.map((opt,i)=>{
        let bg=C.card,border=`1px solid ${C.border}`;
        if(rev){if(i===q.answer){bg=`${C.green}22`;border=`1px solid ${C.green}`;}else if(i===mySel&&i!==q.answer){bg=`${C.red}22`;border=`1px solid ${C.red}`;}}
        else if(mySel===i){border=`1px solid ${C.purple}`;}
        return <div key={i} onClick={()=>handleAns(i)} style={{background:bg,border,borderRadius:12,padding:"12px 14px",color:C.text,fontWeight:700,fontSize:13,fontFamily:fn,cursor:mySel!==null?"default":"pointer",display:"flex",justifyContent:"space-between"}}>
          <span>{opt}</span>
          <div style={{display:"flex",gap:5}}>{mySel===i&&<span>{profile.avatar}</span>}{rev&&opSel===i&&<span>{opp.avatar}</span>}{rev&&i===q.answer&&<span>✅</span>}</div>
        </div>;
      })}
    </div>
    {rev&&<Btn ch={qIdx+1>=total?"Results →":"Next →"} onClick={nextQ} style={{width:"100%",marginTop:12}}/>}
  </div>;
}

// ─── PARENT SCREEN ────────────────────────────────────────────────
function ParentScreen({pending,onApprove,onDeny}){
  const [sub,setSub]=useState("overview");
  const [wallet,setWallet]=useState(25);
  const [processed,setProcessed]=useState([]);
  const pend=pending.filter(p=>!processed.includes(p.id));

  return(
    <div style={{padding:"0 16px 16px"}}>
      <div style={{padding:"18px 0 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <STitle ch="Parent Dashboard 👨‍👩‍👧" sub="Manage rewards, wallet & progress"/>
        <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},${C.orange})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>👨</div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[["overview","📊"],["wallet","💳"],["approvals","✅"]].map(([t,icon])=>(
          <div key={t} onClick={()=>setSub(t)} style={{flex:1,padding:"8px 4px",borderRadius:12,background:sub===t?`linear-gradient(135deg,${C.purple},${C.navy})`:C.card,color:"white",fontSize:11,fontWeight:700,fontFamily:fn,cursor:"pointer",textAlign:"center",border:`1px solid ${sub===t?C.navy:C.border}`,position:"relative"}}>
            {icon} {t[0].toUpperCase()+t.slice(1)}
            {t==="approvals"&&pend.length>0&&<div style={{position:"absolute",top:-4,right:-4,background:C.red,borderRadius:"50%",width:15,height:15,fontSize:9,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>{pend.length}</div>}
          </div>
        ))}
      </div>

      {sub==="overview"&&(
        <>
          <Card glow={C.purple} style={{marginBottom:12,background:`rgba(108,63,197,0.05)`}}>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:32}}>🧒</div>
              <div><div style={{color:C.text,fontSize:17,fontWeight:800,fontFamily:ff}}>Alex</div><div style={{color:C.muted,fontSize:12,fontFamily:fn}}>3rd Grade · <Badge level={2}/></div></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[["⚡ XP","1,840"],["⭐ Coins","420"],["🔥 Streak","9 days"],["📊 Math","87%"]].map(([l,v])=>(
                <div key={l} style={{background:"rgba(0,0,0,0.3)",borderRadius:10,padding:"8px 10px"}}><div style={{color:C.muted,fontSize:10,fontFamily:fn}}>{l}</div><div style={{color:C.text,fontWeight:800,fontSize:15,fontFamily:ff}}>{v}</div></div>
              ))}
            </div>
          </Card>
          <Card glow={C.green} style={{background:`${C.green}08`}}>
            <div style={{color:C.green,fontWeight:800,fontSize:13,fontFamily:fn,marginBottom:8}}>🛡️ COPPA Compliance Status</div>
            {[["✅","Parental consent verified"],["✅","No ads served to child"],["✅","Data deletion available"],["✅","Annual re-consent set"]].map(([icon,text])=>(
              <div key={text} style={{color:C.text,fontSize:12,fontFamily:fn,marginBottom:4}}>{icon} {text}</div>
            ))}
          </Card>
        </>
      )}

      {sub==="wallet"&&(
        <Card glow={C.gold} style={{textAlign:"center",background:C.goldLight}}>
          <div style={{color:C.muted,fontSize:11,fontFamily:fn,marginBottom:4}}>WALLET BALANCE</div>
          <div style={{color:C.labelGold,fontSize:36,fontWeight:800,fontFamily:ff}}>${wallet.toFixed(2)}</div>
          <Btn ch="+ Add $10" onClick={()=>setWallet(w=>w+10)} grad={`linear-gradient(135deg,${C.gold},${C.orange})`} style={{margin:"12px auto 0"}}/>
        </Card>
      )}

      {sub==="approvals"&&(
        pend.length===0
          ?<div style={{textAlign:"center",padding:"40px 20px"}}><div style={{fontSize:60,marginBottom:10}}>✅</div><div style={{color:C.text,fontSize:18,fontWeight:800,fontFamily:ff}}>All caught up!</div></div>
          :pend.map(p=>(
            <Card key={p.id} glow={C.gold} style={{marginBottom:12}}>
              <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}><div style={{fontSize:34}}>{p.emoji}</div><div><div style={{color:C.text,fontWeight:800,fontSize:14,fontFamily:ff}}>{p.item}</div><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>{p.student} · {p.time}</div></div></div>
              <div style={{display:"flex",gap:10}}><Btn ch="❌ Deny" onClick={()=>{setProcessed(x=>[...x,p.id]);onDeny(p.id);}} grad={`linear-gradient(135deg,${C.red},${C.pink})`} style={{flex:1}}/><Btn ch="✅ Approve" onClick={()=>{setProcessed(x=>[...x,p.id]);onApprove(p.id);}} grad={`linear-gradient(135deg,${C.green},${C.teal})`} style={{flex:1}}/></div>
            </Card>
          ))
      )}
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────
function LoginScreen({onLogin}){
  const [step,setStep]=useState("who");
  return step==="who"?(
    <div style={{padding:"28px 20px",textAlign:"center"}}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
        <img src="/letzkool-logo.png" alt="LetzSkool" style={{width:88,height:88,borderRadius:20,boxShadow:`0 8px 32px rgba(0,100,200,0.25)`}}/>
      </div>
      <div style={{color:C.navy,fontSize:28,fontWeight:900,fontFamily:ff,marginBottom:2}}>LetzSkool</div>
      <div style={{color:C.muted,fontSize:12,fontFamily:fn,marginBottom:6}}>Smart learning for every kid</div>
      <div style={{background:C.tealLight,border:`1px solid ${C.teal}30`,borderRadius:10,padding:"6px 14px",display:"inline-block",marginBottom:28}}>
        <div style={{color:C.labelGreen,fontSize:11,fontWeight:700,fontFamily:fn}}>🛡️ COPPA Certified · No Ads · No Data Selling</div>
      </div>
      {[{l:"I'm a Student",s:"Learn, earn & compete!",i:"🎒",m:"student",g:`linear-gradient(135deg,${C.navy},${C.blue})`},
        {l:"I'm a Parent",s:"Manage & approve rewards",i:"👨‍👩‍👧",m:"parent",g:`linear-gradient(135deg,${C.gold},${C.orange})`},
        {l:"I'm a Teacher",s:"Class tools, reports & more",i:"🏫",m:"teacher",g:`linear-gradient(135deg,${C.teal},${C.green})`},
      ].map(item=>(
        <div key={item.m} onClick={()=>item.m==="student"?setStep("profile"):onLogin({mode:item.m})} style={{background:C.card,borderRadius:16,padding:"14px 16px",marginBottom:10,cursor:"pointer",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12,textAlign:"left",boxShadow:"0 1px 6px rgba(27,63,171,0.06)"}}>
          <div style={{width:46,height:46,borderRadius:13,background:item.g,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{item.i}</div>
          <div style={{flex:1}}><div style={{color:C.text,fontWeight:800,fontSize:14,fontFamily:ff}}>{item.l}</div><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>{item.s}</div></div>
          <div style={{color:C.dim,fontSize:18}}>›</div>
        </div>
      ))}
    </div>
  ):(
    <div style={{padding:"20px"}}>
      <div onClick={()=>setStep("who")} style={{color:C.navy,fontSize:13,fontFamily:fn,marginBottom:16,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><span>←</span><span>Back</span></div>
      <STitle ch="Who's Learning? 👋" sub="Pick your profile — content adjusts to your grade!"/>
      {PROFILES.map(p=>(
        <div key={p.id} onClick={()=>onLogin({mode:"student",profile:p})} style={{background:C.card,borderRadius:16,padding:16,marginBottom:12,cursor:"pointer",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:14,boxShadow:"0 1px 6px rgba(27,63,171,0.06)"}}>
          <div style={{width:52,height:52,borderRadius:16,background:`linear-gradient(135deg,${C.navy},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{p.avatar}</div>
          <div style={{flex:1}}>
            <div style={{color:C.text,fontWeight:800,fontSize:16,fontFamily:ff}}>{p.name}</div>
            <div style={{color:C.muted,fontSize:11,fontFamily:fn,marginBottom:5}}>{p.gradeLabel}</div>
            <div style={{display:"flex",gap:6}}><Pill ch={`⭐ ${p.coins}`} c={C.gold}/><Pill ch={`🔥 ${p.streak}d`} c={C.orange}/><Badge level={p.adaptLevel}/></div>
          </div>
          <div style={{color:C.dim,fontSize:20}}>›</div>
        </div>
      ))}
    </div>
  );
}

// ─── STARBOT AI TUTOR ────────────────────────────────────────────
const STARBOT_SYSTEM = (profile, context) => `You are BrainBot, the friendly AI tutor for LetzSkool, an educational app for elementary school students.

You are talking to ${profile.name}, a ${profile.gradeLabel} student.
${context ? `They are currently studying: ${context.subject} — "${context.topic}".` : "They are exploring the app."}

YOUR PERSONALITY:
- Warm, encouraging, and endlessly patient
- You speak simply and clearly — like a wonderful teacher talking to a ${profile.gradeLabel} student
- You use age-appropriate language, short sentences, and friendly emojis 🌟
- You celebrate every attempt, even wrong ones: "Great try! Here's a hint..."
- You NEVER just give the answer — you guide with questions and hints (Socratic method)
- You use real-world examples kids relate to: pizza, Minecraft, sports, candy, animals
- You keep responses SHORT (3-6 sentences max) — kids lose attention quickly
- If they say something off-topic, gently bring them back: "Great question! Let's stay focused on ${context?.topic || "your lessons"} for now 😊"
- You NEVER discuss anything inappropriate, violent, or unrelated to learning

WHAT YOU CAN HELP WITH:
- Explain any concept from their current lesson in a new way
- Give hints when they're stuck on a quiz question
- Answer "why" and "how" questions about math and science
- Encourage them when they feel frustrated
- Suggest what to study next

Always end with an encouraging line or a follow-up question to keep them engaged.`;

const SUGGESTED_QUESTIONS = {
  Math: [
    "Why do we need fractions?",
    "Can you explain multiplication another way?",
    "I keep getting division wrong 😢",
    "What's a trick for times tables?",
    "When do we use math in real life?",
  ],
  Science: [
    "Why is Pluto not a planet?",
    "How do plants make food?",
    "Why does gravity pull things down?",
    "What's the biggest animal ever?",
    "How does the water cycle work?",
  ],
  General: [
    "I'm feeling stuck 😞",
    "What should I study next?",
    "Can you make this fun? 🎮",
    "Give me a cool science fact!",
    "I got it wrong, can you explain?",
  ],
};

function BrainBotChat({ profile, context, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hey ${profile.name}! 👋 I'm BrainBot, your personal tutor! ${context ? `I see you're working on **${context.topic}** — awesome choice! 🌟` : "I'm here to help you learn anything! 🚀"} What would you like to know?`,
      ts: Date.now(),
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState(1);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Animated thinking dots
  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setDots(d => (d % 3) + 1), 400);
    return () => clearInterval(t);
  }, [loading]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text.trim(), ts: Date.now() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: STARBOT_SYSTEM(profile, context),
          messages: history,
        }),
      });

      const data = await res.json();
      const reply = data.content?.[0]?.text || "Hmm, I had trouble thinking just now! Try asking me again 😊";
      setMessages(m => [...m, { role: "assistant", content: reply, ts: Date.now() }]);
    } catch (e) {
      setMessages(m => [...m, {
        role: "assistant",
        content: "Oops! My brain got a little fuzzy 🌀 Check your internet and try again!",
        ts: Date.now(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestKey = context?.subject || "General";
  const suggestions = SUGGESTED_QUESTIONS[suggestKey] || SUGGESTED_QUESTIONS.General;

  // Render message text with **bold** support
  const renderText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**")
        ? <strong key={i}>{p.slice(2, -2)}</strong>
        : p
    );
  };

  return (
    <div style={{ position: "absolute", inset: 0, background: C.card, zIndex: 60, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${C.navy},${C.blue})`, padding: "14px 16px 12px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div onClick={onClose} style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>←</div>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "white", fontWeight: 800, fontSize: 16, fontFamily: ff }}>BrainBot</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontFamily: fn, display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green }} />
              {context ? `Helping with ${context.topic}` : "Your personal AI tutor"}
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "4px 10px" }}>
            <div style={{ color: "white", fontSize: 10, fontWeight: 800, fontFamily: fn }}>✨ AI Powered</div>
          </div>
        </div>
        {context && (
          <div style={{ marginTop: 10, background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "6px 12px", display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ fontSize: 14 }}>{context.emoji}</div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, fontFamily: fn }}>
              <span style={{ fontWeight: 800 }}>{context.subject}</span> · {context.topic}
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "14px 14px 6px" }}>

        {/* Suggested questions — show only at start */}
        {messages.length <= 1 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: C.muted, fontSize: 11, fontFamily: fn, marginBottom: 8, textAlign: "center" }}>💡 Try asking...</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
              {suggestions.slice(0, 4).map((s, i) => (
                <div key={i} onClick={() => sendMessage(s)}
                  style={{ background: `rgba(108,63,197,0.13)`, border: `1px solid rgba(108,63,197,0.27)`, borderRadius: 20, padding: "6px 12px", color: C.purple, fontSize: 11, fontFamily: fn, cursor: "pointer", fontWeight: 600 }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => {
          const isBot = m.role === "assistant";
          return (
            <div key={i} style={{ display: "flex", justifyContent: isBot ? "flex-start" : "flex-end", marginBottom: 12, gap: 8, alignItems: "flex-end" }}>
              {isBot && (
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${C.navy},${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, marginBottom: 2 }}>🤖</div>
              )}
              <div style={{
                maxWidth: "78%",
                background: isBot ? C.navyLight : `linear-gradient(135deg,${C.navy},${C.blue})`,
                border: isBot ? `1px solid ${C.border}` : "none",
                borderRadius: isBot ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
                padding: "11px 14px",
                color: C.text,
                fontSize: 13,
                fontFamily: fn,
                lineHeight: 1.6,
                fontWeight: isBot ? 400 : 600,
              }}>
                {isBot ? renderText(m.content) : m.content}
              </div>
              {!isBot && (
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${C.navy},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, marginBottom: 2 }}>{profile.avatar}</div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${C.navy},${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🤖</div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: C.navy, opacity: dots > j ? 1 : 0.25, transition: "opacity 0.2s" }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick replies after bot responds */}
      {messages.length > 1 && !loading && (
        <div style={{ padding: "0 14px 8px", display: "flex", gap: 7, overflowX: "auto" }}>
          {["Can you explain differently? 🔄", "Give me a hint! 💡", "Why does this matter? 🤔", "Show me an example 📝"].map((s, i) => (
            <div key={i} onClick={() => sendMessage(s)}
              style={{ flexShrink: 0, background: C.blueLight, border: `1px solid ${C.blue}40`, borderRadius: 20, padding: "5px 11px", color: C.blue, fontSize: 10, fontFamily: fn, cursor: "pointer", fontWeight: 700 }}>
              {s}
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: "10px 14px 16px", background: C.card, borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div style={{ flex: 1, background: C.bg, borderRadius: 20, border: `1px solid ${loading ? C.border : C.navy + "44"}`, padding: "10px 16px", transition: "border 0.2s" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              placeholder="Ask BrainBot anything... 🧠"
              style={{ width: "100%", background: "transparent", border: "none", color: C.text, fontSize: 13, fontFamily: fn, outline: "none" }}
            />
          </div>
          <div onClick={() => sendMessage(input)}
            style={{ width: 44, height: 44, borderRadius: "50%", background: input.trim() && !loading ? `linear-gradient(135deg,${C.navy},${C.blue})` : C.border, display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() && !loading ? "pointer" : "default", flexShrink: 0, transition: "background 0.2s", fontSize: 18 }}>
            {loading ? "⏳" : "➤"}
          </div>
        </div>
        <div style={{ color: C.dim, fontSize: 10, fontFamily: fn, textAlign: "center", marginTop: 7 }}>
          BrainBot uses AI · Always review answers with a trusted adult 👨‍👩‍👧
        </div>
      </div>
    </div>
  );
}

// Floating BrainBot button + context-aware trigger
function BrainBotButton({ profile, context, onClick }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 600); }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div onClick={onClick} style={{
      position: "absolute", bottom: 80, right: 14, zIndex: 15,
      width: 52, height: 52, borderRadius: "50%",
      background: `linear-gradient(135deg,${C.navy},${C.blue})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 24, cursor: "pointer",
      boxShadow: pulse ? `0 0 0 8px ${C.navy}22, 0 8px 24px ${C.navy}44` : `0 4px 20px ${C.navy}40`,
      transition: "box-shadow 0.4s ease",
    }}>
      🧠
      <div style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: C.green, border: `2px solid ${C.card}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} />
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────
const STUDENT_TABS=[{id:"home",i:"🏠",l:"Home"},{id:"learn",i:"📚",l:"Learn"},{id:"compete",i:"⚔️",l:"Compete"},{id:"store",i:"🛍️",l:"Store"},{id:"more",i:"✦",l:"More"}];

export default function App(){
  const isTablet = useIsTablet();
  const [coppaAccepted,setCoppaAccepted]=useState(false);
  const [session,setSession]=useState(null);
  const [tab,setTab]=useState("home");
  const [moreOpen,setMoreOpen]=useState(false);
  const [moreTab,setMoreTab]=useState("adaptive");
  const [pendingItems,setPendingItems]=useState([]);
  const [pendingIds,setPendingIds]=useState([]);
  const [donated,setDonated]=useState([]);
  const [toast,setToast]=useState(null);
  const [brainBotOpen,setBrainBotOpen]=useState(false);
  const [brainBotContext,setBrainBotContext]=useState(null);

  useEffect(()=>{
    const l=document.createElement("link");
    l.href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap";
    l.rel="stylesheet";document.head.appendChild(l);
  },[]);

  const showToast=(msg,c=C.green)=>{setToast({msg,c});setTimeout(()=>setToast(null),3000);};
  const handleLogin=(s)=>{ setSession(s); setTab(s.mode==="student"?"home":s.mode==="teacher"?"teacher":"parent"); };
  const handlePurchase=(item)=>{
    setPendingIds(p=>[...p,item.id]);
    setPendingItems(p=>[...p,{id:`p${Date.now()}`,student:session.profile.name,item:item.name,emoji:item.emoji,coins:item.coins,time:"Just now"}]);
    showToast("🎉 Request sent to parent!");
  };
  const navigateTo=(t)=>{
    if(["adaptive","duel","certs","giveback"].includes(t)){setMoreTab(t);setMoreOpen(true);}
    else{setTab(t);setMoreOpen(false);}
  };

  const moreScreens={
    adaptive:<AdaptiveQuiz profile={session?.profile} onComplete={()=>showToast("🧠 Practice complete! XP earned!")}/>,
    duel:<DuelScreen profile={session?.profile}/>,
    giveback:<GiveBackScreen profile={session?.profile} donated={donated} onDonate={(c)=>{setDonated(d=>[...d,c.id]);showToast(`💚 Donated to ${c.org}!`);}}/>,
    certs:(
      <div style={{padding:"28px 20px",textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:10}}>🏅</div>
        <div style={{color:C.text,fontSize:20,fontWeight:800,fontFamily:ff,marginBottom:6}}>My Certificates</div>
        {(session?.profile?.completedTopics||[]).map(t=>(
          <Card key={t} glow={C.gold} style={{marginBottom:10,background:C.goldLight,textAlign:"left"}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{fontSize:30}}>🏅</div>
              <div style={{flex:1}}>
                <div style={{color:C.labelGold,fontWeight:800,fontSize:14,fontFamily:ff}}>{t}</div>
                <div style={{color:C.muted,fontSize:11,fontFamily:fn}}>{session?.profile?.gradeLabel} · Certified</div>
              </div>
              <Btn ch="View 🖨️" sm grad={`linear-gradient(135deg,${C.gold},${C.orange})`} onClick={()=>showToast("🖨️ Opening certificate to print!")}/>
            </div>
          </Card>
        ))}
        <div style={{color:C.muted,fontSize:13,fontFamily:fn,marginTop:8}}>Complete more topics to earn certificates!</div>
      </div>
    ),
  };

  const screens={
    home:session?.profile&&<HomeScreen profile={session.profile} setTab={navigateTo}/>,
    learn:session?.profile&&<LearnScreen profile={session.profile} onAskBrainBot={(ctx)=>{setBrainBotContext(ctx);setBrainBotOpen(true);}}/>,
    compete:session?.profile&&<CompeteScreen profile={session.profile}/>,
    store:session?.profile&&<StoreScreen profile={session.profile} onPurchase={handlePurchase} pendingIds={pendingIds}/>,
    parent:<ParentScreen pending={pendingItems} onApprove={()=>showToast("✅ Reward approved!")} onDeny={()=>showToast("❌ Reward denied.",C.red)}/>,
    teacher:<TeacherPortal/>,
  };

  // ── Shared inner content renderer ──
  const mainContent = (
    <>
      {!coppaAccepted
        ? <CoppaScreen onAccept={()=>setCoppaAccepted(true)}/>
        : !session
        ? <LoginScreen onLogin={handleLogin}/>
        : screens[tab]
      }
    </>
  );

  // ── Tablet sidebar nav items ──
  const TabletSidebarNav = () => {
    const studentItems=[
      {id:"home",i:"🏠",l:"Home"},
      {id:"learn",i:"📚",l:"Learn"},
      {id:"compete",i:"⚔️",l:"Compete"},
      {id:"store",i:"🛍️",l:"Store"},
      {id:"adaptive",i:"🧠",l:"AI Practice"},
      {id:"duel",i:"🤺",l:"Duels"},
      {id:"giveback",i:"💚",l:"Give Back"},
      {id:"certs",i:"🏅",l:"Certificates"},
    ];
    const isActive=(id)=> ["adaptive","duel","giveback","certs"].includes(id)
      ? moreTab===id&&moreOpen
      : tab===id&&!moreOpen;
    return(
      <div style={{width:200,background:C.card,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",height:"100%",flexShrink:0,boxShadow:"2px 0 12px rgba(27,63,171,0.06)"}}>
        {/* Logo */}
        <div style={{padding:"22px 20px 16px",borderBottom:`1px solid ${C.border}`}}>
          <LetzSkoolLogo size={30} showText={true}/>
          {session?.profile&&(
            <div style={{marginTop:14,background:C.navyLight,borderRadius:12,padding:"10px 12px",display:"flex",gap:8,alignItems:"center",border:`1px solid ${C.border}`}}>
              <div style={{fontSize:22}}>{session.profile.avatar}</div>
              <div>
                <div style={{color:C.text,fontWeight:800,fontSize:13,fontFamily:ff}}>{session.profile.name}</div>
                <div style={{color:C.muted,fontSize:10,fontFamily:fn}}>{session.profile.gradeLabel}</div>
              </div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <div style={{flex:1,padding:"10px 10px",overflowY:"auto"}}>
          {session?.mode==="student" ? studentItems.map(item=>{
            const active=isActive(item.id);
            return(
              <div key={item.id} onClick={()=>{
                if(["adaptive","duel","giveback","certs"].includes(item.id)){setMoreTab(item.id);setMoreOpen(true);setTab("home");}
                else{setTab(item.id);setMoreOpen(false);}
              }} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:12,background:active?C.navyLight:"transparent",border:active?`1px solid ${C.navy}30`:"1px solid transparent",marginBottom:4,cursor:"pointer",transition:"all 0.15s"}}>
                <div style={{fontSize:18,width:24,textAlign:"center"}}>{item.i}</div>
                <div style={{color:active?C.navy:C.muted,fontWeight:active?800:600,fontSize:13,fontFamily:fn}}>{item.l}</div>
                {active&&<div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:C.navy}}/>}
              </div>
            );
          }) : (
            <>
              <div onClick={()=>setTab(session?.mode==="teacher"?"teacher":"parent")} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:12,background:`${C.gold}18`,border:`1px solid ${C.gold}33`,marginBottom:4,cursor:"pointer"}}>
                <div style={{fontSize:18}}>{session?.mode==="teacher"?"🏫":"📊"}</div>
                <div style={{color:C.labelGold,fontWeight:800,fontSize:13,fontFamily:fn}}>Dashboard</div>
              </div>
            </>
          )}
        </div>

        {/* Coins + logout */}
        {session?.profile&&(
          <div style={{padding:"12px 10px",borderTop:`1px solid ${C.border}`}}>
            <div style={{background:C.goldLight,borderRadius:12,padding:"10px 12px",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
              <div style={{fontSize:18}}>⭐</div>
              <div>
                <div style={{color:C.labelGold,fontWeight:800,fontSize:14,fontFamily:ff}}>{session.profile.coins}</div>
                <div style={{color:C.muted,fontSize:10,fontFamily:fn}}>Star Coins</div>
              </div>
            </div>
            <div onClick={()=>setSession(null)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:10,cursor:"pointer"}}>
              <div style={{fontSize:16}}>🔓</div>
              <div style={{color:C.dim,fontSize:12,fontFamily:fn}}>Sign out</div>
            </div>
          </div>
        )}
        {!session&&coppaAccepted&&(
          <div style={{padding:"12px"}}/>
        )}
      </div>
    );
  };

  // ── Phone bottom nav ──
  const PhoneBottomNav = () => (
    <div style={{background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-around",padding:"8px 0 12px",flexShrink:0}}>
      {session?.mode==="student"
        ? STUDENT_TABS.map(t=>{
            const active=t.id==="more"?moreOpen:(tab===t.id&&!moreOpen);
            return(
              <div key={t.id} onClick={()=>{if(t.id==="more"){setMoreOpen(x=>!x);}else{setTab(t.id);setMoreOpen(false);}}}
                style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"3px 8px",borderRadius:10}}>
                <div style={{fontSize:active?21:17,transition:"all 0.18s"}}>{t.i}</div>
                <div style={{color:active?C.navy:C.dim,fontSize:9,fontWeight:active?800:600,fontFamily:fn}}>{t.l}</div>
                {active&&<div style={{width:16,height:3,background:`linear-gradient(90deg,${C.navy},${C.blue})`,borderRadius:99}}/>}
              </div>
            );
          })
        : <>
            <div onClick={()=>setTab(session?.mode==="teacher"?"teacher":"parent")} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"3px 14px"}}>
              <div style={{fontSize:20}}>{session?.mode==="teacher"?"🏫":"📊"}</div>
              <div style={{color:C.navy,fontSize:9,fontWeight:800,fontFamily:fn}}>Dashboard</div>
              <div style={{width:16,height:3,background:`linear-gradient(90deg,${C.gold},${C.orange})`,borderRadius:99}}/>
            </div>
            <div onClick={()=>setSession(null)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"3px 14px"}}>
              <div style={{fontSize:18}}>🔓</div>
              <div style={{color:C.dim,fontSize:9,fontFamily:fn}}>Logout</div>
            </div>
          </>
      }
    </div>
  );

  // ── More sheet (phone only — tablet uses sidebar) ──
  const MoreSheet = () => (
    <div style={{position:"absolute",inset:0,background:"rgba(30,42,74,0.5)",zIndex:20,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}
      onClick={e=>{if(e.target===e.currentTarget)setMoreOpen(false);}}>
      <div style={{background:C.card,borderRadius:"26px 26px 0 0",border:`1px solid ${C.border}`,animation:"slideUp 0.28s ease",maxHeight:"88%",display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"10px 0 6px"}}>
          <div style={{width:34,height:4,background:C.dim,borderRadius:99}}/>
        </div>
        <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
          {[["adaptive","🧠 AI Quiz"],["duel","⚔️ Duels"],["giveback","💚 Give"],["certs","🏅 Certs"]].map(([t,l])=>(
            <div key={t} onClick={()=>setMoreTab(t)}
              style={{flex:1,padding:"10px 2px",textAlign:"center",color:moreTab===t?C.navy:C.muted,fontWeight:moreTab===t?800:600,fontSize:10,fontFamily:fn,cursor:"pointer",borderBottom:moreTab===t?`2px solid ${C.navy}`:"2px solid transparent"}}>
              {l}
            </div>
          ))}
        </div>
        <div style={{flex:1,overflowY:"auto"}}>{moreScreens[moreTab]}</div>
      </div>
    </div>
  );

  // ── TABLET LAYOUT ──
  if(isTablet){
    return(
      <div style={{background:C.bg,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <Bg/>
        <style>{`
          @keyframes fadeIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
          @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
          *{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${C.border};border-radius:99px}
        `}</style>

        {/* Tablet top bar */}
        <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"12px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,zIndex:10,boxShadow:"0 1px 8px rgba(27,63,171,0.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <LetzSkoolLogo size={32} showText={true}/>
            <div style={{background:C.tealLight,borderRadius:8,padding:"3px 10px",border:`1px solid ${C.teal}30`}}>
              <div style={{color:C.labelGreen,fontSize:11,fontWeight:700,fontFamily:fn}}>🛡️ COPPA Protected</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            {session?.profile&&(
              <div style={{background:C.goldLight,borderRadius:12,padding:"7px 14px",display:"flex",alignItems:"center",gap:8,border:`1px solid ${C.gold}33`}}>
                <div style={{fontSize:18}}>⭐</div>
                <div style={{color:C.labelGold,fontWeight:800,fontSize:15,fontFamily:ff}}>{session.profile.coins} coins</div>
              </div>
            )}
            {session&&<div onClick={()=>setSession(null)} style={{color:C.muted,fontSize:13,fontFamily:fn,cursor:"pointer",padding:"6px 12px",borderRadius:8,background:C.card,border:`1px solid ${C.border}`}}>Sign out 🔓</div>}
          </div>
        </div>

        {/* Tablet body */}
        <div style={{flex:1,display:"flex",overflow:"hidden",position:"relative"}}>
          {/* Sidebar — only show when logged in */}
          {session&&coppaAccepted&&<TabletSidebarNav/>}

          {/* Main content area */}
          <div style={{flex:1,overflowY:"auto",position:"relative"}}>
            <div style={{maxWidth:session?860:520,margin:"0 auto",padding:"0 0 40px"}}>
              {mainContent}
            </div>

            {/* Tablet More panel — inline when sidebar active */}
            {session?.mode==="student"&&moreOpen&&(
              <div style={{position:"fixed",top:0,right:0,width:440,height:"100vh",background:C.bg,borderLeft:`1px solid ${C.border}`,zIndex:30,display:"flex",flexDirection:"column",overflowY:"auto",animation:"fadeIn 0.2s ease"}}>
                <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
                  <div style={{display:"flex",gap:0}}>
                    {[["adaptive","🧠 AI"],["duel","⚔️ Duels"],["giveback","💚 Give"],["certs","🏅"]].map(([t,l])=>(
                      <div key={t} onClick={()=>setMoreTab(t)}
                        style={{padding:"7px 12px",fontSize:11,fontWeight:moreTab===t?800:600,fontFamily:fn,color:moreTab===t?C.navy:C.muted,cursor:"pointer",borderBottom:moreTab===t?`2px solid ${C.navy}`:"2px solid transparent"}}>
                        {l}
                      </div>
                    ))}
                  </div>
                  <div onClick={()=>setMoreOpen(false)} style={{color:C.muted,fontSize:20,cursor:"pointer",padding:"4px 8px"}}>×</div>
                </div>
                <div style={{flex:1,overflowY:"auto"}}>{moreScreens[moreTab]}</div>
              </div>
            )}

            {/* BrainBot chat — tablet slide-in panel */}
            {session?.mode==="student"&&brainBotOpen&&(
              <div style={{position:"fixed",top:0,right:0,width:420,height:"100vh",zIndex:50,animation:"fadeIn 0.2s ease"}}>
                <BrainBotChat profile={session.profile} context={brainBotContext} onClose={()=>{setBrainBotOpen(false);setBrainBotContext(null);}}/>
              </div>
            )}

            {/* BrainBot FAB */}
            {session?.mode==="student"&&coppaAccepted&&!brainBotOpen&&(
              <BrainBotButton profile={session.profile} context={brainBotContext} onClick={()=>{setBrainBotContext(null);setBrainBotOpen(true);}}/>
            )}
          </div>
        </div>

        {/* Toast */}
        {toast&&(
          <div style={{position:"fixed",bottom:30,left:"50%",transform:"translateX(-50%)",background:toast.c,borderRadius:14,padding:"12px 24px",color:"white",fontWeight:800,fontSize:14,fontFamily:ff,whiteSpace:"nowrap",zIndex:999,boxShadow:"0 8px 40px rgba(27,63,171,0.15)",animation:"fadeIn 0.2s ease"}}>
            {toast.msg}
          </div>
        )}
      </div>
    );
  }

  // ── PHONE LAYOUT ──
  return(
    <div style={{background:C.bg,minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center",padding:16}}>
      <Bg/>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        *{box-sizing:border-box}::-webkit-scrollbar{display:none}
      `}</style>

      <div style={{width:385,height:820,background:C.bg,borderRadius:40,overflow:"hidden",position:"relative",border:"8px solid #CBD5E1",boxShadow:"0 30px 80px rgba(27,63,171,0.18),0 0 0 1px rgba(27,63,171,0.12)",display:"flex",flexDirection:"column",zIndex:1}}>
        {/* Status bar */}
        <div style={{padding:"10px 22px 4px",display:"flex",justifyContent:"space-between",flexShrink:0}}>
          <div style={{color:C.dim,fontSize:11,fontWeight:700,fontFamily:fn}}>9:41</div>
          <div style={{color:C.dim,fontSize:10,fontFamily:fn}}>●●● WiFi 🔋</div>
        </div>

        {/* Screen content */}
        <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none"}}>
          {mainContent}
        </div>

        {/* Phone-only overlays */}
        {session?.mode==="student"&&moreOpen&&<MoreSheet/>}

        {session?.mode==="student"&&brainBotOpen&&(
          <BrainBotChat profile={session.profile} context={brainBotContext} onClose={()=>{setBrainBotOpen(false);setBrainBotContext(null);}}/>
        )}

        {session?.mode==="student"&&coppaAccepted&&!brainBotOpen&&(
          <BrainBotButton profile={session.profile} context={brainBotContext} onClick={()=>{setBrainBotContext(null);setBrainBotOpen(true);}}/>
        )}

        {/* Toast */}
        {toast&&(
          <div style={{position:"absolute",top:68,left:"50%",transform:"translateX(-50%)",background:toast.c,borderRadius:12,padding:"9px 18px",color:"white",fontWeight:800,fontSize:12,fontFamily:ff,whiteSpace:"nowrap",zIndex:99,boxShadow:"0 8px 30px rgba(27,63,171,0.15)",animation:"fadeIn 0.2s ease"}}>
            {toast.msg}
          </div>
        )}

        {/* Bottom Nav */}
        {session&&coppaAccepted&&<PhoneBottomNav/>}
      </div>
    </div>
  );
}

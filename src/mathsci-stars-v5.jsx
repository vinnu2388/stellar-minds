import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────
const C = {
  bg:"#05070E", card:"#0E1320", cardHover:"#141c2e",
  border:"rgba(255,255,255,0.10)", borderHi:"rgba(255,255,255,0.20)",
  purple:"#7C3AED", purpleBright:"#8B5CF6", purpleLight:"#C4B5FD",
  cyan:"#06B6D4", teal:"#2DD4BF", green:"#34D399",
  gold:"#FBBF24", goldLight:"#FDE68A", orange:"#FB923C",
  pink:"#F472B6", red:"#F87171", blue:"#60A5FA",
  // All text values AA-contrast compliant on dark backgrounds
  text:"#F8FAFC", muted:"rgba(248,250,252,0.78)", dim:"rgba(248,250,252,0.40)",
  // Bright label variants for small text on dark cards
  labelGreen:"#6EE7B7", labelGold:"#FDE68A", labelCyan:"#67E8F9",
  labelPurple:"#C4B5FD", labelPink:"#FBCFE8", labelOrange:"#FED7AA",
};
const ff="'Fredoka One',cursive", fn="'Nunito',sans-serif";

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

// ─── ADAPTIVE QUESTION BANK ───────────────────────────────────────
// Each question has a difficulty level: 1=easy, 2=medium, 3=hard
const QUESTION_BANK = {
  "2-3": {
    Math: [
      {id:1,q:"What is 2 + 3?",opts:["4","5","6","7"],ans:1,diff:1,topic:"Addition"},
      {id:2,q:"What is 4 × 3?",opts:["10","12","14","16"],ans:1,diff:1,topic:"Multiplication"},
      {id:3,q:"What is 1/2 + 1/4?",opts:["1/6","2/6","3/4","1/4"],ans:2,diff:2,topic:"Fractions"},
      {id:4,q:"What is 15 ÷ 3?",opts:["3","4","5","6"],ans:2,diff:2,topic:"Division"},
      {id:5,q:"If a pizza has 8 slices and you eat 3/8, how many slices did you eat?",opts:["2","3","4","5"],ans:1,diff:3,topic:"Fractions"},
      {id:6,q:"What is 7 × 8?",opts:["54","56","58","64"],ans:1,diff:2,topic:"Multiplication"},
      {id:7,q:"Which fraction is largest: 1/2, 1/3, or 3/4?",opts:["1/2","1/3","3/4","They're equal"],ans:2,diff:3,topic:"Fractions"},
      {id:8,q:"What is 6 × 4?",opts:["20","22","24","26"],ans:2,diff:1,topic:"Multiplication"},
    ],
    Science: [
      {id:9,q:"Which planet is closest to the Sun?",opts:["Venus","Earth","Mercury","Mars"],ans:2,diff:1,topic:"Solar System"},
      {id:10,q:"What do plants need to make food?",opts:["Water only","Sunlight only","Sunlight, water & CO2","Just soil"],ans:2,diff:2,topic:"Plants"},
      {id:11,q:"How many planets are in our solar system?",opts:["7","8","9","10"],ans:1,diff:1,topic:"Solar System"},
      {id:12,q:"Which gas do plants release during photosynthesis?",opts:["Carbon dioxide","Nitrogen","Oxygen","Hydrogen"],ans:2,diff:3,topic:"Plants"},
      {id:13,q:"What is the largest planet in our solar system?",opts:["Saturn","Neptune","Jupiter","Uranus"],ans:2,diff:2,topic:"Solar System"},
    ],
  },
  "K-1": {
    Math: [
      {id:14,q:"How many legs does a dog have?",opts:["2","4","6","8"],ans:1,diff:1,topic:"Counting"},
      {id:15,q:"What comes after 9?",opts:["7","8","11","10"],ans:3,diff:1,topic:"Counting"},
      {id:16,q:"Which shape has 3 sides?",opts:["Square","Circle","Triangle","Rectangle"],ans:2,diff:1,topic:"Shapes"},
      {id:17,q:"How many fingers are on 2 hands?",opts:["8","9","10","12"],ans:2,diff:1,topic:"Counting"},
      {id:18,q:"What is 3 + 4?",opts:["6","7","8","9"],ans:1,diff:2,topic:"Addition"},
      {id:19,q:"Which is bigger: 8 or 5?",opts:["5","8","They're equal","Can't tell"],ans:1,diff:1,topic:"Numbers"},
    ],
    Science: [
      {id:20,q:"What do fish breathe with?",opts:["Lungs","Gills","Skin","Nose"],ans:1,diff:2,topic:"Animals"},
      {id:21,q:"What does the sun give us?",opts:["Rain","Light & warmth","Wind","Snow"],ans:1,diff:1,topic:"Weather"},
      {id:22,q:"Where do polar bears live?",opts:["Desert","Rainforest","Arctic","Ocean"],ans:2,diff:2,topic:"Animals"},
    ],
  },
  "4-5": {
    Math: [
      {id:23,q:"What is 25% of 80?",opts:["15","20","25","30"],ans:1,diff:2,topic:"Percentages"},
      {id:24,q:"What is 144 ÷ 12?",opts:["11","12","13","14"],ans:1,diff:2,topic:"Division"},
      {id:25,q:"What is 0.75 as a fraction?",opts:["1/4","1/2","3/4","2/3"],ans:2,diff:3,topic:"Decimals"},
      {id:26,q:"What is 15% of 200?",opts:["25","30","35","40"],ans:1,diff:3,topic:"Percentages"},
      {id:27,q:"What is 8²?",opts:["16","48","64","56"],ans:2,diff:3,topic:"Exponents"},
      {id:28,q:"What is 9 × 7?",opts:["54","56","63","72"],ans:2,diff:1,topic:"Multiplication"},
    ],
    Science: [
      {id:29,q:"Which force pulls objects toward Earth?",opts:["Friction","Gravity","Magnetism","Tension"],ans:1,diff:1,topic:"Forces"},
      {id:30,q:"What type of energy does the Sun produce?",opts:["Chemical","Nuclear","Electrical","Mechanical"],ans:1,diff:3,topic:"Energy"},
      {id:31,q:"How many bones are in the adult human body?",opts:["186","206","226","246"],ans:1,diff:3,topic:"Human Body"},
      {id:32,q:"What is the process of water turning into vapor called?",opts:["Condensation","Precipitation","Evaporation","Filtration"],ans:2,diff:2,topic:"Water Cycle"},
    ],
  },
};

// ─── TEACHER DATA ─────────────────────────────────────────────────
const CLASSES = [
  { id:"c1", name:"Ms. Johnson's 3rd Grade", grade:"2-3", students:[
    {id:"s1",name:"Alex",avatar:"🧒",xp:1840,streak:9,rank:23,mathScore:87,sciScore:72,lastActive:"Today",adaptLevel:2},
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

// ─── MOCK PROFILES ────────────────────────────────────────────────
const PROFILES = [
  {id:"s1",name:"Alex",avatar:"🧒",grade:"2-3",gradeLabel:"3rd Grade",coins:420,xp:1840,streak:9,rank:23,
   adaptLevel:2,adaptHistory:[1,1,2,2,2,3],completedTopics:["Fractions Fun","Multiplication Basics"],
   badges:["Math Wizard","Speed Demon","Star Gazer"]},
  {id:"s2",name:"Mia",avatar:"👧",grade:"K-1",gradeLabel:"1st Grade",coins:210,xp:980,streak:5,rank:41,
   adaptLevel:1,adaptHistory:[1,1,1,1,2],completedTopics:["Counting to 20"],badges:["Star Gazer"]},
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

// ─── SHARED UI ────────────────────────────────────────────────────
function PBar({v,c,h=6}){return <div style={{background:"rgba(248,250,252,0.12)",borderRadius:99,height:h,overflow:"hidden"}}><div style={{width:`${Math.min(v,100)}%`,background:c,height:"100%",borderRadius:99,transition:"width 0.8s ease"}}/></div>}
function Pill({ch,c,bg,onClick,style={}}){return <span onClick={onClick} style={{background:bg||`${c}22`,color:c||C.text,borderRadius:99,padding:"3px 10px",fontSize:10,fontWeight:800,fontFamily:fn,display:"inline-block",cursor:onClick?"pointer":"default",...style}}>{ch}</span>}
function Btn({ch,onClick,grad,style={},sm,disabled}){return <button onClick={disabled?undefined:onClick} style={{background:disabled?"#1a1a2e":grad||`linear-gradient(135deg,${C.purple},${C.purpleBright})`,border:"none",borderRadius:12,padding:sm?"8px 14px":"13px 20px",color:disabled?"rgba(248,250,252,0.45)":"white",fontWeight:800,fontSize:sm?11:14,fontFamily:ff,cursor:disabled?"not-allowed":"pointer",display:"block",opacity:disabled?0.5:1,...style}}>{ch}</button>}
function Card({children,style={},glow,onClick}){return <div onClick={onClick} style={{background:C.card,borderRadius:18,padding:16,border:`1px solid ${glow?glow+"44":C.border}`,cursor:onClick?"pointer":"default",...style}}>{children}</div>}
function STitle({ch,sub}){return <div style={{marginBottom:sub?10:12}}><div style={{color:C.text,fontSize:16,fontWeight:800,fontFamily:ff}}>{ch}</div>{sub&&<div style={{color:"rgba(248,250,252,0.82)",fontSize:12,fontFamily:fn,marginTop:2}}>{sub}</div>}</div>}
function Bg(){
  const s=Array.from({length:45},(_,i)=>({id:i,top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,sz:`${Math.random()*2+1}px`,op:Math.random()*0.5+0.12}));
  return <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>{s.map(x=><div key={x.id} style={{position:"absolute",top:x.top,left:x.left,width:x.sz,height:x.sz,borderRadius:"50%",background:"white",opacity:x.op}}/>)}</div>;
}
function Badge({level}){
  const map={1:{label:"Beginner",color:C.teal,icon:"🌱"},2:{label:"Intermediate",color:C.blue,icon:"⚡"},3:{label:"Advanced",color:C.gold,icon:"🔥"}};
  const b=map[level]||map[1];
  return <span style={{background:`${b.color}22`,color:b.color,borderRadius:99,padding:"3px 10px",fontSize:10,fontWeight:800,fontFamily:fn}}>{b.icon} {b.label}</span>;
}

// ─── COPPA CONSENT SCREEN ─────────────────────────────────────────
function CoppaScreen({onAccept}){
  const [step,setStep]=useState("splash"); // splash|age|parent|privacy|done
  const [age,setAge]=useState("");
  const [checks,setChecks]=useState({data:false,noSell:false,delete:false,review:false});
  const [parentEmail,setParentEmail]=useState("");
  const allChecked=Object.values(checks).every(Boolean);

  if(step==="splash") return(
    <div style={{padding:"30px 20px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100%"}}>
      <div style={{width:80,height:80,borderRadius:24,background:`linear-gradient(135deg,${C.green},${C.teal})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,marginBottom:16,boxShadow:`0 0 40px ${C.green}44`}}>🛡️</div>
      <div style={{color:C.text,fontSize:24,fontWeight:800,fontFamily:ff,marginBottom:8}}>Your Privacy is Protected</div>
      <div style={{color:C.muted,fontSize:13,fontFamily:fn,lineHeight:1.6,marginBottom:28,maxWidth:280}}>MathSci Stars is fully COPPA compliant. We protect children's data with the highest standards. Let's take 60 seconds to set this up.</div>
      <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",marginBottom:24}}>
        {[["🔒","No ads, ever","We never show ads to children"],["🚫","We never sell data","Your child's data stays private"],["👨‍👩‍👧","Parent controls","You approve everything"],["🗑️","Delete anytime","Full data deletion on request"]].map(([icon,title,sub])=>(
          <div key={title} style={{background:C.card,borderRadius:14,padding:"12px 16px",display:"flex",gap:12,alignItems:"center",border:`1px solid ${C.border}`,textAlign:"left"}}>
            <div style={{fontSize:24,flexShrink:0}}>{icon}</div>
            <div><div style={{color:C.text,fontWeight:700,fontSize:13,fontFamily:fn}}>{title}</div><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>{sub}</div></div>
          </div>
        ))}
      </div>
      <Btn ch="Let's Set Up Privacy →" onClick={()=>setStep("age")} style={{width:"100%"}} grad={`linear-gradient(135deg,${C.green},${C.teal})`}/>
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
          <div key={a} onClick={()=>setAge(a)} style={{background:age===a?`linear-gradient(135deg,${C.purple},${C.cyan})`:C.card,borderRadius:14,padding:"16px 8px",textAlign:"center",cursor:"pointer",border:`1px solid ${age===a?C.purpleBright:C.border}`,color:C.text,fontWeight:800,fontSize:16,fontFamily:ff,transition:"all 0.2s"}}>
            {a}
          </div>
        ))}
      </div>
      {age&&parseInt(age)<13&&(
        <Card style={{marginBottom:16,background:`${C.gold}0f`,border:`1px solid ${C.gold}44`}}>
          <div style={{color:C.goldLight,fontWeight:700,fontSize:13,fontFamily:fn}}>👨‍👩‍👧 Since you're under 13, we need a parent or guardian to set up your account. This is required by COPPA law to protect kids like you!</div>
        </Card>
      )}
      <Btn ch={age&&parseInt(age)<13?"Get Parent to Continue →":"Continue →"} onClick={()=>age&&(parseInt(age)<13?setStep("parent"):setStep("privacy"))} disabled={!age} style={{width:"100%"}} grad={`linear-gradient(135deg,${C.purple},${C.cyan})`}/>
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
        <input value={parentEmail} onChange={e=>setParentEmail(e.target.value)} placeholder="parent@example.com" style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 16px",color:C.text,fontSize:14,fontFamily:fn,outline:"none",boxSizing:"border-box"}}/>
      </div>
      <Card style={{marginBottom:20,background:`${C.green}0a`,border:`1px solid ${C.green}33`}}>
        <div style={{color:C.green,fontSize:12,fontFamily:fn,lineHeight:1.6}}>
          <div style={{fontWeight:800,marginBottom:4}}>📧 We will email the parent to:</div>
          <div>• Verify they are the parent/guardian</div>
          <div>• Explain what data we collect</div>
          <div>• Give them full control of the account</div>
          <div>• Allow data deletion at any time</div>
        </div>
      </Card>
      <Btn ch="Send Verification Email →" onClick={()=>parentEmail.includes("@")&&setStep("privacy")} disabled={!parentEmail.includes("@")} style={{width:"100%"}} grad={`linear-gradient(135deg,${C.green},${C.teal})`}/>
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
          {key:"delete",title:"Right to Delete",desc:"You can request full deletion of all your child's data at any time by emailing privacy@mathscistars.com. We will delete within 30 days."},
          {key:"review",title:"Parental Review",desc:"Parents can review all data we have collected about their child at any time. We will provide a full data export within 5 business days."},
        ].map(item=>(
          <div key={item.key} onClick={()=>setChecks(c=>({...c,[item.key]:!c[item.key]}))} style={{background:checks[item.key]?`${C.green}0f`:C.card,borderRadius:16,padding:"14px 16px",cursor:"pointer",border:`1px solid ${checks[item.key]?C.green+"55":C.border}`,display:"flex",gap:14,alignItems:"flex-start",transition:"all 0.2s"}}>
            <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${checks[item.key]?C.green:"rgba(248,250,252,0.35)"}`,background:checks[item.key]?C.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2,fontSize:13,transition:"all 0.2s"}}>
              {checks[item.key]&&"✓"}
            </div>
            <div>
              <div style={{color:C.text,fontWeight:700,fontSize:13,fontFamily:fn,marginBottom:3}}>{item.title}</div>
              <div style={{color:C.muted,fontSize:11,fontFamily:fn,lineHeight:1.5}}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <Btn ch={allChecked?"I Agree — Let's Start! 🚀":"Please accept all items above"} onClick={()=>allChecked&&setStep("done")} disabled={!allChecked} style={{width:"100%"}} grad={`linear-gradient(135deg,${C.green},${C.teal})`}/>
    </div>
  );

  if(step==="done") return(
    <div style={{padding:"40px 20px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100%"}}>
      <div style={{width:80,height:80,borderRadius:24,background:`linear-gradient(135deg,${C.green},${C.teal})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,marginBottom:16,boxShadow:`0 0 60px ${C.green}55`}}>✅</div>
      <div style={{color:C.text,fontSize:24,fontWeight:800,fontFamily:ff,marginBottom:8}}>All Set!</div>
      <div style={{color:C.muted,fontSize:13,fontFamily:fn,marginBottom:8,lineHeight:1.6}}>Your account is COPPA compliant and fully protected.</div>
      <div style={{background:`${C.green}11`,border:`1px solid ${C.green}33`,borderRadius:14,padding:"10px 20px",marginBottom:28}}>
        <div style={{color:C.green,fontSize:12,fontWeight:700,fontFamily:fn}}>🛡️ Privacy ID: #MSS-{Math.floor(Math.random()*90000+10000)}</div>
        <div style={{color:"rgba(16,185,129,0.6)",fontSize:10,fontFamily:fn,marginTop:2}}>Keep this for your records</div>
      </div>
      <Btn ch="Start Learning! 🌟" onClick={onAccept} style={{width:"100%"}} grad={`linear-gradient(135deg,${C.purple},${C.cyan})`}/>
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

  const bank=QUESTION_BANK[profile.grade]?.[subject]||[];
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
      <Card style={{marginBottom:16,background:`linear-gradient(135deg,${C.purple}11,${C.cyan}08)`}}>
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
            <div key={s} onClick={()=>setSubject(s)} style={{flex:1,padding:"12px",borderRadius:14,background:subject===s?`linear-gradient(135deg,${C.purple},${C.cyan})`:C.card,color:"white",fontWeight:800,fontSize:14,fontFamily:ff,textAlign:"center",cursor:"pointer",border:`1px solid ${subject===s?C.purpleBright:C.border}`}}>
              {s==="Math"?"🔢 Math":"🔬 Science"}
            </div>
          ))}
        </div>
      </div>
      <Card style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>Your current level</div><div style={{color:C.text,fontSize:16,fontWeight:800,fontFamily:ff,marginTop:2}}><Badge level={level}/></div></div>
          <div style={{textAlign:"right"}}><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>{totalQ} questions</div><div style={{color:C.goldLight,fontSize:13,fontWeight:800,fontFamily:fn,marginTop:2}}>+{totalQ*30} XP possible</div></div>
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
        <Card glow={C.gold} style={{marginBottom:14,background:`${C.gold}0a`}}>
          <div style={{color:C.goldLight,fontSize:26,fontWeight:800,fontFamily:ff}}>+{score*30} XP &nbsp; +{score*15} ⭐</div>
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
        <div style={{position:"absolute",top:70,left:"50%",transform:"translateX(-50%)",background:levelUp==="up"?`linear-gradient(135deg,${C.gold},${C.orange})`:`linear-gradient(135deg,${C.blue},${C.purple})`,borderRadius:14,padding:"10px 20px",color:"white",fontWeight:800,fontSize:13,fontFamily:ff,zIndex:50,whiteSpace:"nowrap",animation:"fadeIn 0.3s ease",boxShadow:"0 8px 30px rgba(0,0,0,0.5)"}}>
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
      <PBar v={((history.length)/totalQ)*100} c={`linear-gradient(90deg,${C.purple},${C.cyan})`} h={6}/>

      {/* Difficulty indicator */}
      <div style={{display:"flex",gap:4,justifyContent:"center",margin:"10px 0"}}>
        {[1,2,3].map(l=>(
          <div key={l} style={{width:28,height:6,borderRadius:3,background:l<=level?diffColor:C.dim,transition:"all 0.4s ease"}}/>
        ))}
      </div>

      <Card style={{margin:"10px 0 14px",textAlign:"center",padding:"22px 18px"}}>
        <div style={{color:"rgba(248,250,252,0.52)",fontSize:10,fontFamily:fn,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>{q.topic}</div>
        <div style={{color:C.text,fontSize:18,fontWeight:800,fontFamily:ff,lineHeight:1.4}}>{q.q}</div>
      </Card>

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {q.opts.map((opt,i)=>{
          let bg=C.card,border=`1px solid ${C.border}`;
          if(answered){
            if(i===q.answer){bg=`${C.green}22`;border=`1px solid ${C.green}`;}
            else if(i===selected&&i!==q.answer){bg=`${C.red}22`;border=`1px solid ${C.red}`;}
          } else if(selected===i){border=`1px solid ${C.purpleBright}`;}
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
        <div style={{position:"absolute",inset:0,background:C.bg,zIndex:30,overflowY:"auto",padding:"16px"}}>
          <div onClick={()=>setSelectedStudent(null)} style={{color:C.muted,fontSize:13,fontFamily:fn,marginBottom:16,cursor:"pointer"}}>← Back to Class</div>
          <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:20}}>
            <div style={{width:54,height:54,borderRadius:"50%",background:`linear-gradient(135deg,${C.purple},${C.pink})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{selectedStudent.avatar}</div>
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
            {[{s:"Math",p:selectedStudent.mathScore,c:C.orange},{s:"Science",p:selectedStudent.sciScore,c:C.cyan}].map(x=>(
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
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.85)",zIndex:20,display:"flex",alignItems:"flex-end"}}>
          <div style={{background:C.bg,borderRadius:"24px 24px 0 0",padding:24,width:"100%",border:`1px solid ${C.border}`}}>
            <div style={{color:C.text,fontSize:18,fontWeight:800,fontFamily:ff,marginBottom:16}}>New Assignment 📋</div>
            <div style={{marginBottom:12}}>
              <div style={{color:C.muted,fontSize:11,fontFamily:fn,marginBottom:6}}>Title</div>
              <input value={assignTitle} onChange={e=>setAssignTitle(e.target.value)} placeholder="e.g. Fractions Quiz" style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.text,fontSize:14,fontFamily:fn,outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{color:C.muted,fontSize:11,fontFamily:fn,marginBottom:6}}>Subject</div>
              <div style={{display:"flex",gap:8}}>
                {["Math","Science"].map(s=>(
                  <div key={s} onClick={()=>setAssignSubject(s)} style={{flex:1,padding:"10px",borderRadius:12,background:assignSubject===s?`linear-gradient(135deg,${C.purple},${C.cyan})`:C.card,color:"white",fontWeight:800,fontSize:13,fontFamily:ff,textAlign:"center",cursor:"pointer"}}>
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
          <div key={t} onClick={()=>setSub(t)} style={{flexShrink:0,padding:"8px 14px",borderRadius:12,background:sub===t?`linear-gradient(135deg,${C.teal},${C.green})`:C.card,color:"white",fontSize:11,fontWeight:700,fontFamily:fn,cursor:"pointer",border:`1px solid ${sub===t?C.teal:C.border}`}}>
            {icon} {t[0].toUpperCase()+t.slice(1)}
          </div>
        ))}
      </div>

      {sub==="dashboard"&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[
              {label:"Students",value:cls.students.length,icon:"👥",color:C.cyan},
              {label:"Active Today",value:activeToday,icon:"🟢",color:C.green},
              {label:"Avg XP",value:avgXP.toLocaleString(),icon:"⚡",color:C.gold},
              {label:"Need Help",value:struggling.length,icon:"⚠️",color:C.red},
            ].map(s=>(
              <Card key={s.label} glow={s.color} style={{textAlign:"center",background:`${s.color}08`}}>
                <div style={{fontSize:26,marginBottom:4}}>{s.icon}</div>
                <div style={{color:s.color,fontSize:24,fontWeight:800,fontFamily:ff}}>{s.value}</div>
                <div style={{color:"rgba(248,250,252,0.72)",fontSize:10,fontFamily:fn}}>{s.label}</div>
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
              {s:"Science",avg:Math.round(cls.students.reduce((a,st)=>a+st.sciScore,0)/cls.students.length),c:C.cyan}].map(x=>(
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
                <div style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${C.purple},${C.pink})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{s.avatar}</div>
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
                <Pill ch={a.subject} c={a.subject==="Math"?C.orange:C.cyan}/>
              </div>
              <div style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <div style={{color:C.muted,fontSize:11,fontFamily:fn}}>Completed: {a.completedBy}/{a.totalStudents}</div>
                  <div style={{color:C.green,fontSize:11,fontWeight:700,fontFamily:fn}}>Avg: {a.avgScore}%</div>
                </div>
                <PBar v={(a.completedBy/a.totalStudents)*100} c={C.green}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Pill ch="📊 View Results" c={C.purpleBright}/>
                <Pill ch="✏️ Edit" c={C.muted}/>
                <Pill ch="🗑️ Delete" c={C.red}/>
              </div>
            </Card>
          ))}
        </>
      )}

      {sub==="reports"&&(
        <>
          <Card glow={C.cyan} style={{marginBottom:14,background:`${C.cyan}08`}}>
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
              {standard:"NGSS.3-ESS2",desc:"Earth's systems",pct:61,c:C.cyan}].map(s=>(
              <div key={s.standard} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <div><div style={{color:C.text,fontSize:11,fontFamily:fn}}>{s.desc}</div><div style={{color:"rgba(248,250,252,0.52)",fontSize:9,fontFamily:fn}}>{s.standard}</div></div>
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
  const content=QUESTION_BANK[profile.grade];
  return(
    <div style={{padding:"0 16px 16px"}}>
      <div style={{padding:"18px 0 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{color:C.cyan,fontSize:12,fontFamily:fn,fontWeight:700}}>Good morning! 🌟</div>
          <div style={{color:C.text,fontSize:22,fontWeight:800,fontFamily:ff}}>{profile.name}'s World</div>
          <div style={{display:"flex",gap:6,marginTop:4}}>
            <Pill ch={profile.gradeLabel} c={C.purpleBright}/>
            <Badge level={profile.adaptLevel}/>
          </div>
        </div>
        <div style={{width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,${C.purple},${C.pink})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,border:`3px solid ${C.purpleBright}44`}}>{profile.avatar}</div>
      </div>

      {/* Coins */}
      <div onClick={()=>setTab("store")} style={{background:`linear-gradient(135deg,#2d1a00,#120d00)`,borderRadius:18,padding:"13px 16px",marginBottom:14,cursor:"pointer",border:`1px solid ${C.gold}44`,display:"flex",alignItems:"center",gap:12}}>
        <div style={{fontSize:30}}>⭐</div>
        <div style={{flex:1}}>
          <div style={{color:C.goldLight,fontSize:20,fontWeight:800,fontFamily:ff}}>{profile.coins} Star Coins</div>
          <div style={{color:"rgba(252,211,77,0.55)",fontSize:11,fontFamily:fn}}>Earn more → redeem real gifts!</div>
        </div>
        <div style={{background:`linear-gradient(135deg,${C.gold},${C.orange})`,borderRadius:10,padding:"7px 12px",color:"white",fontWeight:800,fontSize:12,fontFamily:ff}}>Shop →</div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
        {[{l:"XP",v:profile.xp.toLocaleString(),i:"⚡",c:C.cyan},{l:"Streak",v:`${profile.streak}🔥`,i:"🔥",c:C.orange},{l:"Rank",v:`#${profile.rank}`,i:"🏆",c:C.green}].map(s=>(
          <div key={s.l} style={{background:C.card,borderRadius:14,padding:"10px 6px",textAlign:"center",border:`1px solid ${C.border}`}}>
            <div style={{fontSize:16,marginBottom:2}}>{s.i}</div>
            <div style={{color:"white",fontWeight:800,fontSize:15,fontFamily:ff}}>{s.v}</div>
            <div style={{color:"rgba(248,250,252,0.52)",fontSize:10,fontFamily:fn}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Feature Grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {[
          {tab:"adaptive",icon:"🧠",title:"Adaptive Practice",sub:"AI adjusts to you!",c:C.purple,badge:"NEW ✨"},
          {tab:"compete",icon:"⚔️",title:"Weekly Quiz",sub:"Win 200 coins!",c:C.pink,badge:"2d left"},
          {tab:"duel",icon:"🤺",title:"Friend Duels",sub:"2 online now",c:C.cyan,badge:"LIVE"},
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
      {(QUESTION_BANK[profile.grade]?.Math||[]).slice(0,2).map((q,i)=>(
        <div key={q.id} style={{background:C.card,borderRadius:16,padding:13,display:"flex",alignItems:"center",gap:12,marginBottom:10,border:`1px solid ${C.border}`}}>
          <div style={{width:44,height:44,borderRadius:12,background:`${[C.orange,C.cyan][i]}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{["🔢","🔬"][i]}</div>
          <div style={{flex:1}}>
            <div style={{color:C.text,fontWeight:700,fontSize:13,fontFamily:fn}}>{q.topic}</div>
            <div style={{color:C.muted,fontSize:11,fontFamily:fn,marginBottom:5}}>Math · <Badge level={q.diff}/></div>
            <PBar v={[75,40][i]} c={[C.orange,C.cyan][i]}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── CURRICULUM DATA ──────────────────────────────────────────────
const CURRICULUM = {
  "K-1": {
    Math: [
      { id:"km1", title:"Counting to 20", emoji:"🔢", color:C.orange, standard:"CCSS.MATH.K.CC.A.1",
        xp:60, coins:30, progress:80, lessons:[
          { step:1, type:"explain", title:"Let's Count!", body:"Numbers help us count things around us. We start at 1 and go all the way to 20! Let's practice counting with stars ⭐", visual:"⭐⭐⭐⭐⭐\n⭐⭐⭐⭐⭐\n⭐⭐⭐⭐⭐\n⭐⭐⭐⭐⭐" },
          { step:2, type:"example", title:"Count the Apples", body:"🍎🍎🍎🍎🍎\nHow many apples? Count them one by one!\n1, 2, 3, 4, 5... there are 5 apples! 🎉" },
          { step:3, type:"tip", title:"Fun Trick!", body:"Use your fingers to help count. Each finger = 1 number. Two hands = 10 fingers!" },
        ]
      },
      { id:"km2", title:"Shapes Around Us", emoji:"🔷", color:C.blue, standard:"CCSS.MATH.K.G.A.1",
        xp:60, coins:30, progress:30, lessons:[
          { step:1, type:"explain", title:"What Are Shapes?", body:"Shapes are everywhere! A pizza is a circle 🍕, a book is a rectangle 📚, and a sandwich corner is a triangle 🔺", visual:"🔴 Circle\n🟦 Square\n🔺 Triangle\n▬ Rectangle" },
          { step:2, type:"example", title:"Count the Sides!", body:"Triangle = 3 sides\nSquare = 4 equal sides\nRectangle = 4 sides (2 long, 2 short)\nCircle = 0 sides — it's round!" },
          { step:3, type:"tip", title:"Look Around!", body:"Find shapes in your room right now! A door is a rectangle. A clock is a circle. A sandwich cut diagonally makes triangles!" },
        ]
      },
    ],
    Science: [
      { id:"ks1", title:"Animals & Habitats", emoji:"🦁", color:C.green, standard:"NGSS.K-ESS2-2",
        xp:60, coins:30, progress:50, lessons:[
          { step:1, type:"explain", title:"Where Do Animals Live?", body:"Animals live in places that give them food, water, and shelter. These places are called HABITATS 🌍", visual:"🌊 Ocean → 🐟 Fish\n🌲 Forest → 🐻 Bears\n🏜️ Desert → 🦎 Lizards\n❄️ Arctic → 🐧 Penguins" },
          { step:2, type:"example", title:"Match the Animal!", body:"🦁 Lions live in grasslands — they need space to run and hunt!\n🐠 Fish live in water — they breathe with gills, not lungs!\n🐦 Birds live in trees — their claws grip branches perfectly!" },
          { step:3, type:"tip", title:"Did You Know?", body:"A polar bear's fur is actually transparent (clear), not white! It just looks white because it reflects light ❄️" },
        ]
      },
    ],
  },
  "2-3": {
    Math: [
      { id:"mm1", title:"Fractions", emoji:"🍕", color:C.orange, standard:"CCSS.MATH.3.NF.A.1",
        xp:100, coins:50, progress:75, lessons:[
          { step:1, type:"explain", title:"What Is a Fraction?", body:"A fraction shows PART of a whole. When you split a pizza into 4 equal slices and eat 1 slice, you ate 1/4 of the pizza! 🍕\n\n• Top number = how many parts you have (numerator)\n• Bottom number = total equal parts (denominator)", visual:"🍕🍕🍕🍕\n↑ 4 total slices\n🍕 = 1/4 of the pizza" },
          { step:2, type:"example", title:"Real Life Fractions", body:"🍫 A chocolate bar broken into 8 pieces:\n— Eat 3 pieces = you ate 3/8\n— Left over = 5/8\n\n🥧 A pie cut into 6 slices:\n— You get 2 slices = 2/6 (same as 1/3!)" },
          { step:3, type:"tip", title:"Comparing Fractions Trick!", body:"Same bottom number? Bigger top = bigger fraction!\n1/4 vs 3/4 → 3/4 is bigger ✅\n\nSame top number? Smaller bottom = bigger fraction!\n1/3 vs 1/8 → 1/3 is bigger ✅ (fewer cuts = bigger pieces!)" },
        ]
      },
      { id:"mm2", title:"Multiplication", emoji:"✖️", color:C.purple, standard:"CCSS.MATH.3.OA.A.1",
        xp:100, coins:50, progress:60, lessons:[
          { step:1, type:"explain", title:"Multiplication = Repeated Adding", body:"Multiplication is a shortcut for adding the same number many times!\n\n3 × 4 means:\n4 + 4 + 4 = 12\n(add 4 three times)\n\nOr think of it as 3 groups of 4 objects!", visual:"🍎🍎🍎🍎  (group 1)\n🍎🍎🍎🍎  (group 2)\n🍎🍎🍎🍎  (group 3)\n= 12 apples total!" },
          { step:2, type:"example", title:"Times Tables Trick", body:"× 2 → always double it! (6×2 = 12)\n× 5 → ends in 0 or 5! (7×5 = 35)\n× 10 → just add a zero! (8×10 = 80)\n× 9 trick: fingers! Hold up 9 fingers, fold down the Nth finger, count left·right for the answer!" },
          { step:3, type:"tip", title:"Practice Makes Perfect!", body:"The best way to remember times tables is songs and patterns. 6×6=36, 7×7=49, 8×8=64 — try saying them like a rap! 🎤" },
        ]
      },
      { id:"mm3", title:"Division", emoji:"➗", color:C.cyan, standard:"CCSS.MATH.3.OA.A.2",
        xp:100, coins:50, progress:20, lessons:[
          { step:1, type:"explain", title:"Division = Fair Sharing", body:"Division means splitting things into equal groups!\n\n12 ÷ 3 = 4\nMeans: share 12 items between 3 people — each person gets 4!\n\nOr: how many groups of 3 fit into 12? → 4 groups!", visual:"🍬🍬🍬🍬  (Person 1)\n🍬🍬🍬🍬  (Person 2)\n🍬🍬🍬🍬  (Person 3)" },
          { step:2, type:"example", title:"Division Fact Families", body:"Multiplication and division are opposites!\n\n4 × 3 = 12 ↔ 12 ÷ 3 = 4\n4 × 3 = 12 ↔ 12 ÷ 4 = 3\n\nIf you know your times tables, you already know division! 🧠" },
          { step:3, type:"tip", title:"Remainders!", body:"Sometimes things don't divide evenly!\n\n13 ÷ 3 = 4 remainder 1\n(4 groups of 3, with 1 left over)\n\nThe leftover is called the REMAINDER 📦" },
        ]
      },
    ],
    Science: [
      { id:"ms1", title:"Solar System", emoji:"🪐", color:C.blue, standard:"NGSS.3-ESS1-1",
        xp:100, coins:50, progress:40, lessons:[
          { step:1, type:"explain", title:"Our Solar System", body:"Our solar system has 1 star (the Sun ☀️) and 8 planets orbiting around it. Everything is held in place by GRAVITY — an invisible pulling force.\n\nPlanets in order from the Sun:\n☿ Mercury — closest, hottest!\n♀ Venus\n🌍 Earth — that's us!\n♂ Mars — the red planet", visual:"☀️ → ☿ → ♀ → 🌍 → ♂\n→ ♃ → ♄ → ⛢ → ♆" },
          { step:2, type:"example", title:"Planet Facts!", body:"🌍 Earth: Only planet with liquid water oceans and life\n♄ Saturn: Has rings made of ice and rock!\n♃ Jupiter: Biggest planet — 1,300 Earths could fit inside!\n☿ Mercury: A day on Mercury = 59 Earth days!" },
          { step:3, type:"tip", title:"Memory Trick!", body:'Remember planet order with:\n"My Very Educated Mother Just Served Us Nachos"\n\nMercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune 🚀' },
        ]
      },
      { id:"ms2", title:"Plant Life Cycle", emoji:"🌱", color:C.green, standard:"NGSS.3-LS1-1",
        xp:100, coins:50, progress:20, lessons:[
          { step:1, type:"explain", title:"How Plants Grow", body:"All flowering plants follow the same life cycle:\n\n🌱 Seed → 🌿 Sprout → 🌳 Plant → 🌸 Flower → 🍎 Fruit → 🌱 New Seeds!\n\nEach stage needs: water 💧, sunlight ☀️, and soil 🌍", visual:"🌱→🌿→🌳→🌸→🍎→🌱" },
          { step:2, type:"example", title:"Photosynthesis!", body:"Plants make their own food through PHOTOSYNTHESIS:\n\n☀️ Sunlight + 💧 Water + 💨 CO₂\n↓\n🍬 Sugar (food for the plant!)\n+ 🌬️ Oxygen (the air we breathe!)\n\nPlants are basically tiny food factories!" },
          { step:3, type:"tip", title:"Did You Know?", body:"The biggest seed in the world is the Coco de Mer coconut — it can weigh up to 25 kg (55 lbs)! 🥥\n\nThe fastest growing plant is bamboo — it can grow 90 cm (3 feet) in ONE DAY! 🎋" },
        ]
      },
    ],
  },
  "4-5": {
    Math: [
      { id:"hm1", title:"Decimals & Percentages", emoji:"💯", color:C.gold, standard:"CCSS.MATH.5.NBT.A.3",
        xp:150, coins:75, progress:65, lessons:[
          { step:1, type:"explain", title:"Decimals Are Fractions!", body:"A decimal is just another way to write a fraction with 10, 100, or 1000 on the bottom!\n\n0.5 = 5/10 = 1/2\n0.25 = 25/100 = 1/4\n0.75 = 75/100 = 3/4\n\nThe dot (.) separates whole numbers from parts of a number.", visual:"1.0 = one whole\n0.5 = half\n0.25 = one quarter\n0.1 = one tenth" },
          { step:2, type:"example", title:"Percentages", body:"Percent means 'per hundred' — it's a fraction out of 100!\n\n50% = 50/100 = 0.5 = half\n25% = 25/100 = 0.25 = quarter\n10% of $80 → move decimal: $8.00\n25% of $80 → divide by 4: $20.00\n\nSale signs use % — now you can calculate discounts! 🛍️" },
          { step:3, type:"tip", title:"Quick % Tricks!", body:"10% → move decimal left 1 place\n20% → find 10%, then double it\n5% → find 10%, then halve it\n50% → divide by 2\n25% → divide by 4\n\nThese tricks work for any number! 🧮" },
        ]
      },
      { id:"hm2", title:"Long Division", emoji:"➗", color:C.pink, standard:"CCSS.MATH.5.NBT.B.6",
        xp:150, coins:75, progress:85, lessons:[
          { step:1, type:"explain", title:"Long Division Steps", body:"Long division breaks a big problem into smaller steps.\n\nDivide → Multiply → Subtract → Bring Down\n(remember: Dad, Mom, Sister, Brother!)\n\nExample: 156 ÷ 4\n1. How many 4s fit in 15? → 3 (3×4=12)\n2. 15 - 12 = 3, bring down 6 → 36\n3. How many 4s fit in 36? → 9\n4. Answer: 39!", visual:"  39\n4)156\n -12↓\n  36\n  -36\n   0" },
          { step:2, type:"example", title:"Real World Division", body:"You have 245 stickers to share equally among 5 friends.\n\n245 ÷ 5 = ?\n\n5 into 24 = 4 (remainder 4)\nBring down 5 → 45\n5 into 45 = 9\n\nAnswer: 49 stickers each! 🎉" },
          { step:3, type:"tip", title:"Check Your Work!", body:"After dividing, always CHECK by multiplying your answer by the divisor!\n\n39 × 4 = 156 ✅ Correct!\n\nIf there's a remainder, add it too:\n(39 × 4) + 0 = 156 ✅" },
        ]
      },
    ],
    Science: [
      { id:"hs1", title:"Force & Motion", emoji:"⚡", color:C.cyan, standard:"NGSS.3-PS2-1",
        xp:150, coins:75, progress:45, lessons:[
          { step:1, type:"explain", title:"What Is a Force?", body:"A FORCE is a push or pull on an object. Forces can:\n• Start things moving 🚀\n• Stop things moving 🛑\n• Change direction ↩️\n• Change shape 🫳\n\nAll forces have SIZE (how strong) and DIRECTION (which way).", visual:"→ Push force\n← Pull force\n↓ Gravity\n↑ Normal force" },
          { step:2, type:"example", title:"Newton's Laws (Simplified!)", body:"Law 1: Things stay still (or keep moving) unless a force acts on them. (A soccer ball doesn't move until you kick it!)\n\nLaw 2: Bigger force = bigger acceleration. A harder kick = faster ball! ⚽\n\nLaw 3: Every action has an equal and opposite reaction. Jump off a boat → boat moves backward! 🚤" },
          { step:3, type:"tip", title:"Friction!", body:"Friction is a force that SLOWS things down when surfaces rub together.\n\n🧊 Ice = very little friction (slippery!)\n🛤️ Rough road = lots of friction (car tires grip!)\n\nWithout friction, we couldn't walk — our feet would slide everywhere! 🦶" },
        ]
      },
      { id:"hs2", title:"Ecosystems", emoji:"🌍", color:C.green, standard:"NGSS.5-LS2-1",
        xp:150, coins:75, progress:30, lessons:[
          { step:1, type:"explain", title:"What Is an Ecosystem?", body:"An ECOSYSTEM is all the living things (plants, animals, bacteria) in an area plus the non-living things (water, air, soil, sunlight).\n\nEverything is connected! Change one thing and it affects everything else — this is called a FOOD WEB 🕸️", visual:"☀️ Sun\n↓\n🌿 Plants (producers)\n↓\n🐛 Insects (primary consumers)\n↓\n🐸 Frogs (secondary consumers)\n↓\n🦅 Eagles (apex predators)" },
          { step:2, type:"example", title:"Food Chains", body:"Energy flows from the sun through a food chain:\n\n☀️ → 🌾 Grass → 🐰 Rabbit → 🦊 Fox → 🦅 Eagle\n\nEach arrow means 'is eaten by'\nProducers make energy (plants)\nConsumers eat energy (animals)\nDecomposers recycle energy (fungi, bacteria) ♻️" },
          { step:3, type:"tip", title:"Keystone Species!", body:"Some animals are SO important that if they disappear, the whole ecosystem collapses — these are called KEYSTONE SPECIES.\n\nExample: Sea otters 🦦 eat sea urchins. Without otters → too many sea urchins → they eat all the kelp forests → fish have nowhere to live → the whole ocean ecosystem breaks down!" },
        ]
      },
    ],
  },
};

// ─── LEARN SCREEN ─────────────────────────────────────────────────
function LearnScreen({ profile, onAskStarBot }) {
  // ALL hooks at top level — fixes the React hooks-in-conditional bug
  const [subject, setSubject] = useState("Math");
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonStep, setLessonStep] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  // Audio narration state
  const [speaking, setSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const synthRef = useRef(window.speechSynthesis);

  const units = CURRICULUM[profile.grade]?.[subject] || [];
  const gradeQuestions = QUESTION_BANK[profile.grade]?.[subject] || [];

  const getLessonQuiz = (lesson) => {
    const relevant = gradeQuestions.filter(q => q.topic === lesson.title);
    const others = gradeQuestions.filter(q => q.topic !== lesson.title);
    return [...relevant, ...others].slice(0, 3);
  };

  // Stop speech when leaving lesson or changing step
  const stopSpeech = () => {
    if (synthRef.current) synthRef.current.cancel();
    setSpeaking(false);
  };

  // Narrate text using Web Speech API
  const narrate = (text) => {
    if (!audioEnabled || !synthRef.current) return;
    stopSpeech();
    // Strip emoji and special chars for cleaner speech
    const clean = text.replace(/[^\w\s.,!?'():+-]/g, " ").replace(/\s+/g, " ").trim();
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 0.88;
    utt.pitch = 1.1;
    utt.volume = 1;
    // Pick a friendly voice if available
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(v => v.name.includes("Samantha") || v.name.includes("Karen") || v.name.includes("Google US") || v.lang === "en-US");
    if (preferred) utt.voice = preferred;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    synthRef.current.speak(utt);
  };

  // Clean up speech on unmount
  useEffect(() => () => stopSpeech(), []);

  // Auto-narrate when step changes inside a lesson
  useEffect(() => {
    if (!activeLesson || quizMode) return;
    const step = activeLesson.lessons[lessonStep];
    if (step && audioEnabled) {
      const toSpeak = `${step.title}. ${step.body}`;
      narrate(toSpeak);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonStep, activeLesson, quizMode]);

  const openLesson = (unit) => {
    setActiveLesson(unit);
    setLessonStep(0);
    setQuizMode(false);
    setQuizDone(false);
    setQIdx(0);
    setSel(null);
    setAnswered(false);
    setScore(0);
  };

  const closeLesson = () => {
    stopSpeech();
    setActiveLesson(null);
    setLessonStep(0);
    setQuizMode(false);
    setQuizDone(false);
    setQIdx(0);
    setSel(null);
    setAnswered(false);
    setScore(0);
  };

  // ── Audio control bar ──
  const AudioBar = ({ stepText }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, borderRadius: 14, padding: "10px 14px", marginBottom: 12, border: `1px solid ${speaking ? C.purpleBright + "66" : C.border}` }}>
      <div style={{ display: "flex", gap: 3, alignItems: "center", flexShrink: 0 }}>
        {[1, 2, 3, 4].map(b => (
          <div key={b} style={{ width: 3, borderRadius: 99, background: speaking ? C.purpleBright : C.dim, height: speaking ? `${8 + b * 4}px` : "6px", transition: "height 0.15s ease", animationDelay: `${b * 0.1}s` }} />
        ))}
      </div>
      <div style={{ flex: 1, color: speaking ? C.purpleBright : C.muted, fontSize: 11, fontFamily: fn, fontWeight: speaking ? 700 : 400 }}>
        {speaking ? "🔊 Reading aloud..." : audioEnabled ? "🔇 Tap to hear this" : "🔇 Audio off"}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {audioEnabled && (
          <div onClick={() => speaking ? stopSpeech() : narrate(stepText)}
            style={{ background: speaking ? `${C.red}22` : `${C.purpleBright}22`, color: speaking ? C.red : C.purpleBright, borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 800, fontFamily: fn, cursor: "pointer" }}>
            {speaking ? "⏹ Stop" : "▶ Play"}
          </div>
        )}
        <div onClick={() => { setAudioEnabled(a => !a); stopSpeech(); }}
          style={{ background: audioEnabled ? `${C.green}22` : `${C.muted}22`, color: audioEnabled ? C.green : C.muted, borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 800, fontFamily: fn, cursor: "pointer" }}>
          {audioEnabled ? "ON" : "OFF"}
        </div>
      </div>
    </div>
  );

  // ── Quiz result screen ──
  if (activeLesson && quizDone) {
    const lessonQuiz = getLessonQuiz(activeLesson);
    return (
      <div style={{ padding: "30px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 70, marginBottom: 12 }}>{score === lessonQuiz.length ? "🏆" : score > 0 ? "⭐" : "💪"}</div>
        <div style={{ color: C.text, fontSize: 24, fontWeight: 800, fontFamily: ff, marginBottom: 6 }}>
          {score === lessonQuiz.length ? "Perfect!" : "Lesson Complete!"}
        </div>
        <div style={{ color: C.muted, fontSize: 13, fontFamily: fn, marginBottom: 20 }}>
          {score}/{lessonQuiz.length} quiz questions correct
        </div>
        <Card glow={C.gold} style={{ marginBottom: 14, background: `${C.gold}0a`, textAlign: "center" }}>
          <div style={{ color: C.goldLight, fontSize: 24, fontWeight: 800, fontFamily: ff }}>
            +{activeLesson.xp} XP &nbsp; +{activeLesson.coins} ⭐
          </div>
          <div style={{ color: C.muted, fontSize: 11, fontFamily: fn, marginTop: 4 }}>Lesson mastered!</div>
        </Card>
        <Btn ch="← Back to Lessons" onClick={closeLesson} style={{ width: "100%" }} />
      </div>
    );
  }

  // ── Quiz mode ──
  if (activeLesson && quizMode) {
    const lessonQuiz = getLessonQuiz(activeLesson);
    const q = lessonQuiz[qIdx];
    if (!q) { setQuizDone(true); return null; }
    return (
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div onClick={() => { stopSpeech(); setQuizMode(false); }} style={{ color: C.muted, fontSize: 12, fontFamily: fn, cursor: "pointer" }}>← Back to Lesson</div>
          <Pill ch={`Q ${qIdx + 1}/${lessonQuiz.length}`} c={C.cyan} />
        </div>
        <PBar v={(qIdx / lessonQuiz.length) * 100} c={C.purple} h={6} />
        <div style={{ background: `${activeLesson.color}11`, borderRadius: 16, padding: "6px 12px", margin: "10px 0 8px", display: "inline-block" }}>
          <div style={{ color: activeLesson.color, fontSize: 11, fontWeight: 800, fontFamily: fn }}>
            📝 {activeLesson.title} — Check Your Understanding
          </div>
        </div>
        <Card style={{ margin: "0 0 14px", textAlign: "center", padding: "20px 16px" }}>
          <div style={{ color: C.text, fontSize: 17, fontWeight: 800, fontFamily: ff, lineHeight: 1.4 }}>{q.q}</div>
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {q.opts.map((opt, i) => {
            let bg = C.card, border = `1px solid ${C.border}`;
            if (answered) {
              if (i === q.ans) { bg = `${C.green}22`; border = `1px solid ${C.green}`; }
              else if (i === sel && i !== q.ans) { bg = `${C.red}22`; border = `1px solid ${C.red}`; }
            }
            return (
              <div key={i}
                onClick={() => { if (!answered) { setSel(i); setAnswered(true); if (i === q.ans) setScore(s => s + 1); } }}
                style={{ background: bg, border, borderRadius: 12, padding: "12px 16px", color: C.text, fontWeight: 700, fontSize: 14, fontFamily: fn, cursor: answered ? "default" : "pointer", display: "flex", justifyContent: "space-between" }}>
                <span>{opt}</span>
                {answered && i === q.ans && <span>✅</span>}
                {answered && i === sel && i !== q.ans && <span>❌</span>}
              </div>
            );
          })}
        </div>
        {answered && (
          <Btn
            ch={qIdx + 1 >= lessonQuiz.length ? "See Results 🎉" : "Next →"}
            onClick={() => {
              if (qIdx + 1 >= lessonQuiz.length) { setQuizDone(true); }
              else { setQIdx(x => x + 1); setSel(null); setAnswered(false); }
            }}
            style={{ width: "100%", marginTop: 12 }}
          />
        )}
      </div>
    );
  }

  // ── Active lesson content ──
  if (activeLesson) {
    const steps = activeLesson.lessons;
    const currentStep = steps[lessonStep];
    const typeConfig = {
      explain: { icon: "📖", color: C.cyan, label: "Learn" },
      example: { icon: "💡", color: C.gold, label: "Example" },
      tip:     { icon: "🌟", color: C.green, label: "Pro Tip" },
    };
    const tc = typeConfig[currentStep.type] || typeConfig.explain;
    const narrationText = `${currentStep.title}. ${currentStep.body}`;

    return (
      <div style={{ padding: "0 16px 16px" }}>
        {/* Header */}
        <div style={{ padding: "14px 0 10px", display: "flex", alignItems: "center", gap: 10 }}>
          <div onClick={closeLesson}
            style={{ width: 34, height: 34, borderRadius: 10, background: C.card, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer", border: `1px solid ${C.border}` }}>←</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: C.text, fontWeight: 800, fontSize: 15, fontFamily: ff }}>{activeLesson.title}</div>
            <div style={{ color: C.muted, fontSize: 11, fontFamily: fn }}>{subject} · {activeLesson.standard}</div>
          </div>
          <div style={{ fontSize: 28 }}>{activeLesson.emoji}</div>
        </div>

        {/* Step progress dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 5, borderRadius: 99, background: i <= lessonStep ? activeLesson.color : C.dim, transition: "background 0.3s" }} />
          ))}
        </div>

        {/* Audio narration bar */}
        <AudioBar stepText={narrationText} />

        {/* Step type badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ background: `${tc.color}22`, color: tc.color, borderRadius: 10, padding: "5px 12px", fontSize: 11, fontWeight: 800, fontFamily: fn }}>
            {tc.icon} {tc.label}
          </div>
          <div style={{ color: C.dim, fontSize: 11, fontFamily: fn }}>Step {lessonStep + 1} of {steps.length}</div>
        </div>

        {/* Content card */}
        <Card glow={tc.color} style={{ marginBottom: 12, background: `${tc.color}08` }}>
          <div style={{ color: tc.color, fontWeight: 800, fontSize: 16, fontFamily: ff, marginBottom: 10 }}>{currentStep.title}</div>
          <div style={{ color: C.text, fontSize: 13, fontFamily: fn, lineHeight: 1.8, whiteSpace: "pre-line" }}>{currentStep.body}</div>
        </Card>

        {/* Visual block */}
        {currentStep.visual && (
          <div style={{ background: "#080B14", borderRadius: 14, padding: "14px 16px", marginBottom: 14, border: `1px solid ${tc.color}33`, fontFamily: "'Courier New', monospace", fontSize: 13, color: tc.color, lineHeight: 1.9, whiteSpace: "pre-line" }}>
            {currentStep.visual}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", gap: 10 }}>
          {lessonStep > 0 && (
            <Btn ch="← Prev" onClick={() => setLessonStep(s => s - 1)} grad="linear-gradient(135deg,#1a1a2e,#2a2a4e)" style={{ flex: 1 }} />
          )}
          {lessonStep < steps.length - 1 ? (
            <Btn ch="Next Step →" onClick={() => setLessonStep(s => s + 1)} style={{ flex: 1 }} />
          ) : (
            <Btn ch="📝 Take Quiz!" onClick={() => { stopSpeech(); setQuizMode(true); }} grad={`linear-gradient(135deg,${C.gold},${C.orange})`} style={{ flex: 1 }} />
          )}
        </div>

        {/* Ask StarBot contextual button */}
        <div onClick={() => onAskStarBot && onAskStarBot({ subject, topic: activeLesson.title, emoji: activeLesson.emoji })}
          style={{ display: "flex", alignItems: "center", gap: 10, background: `linear-gradient(135deg,${C.purple}22,${C.cyan}11)`, border: `1px solid ${C.purple}44`, borderRadius: 14, padding: "12px 16px", marginTop: 12, cursor: "pointer" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${C.purple},${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: C.text, fontWeight: 800, fontSize: 13, fontFamily: ff }}>Ask StarBot about this! ✨</div>
            <div style={{ color: C.muted, fontSize: 11, fontFamily: fn }}>Still confused? I'll explain it a different way!</div>
          </div>
          <div style={{ color: C.purpleLight, fontSize: 18 }}>›</div>
        </div>

        <div style={{ textAlign: "center", marginTop: 12, color: C.muted, fontSize: 11, fontFamily: fn }}>
          Complete to earn <span style={{ color: C.goldLight, fontWeight: 800 }}>+{activeLesson.xp} XP</span> and <span style={{ color: C.goldLight, fontWeight: 800 }}>+{activeLesson.coins} ⭐</span>
        </div>
      </div>
    );
  }

  // ── Lesson list ──
  return (
    <div style={{ padding: "0 16px 16px" }}>
      <div style={{ padding: "18px 0 6px" }}>
        <STitle ch="My Curriculum 📚" sub={`${profile.gradeLabel} · Tap a lesson to start`} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["Math", "Science"].map(s => (
          <div key={s} onClick={() => setSubject(s)}
            style={{ flex: 1, padding: "11px", borderRadius: 14, background: subject === s ? `linear-gradient(135deg,${s === "Math" ? C.orange : C.cyan},${s === "Math" ? C.gold : C.teal})` : C.card, color: "white", fontWeight: 800, fontSize: 14, fontFamily: ff, textAlign: "center", cursor: "pointer", border: `1px solid ${subject === s ? "transparent" : C.border}` }}>
            {s === "Math" ? "🔢 Math" : "🔬 Science"}
          </div>
        ))}
      </div>

      <Card style={{ marginBottom: 16, background: subject === "Math" ? `${C.orange}08` : `${C.cyan}08`, border: `1px solid ${subject === "Math" ? C.orange : C.cyan}33` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ color: C.text, fontWeight: 800, fontSize: 13, fontFamily: ff }}>{subject} Progress</div>
          <div style={{ color: subject === "Math" ? C.orange : C.cyan, fontWeight: 800, fontSize: 13, fontFamily: fn }}>
            {Math.round(units.reduce((a, u) => a + u.progress, 0) / (units.length || 1))}% overall
          </div>
        </div>
        <PBar v={Math.round(units.reduce((a, u) => a + u.progress, 0) / (units.length || 1))} c={subject === "Math" ? C.orange : C.cyan} h={8} />
        <div style={{ color: C.muted, fontSize: 11, fontFamily: fn, marginTop: 6 }}>
          {units.filter(u => u.progress === 100).length}/{units.length} units complete · {units.reduce((a, u) => a + u.xp, 0)} XP available
        </div>
      </Card>

      {units.map((unit, idx) => {
        const isLocked = idx > 0 && units[idx - 1].progress < 50;
        return (
          <div key={unit.id} onClick={() => !isLocked && openLesson(unit)}
            style={{ background: C.card, borderRadius: 20, padding: 16, marginBottom: 12, border: `1px solid ${isLocked ? C.border : unit.color + "44"}`, opacity: isLocked ? 0.5 : 1, cursor: isLocked ? "not-allowed" : "pointer" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${unit.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0, border: `2px solid ${unit.color}44`, position: "relative" }}>
                {unit.emoji}
                {isLocked && <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔒</div>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
                  <div style={{ color: C.text, fontWeight: 800, fontSize: 15, fontFamily: ff }}>{unit.title}</div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                    <Pill ch={`+${unit.xp} XP`} c={unit.color} />
                    <Pill ch={`+${unit.coins} ⭐`} c={C.goldLight} />
                  </div>
                </div>
                <div style={{ color: C.dim, fontSize: 10, fontFamily: fn, marginBottom: 7 }}>{unit.standard}</div>
                <PBar v={unit.progress} c={unit.color} h={5} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, alignItems: "center" }}>
                  <div style={{ color: C.muted, fontSize: 11, fontFamily: fn }}>{unit.progress}% complete</div>
                  {isLocked
                    ? <Pill ch="🔒 Complete previous first" c={C.muted} />
                    : <div style={{ color: unit.color, fontSize: 11, fontWeight: 700, fontFamily: fn }}>{unit.progress > 0 ? "Continue →" : "Start →"}</div>}
                </div>
              </div>
            </div>
            {!isLocked && (
              <div style={{ display: "flex", gap: 6, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                {unit.lessons.map((ls, i) => (
                  <div key={i} style={{ flex: 1, background: i < Math.ceil(unit.progress / (100 / unit.lessons.length)) ? `${unit.color}33` : C.dim, borderRadius: 6, padding: "5px 4px", textAlign: "center" }}>
                    <div style={{ fontSize: 12 }}>{{ explain: "📖", example: "💡", tip: "🌟" }[ls.type]}</div>
                    <div style={{ color: C.muted, fontSize: 8, fontFamily: fn, marginTop: 1 }}>{ls.title.split(" ").slice(0, 2).join(" ")}</div>
                  </div>
                ))}
                <div style={{ flex: 1, background: unit.progress >= 90 ? `${C.gold}33` : C.dim, borderRadius: 6, padding: "5px 4px", textAlign: "center" }}>
                  <div style={{ fontSize: 12 }}>📝</div>
                  <div style={{ color: C.muted, fontSize: 8, fontFamily: fn, marginTop: 1 }}>Quiz</div>
                </div>
                <div onClick={e => { e.stopPropagation(); onAskStarBot && onAskStarBot({ subject, topic: unit.title, emoji: unit.emoji }); }}
                  style={{ flex: 1, background: `${C.purple}22`, borderRadius: 6, padding: "5px 4px", textAlign: "center", border: `1px solid ${C.purple}33`, cursor: "pointer" }}>
                  <div style={{ fontSize: 12 }}>🤖</div>
                  <div style={{ color: C.purpleLight, fontSize: 8, fontFamily: fn, marginTop: 1 }}>Ask AI</div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── COMPETE SCREEN (simple) ──────────────────────────────────────
function CompeteScreen({profile}){
  const [started,setStarted]=useState(false);
  const qs=QUESTION_BANK[profile.grade]?.Math||[];
  const [qIdx,setQIdx]=useState(0);
  const [sel,setSel]=useState(null);
  const [ans,setAns]=useState(false);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const total=3;
  const q=qs[qIdx%qs.length];

  if(!started) return(
    <div style={{padding:"0 16px"}}>
      <div style={{padding:"18px 0 10px"}}><STitle ch="Weekly Competition ⚔️" sub={`${profile.gradeLabel} challenge · Win 200 coins!`}/></div>
      <Card glow={C.purple} style={{marginBottom:14,background:`${C.purple}08`}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {[["⏰","Ends in","2d 14h"],["👥","Students","1,247"],["❓","Questions","3"],["🏆","Prize","200 coins"]].map(([i,l,v])=>(
            <div key={l} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"10px"}}>
              <div style={{color:C.muted,fontSize:10,fontFamily:fn}}>{i} {l}</div>
              <div style={{color:C.text,fontWeight:800,fontSize:14,fontFamily:fn}}>{v}</div>
            </div>
          ))}
        </div>
        <Btn ch="Start Quiz! 🚀" onClick={()=>setStarted(true)} style={{width:"100%"}}/>
      </Card>
      <STitle ch="Leaderboard 🌟"/>
      {[{n:"Zara M.",p:2840,b:"🥇",s:12},{n:"Leo K.",p:2650,b:"🥈",s:9},{n:profile.name,p:profile.xp,b:"⭐",s:profile.streak,me:true},{n:"Nia T.",p:2200,b:"🥉",s:7}].map(s=>(
        <div key={s.n} style={{background:s.me?`${C.purple}22`:C.card,borderRadius:14,padding:"12px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:12,border:s.me?`1px solid ${C.purple}55`:`1px solid ${C.border}`}}>
          <div style={{fontSize:20}}>{s.b}</div>
          <div style={{flex:1}}><div style={{color:C.text,fontWeight:700,fontSize:13,fontFamily:fn}}>{s.n}{s.me&&<span style={{color:C.cyan}}> (You)</span>}</div><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>🔥{s.s}</div></div>
          <div style={{color:C.goldLight,fontWeight:800,fontSize:13,fontFamily:ff}}>{s.p.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );

  if(done) return(
    <div style={{padding:"40px 16px",textAlign:"center"}}>
      <div style={{fontSize:70,marginBottom:12}}>{score===total?"🏆":score>=2?"🌟":"💪"}</div>
      <div style={{color:C.text,fontSize:26,fontWeight:800,fontFamily:ff,marginBottom:20}}>{score}/{total} Correct!</div>
      <Card glow={C.gold} style={{marginBottom:20,background:`${C.gold}0a`}}>
        <div style={{color:C.goldLight,fontSize:24,fontWeight:800,fontFamily:ff}}>+{score*50} XP &nbsp; +{score*20} ⭐</div>
      </Card>
      <Btn ch="Done" onClick={()=>{setStarted(false);setDone(false);setQIdx(0);setSel(null);setAns(false);setScore(0);}} style={{width:"100%"}}/>
    </div>
  );

  return(
    <div style={{padding:"20px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><Pill ch={`Q ${qIdx+1}/${total}`} c={C.muted}/><Pill ch={`⭐ ${score*20}`} c={C.goldLight}/></div>
      <PBar v={(qIdx/total)*100} c={C.purple} h={6}/>
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
      <div style={{color:C.goldLight,fontSize:28,fontWeight:800,fontFamily:ff,marginBottom:20}}>⭐ {conf.coins}</div>
      <Card style={{marginBottom:20}}><div style={{fontSize:24,marginBottom:6}}>👨‍👩‍👧</div><div style={{color:C.text,fontWeight:700,fontSize:13,fontFamily:fn}}>Needs parent approval before it's sent.</div></Card>
      <div style={{display:"flex",gap:10}}><Btn ch="Cancel" onClick={()=>setConf(null)} grad={`linear-gradient(135deg,${C.red},${C.pink})`} style={{flex:1}}/><Btn ch="Request! 🎁" onClick={()=>{onPurchase(conf);setConf(null);}} grad={`linear-gradient(135deg,${C.gold},${C.orange})`} style={{flex:1}}/></div>
    </div>
  );
  return(
    <div style={{padding:"0 16px 16px"}}>
      <div style={{padding:"18px 0 6px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <STitle ch="Reward Store 🛍️" sub="Spend your Star Coins!"/>
        <div style={{background:`${C.gold}22`,borderRadius:12,padding:"8px 12px",border:`1px solid ${C.gold}33`}}>
          <div style={{color:C.goldLight,fontWeight:800,fontSize:15,fontFamily:ff}}>⭐ {profile.coins}</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {STORE_ITEMS.map(r=>{
          const can=profile.coins>=r.coins,pend=pendingIds.includes(r.id);
          return(
            <div key={r.id} style={{background:C.card,borderRadius:16,padding:14,border:`1px solid ${pend?C.gold+"44":C.border}`}}>
              {r.badge&&<div style={{color:C.purpleBright,fontSize:9,fontWeight:800,fontFamily:fn,marginBottom:4}}>{r.badge}</div>}
              <div style={{fontSize:32,textAlign:"center",marginBottom:8}}>{r.emoji}</div>
              <div style={{color:C.text,fontWeight:700,fontSize:12,fontFamily:fn,textAlign:"center",marginBottom:5,lineHeight:1.3}}>{r.name}</div>
              <div style={{textAlign:"center",marginBottom:8}}><span style={{color:C.goldLight,fontWeight:800,fontSize:13,fontFamily:ff}}>⭐ {r.coins}</span></div>
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
        <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:60}}>{conf.emoji}</div><div style={{color:C.text,fontSize:18,fontWeight:800,fontFamily:ff,marginTop:8}}>{conf.name}</div><div style={{color:C.goldLight,fontSize:24,fontWeight:800,fontFamily:ff,marginTop:4}}>⭐ {conf.coins} coins</div><div style={{color:C.teal,fontSize:12,fontFamily:fn,marginTop:4}}>{conf.impact}</div></div>
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
  const qs=QUESTION_BANK[profile.grade]?.Math||[];
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
      <Card style={{marginBottom:14,background:`${C.purple}08`}}>
        {[["⚡","Same question, same time","Race to answer first!"],["🏆","Winner gets bonus coins","Loser still earns 40 coins"],["📈","Both learn together","Win or lose, you improve!"]].map(([i,t,s])=>(
          <div key={t} style={{display:"flex",gap:10,marginBottom:10}}><div style={{fontSize:18}}>{i}</div><div><div style={{color:C.text,fontWeight:700,fontSize:12,fontFamily:fn}}>{t}</div><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>{s}</div></div></div>
        ))}
      </Card>
      <STitle ch="Friends 🟢"/>
      {friends.map(f=>(
        <div key={f.id} style={{background:C.card,borderRadius:16,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12,border:`1px solid ${f.online?C.green+"33":C.border}`}}>
          <div style={{position:"relative"}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${C.purple},${C.pink})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{f.avatar}</div>
            <div style={{position:"absolute",bottom:0,right:0,width:10,height:10,borderRadius:"50%",background:f.online?C.green:"#555",border:`2px solid ${C.card}`}}/>
          </div>
          <div style={{flex:1}}><div style={{color:C.text,fontWeight:700,fontSize:13,fontFamily:fn}}>{f.name}</div><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>{f.online?"🟢 Online":"⚫ Offline"}</div></div>
          {f.online?<Btn ch="Challenge!" onClick={()=>{setOpp(f);setPhase("waiting");}} sm grad={`linear-gradient(135deg,${C.purple},${C.cyan})`}/>:<Pill ch="Offline" c={C.dim}/>}
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
      <Card glow={C.gold} style={{marginBottom:16,background:`${C.gold}0a`}}><div style={{color:C.goldLight,fontSize:24,fontWeight:800,fontFamily:ff}}>+{won?150:tied?80:40} ⭐ Coins!</div></Card>
      <Btn ch="Back to Friends" onClick={()=>{setPhase("lobby");setDone(false);setQIdx(0);setMyS(0);setOpS(0);setMySel(null);setOpSel(null);setRev(false);}} style={{width:"100%"}}/>
    </div>;
  }

  return <div style={{padding:"16px"}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center",marginBottom:14}}>
      <Card style={{textAlign:"center",background:`${C.purple}11`}}><div style={{fontSize:20}}>{profile.avatar}</div><div style={{color:C.text,fontWeight:800,fontSize:20,fontFamily:ff}}>{myS}</div><div style={{color:C.muted,fontSize:10,fontFamily:fn}}>You</div></Card>
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
          <div key={t} onClick={()=>setSub(t)} style={{flex:1,padding:"8px 4px",borderRadius:12,background:sub===t?`linear-gradient(135deg,${C.purple},${C.purpleBright})`:C.card,color:"white",fontSize:11,fontWeight:700,fontFamily:fn,cursor:"pointer",textAlign:"center",border:`1px solid ${sub===t?C.purpleBright:C.border}`,position:"relative"}}>
            {icon} {t[0].toUpperCase()+t.slice(1)}
            {t==="approvals"&&pend.length>0&&<div style={{position:"absolute",top:-4,right:-4,background:C.red,borderRadius:"50%",width:15,height:15,fontSize:9,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>{pend.length}</div>}
          </div>
        ))}
      </div>

      {sub==="overview"&&(
        <>
          <Card glow={C.purple} style={{marginBottom:12,background:`${C.purple}08`}}>
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
        <Card glow={C.gold} style={{textAlign:"center",background:`${C.gold}0a`}}>
          <div style={{color:C.muted,fontSize:11,fontFamily:fn,marginBottom:4}}>WALLET BALANCE</div>
          <div style={{color:C.goldLight,fontSize:36,fontWeight:800,fontFamily:ff}}>${wallet.toFixed(2)}</div>
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
      <div style={{fontSize:60,marginBottom:8}}>🌟</div>
      <div style={{color:C.text,fontSize:26,fontWeight:800,fontFamily:ff,marginBottom:2}}>MathSci Stars</div>
      <div style={{color:C.muted,fontSize:12,fontFamily:fn,marginBottom:6}}>Learning that rewards you!</div>
      <div style={{background:`${C.green}11`,border:`1px solid ${C.green}33`,borderRadius:10,padding:"6px 14px",display:"inline-block",marginBottom:28}}>
        <div style={{color:C.green,fontSize:11,fontWeight:700,fontFamily:fn}}>🛡️ COPPA Certified · No Ads · No Data Selling</div>
      </div>
      {[{l:"I'm a Student",s:"Learn, earn & compete!",i:"🎒",m:"student",g:`linear-gradient(135deg,${C.purple},${C.cyan})`},
        {l:"I'm a Parent",s:"Manage & approve rewards",i:"👨‍👩‍👧",m:"parent",g:`linear-gradient(135deg,${C.gold},${C.orange})`},
        {l:"I'm a Teacher",s:"Class tools, reports & more",i:"🏫",m:"teacher",g:`linear-gradient(135deg,${C.teal},${C.green})`},
      ].map(item=>(
        <div key={item.m} onClick={()=>item.m==="student"?setStep("profile"):onLogin({mode:item.m})} style={{background:C.card,borderRadius:18,padding:"14px 16px",marginBottom:10,cursor:"pointer",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12,textAlign:"left"}}>
          <div style={{width:46,height:46,borderRadius:13,background:item.g,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{item.i}</div>
          <div style={{flex:1}}><div style={{color:C.text,fontWeight:800,fontSize:14,fontFamily:ff}}>{item.l}</div><div style={{color:C.muted,fontSize:11,fontFamily:fn}}>{item.s}</div></div>
          <div style={{color:C.muted,fontSize:18}}>›</div>
        </div>
      ))}
    </div>
  ):(
    <div style={{padding:"20px"}}>
      <div onClick={()=>setStep("who")} style={{color:C.muted,fontSize:13,fontFamily:fn,marginBottom:16,cursor:"pointer"}}>← Back</div>
      <STitle ch="Who's Learning? 👋" sub="Pick your profile — content adjusts to your grade!"/>
      {PROFILES.map(p=>(
        <div key={p.id} onClick={()=>onLogin({mode:"student",profile:p})} style={{background:C.card,borderRadius:18,padding:16,marginBottom:12,cursor:"pointer",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${C.purple},${C.pink})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{p.avatar}</div>
          <div style={{flex:1}}>
            <div style={{color:C.text,fontWeight:800,fontSize:16,fontFamily:ff}}>{p.name}</div>
            <div style={{color:C.muted,fontSize:11,fontFamily:fn,marginBottom:5}}>{p.gradeLabel}</div>
            <div style={{display:"flex",gap:6}}><Pill ch={`⭐ ${p.coins}`} c={C.gold}/><Pill ch={`🔥 ${p.streak}d`} c={C.orange}/><Badge level={p.adaptLevel}/></div>
          </div>
          <div style={{color:C.muted,fontSize:20}}>›</div>
        </div>
      ))}
    </div>
  );
}

// ─── STARBOT AI TUTOR ────────────────────────────────────────────
const STARBOT_SYSTEM = (profile, context) => `You are StarBot, the friendly AI tutor for MathSci Stars, an educational app for elementary school students.

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

function StarBotChat({ profile, context, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hey ${profile.name}! 👋 I'm StarBot, your personal tutor! ${context ? `I see you're working on **${context.topic}** — awesome choice! 🌟` : "I'm here to help you learn anything! 🚀"} What would you like to know?`,
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
    <div style={{ position: "absolute", inset: 0, background: C.bg, zIndex: 60, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${C.purple},${C.cyan})`, padding: "14px 16px 12px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div onClick={onClose} style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>←</div>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "white", fontWeight: 800, fontSize: 16, fontFamily: ff }}>StarBot</div>
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
                  style={{ background: `${C.purple}22`, border: `1px solid ${C.purple}44`, borderRadius: 20, padding: "6px 12px", color: C.purpleLight, fontSize: 11, fontFamily: fn, cursor: "pointer", fontWeight: 600 }}>
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
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${C.purple},${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, marginBottom: 2 }}>🤖</div>
              )}
              <div style={{
                maxWidth: "78%",
                background: isBot ? C.card : `linear-gradient(135deg,${C.purple},${C.purpleBright})`,
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
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${C.pink},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, marginBottom: 2 }}>{profile.avatar}</div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${C.purple},${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🤖</div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: C.purpleBright, opacity: dots > j ? 1 : 0.25, transition: "opacity 0.2s" }} />
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
              style={{ flexShrink: 0, background: `${C.cyan}15`, border: `1px solid ${C.cyan}33`, borderRadius: 20, padding: "5px 11px", color: C.cyan, fontSize: 10, fontFamily: fn, cursor: "pointer", fontWeight: 700 }}>
              {s}
            </div>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{ padding: "10px 14px 16px", background: C.card, borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div style={{ flex: 1, background: C.bg, borderRadius: 20, border: `1px solid ${loading ? C.border : C.purpleBright + "66"}`, padding: "10px 16px", transition: "border 0.2s" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              placeholder="Ask StarBot anything... 🌟"
              style={{ width: "100%", background: "transparent", border: "none", color: C.text, fontSize: 13, fontFamily: fn, outline: "none" }}
            />
          </div>
          <div onClick={() => sendMessage(input)}
            style={{ width: 44, height: 44, borderRadius: "50%", background: input.trim() && !loading ? `linear-gradient(135deg,${C.purple},${C.cyan})` : C.dim, display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() && !loading ? "pointer" : "default", flexShrink: 0, transition: "background 0.2s", fontSize: 18 }}>
            {loading ? "⏳" : "➤"}
          </div>
        </div>
        <div style={{ color: C.dim, fontSize: 10, fontFamily: fn, textAlign: "center", marginTop: 7 }}>
          StarBot uses AI · Always review answers with a trusted adult 👨‍👩‍👧
        </div>
      </div>
    </div>
  );
}

// Floating StarBot button + context-aware trigger
function StarBotButton({ profile, context, onClick }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 600); }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div onClick={onClick} style={{
      position: "absolute", bottom: 80, right: 14, zIndex: 15,
      width: 52, height: 52, borderRadius: "50%",
      background: `linear-gradient(135deg,${C.purple},${C.cyan})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 24, cursor: "pointer",
      boxShadow: pulse ? `0 0 0 8px ${C.purple}44, 0 8px 24px ${C.purple}66` : `0 4px 20px ${C.purple}66`,
      transition: "box-shadow 0.4s ease",
    }}>
      🤖
      <div style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: C.green, border: `2px solid ${C.bg}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
  const [starBotOpen,setStarBotOpen]=useState(false);
  const [starBotContext,setStarBotContext]=useState(null);

  useEffect(()=>{
    const l=document.createElement("link");
    l.href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap";
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
          <Card key={t} glow={C.gold} style={{marginBottom:10,background:`${C.gold}0a`,textAlign:"left"}}>
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
    learn:session?.profile&&<LearnScreen profile={session.profile} onAskStarBot={(ctx)=>{setStarBotContext(ctx);setStarBotOpen(true);}}/>,
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
      <div style={{width:200,background:C.card,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",height:"100%",flexShrink:0}}>
        {/* Logo */}
        <div style={{padding:"22px 20px 16px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${C.purple},${C.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🌟</div>
            <div>
              <div style={{color:C.text,fontWeight:800,fontSize:15,fontFamily:ff,lineHeight:1}}>MathSci</div>
              <div style={{color:C.labelPurple,fontSize:11,fontFamily:fn,fontWeight:700}}>Stars</div>
            </div>
          </div>
          {session?.profile&&(
            <div style={{marginTop:14,background:`${C.purple}18`,borderRadius:12,padding:"10px 12px",display:"flex",gap:8,alignItems:"center"}}>
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
              }} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:12,background:active?`linear-gradient(135deg,${C.purple}33,${C.cyan}11)`:"transparent",border:active?`1px solid ${C.purple}44`:"1px solid transparent",marginBottom:4,cursor:"pointer",transition:"all 0.15s"}}>
                <div style={{fontSize:18,width:24,textAlign:"center"}}>{item.i}</div>
                <div style={{color:active?C.purpleLight:"rgba(248,250,252,0.72)",fontWeight:active?800:600,fontSize:13,fontFamily:fn}}>{item.l}</div>
                {active&&<div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:C.purpleBright}}/>}
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
            <div style={{background:`${C.gold}15`,borderRadius:12,padding:"10px 12px",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
              <div style={{fontSize:18}}>⭐</div>
              <div>
                <div style={{color:C.labelGold,fontWeight:800,fontSize:14,fontFamily:ff}}>{session.profile.coins}</div>
                <div style={{color:C.muted,fontSize:10,fontFamily:fn}}>Star Coins</div>
              </div>
            </div>
            <div onClick={()=>setSession(null)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:10,cursor:"pointer"}}>
              <div style={{fontSize:16}}>🔓</div>
              <div style={{color:"rgba(248,250,252,0.52)",fontSize:12,fontFamily:fn}}>Sign out</div>
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
                <div style={{color:active?C.purpleLight:C.dim,fontSize:9,fontWeight:active?800:600,fontFamily:fn}}>{t.l}</div>
                {active&&<div style={{width:16,height:3,background:`linear-gradient(90deg,${C.purple},${C.cyan})`,borderRadius:99}}/>}
              </div>
            );
          })
        : <>
            <div onClick={()=>setTab(session?.mode==="teacher"?"teacher":"parent")} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"3px 14px"}}>
              <div style={{fontSize:20}}>{session?.mode==="teacher"?"🏫":"📊"}</div>
              <div style={{color:C.purpleLight,fontSize:9,fontWeight:800,fontFamily:fn}}>Dashboard</div>
              <div style={{width:16,height:3,background:`linear-gradient(90deg,${C.gold},${C.orange})`,borderRadius:99}}/>
            </div>
            <div onClick={()=>setSession(null)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"3px 14px"}}>
              <div style={{fontSize:18}}>🔓</div>
              <div style={{color:"rgba(248,250,252,0.52)",fontSize:9,fontFamily:fn}}>Logout</div>
            </div>
          </>
      }
    </div>
  );

  // ── More sheet (phone only — tablet uses sidebar) ──
  const MoreSheet = () => (
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.78)",zIndex:20,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}
      onClick={e=>{if(e.target===e.currentTarget)setMoreOpen(false);}}>
      <div style={{background:C.bg,borderRadius:"26px 26px 0 0",border:`1px solid ${C.border}`,animation:"slideUp 0.28s ease",maxHeight:"88%",display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"10px 0 6px"}}>
          <div style={{width:34,height:4,background:C.dim,borderRadius:99}}/>
        </div>
        <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
          {[["adaptive","🧠 AI Quiz"],["duel","⚔️ Duels"],["giveback","💚 Give"],["certs","🏅 Certs"]].map(([t,l])=>(
            <div key={t} onClick={()=>setMoreTab(t)}
              style={{flex:1,padding:"10px 2px",textAlign:"center",color:moreTab===t?C.purpleLight:C.muted,fontWeight:moreTab===t?800:600,fontSize:10,fontFamily:fn,cursor:"pointer",borderBottom:moreTab===t?`2px solid ${C.purpleBright}`:"2px solid transparent"}}>
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
        <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"12px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,zIndex:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${C.purple},${C.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🌟</div>
            <div style={{color:C.text,fontWeight:800,fontSize:20,fontFamily:ff}}>MathSci Stars</div>
            <div style={{background:`${C.green}22`,borderRadius:8,padding:"3px 10px"}}>
              <div style={{color:C.labelGreen,fontSize:11,fontWeight:800,fontFamily:fn}}>🛡️ COPPA Protected</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            {session?.profile&&(
              <div style={{background:`${C.gold}15`,borderRadius:12,padding:"7px 14px",display:"flex",alignItems:"center",gap:8,border:`1px solid ${C.gold}33`}}>
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
                        style={{padding:"7px 12px",fontSize:11,fontWeight:moreTab===t?800:600,fontFamily:fn,color:moreTab===t?C.purpleLight:C.muted,cursor:"pointer",borderBottom:moreTab===t?`2px solid ${C.purpleBright}`:"2px solid transparent"}}>
                        {l}
                      </div>
                    ))}
                  </div>
                  <div onClick={()=>setMoreOpen(false)} style={{color:C.muted,fontSize:20,cursor:"pointer",padding:"4px 8px"}}>×</div>
                </div>
                <div style={{flex:1,overflowY:"auto"}}>{moreScreens[moreTab]}</div>
              </div>
            )}

            {/* StarBot chat — tablet slide-in panel */}
            {session?.mode==="student"&&starBotOpen&&(
              <div style={{position:"fixed",top:0,right:0,width:420,height:"100vh",zIndex:50,animation:"fadeIn 0.2s ease"}}>
                <StarBotChat profile={session.profile} context={starBotContext} onClose={()=>{setStarBotOpen(false);setStarBotContext(null);}}/>
              </div>
            )}

            {/* StarBot FAB */}
            {session?.mode==="student"&&coppaAccepted&&!starBotOpen&&(
              <StarBotButton profile={session.profile} context={starBotContext} onClick={()=>{setStarBotContext(null);setStarBotOpen(true);}}/>
            )}
          </div>
        </div>

        {/* Toast */}
        {toast&&(
          <div style={{position:"fixed",bottom:30,left:"50%",transform:"translateX(-50%)",background:toast.c,borderRadius:14,padding:"12px 24px",color:"white",fontWeight:800,fontSize:14,fontFamily:ff,whiteSpace:"nowrap",zIndex:999,boxShadow:"0 8px 40px rgba(0,0,0,0.5)",animation:"fadeIn 0.2s ease"}}>
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

      <div style={{width:385,height:820,background:C.bg,borderRadius:40,overflow:"hidden",position:"relative",border:"8px solid #080a14",boxShadow:"0 50px 120px rgba(0,0,0,0.95),0 0 0 1px rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",zIndex:1}}>
        {/* Status bar */}
        <div style={{padding:"10px 22px 4px",display:"flex",justifyContent:"space-between",flexShrink:0}}>
          <div style={{color:"rgba(248,250,252,0.52)",fontSize:11,fontWeight:700,fontFamily:fn}}>9:41</div>
          <div style={{color:"rgba(248,250,252,0.52)",fontSize:10,fontFamily:fn}}>●●● WiFi 🔋</div>
        </div>

        {/* Screen content */}
        <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none"}}>
          {mainContent}
        </div>

        {/* Phone-only overlays */}
        {session?.mode==="student"&&moreOpen&&<MoreSheet/>}

        {session?.mode==="student"&&starBotOpen&&(
          <StarBotChat profile={session.profile} context={starBotContext} onClose={()=>{setStarBotOpen(false);setStarBotContext(null);}}/>
        )}

        {session?.mode==="student"&&coppaAccepted&&!starBotOpen&&(
          <StarBotButton profile={session.profile} context={starBotContext} onClick={()=>{setStarBotContext(null);setStarBotOpen(true);}}/>
        )}

        {/* Toast */}
        {toast&&(
          <div style={{position:"absolute",top:68,left:"50%",transform:"translateX(-50%)",background:toast.c,borderRadius:12,padding:"9px 18px",color:"white",fontWeight:800,fontSize:12,fontFamily:ff,whiteSpace:"nowrap",zIndex:99,boxShadow:"0 8px 30px rgba(0,0,0,0.5)",animation:"fadeIn 0.2s ease"}}>
            {toast.msg}
          </div>
        )}

        {/* Bottom Nav */}
        {session&&coppaAccepted&&<PhoneBottomNav/>}
      </div>
    </div>
  );
}

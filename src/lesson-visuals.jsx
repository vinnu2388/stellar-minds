// ═══════════════════════════════════════════════════════════════════
// LETZKOOL — LESSON VISUALS LIBRARY
// Animated SVG + HTML visual components for each lesson type
// Each visual takes a `step` prop (0-based) and `color` prop
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  bg:"#F0F4FF", card:"#FFFFFF", text:"#1E2A4A",
  muted:"#64748B", dim:"#94A3B8",
  green:"#22C55E", blue:"#3B82F6", red:"#EF4444", gold:"#F59E0B",
  navy:"#1B3FAB", purple:"#6C3FC5", orange:"#F97316", pink:"#EC4899",
  teal:"#0F9D75",
};
const fn = "'Nunito', sans-serif";
const fp = "'Nunito', sans-serif"; // replace pixel font with Nunito for readability

// ── helper: pulsing glow animation ──
const pulse = (color) => ({
  animation: "pulse 1.5s ease-in-out infinite",
  filter: `drop-shadow(0 0 8px ${color})`,
});

// ────────────────────────────────────────────────────────────────
// 🔢 PLACE VALUE VISUAL — base-ten blocks
// ────────────────────────────────────────────────────────────────
export function PlaceValueVisual({ step }) {
  const configs = [
    { h:200, t:4,  o:7  },  // 247
    { h:3,   t:1,  o:5  },  // 315
    { h:5,   t:6,  o:2  },  // 562
    { h:8,   t:0,  o:8  },  // 808
    { h:4,   t:2,  o:0  },  // 420
  ];
  const cfg = configs[Math.min(step, configs.length-1)];
  const num = cfg.h*100 + cfg.t*10 + cfg.o;
  const [anim, setAnim] = useState(false);
  useEffect(() => { setAnim(false); const t=setTimeout(()=>setAnim(true),50); return()=>clearTimeout(t); }, [step]);

  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ color:C.gold, fontFamily:fn, fontSize:11, marginBottom:10 }}>
        THE NUMBER {num}
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:16, marginBottom:12 }}>
        {/* Hundreds */}
        <div style={{ textAlign:"center" }}>
          <div style={{ color:C.blue, fontFamily:fn, fontSize:11, marginBottom:6 }}>HUNDREDS</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:3, width:60, justifyContent:"center" }}>
            {Array.from({length:Math.min(cfg.h,9)}).map((_,i)=>(
              <div key={i} style={{
                width:18, height:18, background:`${C.blue}30`,
                border:`2px solid ${C.blue}`, borderRadius:2,
                opacity: anim?1:0, transition:`opacity 0.3s ${i*0.05}s`,
                boxShadow:`0 0 4px ${C.blue}`,
              }}/>
            ))}
          </div>
          <div style={{ color:C.blue, fontFamily:fn, fontSize:22, fontWeight:900, marginTop:6 }}>{cfg.h}</div>
        </div>
        {/* Tens */}
        <div style={{ textAlign:"center" }}>
          <div style={{ color:C.green, fontFamily:fn, fontSize:11, marginBottom:6 }}>TENS</div>
          <div style={{ display:"flex", flexDirection:"column", gap:3, alignItems:"center" }}>
            {Array.from({length:Math.min(cfg.t,9)}).map((_,i)=>(
              <div key={i} style={{
                width:10, height:18, background:`${C.green}30`,
                border:`2px solid ${C.green}`, borderRadius:2,
                opacity: anim?1:0, transition:`opacity 0.3s ${i*0.07}s`,
                boxShadow:`0 0 4px ${C.green}`,
              }}/>
            ))}
          </div>
          <div style={{ color:C.green, fontFamily:fn, fontSize:22, fontWeight:900, marginTop:6 }}>{cfg.t}</div>
        </div>
        {/* Ones */}
        <div style={{ textAlign:"center" }}>
          <div style={{ color:C.gold, fontFamily:fn, fontSize:11, marginBottom:6 }}>ONES</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:3, width:40, justifyContent:"center" }}>
            {Array.from({length:Math.min(cfg.o,9)}).map((_,i)=>(
              <div key={i} style={{
                width:10, height:10, background:`${C.gold}30`,
                border:`2px solid ${C.gold}`, borderRadius:2,
                opacity: anim?1:0, transition:`opacity 0.3s ${i*0.06}s`,
                boxShadow:`0 0 4px ${C.gold}`,
              }}/>
            ))}
          </div>
          <div style={{ color:C.gold, fontFamily:fn, fontSize:22, fontWeight:900, marginTop:6 }}>{cfg.o}</div>
        </div>
      </div>
      {/* Equation */}
      <div style={{ color:C.text, fontFamily:fn, fontSize:15, fontWeight:800 }}>
        <span style={{color:C.blue}}>{cfg.h*100}</span>
        {" + "}
        <span style={{color:C.green}}>{cfg.t*10}</span>
        {" + "}
        <span style={{color:C.gold}}>{cfg.o}</span>
        {" = "}
        <span style={{color:C.text, fontSize:20}}>{num}</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 📏 RULER VISUAL — animated measurement
// ────────────────────────────────────────────────────────────────
export function RulerVisual({ step }) {
  const items = [
    { label:"🖊️ Pencil", lengthCm:18, color:C.gold },
    { label:"📎 Paperclip", lengthCm:3.5, color:C.blue },
    { label:"📚 Book", lengthCm:22, color:C.green },
    { label:"🪄 Magic wand", lengthCm:15, color:C.purple },
    { label:"🍌 Banana", lengthCm:20, color:C.orange },
  ];
  const item = items[Math.min(step, items.length-1)];
  const maxCm = 25;
  const rulerW = 280;
  const scale = rulerW / maxCm;
  const itemW = item.lengthCm * scale;
  const [animW, setAnimW] = useState(0);
  useEffect(() => { setAnimW(0); const t=setTimeout(()=>setAnimW(itemW),100); return()=>clearTimeout(t); }, [step,itemW]);

  const ticks = Array.from({length:maxCm+1},(_,i)=>i);

  return (
    <div style={{ padding:"8px 4px" }}>
      {/* Object */}
      <div style={{ marginBottom:12, display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ fontSize:28 }}>{item.label.split(" ")[0]}</div>
        <div style={{ flex:1, height:28, borderRadius:4, background:`${item.color}25`,
          border:`2px solid ${item.color}`, overflow:"hidden", position:"relative" }}>
          <div style={{ width:animW, height:"100%", background:`${item.color}40`,
            boxShadow:`0 0 10px ${item.color}`, transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)",
            display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:8 }}>
            <span style={{ color:item.color, fontFamily:fn, fontSize:11, whiteSpace:"nowrap" }}>
              {item.lengthCm} cm
            </span>
          </div>
        </div>
      </div>
      {/* Ruler */}
      <svg width={rulerW+10} height={50} style={{ overflow:"visible" }}>
        {/* Ruler body */}
        <rect x={0} y={10} width={rulerW} height={30} rx={3}
          fill="#2a2a1a" stroke={C.gold} strokeWidth={1.5}/>
        {/* Tick marks */}
        {ticks.map(i => (
          <g key={i}>
            <line x1={i*scale} y1={10} x2={i*scale} y2={i%5===0?26:20}
              stroke={C.gold} strokeWidth={i%10===0?1.5:0.8} opacity={0.8}/>
            {i%5===0 && (
              <text x={i*scale} y={38} textAnchor="middle"
                fill={C.gold} fontSize={7} fontFamily={fn} fontWeight={700}>{i}</text>
            )}
          </g>
        ))}
        {/* Measurement arrow */}
        <line x1={0} y1={5} x2={animW} y2={5} stroke={item.color} strokeWidth={2}
          style={{transition:"stroke-dashoffset 0.8s"}}/>
        <polygon points={`${animW},2 ${animW},8 ${animW+6},5`} fill={item.color}/>
      </svg>
      <div style={{ color:C.muted, fontFamily:fn, fontSize:13, marginTop:8, textAlign:"center" }}>
        {item.label} = <span style={{color:item.color, fontWeight:900}}>{item.lengthCm} cm</span>
        {" "}({(item.lengthCm/2.54).toFixed(1)} inches)
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 🕐 CLOCK VISUAL — analogue clock face
// ────────────────────────────────────────────────────────────────
export function ClockVisual({ step }) {
  const times = [
    { h:3,  m:0,  label:"3:00",  ampm:"P.M.", note:"After lunch!" },
    { h:7,  m:30, label:"7:30",  ampm:"A.M.", note:"Breakfast time!" },
    { h:12, m:0,  label:"12:00", ampm:"P.M.", note:"Noon — lunchtime!" },
    { h:8,  m:15, label:"8:15",  ampm:"A.M.", note:"School starts!" },
    { h:9,  m:45, label:"9:45",  ampm:"A.M.", note:"Reading time!" },
    { h:6,  m:30, label:"6:30",  ampm:"P.M.", note:"Dinner time!" },
    { h:8,  m:30, label:"8:30",  ampm:"P.M.", note:"Almost bedtime!" },
  ];
  const t = times[Math.min(step, times.length-1)];
  const cx=80, cy=80, r=70;
  const hourAngle  = ((t.h % 12) + t.m/60) / 12 * 360 - 90;
  const minAngle   = t.m / 60 * 360 - 90;
  const toRad = a => a * Math.PI / 180;
  const hourX = cx + 38 * Math.cos(toRad(hourAngle));
  const hourY = cy + 38 * Math.sin(toRad(hourAngle));
  const minX  = cx + 55 * Math.cos(toRad(minAngle));
  const minY  = cy + 55 * Math.sin(toRad(minAngle));

  return (
    <div style={{ display:"flex", gap:16, alignItems:"center" }}>
      <svg width={160} height={160}>
        {/* Clock face */}
        <circle cx={cx} cy={cy} r={r} fill="#0F0F2A" stroke={C.blue} strokeWidth={3}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.blue} strokeWidth={1} opacity={0.3}
          style={{filter:`drop-shadow(0 0 8px ${C.blue})`}}/>
        {/* Hour numbers */}
        {[12,1,2,3,4,5,6,7,8,9,10,11].map((n,i)=>{
          const a = (i/12)*360 - 90;
          const x = cx + 56*Math.cos(toRad(a));
          const y = cy + 56*Math.sin(toRad(a));
          return <text key={n} x={x} y={y} textAnchor="middle" dominantBaseline="central"
            fill={C.text} fontSize={9} fontFamily={fn} fontWeight={900}>{n}</text>;
        })}
        {/* Minute tick marks */}
        {Array.from({length:60},(_,i)=>{
          const a = (i/60)*360 - 90;
          const inner = i%5===0 ? 58 : 62;
          const x1=cx+inner*Math.cos(toRad(a)), y1=cy+inner*Math.sin(toRad(a));
          const x2=cx+67*Math.cos(toRad(a)),    y2=cy+67*Math.sin(toRad(a));
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={C.dim} strokeWidth={i%5===0?2:0.8}/>;
        })}
        {/* Hour hand */}
        <line x1={cx} y1={cy} x2={hourX} y2={hourY}
          stroke={C.gold} strokeWidth={5} strokeLinecap="round"
          style={{transformOrigin:`${cx}px ${cy}px`, transition:"all 0.6s ease"}}/>
        {/* Minute hand */}
        <line x1={cx} y1={cy} x2={minX} y2={minY}
          stroke={C.blue} strokeWidth={3} strokeLinecap="round"
          style={{transformOrigin:`${cx}px ${cy}px`, transition:"all 0.6s ease"}}/>
        {/* Center dot */}
        <circle cx={cx} cy={cy} r={5} fill={C.text}/>
        {/* Labels */}
        <text x={cx} y={cy+85} textAnchor="middle" fill={C.gold} fontSize={8} fontFamily={fp}
          style={{filter:`drop-shadow(0 0 6px ${C.gold})`}}>{t.label} {t.ampm}</text>
      </svg>
      <div style={{ flex:1 }}>
        <div style={{ color:C.gold, fontFamily:fn, fontSize:9, marginBottom:8 }}>⏰ {t.label} {t.ampm}</div>
        <div style={{ color:C.muted, fontFamily:fn, fontSize:13, lineHeight:1.7, marginBottom:10 }}>
          {t.note}
        </div>
        <div style={{ background:`${C.blue}15`, border:`1px solid ${C.blue}33`,
          borderRadius:6, padding:"8px 10px" }}>
          <div style={{ color:C.gold, fontFamily:fn, fontSize:12, fontWeight:800, marginBottom:4 }}>
            🟡 Short hand → Hour
          </div>
          <div style={{ color:C.blue, fontFamily:fn, fontSize:12, fontWeight:800 }}>
            🔵 Long hand → Minutes
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 🪙 COINS VISUAL — counting coins
// ────────────────────────────────────────────────────────────────
export function CoinsVisual({ step }) {
  const scenarios = [
    { coins:[{t:"Q",v:25,c:"#FFD700",n:"Quarter"},{t:"D",v:10,c:"#C0C0C0",n:"Dime"},{t:"N",v:5,c:"#CD853F",n:"Nickel"},{t:"P",v:1,c:"#B87333",n:"Penny"}], label:"One of each coin" },
    { coins:[{t:"Q",v:25,c:"#FFD700",n:"Quarter"},{t:"Q",v:25,c:"#FFD700",n:"Quarter"},{t:"D",v:10,c:"#C0C0C0",n:"Dime"},{t:"D",v:10,c:"#C0C0C0",n:"Dime"}], label:"2 Quarters + 2 Dimes" },
    { coins:[{t:"Q",v:25,c:"#FFD700",n:"Quarter"},{t:"Q",v:25,c:"#FFD700",n:"Quarter"},{t:"Q",v:25,c:"#FFD700",n:"Quarter"},{t:"Q",v:25,c:"#FFD700",n:"Quarter"}], label:"4 Quarters = $1.00!" },
    { coins:[{t:"D",v:10,c:"#C0C0C0",n:"Dime"},{t:"N",v:5,c:"#CD853F",n:"Nickel"},{t:"N",v:5,c:"#CD853F",n:"Nickel"},{t:"P",v:1,c:"#B87333",n:"Penny"},{t:"P",v:1,c:"#B87333",n:"Penny"},{t:"P",v:1,c:"#B87333",n:"Penny"}], label:"Dime + 2 Nickels + 3 Pennies" },
  ];
  const s = scenarios[Math.min(step, scenarios.length-1)];
  const total = s.coins.reduce((a,c)=>a+c.v, 0);
  const [visible, setVisible] = useState(0);
  useEffect(()=>{
    setVisible(0);
    let i=0; const id=setInterval(()=>{ i++; setVisible(i); if(i>=s.coins.length) clearInterval(id); },250);
    return ()=>clearInterval(id);
  },[step]);

  return (
    <div>
      <div style={{ color:C.gold, fontFamily:fn, fontSize:11, marginBottom:10, textAlign:"center" }}>{s.label}</div>
      {/* Coin display */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center", marginBottom:14 }}>
        {s.coins.map((c,i)=>(
          <div key={i} style={{
            width:52, height:52, borderRadius:"50%",
            background:`radial-gradient(circle at 35% 35%, ${c.c}ee, ${c.c}88)`,
            border:`3px solid ${c.c}`, display:"flex", alignItems:"center", justifyContent:"center",
            flexDirection:"column", boxShadow:`0 0 10px ${c.c}55`,
            opacity: i < visible ? 1 : 0, transform: i < visible ? "scale(1)" : "scale(0.3)",
            transition:"all 0.3s ease",
          }}>
            <div style={{ color:"#000", fontFamily:fn, fontSize:10, fontWeight:900 }}>{c.t}</div>
            <div style={{ color:"#333", fontFamily:fn, fontSize:10, fontWeight:800 }}>{c.v}¢</div>
          </div>
        ))}
      </div>
      {/* Running total */}
      <div style={{ background:`${C.gold}15`, border:`1px solid ${C.gold}44`, borderRadius:8, padding:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:C.muted, fontFamily:fn, fontSize:13 }}>
            {s.coins.slice(0,visible).map(c=>c.v+"¢").join(" + ")}
          </span>
          <span style={{ color:C.gold, fontFamily:fn, fontSize:12 }}>
            = {total >= 100 ? `$${(total/100).toFixed(2)}` : `${total}¢`}
          </span>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 🔷 2D SHAPES VISUAL
// ────────────────────────────────────────────────────────────────
export function Shapes2DVisual({ step }) {
  const shapes = [
    { name:"Triangle", sides:3, color:C.red, path:"M80,20 L140,120 L20,120 Z", cx:80, cy:80 },
    { name:"Square", sides:4, color:C.blue, path:"M30,30 L130,30 L130,130 L30,130 Z", cx:80, cy:80 },
    { name:"Rectangle", sides:4, color:C.green, path:"M15,50 L145,50 L145,110 L15,110 Z", cx:80, cy:80 },
    { name:"Pentagon", sides:5, color:C.purple, path:"M80,15 L145,60 L120,130 L40,130 L15,60 Z", cx:80, cy:80 },
    { name:"Hexagon", sides:6, color:C.orange, path:"M80,10 L140,45 L140,115 L80,150 L20,115 L20,45 Z", cx:80, cy:80 },
    { name:"Octagon", sides:8, color:C.pink, path:"M55,10 L105,10 L140,45 L140,95 L105,130 L55,130 L20,95 L20,45 Z", cx:80, cy:80 },
  ];
  const s = shapes[Math.min(step, shapes.length-1)];
  const [dash, setDash] = useState(0);
  useEffect(()=>{ setDash(0); const t=setTimeout(()=>setDash(600),100); return()=>clearTimeout(t); },[step]);

  return (
    <div style={{ display:"flex", gap:12, alignItems:"center" }}>
      <svg width={160} height={160}>
        <path d={s.path} fill={`${s.color}22`} stroke={s.color} strokeWidth={3}
          strokeDasharray={600} strokeDashoffset={600-dash}
          style={{transition:"stroke-dashoffset 1s ease", filter:`drop-shadow(0 0 8px ${s.color})`}}/>
        {/* Vertex dots */}
        {s.path.match(/[ML](\d+),(\d+)/g)?.map((pt,i)=>{
          const [,x,y] = pt.match(/[ML](\d+),(\d+)/);
          return <circle key={i} cx={+x} cy={+y} r={5} fill={s.color}
            opacity={dash>0?1:0} style={{transition:`opacity 0.3s ${i*0.1}s`}}/>;
        })}
      </svg>
      <div style={{ flex:1 }}>
        <div style={{ color:s.color, fontFamily:fn, fontSize:12, marginBottom:8,
          textShadow:`0 0 10px ${s.color}` }}>{s.name.toUpperCase()}</div>
        {[
          { label:"Sides", value:s.sides },
          { label:"Angles", value:s.sides },
          { label:"Type", value: s.sides===4?"Quadrilateral":s.sides===3?"Triangle":"Polygon" },
        ].map(r=>(
          <div key={r.label} style={{ display:"flex", justifyContent:"space-between",
            padding:"6px 0", borderBottom:`1px solid ${C.border}` }}>
            <span style={{ color:C.muted, fontFamily:fn, fontSize:13 }}>{r.label}</span>
            <span style={{ color:s.color, fontFamily:fn, fontSize:9 }}>{r.value}</span>
          </div>
        ))}
        <div style={{ marginTop:10, color:C.muted, fontFamily:fn, fontSize:12 }}>
          {s.sides===3 && "🎪 Like a roof or a slice of pizza!"}
          {s.sides===4 && "📦 Like a door, book, or screen!"}
          {s.sides===5 && "⭐ Like the Pentagon building in the USA!"}
          {s.sides===6 && "🍯 Like a honeycomb cell!"}
          {s.sides===8 && "🛑 Like a STOP sign!"}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 📦 3D SHAPES VISUAL
// ────────────────────────────────────────────────────────────────
export function Shapes3DVisual({ step }) {
  const shapes = [
    { name:"Cube", faces:6, edges:12, vertices:8, color:C.blue,  example:"🎲 Dice, sugar cube",
      svg: <g>
        <rect x={35} y={50} width={70} height={70} fill={`${C.blue}30`} stroke={C.blue} strokeWidth={2}/>
        <rect x={55} y={30} width={70} height={70} fill={`${C.blue}18`} stroke={C.blue} strokeWidth={1.5}/>
        <line x1={35} y1={50} x2={55} y2={30} stroke={C.blue} strokeWidth={1.5}/>
        <line x1={105} y1={50} x2={125} y2={30} stroke={C.blue} strokeWidth={1.5}/>
        <line x1={105} y1={120} x2={125} y2={100} stroke={C.blue} strokeWidth={1.5}/>
      </g> },
    { name:"Sphere", faces:0, edges:0, vertices:0, color:C.red, example:"⚽ Ball, globe, orange",
      svg: <g>
        <circle cx={80} cy={80} r={55} fill={`${C.red}25`} stroke={C.red} strokeWidth={2.5}/>
        <ellipse cx={80} cy={80} rx={55} ry={18} fill="none" stroke={C.red} strokeWidth={1} strokeDasharray="4,3" opacity={0.6}/>
        <ellipse cx={80} cy={80} rx={18} ry={55} fill="none" stroke={C.red} strokeWidth={1} strokeDasharray="4,3" opacity={0.6}/>
      </g> },
    { name:"Cylinder", faces:2, edges:2, vertices:0, color:C.green, example:"🥫 Soup can, drum",
      svg: <g>
        <ellipse cx={80} cy={45} rx={50} ry={16} fill={`${C.green}30`} stroke={C.green} strokeWidth={2}/>
        <rect x={30} y={45} width={100} height={80} fill={`${C.green}18`} stroke={C.green} strokeWidth={2}/>
        <ellipse cx={80} cy={125} rx={50} ry={16} fill={`${C.green}30`} stroke={C.green} strokeWidth={2}/>
      </g> },
    { name:"Cone", faces:1, edges:1, vertices:1, color:C.orange, example:"🍦 Ice cream cone, party hat",
      svg: <g>
        <ellipse cx={80} cy={118} rx={50} ry={16} fill={`${C.orange}25`} stroke={C.orange} strokeWidth={2}/>
        <line x1={30} y1={118} x2={80} y2={25} stroke={C.orange} strokeWidth={2}/>
        <line x1={130} y1={118} x2={80} y2={25} stroke={C.orange} strokeWidth={2}/>
        <path d="M30,118 Q80,90 130,118" fill={`${C.orange}18`} stroke="none"/>
        <circle cx={80} cy={25} r={5} fill={C.orange}/>
      </g> },
    { name:"Rectangular Prism", faces:6, edges:12, vertices:8, color:C.purple, example:"📦 Cereal box, brick",
      svg: <g>
        <rect x={25} y={55} width={90} height={65} fill={`${C.purple}25`} stroke={C.purple} strokeWidth={2}/>
        <rect x={55} y={30} width={75} height={65} fill={`${C.purple}15`} stroke={C.purple} strokeWidth={1.5}/>
        <line x1={25} y1={55} x2={55} y2={30} stroke={C.purple} strokeWidth={1.5}/>
        <line x1={115} y1={55} x2={130} y2={30} stroke={C.purple} strokeWidth={1.5}/>
        <line x1={115} y1={120} x2={130} y2={95} stroke={C.purple} strokeWidth={1.5}/>
      </g> },
  ];
  const s = shapes[Math.min(step, shapes.length-1)];
  const [glow, setGlow] = useState(false);
  useEffect(()=>{ setGlow(false); const t=setTimeout(()=>setGlow(true),100); return()=>clearTimeout(t); },[step]);

  return (
    <div style={{ display:"flex", gap:12, alignItems:"center" }}>
      <svg width={160} height={160}
        style={{ filter: glow ? `drop-shadow(0 0 12px ${s.color})` : "none", transition:"filter 0.5s" }}>
        {s.svg}
        <text x={80} y={152} textAnchor="middle" fill={s.color} fontSize={9} fontFamily={fp}>{s.name}</text>
      </svg>
      <div style={{ flex:1 }}>
        <div style={{ color:s.color, fontFamily:fn, fontSize:10, marginBottom:8,
          textShadow:`0 0 10px ${s.color}` }}>{s.name.toUpperCase()}</div>
        {[
          { label:"Faces",    value: s.faces },
          { label:"Edges",    value: s.edges },
          { label:"Vertices", value: s.vertices },
        ].map(r=>(
          <div key={r.label} style={{ display:"flex", justifyContent:"space-between",
            padding:"6px 0", borderBottom:`1px solid rgba(27,63,171,0.08)` }}>
            <span style={{ color:"rgba(240,240,255,0.7)", fontFamily:"'Nunito',sans-serif", fontSize:13 }}>{r.label}</span>
            <span style={{ color:s.color, fontFamily:fn, fontSize:9 }}>{r.value}</span>
          </div>
        ))}
        <div style={{ marginTop:10, color:"rgba(240,240,255,0.7)", fontFamily:"'Nunito',sans-serif", fontSize:12 }}>
          {s.example}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 🍕 FRACTIONS VISUAL
// ────────────────────────────────────────────────────────────────
export function FractionsVisual({ step }) {
  const fracs = [
    { n:1, d:2, label:"ONE HALF", color:C.blue,   story:"You cut a sandwich in 2 equal pieces. You eat 1." },
    { n:1, d:3, label:"ONE THIRD", color:C.green,  story:"A pizza cut into 3 equal slices. You get 1 slice." },
    { n:1, d:4, label:"ONE QUARTER", color:C.gold, story:"A chocolate bar broken into 4 equal pieces. You have 1." },
    { n:2, d:4, label:"TWO QUARTERS", color:C.orange, story:"2 out of 4 equal parts — same as ONE HALF!" },
    { n:3, d:4, label:"THREE QUARTERS", color:C.purple, story:"¾ of your water bottle is still full." },
  ];
  const f = fracs[Math.min(step, fracs.length-1)];
  const [animSlices, setAnimSlices] = useState(0);
  useEffect(()=>{
    setAnimSlices(0);
    let i=0; const id=setInterval(()=>{ i++; setAnimSlices(i); if(i>=f.d) clearInterval(id); },200);
    return()=>clearInterval(id);
  },[step]);

  const cx=75, cy=75, r=62;
  const sliceAngle = (2*Math.PI)/f.d;
  const slicePaths = Array.from({length:f.d},(_,i)=>{
    const a1 = i*sliceAngle - Math.PI/2;
    const a2 = (i+1)*sliceAngle - Math.PI/2;
    const x1=cx+r*Math.cos(a1), y1=cy+r*Math.sin(a1);
    const x2=cx+r*Math.cos(a2), y2=cy+r*Math.sin(a2);
    return { x1,y1,x2,y2,a1,a2,isShaded:i<f.n };
  });

  return (
    <div style={{ display:"flex", gap:12, alignItems:"center" }}>
      <svg width={150} height={150}>
        {slicePaths.map((sp,i)=>(
          <g key={i} style={{ opacity: i<animSlices?1:0, transition:`opacity 0.25s ${i*0.1}s` }}>
            <path d={`M${cx},${cy} L${sp.x1},${sp.y1} A${r},${r} 0 0,1 ${sp.x2},${sp.y2} Z`}
              fill={sp.isShaded ? `${f.color}50` : `${f.color}10`}
              stroke={f.color} strokeWidth={2}/>
          </g>
        ))}
        <text x={cx} y={cy+5} textAnchor="middle" fill={f.color}
          fontSize={14} fontFamily={fp} fontWeight={900}
          style={{filter:`drop-shadow(0 0 6px ${f.color})`}}>
          {f.n}/{f.d}
        </text>
      </svg>
      <div style={{ flex:1 }}>
        <div style={{ color:f.color, fontFamily:fn, fontSize:10, marginBottom:8 }}>{f.label}</div>
        <div style={{ color:"rgba(240,240,255,0.85)", fontFamily:"'Nunito',sans-serif",
          fontSize:13, lineHeight:1.7, marginBottom:10 }}>
          {f.story}
        </div>
        <div style={{ background:`${f.color}15`, borderRadius:6, padding:"8px 10px",
          border:`1px solid ${f.color}33` }}>
          <span style={{ color:f.color, fontFamily:fn, fontSize:8 }}>{f.n}</span>
          <span style={{ color:"rgba(240,240,255,0.5)", fontFamily:fn, fontSize:7 }}> ← shaded pieces</span>
          <div style={{ borderTop:`1px solid ${f.color}`, margin:"4px 0" }}/>
          <span style={{ color:f.color, fontFamily:fn, fontSize:8 }}>{f.d}</span>
          <span style={{ color:"rgba(240,240,255,0.5)", fontFamily:fn, fontSize:7 }}> ← total pieces</span>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// ➕ ADDITION / SUBTRACTION VISUAL — regrouping animation
// ────────────────────────────────────────────────────────────────
export function AddSubVisual({ step }) {
  const problems = [
    { a:47, b:35, op:"+", ans:82, label:"Carrying the ten" },
    { a:63, b:27, op:"-", ans:36, label:"Borrowing a ten" },
    { a:56, b:30, op:"+", ans:86, label:"Mental math — add tens!" },
    { a:85, b:29, op:"-", ans:56, label:"Regroup from the tens" },
    { a:48, b:53, op:"+", ans:101, label:"Crossing into hundreds!" },
  ];
  const p = problems[Math.min(step, problems.length-1)];
  const onesA = p.a % 10, tensA = Math.floor(p.a/10);
  const onesB = p.b % 10, tensB = Math.floor(p.b/10);
  const [flash, setFlash] = useState(false);
  useEffect(()=>{ setFlash(false); const t=setTimeout(()=>setFlash(true),600); return()=>clearTimeout(t); },[step]);

  return (
    <div style={{ padding:"0 8px" }}>
      <div style={{ color:C.gold, fontFamily:fn, fontSize:11, marginBottom:12, textAlign:"center" }}>
        {p.label.toUpperCase()}
      </div>
      {/* Column layout */}
      <div style={{ display:"flex", justifyContent:"center", gap:0, marginBottom:16 }}>
        {/* Hundreds col */}
        <div style={{ width:50, textAlign:"center", borderRight:`1px dashed ${C.border}` }}>
          <div style={{ color:C.blue, fontFamily:fn, fontSize:10, marginBottom:8 }}>H</div>
          <div style={{ color:C.text, fontFamily:fn, fontSize:28, fontWeight:900 }}>
            {p.ans >= 100 ? Math.floor(p.ans/100) : " "}
          </div>
        </div>
        {/* Tens col */}
        <div style={{ width:50, textAlign:"center", borderRight:`1px dashed ${C.border}` }}>
          <div style={{ color:C.green, fontFamily:fn, fontSize:10, marginBottom:8 }}>T</div>
          <div style={{ color:C.green, fontFamily:fn, fontSize:28, fontWeight:900 }}>{tensA}</div>
          <div style={{ color:C.green, fontFamily:fn, fontSize:28, fontWeight:900 }}>{tensB}</div>
          <div style={{ borderTop:`2px solid ${C.green}`, margin:"4px 8px" }}/>
          <div style={{ color:flash?C.green:C.dim, fontFamily:fn, fontSize:32, fontWeight:900,
            transition:"color 0.4s", textShadow:flash?`0 0 12px ${C.green}`:"none" }}>
            {Math.floor((p.ans%100)/10)}
          </div>
        </div>
        {/* Ones col */}
        <div style={{ width:50, textAlign:"center" }}>
          <div style={{ color:C.gold, fontFamily:fn, fontSize:10, marginBottom:8 }}>O</div>
          <div style={{ color:C.gold, fontFamily:fn, fontSize:28, fontWeight:900 }}>{onesA}</div>
          <div style={{ color:C.gold, fontFamily:fn, fontSize:28, fontWeight:900 }}>{onesB}</div>
          <div style={{ borderTop:`2px solid ${C.gold}`, margin:"4px 8px" }}/>
          <div style={{ color:flash?C.gold:C.dim, fontFamily:fn, fontSize:32, fontWeight:900,
            transition:"color 0.4s", textShadow:flash?`0 0 12px ${C.gold}`:"none" }}>
            {p.ans%10}
          </div>
        </div>
      </div>
      {/* Summary */}
      <div style={{ background:`${C.gold}15`, border:`1px solid ${C.gold}33`, borderRadius:8,
        padding:10, textAlign:"center" }}>
        <span style={{ color:C.text, fontFamily:fn, fontSize:20, fontWeight:900 }}>
          {p.a} {p.op} {p.b} = </span>
        <span style={{ color:C.gold, fontFamily:fn, fontSize:26, fontWeight:900,
          textShadow:flash?`0 0 16px ${C.gold}`:"none", transition:"text-shadow 0.4s" }}>
          {p.ans}
        </span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 🧪 STATES OF MATTER VISUAL
// ────────────────────────────────────────────────────────────────
export function MatterVisual({ step }) {
  const states = [
    { name:"SOLID", color:C.blue,   icon:"🧊", desc:"Particles tightly packed. Fixed shape!", particles:[
      {x:50,y:50},{x:70,y:50},{x:90,y:50},{x:110,y:50},
      {x:50,y:70},{x:70,y:70},{x:90,y:70},{x:110,y:70},
      {x:50,y:90},{x:70,y:90},{x:90,y:90},{x:110,y:90},
    ], move:0 },
    { name:"LIQUID", color:C.green, icon:"💧", desc:"Particles flow past each other. Takes the shape of container!", particles:[
      {x:45,y:80},{x:65,y:65},{x:85,y:80},{x:105,y:70},
      {x:55,y:100},{x:75,y:95},{x:95,y:105},{x:115,y:90},
      {x:50,y:120},{x:70,y:110},{x:90,y:120},{x:110,y:115},
    ], move:4 },
    { name:"GAS", color:C.orange,  icon:"💨", desc:"Particles zoom everywhere! Fills entire container.", particles:[
      {x:30,y:30},{x:110,y:25},{x:65,y:50},{x:140,y:60},
      {x:20,y:80},{x:100,y:75},{x:55,y:100},{x:130,y:100},
      {x:40,y:130},{x:90,y:140},{x:150,y:130},{x:75,y:155},
    ], move:15 },
    { name:"MELTING", color:C.red, icon:"🔥→💧", desc:"Solid → Liquid. Heat breaks the tight bonds!", particles:[], move:8 },
    { name:"FREEZING", color:C.blue, icon:"❄️", desc:"Liquid → Solid. Cold locks particles in place!", particles:[], move:1 },
  ];
  const s = states[Math.min(step, states.length-1)];
  const [tick, setTick] = useState(0);
  useEffect(()=>{
    const id=setInterval(()=>setTick(t=>t+1), 120);
    return()=>clearInterval(id);
  },[]);

  // Simple pseudo-random movement
  const jitter = (base, amp, t, seed) =>
    base + amp * Math.sin(t*0.3 + seed*1.7);

  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:6 }}>
        <span style={{ fontSize:28 }}>{s.icon.split("→")[0]}</span>
        {s.icon.includes("→") && <span style={{ color:C.gold, fontFamily:fn, fontSize:10 }}> → </span>}
        {s.icon.includes("→") && <span style={{ fontSize:28 }}>{s.icon.split("→")[1]}</span>}
      </div>
      <svg width={180} height={160}
        style={{ background:`${s.color}08`, border:`1.5px solid ${s.color}44`, borderRadius:8 }}>
        {/* Container */}
        <rect x={15} y={15} width={150} height={145} rx={8}
          fill="none" stroke={s.color} strokeWidth={2} opacity={0.4}/>
        {/* Particles */}
        {s.particles.map((p,i)=>(
          <circle key={i}
            cx={jitter(p.x, s.move, tick, i)}
            cy={jitter(p.y, s.move, tick, i*1.3)}
            r={8} fill={`${s.color}60`} stroke={s.color} strokeWidth={1.5}/>
        ))}
        {/* State label */}
        <text x={90} y={155} textAnchor="middle" fill={s.color}
          fontSize={9} fontFamily={fp}>{s.name}</text>
      </svg>
      <div style={{ color:"rgba(240,240,255,0.8)", fontFamily:"'Nunito',sans-serif",
        fontSize:13, lineHeight:1.6, marginTop:8, textAlign:"center" }}>
        {s.desc}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 🌱 LIFE CYCLE VISUAL
// ────────────────────────────────────────────────────────────────
export function LifeCycleVisual({ step }) {
  const cycles = [
    { name:"Butterfly", stages:[
      {e:"🥚",l:"Egg",d:"Laid on a leaf"},
      {e:"🐛",l:"Caterpillar",d:"Eats & grows"},
      {e:"🫘",l:"Chrysalis",d:"Transforms inside"},
      {e:"🦋",l:"Butterfly!",d:"Flies & lays eggs"},
    ], color:C.purple },
    { name:"Frog", stages:[
      {e:"🟢",l:"Egg",d:"In the water"},
      {e:"🐠",l:"Tadpole",d:"Swims with tail"},
      {e:"🐸",l:"Froglet",d:"Growing legs!"},
      {e:"🐸",l:"Adult Frog",d:"Lives on land & water"},
    ], color:C.green },
    { name:"Flowering Plant", stages:[
      {e:"🌰",l:"Seed",d:"Waiting to grow"},
      {e:"🌱",l:"Seedling",d:"First tiny leaves"},
      {e:"🌿",l:"Growing Plant",d:"Getting taller"},
      {e:"🌸",l:"Flower",d:"Makes new seeds!"},
    ], color:C.pink },
    { name:"Bird", stages:[
      {e:"🥚",l:"Egg",d:"In the nest"},
      {e:"🐣",l:"Hatchling",d:"Just hatched!"},
      {e:"🐤",l:"Chick",d:"Learning to fly"},
      {e:"🐦",l:"Adult Bird",d:"Lays its own eggs"},
    ], color:C.gold },
  ];
  const c = cycles[Math.min(step, cycles.length-1)];
  const [active, setActive] = useState(0);
  useEffect(()=>{
    setActive(0);
    const id=setInterval(()=>setActive(a=>(a+1)%c.stages.length), 1000);
    return()=>clearInterval(id);
  },[step]);

  return (
    <div>
      <div style={{ color:c.color, fontFamily:fn, fontSize:9, textAlign:"center",
        marginBottom:12 }}>{c.name.toUpperCase()} LIFE CYCLE</div>
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center",
        flexWrap:"wrap", gap:4 }}>
        {c.stages.map((s,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:4 }}>
            <div style={{
              background: i===active ? `${c.color}30` : `${c.color}0a`,
              border:`2px solid ${i===active ? c.color : c.color+"44"}`,
              borderRadius:8, padding:"8px 10px", textAlign:"center",
              transform: i===active ? "scale(1.1)" : "scale(1)",
              transition:"all 0.4s ease",
              boxShadow: i===active ? `0 0 16px ${c.color}` : "none",
              minWidth:62,
            }}>
              <div style={{ fontSize:26, marginBottom:4 }}>{s.e}</div>
              <div style={{ color:i===active?c.color:C.muted, fontFamily:fn, fontSize:6,
                marginBottom:2 }}>{s.l}</div>
              <div style={{ color:C.dim, fontFamily:fn, fontSize:10 }}>{s.d}</div>
            </div>
            {i < c.stages.length-1 && (
              <div style={{ color:c.color, fontFamily:fn, fontSize:10, opacity:0.6 }}>→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 📊 BAR GRAPH VISUAL
// ────────────────────────────────────────────────────────────────
export function BarGraphVisual({ step }) {
  const graphs = [
    { title:"Favourite Pets 🐾", data:[{l:"🐶 Dogs",v:12,c:C.blue},{l:"🐱 Cats",v:8,c:C.pink},{l:"🐠 Fish",v:5,c:C.green},{l:"🐰 Rabbits",v:7,c:C.orange}] },
    { title:"Favourite Seasons ☀️", data:[{l:"🌸 Spring",v:7,c:C.green},{l:"☀️ Summer",v:15,c:C.gold},{l:"🍂 Autumn",v:9,c:C.orange},{l:"❄️ Winter",v:4,c:C.blue}] },
    { title:"Books Read This Month 📚", data:[{l:"Mon",v:3,c:C.purple},{l:"Tue",v:5,c:C.blue},{l:"Wed",v:2,c:C.green},{l:"Thu",v:7,c:C.gold},{l:"Fri",v:4,c:C.pink}] },
  ];
  const g = graphs[Math.min(step%graphs.length, graphs.length-1)];
  const maxV = Math.max(...g.data.map(d=>d.v));
  const chartH = 100;
  const [animH, setAnimH] = useState([]);
  useEffect(()=>{
    setAnimH(g.data.map(()=>0));
    const t=setTimeout(()=>setAnimH(g.data.map(d=>d.v)),100);
    return()=>clearTimeout(t);
  },[step]);

  return (
    <div>
      <div style={{ color:C.gold, fontFamily:fn, fontSize:11, textAlign:"center", marginBottom:10 }}>
        {g.title}
      </div>
      <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:chartH+40,
        padding:"0 8px", justifyContent:"center" }}>
        {g.data.map((d,i)=>{
          const barH = ((animH[i] || 0)/maxV)*chartH;
          return (
            <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
              <div style={{ color:d.c, fontFamily:fn, fontSize:10, marginBottom:4 }}>{animH[i]===d.v?d.v:""}</div>
              <div style={{ width:"100%", height:barH, background:`${d.c}40`,
                border:`2px solid ${d.c}`, borderRadius:"4px 4px 0 0",
                transition:"height 0.8s cubic-bezier(0.4,0,0.2,1)",
                boxShadow:`0 0 8px ${d.c}66` }}/>
              <div style={{ color:C.muted, fontFamily:fn, fontSize:10, textAlign:"center",
                marginTop:6, lineHeight:1.3 }}>{d.l}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 🗺️ HABITATS VISUAL
// ────────────────────────────────────────────────────────────────
export function HabitatVisual({ step }) {
  const habitats = [
    { name:"OCEAN", color:C.blue,   bg:"#001830", emoji:"🌊",
      animals:["🐳","🦈","🐙","🐠","🦑"], plants:["🌿","🪸","🌾"],
      fact:"Covers 71% of Earth! The largest habitat on our planet." },
    { name:"FOREST", color:C.green, bg:"#0a1a0a", emoji:"🌲",
      animals:["🐻","🦊","🦉","🦌","🐿️"], plants:["🌲","🌿","🍄"],
      fact:"Home to more than 50% of all plant and animal species!" },
    { name:"DESERT", color:C.orange,bg:"#1a0f00", emoji:"🏜️",
      animals:["🐪","🦎","🦂","🐍","🦅"], plants:["🌵","🌾","🌴"],
      fact:"Less than 25cm of rain per year. Extreme hot AND cold!" },
    { name:"GRASSLAND", color:C.gold,bg:"#1a1400", emoji:"🌾",
      animals:["🦁","🦓","🐘","🦒","🦬"], plants:["🌾","🌻","🌿"],
      fact:"Wide open land. Perfect for herds of large animals!" },
    { name:"ARCTIC", color:"#88EEFF", bg:"#001020", emoji:"❄️",
      animals:["🐻‍❄️","🐧","🦭","🐋","🦊"], plants:["🌿","🪨","❄️"],
      fact:"Covered in ice and snow. Only the toughest survive here!" },
  ];
  const h = habitats[Math.min(step, habitats.length-1)];
  return (
    <div style={{ background:h.bg, borderRadius:10, padding:12,
      border:`2px solid ${h.color}44` }}>
      <div style={{ color:h.color, fontFamily:fn, fontSize:9, marginBottom:8,
        textShadow:`0 0 10px ${h.color}` }}>
        {h.emoji} {h.name}
      </div>
      <div style={{ display:"flex", gap:12, marginBottom:10 }}>
        <div style={{ flex:1 }}>
          <div style={{ color:C.gold, fontFamily:fn, fontSize:11, fontWeight:800, marginBottom:6 }}>🐾 Animals:</div>
          <div style={{ fontSize:22, letterSpacing:4 }}>{h.animals.join(" ")}</div>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ color:C.green, fontFamily:fn, fontSize:11, fontWeight:800, marginBottom:6 }}>🌿 Plants:</div>
          <div style={{ fontSize:22, letterSpacing:4 }}>{h.plants.join(" ")}</div>
        </div>
      </div>
      <div style={{ background:`${h.color}15`, borderRadius:6, padding:"8px 10px",
        color:C.text, fontFamily:fn, fontSize:12, lineHeight:1.6 }}>
        💡 {h.fact}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 🍃 FOOD CHAIN VISUAL
// ────────────────────────────────────────────────────────────────
export function FoodChainVisual({ step }) {
  const chains = [
    { habitat:"Grassland", links:[
      {e:"🌾",l:"Grass",r:"Producer",c:C.green},
      {e:"🐛",l:"Grasshopper",r:"Herbivore",c:C.gold},
      {e:"🐸",l:"Frog",r:"Carnivore",c:C.blue},
      {e:"🐍",l:"Snake",r:"Carnivore",c:C.orange},
      {e:"🦅",l:"Hawk",r:"Top Predator",c:C.red},
    ]},
    { habitat:"Ocean", links:[
      {e:"🌿",l:"Seaweed",r:"Producer",c:C.green},
      {e:"🦐",l:"Shrimp",r:"Herbivore",c:C.orange},
      {e:"🐠",l:"Small Fish",r:"Carnivore",c:C.blue},
      {e:"🦈",l:"Shark",r:"Top Predator",c:C.red},
    ]},
    { habitat:"Forest", links:[
      {e:"🍂",l:"Leaves",r:"Producer",c:C.green},
      {e:"🐛",l:"Caterpillar",r:"Herbivore",c:C.gold},
      {e:"🐦",l:"Bird",r:"Carnivore",c:C.blue},
      {e:"🦊",l:"Fox",r:"Top Predator",c:C.red},
    ]},
  ];
  const ch = chains[Math.min(step%chains.length, chains.length-1)];
  const [vis, setVis] = useState(0);
  useEffect(()=>{
    setVis(0);
    let i=0; const id=setInterval(()=>{ i++; setVis(i); if(i>=ch.links.length) clearInterval(id); },400);
    return()=>clearInterval(id);
  },[step]);

  return (
    <div>
      <div style={{ color:C.gold, fontFamily:fn, fontSize:11, textAlign:"center", marginBottom:10 }}>
        🌍 {ch.habitat} Food Chain
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4, flexWrap:"wrap" }}>
        {ch.links.map((l,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:4 }}>
            <div style={{
              opacity:i<vis?1:0, transform:i<vis?"scale(1)":"scale(0.5)",
              transition:"all 0.4s ease",
              background:`${l.c}18`, border:`2px solid ${l.c}66`,
              borderRadius:8, padding:"8px 10px", textAlign:"center", minWidth:56,
              boxShadow:i===vis-1?`0 0 14px ${l.c}`:"none",
            }}>
              <div style={{ fontSize:28, marginBottom:4 }}>{l.e}</div>
              <div style={{ color:l.c, fontFamily:fn, fontSize:6, marginBottom:2 }}>{l.l}</div>
              <div style={{ color:C.dim, fontFamily:fn, fontSize:9 }}>{l.r}</div>
            </div>
            {i < ch.links.length-1 && (
              <div style={{ color:C.gold, fontFamily:fn, fontSize:12,
                opacity:i+1<vis?1:0, transition:"opacity 0.3s" }}>→</div>
            )}
          </div>
        ))}
      </div>
      <div style={{ color:C.muted, fontFamily:fn, fontSize:12, textAlign:"center", marginTop:10 }}>
        Each arrow means <span style={{color:C.gold, fontWeight:800}}>"is eaten by"</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// ⛅ WEATHER VISUAL — tools and sky
// ────────────────────────────────────────────────────────────────
export function WeatherVisual({ step }) {
  const scenes = [
    { type:"tools", tools:[
      {e:"🌡️",n:"Thermometer",m:"Measures TEMPERATURE"},
      {e:"🌬️",n:"Anemometer",m:"Measures WIND SPEED"},
      {e:"🧭",n:"Wind Vane",m:"Shows WIND DIRECTION"},
      {e:"☔",n:"Rain Gauge",m:"Measures RAINFALL"},
    ]},
    { type:"seasons" },
    { type:"sky" },
  ];

  const seasons = [
    { name:"SPRING 🌸", color:C.green,  temp:"15°C",  words:["Warm","Rainy","Flowers bloom","New life!"] },
    { name:"SUMMER ☀️", color:C.gold,   temp:"30°C",  words:["Hot","Sunny","Long days","Swim!"] },
    { name:"AUTUMN 🍂", color:C.orange, temp:"12°C",  words:["Cool","Windy","Leaves fall","Harvest!"] },
    { name:"WINTER ❄️", color:C.blue,   temp:"-2°C",  words:["Cold","Snow","Short days","Cosy!"] },
  ];
  const [activeSeason, setActiveSeason] = useState(0);
  useEffect(()=>{
    const id=setInterval(()=>setActiveSeason(s=>(s+1)%4),1200);
    return()=>clearInterval(id);
  },[]);

  const scene = scenes[Math.min(step%3, 2)];

  if (scene.type === "seasons") return (
    <div>
      <div style={{ color:C.gold, fontFamily:fn, fontSize:11, textAlign:"center", marginBottom:10 }}>
        THE 4 SEASONS
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {seasons.map((s,i)=>(
          <div key={i} style={{
            background: i===activeSeason?`${s.color}25`:`${s.color}0a`,
            border:`2px solid ${i===activeSeason?s.color:s.color+"33"}`,
            borderRadius:8, padding:"10px 12px",
            transform:i===activeSeason?"scale(1.04)":"scale(1)",
            transition:"all 0.5s ease",
            boxShadow:i===activeSeason?`0 0 12px ${s.color}`:"none",
          }}>
            <div style={{ color:s.color, fontFamily:fn, fontSize:11, marginBottom:6 }}>{s.name}</div>
            <div style={{ color:C.gold, fontFamily:fn, fontSize:13, fontWeight:800, marginBottom:4 }}>
              {s.temp}
            </div>
            {s.words.map((w,j)=>(
              <div key={j} style={{ color:C.muted, fontFamily:fn, fontSize:11 }}>• {w}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  if (scene.type === "tools") return (
    <div>
      <div style={{ color:C.blue, fontFamily:fn, fontSize:11, textAlign:"center", marginBottom:10 }}>
        WEATHER TOOLS 🔬
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {scene.tools.map((t,i)=>(
          <div key={i} style={{ background:`${C.blue}12`, border:`1.5px solid ${C.blue}33`,
            borderRadius:8, padding:"10px 12px", textAlign:"center" }}>
            <div style={{ fontSize:28, marginBottom:6 }}>{t.e}</div>
            <div style={{ color:C.blue, fontFamily:fn, fontSize:10, marginBottom:4 }}>{t.n}</div>
            <div style={{ color:C.muted, fontFamily:fn, fontSize:11, lineHeight:1.4 }}>{t.m}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // sky
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ color:C.gold, fontFamily:fn, fontSize:11, marginBottom:10 }}>
        ☀️ THE SKY & SPACE
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:16 }}>
        {[
          {e:"☀️",n:"The SUN",f:"A star! 150M km away. Light takes 8 min to reach us!",c:C.gold},
          {e:"🌙",n:"The MOON",f:"Reflects sunlight. Takes 29.5 days to orbit Earth.",c:C.blue},
          {e:"⭐",n:"Stars",f:"Massive balls of fire — look tiny because VERY far away!",c:C.purple},
        ].map((item,i)=>(
          <div key={i} style={{ flex:1, background:`${item.c}12`, border:`1.5px solid ${item.c}33`,
            borderRadius:8, padding:"10px 6px", textAlign:"center" }}>
            <div style={{ fontSize:30, marginBottom:6 }}>{item.e}</div>
            <div style={{ color:item.c, fontFamily:fn, fontSize:10, marginBottom:6 }}>{item.n}</div>
            <div style={{ color:C.muted, fontFamily:fn, fontSize:10, lineHeight:1.5 }}>{item.f}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 🗺️ LANDFORMS VISUAL
// ────────────────────────────────────────────────────────────────
export function LandformsVisual({ step }) {
  const landforms = [
    { name:"MOUNTAIN ⛰️",   color:C.orange, emoji:"⛰️", desc:"Very high land with steep sides. Formed by tectonic plates pushing together over millions of years!", fact:"🏔️ Mount Everest = 8,849 metres tall!" },
    { name:"VALLEY 🏞️",     color:C.green,  emoji:"🏞️", desc:"Low land between hills or mountains. Often carved by rivers flowing for millions of years.", fact:"💧 Rivers always flow from high to low!" },
    { name:"PLAIN 🌾",       color:C.gold,   emoji:"🌾", desc:"Flat, low land. The best land for farming because it has rich soil and is easy to plow.", fact:"🌽 The Great Plains grow most of USA's corn & wheat!" },
    { name:"ISLAND 🏝️",     color:C.blue,   emoji:"🏝️", desc:"Land completely surrounded by water on ALL sides. Islands form from volcanoes or rising sea floors.", fact:"🌺 Hawaii is a chain of volcanic islands!" },
    { name:"PENINSULA 🗺️",  color:C.purple, emoji:"🗺️", desc:"Land surrounded by water on THREE sides. One side connects to the mainland.", fact:"🍕 Italy is shaped like a boot — it's a peninsula!" },
  ];
  const l = landforms[Math.min(step, landforms.length-1)];
  return (
    <div style={{ background:`${l.color}08`, border:`2px solid ${l.color}33`, borderRadius:10, padding:14 }}>
      <div style={{ fontSize:40, textAlign:"center", marginBottom:8 }}>{l.emoji}</div>
      <div style={{ color:l.color, fontFamily:fn, fontSize:9, textAlign:"center", marginBottom:10,
        textShadow:`0 0 10px ${l.color}` }}>{l.name}</div>
      <div style={{ color:C.text, fontFamily:fn, fontSize:13, lineHeight:1.7, marginBottom:10 }}>
        {l.desc}
      </div>
      <div style={{ background:`${l.color}18`, borderRadius:6, padding:"8px 12px",
        color:l.color, fontFamily:fn, fontSize:12, fontWeight:700 }}>{l.fact}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 🔊 AUDIO NARRATION ENGINE (Web Speech API)
// ────────────────────────────────────────────────────────────────
export function useNarration() {
  const [enabled, setEnabled] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef(null);

  const speak = useCallback((text) => {
    if (!enabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    // Strip emojis for cleaner speech
    const clean = text.replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
                      .replace(/[→←↑↓]/g, "")
                      .replace(/\s+/g, " ").trim();
    const u = new SpeechSynthesisUtterance(clean);
    u.rate  = 0.88;
    u.pitch = 1.15;
    u.volume = 0.95;
    // Pick a child-friendly voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes("Samantha") || v.name.includes("Karen") ||
      v.name.includes("Google US") || v.name.includes("en-US")
    );
    if (preferred) u.voice = preferred;
    u.onstart = () => setSpeaking(true);
    u.onend   = () => setSpeaking(false);
    utterRef.current = u;
    window.speechSynthesis.speak(u);
  }, [enabled]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const toggle = useCallback(() => {
    setEnabled(e => { if(e) window.speechSynthesis?.cancel(); return !e; });
  }, []);

  return { enabled, speaking, speak, stop, toggle };
}

// ────────────────────────────────────────────────────────────────
// 🔊 NARRATION TOGGLE BUTTON
// ────────────────────────────────────────────────────────────────
const fn2 = "'Press Start 2P', monospace";
export function NarrationBtn({ enabled, speaking, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      background: enabled ? `rgba(0,212,255,0.15)` : `rgba(27,63,171,0.05)`,
      border: `2px solid ${enabled ? "#00D4FF" : "rgba(255,255,255,0.15)"}`,
      borderRadius:6, padding:"6px 10px", cursor:"pointer",
      display:"flex", alignItems:"center", gap:6,
      boxShadow: enabled ? `0 0 8px #00D4FF55` : "none",
      transition:"all 0.3s",
    }}>
      <span style={{ fontSize:14 }}>{speaking ? "🔊" : enabled ? "🔈" : "🔇"}</span>
      <span style={{ color: enabled?"#00D4FF":"rgba(240,240,255,0.4)",
        fontFamily:fn2, fontSize:6 }}>
        {enabled ? (speaking?"SPEAKING":"AUDIO ON") : "AUDIO OFF"}
      </span>
    </button>
  );
}

// ────────────────────────────────────────────────────────────────
// VISUAL REGISTRY — maps lessonId to component + step mapping
// ────────────────────────────────────────────────────────────────
export const LESSON_VISUALS = {
  // MATH
  "m1-l1": { component: PlaceValueVisual,  label:"📊 Base-Ten Blocks" },
  "m1-l2": { component: PlaceValueVisual,  label:"📊 Place Value" },
  "m1-l3": { component: PlaceValueVisual,  label:"📊 Number Forms" },
  "m1-l4": { component: AddSubVisual,      label:"⚖️ Compare" },
  "m1-l5": { component: PlaceValueVisual,  label:"📏 Number Line" },
  "m1-l6": { component: PlaceValueVisual,  label:"🔄 Patterns" },
  "m2-l1": { component: AddSubVisual,      label:"🧠 Mental Math" },
  "m2-l2": { component: AddSubVisual,      label:"➕ Regrouping" },
  "m2-l3": { component: AddSubVisual,      label:"➖ Borrowing" },
  "m2-l4": { component: AddSubVisual,      label:"📝 Word Problems" },
  "m2-l5": { component: AddSubVisual,      label:"🔢 Three Numbers" },
  "m3-l1": { component: RulerVisual,       label:"📏 Measuring" },
  "m3-l2": { component: RulerVisual,       label:"📏 Centimetres" },
  "m3-l3": { component: RulerVisual,       label:"📏 Estimating" },
  "m3-l4": { component: BarGraphVisual,    label:"📊 Bar Graphs" },
  "m3-l5": { component: BarGraphVisual,    label:"📈 Picture Graphs" },
  "m4-l1": { component: Shapes2DVisual,    label:"🔷 2D Shapes" },
  "m4-l2": { component: Shapes3DVisual,    label:"📦 3D Shapes" },
  "m4-l3": { component: FractionsVisual,   label:"🍕 Fractions" },
  "m4-l4": { component: FractionsVisual,   label:"🥧 Halves/Thirds" },
  "m4-l5": { component: Shapes2DVisual,    label:"🔲 Area" },
  "m5-l1": { component: ClockVisual,       label:"🕐 Clock" },
  "m5-l2": { component: ClockVisual,       label:"🌅 AM/PM" },
  "m5-l3": { component: CoinsVisual,       label:"🪙 Coins" },
  "m5-l4": { component: CoinsVisual,       label:"💵 Making Change" },
  "m5-l5": { component: CoinsVisual,       label:"💰 Money Problems" },
  // SCIENCE
  "s1-l1": { component: MatterVisual,      label:"🔍 Properties" },
  "s1-l2": { component: MatterVisual,      label:"🧊 States" },
  "s1-l3": { component: MatterVisual,      label:"🔥 Heating" },
  "s1-l4": { component: MatterVisual,      label:"🔄 Changes" },
  "s1-l5": { component: MatterVisual,      label:"⚗️ Mixing" },
  "s2-l1": { component: LifeCycleVisual,   label:"🌱 Plant Cycle" },
  "s2-l2": { component: LifeCycleVisual,   label:"☀️ Photosynthesis" },
  "s2-l3": { component: LifeCycleVisual,   label:"🦋 Butterfly" },
  "s2-l4": { component: LifeCycleVisual,   label:"🐦 Bird/Mammal" },
  "s2-l5": { component: LifeCycleVisual,   label:"⚖️ Comparing" },
  "s3-l1": { component: HabitatVisual,     label:"🌍 Habitats" },
  "s3-l2": { component: HabitatVisual,     label:"🐪 Adaptations" },
  "s3-l3": { component: FoodChainVisual,   label:"🍃 Food Chains" },
  "s3-l4": { component: FoodChainVisual,   label:"🌐 Ecosystems" },
  "s3-l5": { component: HabitatVisual,     label:"🏭 Human Impact" },
  "s4-l1": { component: LandformsVisual,   label:"🪨 Rocks" },
  "s4-l2": { component: LandformsVisual,   label:"💧 Erosion" },
  "s4-l3": { component: LandformsVisual,   label:"⛰️ Landforms" },
  "s4-l4": { component: LandformsVisual,   label:"🗺️ Maps" },
  "s4-l5": { component: LandformsVisual,   label:"♻️ Resources" },
  "s5-l1": { component: WeatherVisual,     label:"🌡️ Weather Tools" },
  "s5-l2": { component: WeatherVisual,     label:"🍂 Seasons" },
  "s5-l3": { component: WeatherVisual,     label:"☀️ Sun & Moon" },
  "s5-l4": { component: WeatherVisual,     label:"⚡ Safety" },
  "s5-l5": { component: WeatherVisual,     label:"🌙 Sky Patterns" },
};

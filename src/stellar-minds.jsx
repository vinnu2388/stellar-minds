import { useState, useEffect, useRef, useCallback } from "react";

// ─── GOOGLE FONTS: Press Start 2P + Nunito ─────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap";
document.head.appendChild(fontLink);

// ─── DESIGN TOKENS — ROBLOX/MINECRAFT ENERGY ──────────────────────
const C = {
  bg: "#08080F",
  card: "#0F0F1A",
  cardHi: "#161628",
  border: "rgba(255,255,255,0.08)",
  borderHi: "rgba(255,255,255,0.20)",
  // NEON PALETTE
  green: "#39FF14",   // neon green
  blue: "#00D4FF",    // electric blue
  red: "#FF073A",     // laser red
  gold: "#FFD700",    // gold
  purple: "#BF00FF",  // electric purple
  pink: "#FF10F0",    // hot pink
  orange: "#FF6B00",  // lava orange
  cyan: "#00FFFF",    // cyber cyan
  // Text
  text: "#F0F0FF",
  muted: "rgba(240,240,255,0.70)",
  dim: "rgba(240,240,255,0.40)",
};
const fp = "'Press Start 2P', monospace"; // pixel font
const fn = "'Nunito', sans-serif";        // body font

// ─── SOUND ENGINE (Web Audio API — no external deps) ──────────────
const SFX = {
  ctx: null,
  init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
  play(type) {
    try {
      this.init();
      const ctx = this.ctx;
      const g = ctx.createGain();
      g.connect(ctx.destination);
      const o = ctx.createOscillator();
      o.connect(g);
      const configs = {
        correct:  { freq: [523, 659, 784], dur: 0.08, wave: "square", vol: 0.15 },
        wrong:    { freq: [200, 150], dur: 0.15, wave: "sawtooth", vol: 0.12 },
        levelup:  { freq: [523, 659, 784, 1047], dur: 0.12, wave: "square", vol: 0.2 },
        coin:     { freq: [880, 1100], dur: 0.06, wave: "square", vol: 0.1 },
        boss:     { freq: [80, 60], dur: 0.3, wave: "sawtooth", vol: 0.18 },
        combo:    { freq: [659, 784, 988, 1175], dur: 0.07, wave: "square", vol: 0.18 },
        click:    { freq: [440], dur: 0.04, wave: "square", vol: 0.08 },
      };
      const cfg = configs[type] || configs.click;
      o.type = cfg.wave;
      cfg.freq.forEach((f, i) => {
        const t = ctx.currentTime + i * cfg.dur;
        o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(cfg.vol, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + cfg.dur);
      });
      o.start(ctx.currentTime);
      o.stop(ctx.currentTime + cfg.freq.length * cfg.dur + 0.1);
    } catch (e) {}
  }
};

// ─── RESPONSIVE HOOK ──────────────────────────────────────────────
function useIsTablet() {
  const [tablet, setTablet] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );
  useEffect(() => {
    const fn = () => setTablet(window.innerWidth >= 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return tablet;
}

// ─── PARTICLE SYSTEM ──────────────────────────────────────────────
function useParticles() {
  const [particles, setParticles] = useState([]);
  const idRef = useRef(0);
  const burst = useCallback((x, y, count = 20, colors = [C.gold, C.green, C.blue, C.pink]) => {
    const newP = Array.from({ length: count }, () => ({
      id: idRef.current++,
      x, y,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.7) * 14,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 4,
      life: 1,
      shape: Math.random() > 0.5 ? "square" : "star",
    }));
    setParticles(p => [...p, ...newP]);
    const interval = setInterval(() => {
      setParticles(p => p
        .map(pt => ({ ...pt, x: pt.x + pt.vx, y: pt.y + pt.vy, vy: pt.vy + 0.4, life: pt.life - 0.025 }))
        .filter(pt => pt.life > 0)
      );
    }, 16);
    setTimeout(() => clearInterval(interval), 2000);
  }, []);
  return { particles, burst };
}

function Particles({ particles }) {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: p.x, top: p.y,
          width: p.size, height: p.size,
          background: p.color,
          opacity: p.life,
          transform: p.shape === "star" ? "rotate(45deg)" : "none",
          borderRadius: p.shape === "square" ? 2 : "50%",
          boxShadow: `0 0 6px ${p.color}`,
          transition: "none",
        }} />
      ))}
    </div>
  );
}

// ─── SCREEN SHAKE ─────────────────────────────────────────────────
function useShake() {
  const [shaking, setShaking] = useState(false);
  const shake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 400);
  }, []);
  return { shaking, shake };
}

// ─── RANK SYSTEM ──────────────────────────────────────────────────
const RANKS = [
  { name: "NOOB",     min: 0,    color: C.muted,  emoji: "🥚" },
  { name: "BRONZE",   min: 500,  color: "#CD7F32", emoji: "🥉" },
  { name: "SILVER",   min: 1500, color: "#C0C0C0", emoji: "🥈" },
  { name: "GOLD",     min: 3000, color: C.gold,    emoji: "🥇" },
  { name: "DIAMOND",  min: 6000, color: C.blue,    emoji: "💎" },
  { name: "MASTER",   min: 10000,color: C.purple,  emoji: "👑" },
  { name: "LEGEND",   min: 15000,color: C.pink,    emoji: "⚡" },
  { name: "GALACTIC", min: 25000,color: C.green,   emoji: "🚀" },
];
function getRank(xp) { return [...RANKS].reverse().find(r => xp >= r.min) || RANKS[0]; }
function getNextRank(xp) { return RANKS.find(r => xp < r.min) || null; }
function getRankProgress(xp) {
  const cur = getRank(xp), next = getNextRank(xp);
  if (!next) return 100;
  return Math.round(((xp - cur.min) / (next.min - cur.min)) * 100);
}

// ─── PET SYSTEM ───────────────────────────────────────────────────
const PETS = [
  { id: "cosmo", name: "Cosmo", emoji: "🐱", desc: "Comet Cat", color: C.blue,
    stages: ["🥚","🐱","😺","😸","⭐😺"], buff: "+10% Math XP",
    stageNames: ["Egg","Kitten","Cat","Star Cat","Cosmic Cat"] },
  { id: "nova",  name: "Nova",  emoji: "🐶", desc: "Star Pup",  color: C.orange,
    stages: ["🥚","🐶","🐕","🦊","⭐🐕"], buff: "+10% Science XP",
    stageNames: ["Egg","Pup","Dog","Fox","Star Dog"] },
  { id: "pixel", name: "Pixel", emoji: "🐲", desc: "Block Dragon", color: C.green,
    stages: ["🥚","🦎","🐊","🐲","🔥🐲"], buff: "+5% Coins",
    stageNames: ["Egg","Lizard","Croc","Dragon","LEGENDARY"] },
];
function getPetStage(xp) { return Math.min(Math.floor(xp / 500), 4); }

// ─── BOSS DATA ────────────────────────────────────────────────────
const BOSSES = [
  { id: "minus",   name: "PROFESSOR MINUS",  emoji: "🧛", hp: 10, color: C.purple,
    taunt: "Your math is WEAK, puny student!", world: "Number Nebula",
    reward: { coins: 200, xp: 300, badge: "🧛 Minus Slayer" } },
  { id: "decimal", name: "DECIMAL DEMON",    emoji: "👹", hp: 12, color: C.red,
    taunt: "Decimals will DESTROY you!", world: "Fraction Forest",
    reward: { coins: 300, xp: 400, badge: "👹 Decimal Destroyer" } },
  { id: "void",    name: "COUNT CONFUSIO",   emoji: "🤡", hp: 15, color: C.pink,
    taunt: "CONFUSION is my superpower!", world: "Geometry Galaxy",
    reward: { coins: 400, xp: 500, badge: "🤡 Confusio Crusher" } },
  { id: "gravity", name: "GRAVITY GOBLIN",   emoji: "👺", hp: 14, color: C.orange,
    taunt: "Science is IMPOSSIBLE for you!", world: "Science Station",
    reward: { coins: 350, xp: 450, badge: "👺 Gravity Gobbler" } },
  { id: "final",   name: "THE FINAL EXAM",   emoji: "💀", hp: 20, color: C.gold,
    taunt: "NO ONE has ever defeated me!", world: "Final Boss",
    reward: { coins: 1000, xp: 2000, badge: "💀 GALACTIC CHAMPION" } },
];

// ─── QUESTION BANK ────────────────────────────────────────────────
const QUESTION_BANK = {
  "2-3": {
    Math: [
      {id:1,q:"What is 2 + 3?",opts:["4","5","6","7"],ans:1,diff:1,topic:"Addition"},
      {id:2,q:"What is 4 × 3?",opts:["10","12","14","16"],ans:1,diff:1,topic:"Multiplication"},
      {id:3,q:"What is 1/2 + 1/4?",opts:["1/6","2/6","3/4","1/4"],ans:2,diff:2,topic:"Fractions"},
      {id:4,q:"What is 15 ÷ 3?",opts:["3","4","5","6"],ans:2,diff:2,topic:"Division"},
      {id:5,q:"Pizza has 8 slices, you eat 3/8. How many slices?",opts:["2","3","4","5"],ans:1,diff:3,topic:"Fractions"},
      {id:6,q:"What is 7 × 8?",opts:["54","56","58","64"],ans:1,diff:2,topic:"Multiplication"},
      {id:7,q:"Largest fraction: 1/2, 1/3, or 3/4?",opts:["1/2","1/3","3/4","Equal"],ans:2,diff:3,topic:"Fractions"},
      {id:8,q:"What is 6 × 4?",opts:["20","22","24","26"],ans:2,diff:1,topic:"Multiplication"},
      {id:9,q:"What is 36 ÷ 6?",opts:["5","6","7","8"],ans:1,diff:1,topic:"Division"},
      {id:10,q:"What is 3/4 of 20?",opts:["10","12","15","18"],ans:2,diff:3,topic:"Fractions"},
    ],
    Science: [
      {id:11,q:"Which planet is closest to the Sun?",opts:["Venus","Earth","Mercury","Mars"],ans:2,diff:1,topic:"Space"},
      {id:12,q:"Plants make food using sunlight, water and...?",opts:["Nitrogen","CO2","Oxygen","Soil"],ans:1,diff:2,topic:"Plants"},
      {id:13,q:"How many planets in our solar system?",opts:["7","8","9","10"],ans:1,diff:1,topic:"Space"},
      {id:14,q:"What gas do plants release during photosynthesis?",opts:["CO2","Nitrogen","Oxygen","Hydrogen"],ans:2,diff:3,topic:"Plants"},
      {id:15,q:"Largest planet in our solar system?",opts:["Saturn","Neptune","Jupiter","Uranus"],ans:2,diff:2,topic:"Space"},
    ],
  },
  "K-1": {
    Math: [
      {id:16,q:"How many legs does a dog have?",opts:["2","4","6","8"],ans:1,diff:1,topic:"Counting"},
      {id:17,q:"What comes after 9?",opts:["7","8","11","10"],ans:3,diff:1,topic:"Counting"},
      {id:18,q:"Which shape has 3 sides?",opts:["Square","Circle","Triangle","Rectangle"],ans:2,diff:1,topic:"Shapes"},
      {id:19,q:"How many fingers on 2 hands?",opts:["8","9","10","12"],ans:2,diff:1,topic:"Counting"},
      {id:20,q:"What is 3 + 4?",opts:["6","7","8","9"],ans:1,diff:2,topic:"Addition"},
    ],
    Science: [
      {id:21,q:"What do fish breathe with?",opts:["Lungs","Gills","Skin","Nose"],ans:1,diff:2,topic:"Animals"},
      {id:22,q:"What does the sun give us?",opts:["Rain","Light & warmth","Wind","Snow"],ans:1,diff:1,topic:"Weather"},
      {id:23,q:"Where do polar bears live?",opts:["Desert","Rainforest","Arctic","Ocean"],ans:2,diff:2,topic:"Animals"},
    ],
  },
  "4-5": {
    Math: [
      {id:24,q:"What is 25% of 80?",opts:["15","20","25","30"],ans:1,diff:2,topic:"Percentages"},
      {id:25,q:"What is 144 ÷ 12?",opts:["11","12","13","14"],ans:1,diff:2,topic:"Division"},
      {id:26,q:"What is 0.75 as a fraction?",opts:["1/4","1/2","3/4","2/3"],ans:2,diff:3,topic:"Decimals"},
      {id:27,q:"What is 15% of 200?",opts:["25","30","35","40"],ans:1,diff:3,topic:"Percentages"},
      {id:28,q:"What is 8²?",opts:["16","48","64","56"],ans:2,diff:3,topic:"Exponents"},
      {id:29,q:"What is 9 × 7?",opts:["54","56","63","72"],ans:2,diff:1,topic:"Multiplication"},
    ],
    Science: [
      {id:30,q:"Which force pulls objects toward Earth?",opts:["Friction","Gravity","Magnetism","Tension"],ans:1,diff:1,topic:"Forces"},
      {id:31,q:"What energy does the Sun produce?",opts:["Chemical","Nuclear","Electrical","Mechanical"],ans:1,diff:3,topic:"Energy"},
      {id:32,q:"How many bones in the adult human body?",opts:["186","206","226","246"],ans:1,diff:3,topic:"Body"},
      {id:33,q:"Water turning to vapor is called?",opts:["Condensation","Precipitation","Evaporation","Filtration"],ans:2,diff:2,topic:"Water Cycle"},
    ],
  },
};

// ─── LEADERBOARD DATA ─────────────────────────────────────────────
const LEADERBOARD = [
  {rank:1,name:"Zara",avatar:"👧",xp:4200,streak:14,change:0,crown:true},
  {rank:2,name:"Leo",xp:3800,streak:9,avatar:"👦",change:1},
  {rank:3,name:"Alex",xp:2840,streak:9,avatar:"🧒",change:-1},
  {rank:4,name:"Maya",xp:2100,streak:5,avatar:"👧",change:2},
  {rank:5,name:"Sam",xp:1890,streak:3,avatar:"🧒",change:0},
  {rank:6,name:"Nia",xp:1450,streak:7,avatar:"👧",change:3},
  {rank:7,name:"Jake",xp:1200,streak:2,avatar:"👦",change:-2},
  {rank:8,name:"Priya",xp:980,streak:4,avatar:"👧",change:1},
];

// ─── PROFILES ─────────────────────────────────────────────────────
const PROFILES = [
  { id:"s1", name:"Alex", avatar:"🧒", grade:"2-3", gradeLabel:"3rd Grade",
    coins:420, xp:2840, streak:9, rank:3,
    adaptLevel:2, petId:"cosmo", petHunger:70,
    badges:["🧛 Minus Slayer","⚡ Speed Demon","🌟 Star Gazer"],
    bossesDefeated:["minus"], hearts:3 },
  { id:"s2", name:"Mia", avatar:"👧", grade:"K-1", gradeLabel:"1st Grade",
    coins:210, xp:980, streak:5, rank:8,
    adaptLevel:1, petId:"nova", petHunger:45,
    badges:["🌟 Star Gazer"], bossesDefeated:[], hearts:3 },
];

// ─── SHARED UI COMPONENTS ─────────────────────────────────────────
function PixelBorder({ children, color = C.blue, style = {}, onClick }) {
  const [active, setActive] = useState(false);
  const handlePress = (e) => {
    e.preventDefault();
    onClick?.();
  };
  return (
    <div
      onPointerDown={() => onClick && setActive(true)}
      onPointerUp={(e) => { setActive(false); if (onClick) handlePress(e); }}
      onPointerLeave={() => setActive(false)}
      onPointerCancel={() => setActive(false)}
      style={{
        border: `3px solid ${color}`,
        borderRadius: 4,
        boxShadow: active
          ? `0 0 20px ${color}88, inset 0 0 12px ${color}22`
          : `0 0 12px ${color}44, inset 0 0 8px ${color}11`,
        transform: active ? "scale(0.97)" : "scale(1)",
        transition: "transform 0.1s, box-shadow 0.1s",
        cursor: onClick ? "pointer" : "default",
        touchAction: "manipulation",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTapHighlightColor: "transparent",
        ...style
      }}
    >
      {children}
    </div>
  );
}

function NeonBtn({ ch, onClick, color = C.green, style = {}, sm, disabled }) {
  const [active, setActive] = useState(false);
  const handlePress = (e) => {
    e.preventDefault();
    if (disabled) return;
    SFX.play("click");
    onClick?.();
  };
  return (
    <button
      onPointerDown={() => !disabled && setActive(true)}
      onPointerUp={(e) => { setActive(false); handlePress(e); }}
      onPointerLeave={() => setActive(false)}
      onPointerCancel={() => setActive(false)}
      onClick={(e) => e.preventDefault()} // prevent double-fire on mobile
      style={{
        background: disabled ? "#1a1a2e" : active ? color : "transparent",
        border: `3px solid ${disabled ? C.dim : color}`,
        borderRadius: 4,
        padding: sm ? "8px 14px" : "14px 20px",
        color: disabled ? C.dim : active ? C.bg : color,
        fontWeight: 900,
        fontSize: sm ? 9 : 11,
        fontFamily: fp,
        cursor: disabled ? "not-allowed" : "pointer",
        letterSpacing: 1,
        boxShadow: disabled ? "none" : active ? `0 0 24px ${color}` : `0 0 8px ${color}44`,
        transition: "background 0.1s, box-shadow 0.1s, color 0.1s",
        textTransform: "uppercase",
        touchAction: "manipulation",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTapHighlightColor: "transparent",
        minHeight: sm ? 36 : 48, // minimum tap target size
        ...style
      }}
    >
      {ch}
    </button>
  );
}

function XPBar({ xp, showRank = true }) {
  const rank = getRank(xp);
  const next = getNextRank(xp);
  const pct = getRankProgress(xp);
  return (
    <div style={{ width: "100%" }}>
      {showRank && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ color: rank.color, fontSize: 8, fontFamily: fp, letterSpacing: 1 }}>
            {rank.emoji} {rank.name}
          </span>
          {next && <span style={{ color: C.dim, fontSize: 7, fontFamily: fp }}>
            {next.min - xp} XP → {next.name}
          </span>}
        </div>
      )}
      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 2, height: 12, border: `1px solid ${rank.color}44`, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: `linear-gradient(90deg, ${rank.color}88, ${rank.color})`,
          boxShadow: `0 0 8px ${rank.color}`,
          transition: "width 1s ease",
          borderRadius: 2,
        }} />
      </div>
      <div style={{ color: C.dim, fontSize: 7, fontFamily: fp, marginTop: 4, textAlign: "right" }}>
        {xp.toLocaleString()} XP
      </div>
    </div>
  );
}

function ComboFlash({ combo }) {
  if (combo < 3) return null;
  const msgs = { 3: { text: "COMBO!", color: C.green }, 5: { text: "ULTRA COMBO!", color: C.blue }, 8: { text: "MEGA COMBO!!", color: C.purple }, 10: { text: "🔥 LEGENDARY!! 🔥", color: C.gold } };
  const best = [10, 8, 5, 3].find(k => combo >= k);
  const m = msgs[best];
  return (
    <div style={{
      position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
      color: m.color, fontFamily: fp, fontSize: combo >= 8 ? 18 : 14,
      textShadow: `0 0 20px ${m.color}, 0 0 40px ${m.color}`,
      animation: "comboFlash 0.5s ease",
      zIndex: 999, pointerEvents: "none", whiteSpace: "nowrap",
      letterSpacing: 2,
    }}>
      {m.text} ×{combo}
    </div>
  );
}

function LevelUpBanner({ rank }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9998, flexDirection: "column", gap: 16,
    }}>
      <div style={{ fontSize: 80, animation: "bounce 0.6s ease infinite alternate" }}>
        {rank.emoji}
      </div>
      <div style={{ color: rank.color, fontFamily: fp, fontSize: 22, textAlign: "center",
        textShadow: `0 0 30px ${rank.color}, 0 0 60px ${rank.color}`, letterSpacing: 3 }}>
        RANK UP!
      </div>
      <div style={{ color: rank.color, fontFamily: fp, fontSize: 16, letterSpacing: 2 }}>
        {rank.name}
      </div>
      <div style={{ color: C.muted, fontFamily: fn, fontSize: 14 }}>
        You're getting stronger! 💪
      </div>
    </div>
  );
}

function HeartBar({ hearts, max = 3 }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ fontSize: 18, filter: i < hearts ? "none" : "grayscale(1) opacity(0.3)" }}>❤️</span>
      ))}
    </div>
  );
}

function Bg() {
  const dots = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    sz: Math.random() > 0.8 ? 3 : 1,
    color: [C.blue, C.green, C.purple, C.pink][Math.floor(Math.random() * 4)],
    op: Math.random() * 0.4 + 0.1,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {dots.map(d => (
        <div key={d.id} style={{
          position: "absolute", top: d.top, left: d.left,
          width: d.sz, height: d.sz,
          background: d.color, opacity: d.op,
          boxShadow: d.sz > 1 ? `0 0 4px ${d.color}` : "none",
          borderRadius: "50%",
        }} />
      ))}
    </div>
  );
}

// ─── CSS ANIMATIONS ───────────────────────────────────────────────
const styleEl = document.createElement("style");
styleEl.textContent = `
  * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
  html { touch-action: manipulation; }
  @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-16px); } }
  @keyframes comboFlash { 0% { transform: translateX(-50%) scale(0.5); opacity:0; } 60% { transform: translateX(-50%) scale(1.2); opacity:1; } 100% { transform: translateX(-50%) scale(1); opacity:1; } }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
  @keyframes glowPulse { 0%,100%{box-shadow:0 0 8px currentColor} 50%{box-shadow:0 0 24px currentColor, 0 0 48px currentColor} }
  @keyframes petBounce { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-8px) scale(1.05)} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .shake { animation: shake 0.4s ease; }
  .pet-idle { animation: petBounce 2s ease-in-out infinite; }
  button { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
`;
document.head.appendChild(styleEl);

// ═══════════════════════════════════════════════════════════════════
// ── SCREEN: HOME ──────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════
function HomeScreen({ profile, onNav, burst }) {
  const pet = PETS.find(p => p.id === profile.petId) || PETS[0];
  const petStage = getPetStage(profile.xp);
  const rank = getRank(profile.xp);
  const nextRank = getNextRank(profile.xp);

  const feedPet = (e) => {
    if (profile.coins < 20) return;
    SFX.play("coin");
    burst(e.clientX, e.clientY, 15, [C.gold, C.orange]);
  };

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 12, animation: "fadeIn 0.4s ease" }}>

      {/* ── PLAYER CARD ── */}
      <PixelBorder color={rank.color} style={{ background: C.card, borderRadius: 4, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 4, fontSize: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: `${rank.color}22`, border: `2px solid ${rank.color}`,
            boxShadow: `0 0 16px ${rank.color}66`,
          }}>
            {profile.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: rank.color, fontFamily: fp, fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>
              {rank.emoji} {profile.name.toUpperCase()}
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ color: C.gold, fontFamily: fp, fontSize: 9 }}>⭐ {profile.coins}</span>
              <span style={{ color: C.orange, fontFamily: fp, fontSize: 9 }}>🔥 {profile.streak}d</span>
              <span style={{ color: C.blue, fontFamily: fp, fontSize: 9 }}>#{profile.rank}</span>
            </div>
          </div>
          <HeartBar hearts={profile.hearts} />
        </div>
        <XPBar xp={profile.xp} />
      </PixelBorder>

      {/* ── PET ── */}
      <PixelBorder color={pet.color} style={{ background: C.card, borderRadius: 4, padding: 16, textAlign: "center" }}>
        <div style={{ color: pet.color, fontFamily: fp, fontSize: 8, marginBottom: 8, letterSpacing: 1 }}>
          YOUR PET — {pet.name.toUpperCase()}
        </div>
        <div className="pet-idle" style={{ fontSize: 64, margin: "8px 0", cursor: "pointer",
          touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
          onPointerUp={feedPet}>
          {pet.stages[petStage]}
        </div>
        <div style={{ color: C.muted, fontFamily: fn, fontSize: 11, marginBottom: 8 }}>
          {pet.stageNames[petStage]} • Stage {petStage + 1}/5
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ color: C.dim, fontSize: 8, fontFamily: fp }}>HUNGER</span>
            <span style={{ color: C.orange, fontSize: 8, fontFamily: fp }}>{profile.petHunger}%</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 2, height: 8, border: `1px solid ${C.orange}44` }}>
            <div style={{ width: `${profile.petHunger}%`, height: "100%", background: profile.petHunger > 50 ? C.green : profile.petHunger > 25 ? C.orange : C.red, transition: "width 0.5s" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <NeonBtn ch="🍖 FEED (20⭐)" onClick={feedPet} color={C.orange} sm style={{ flex: 1 }} />
          <NeonBtn ch="🐾 SWITCH" onClick={() => {}} color={pet.color} sm style={{ flex: 1 }} />
        </div>
        <div style={{ color: pet.color, fontFamily: fp, fontSize: 7, marginTop: 8 }}>BUFF: {pet.buff}</div>
      </PixelBorder>

      {/* ── QUICK ACTIONS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { label: "▶ STORY MODE", color: C.purple, tab: "boss", emoji: "⚔️" },
          { label: "⚡ QUICK QUIZ", color: C.blue, tab: "compete", emoji: "🧠" },
          { label: "🏆 LEADERBOARD", color: C.gold, tab: "leaderboard", emoji: "👑" },
          { label: "📚 LEARN", color: C.green, tab: "learn", emoji: "📖" },
        ].map(a => (
          <PixelBorder key={a.tab} color={a.color} style={{ background: C.card, padding: 14, textAlign: "center" }}
            onClick={() => { SFX.play("click"); onNav(a.tab); }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{a.emoji}</div>
            <div style={{ color: a.color, fontFamily: fp, fontSize: 7, letterSpacing: 1 }}>{a.label}</div>
          </PixelBorder>
        ))}
      </div>

      {/* ── RECENT BADGES ── */}
      {profile.badges.length > 0 && (
        <PixelBorder color={C.gold} style={{ background: C.card, padding: 14 }}>
          <div style={{ color: C.gold, fontFamily: fp, fontSize: 8, marginBottom: 10, letterSpacing: 1 }}>BADGES COLLECTED</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {profile.badges.map((b, i) => (
              <div key={i} style={{
                background: `${C.gold}15`, border: `2px solid ${C.gold}55`,
                borderRadius: 4, padding: "6px 10px",
                color: C.gold, fontFamily: fn, fontSize: 11, fontWeight: 700,
              }}>{b}</div>
            ))}
          </div>
        </PixelBorder>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ── SCREEN: BOSS BATTLE ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════
function BossScreen({ profile, burst, shake }) {
  const [phase, setPhase] = useState("map");   // map | battle | victory | defeat
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [bossHp, setBossHp] = useState(0);
  const [playerHearts, setPlayerHearts] = useState(profile.hearts);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [combo, setCombo] = useState(0);
  const [bossShaking, setBossShaking] = useState(false);
  const [reward, setReward] = useState(null);

  const bank = QUESTION_BANK[profile.grade]?.Math || QUESTION_BANK["2-3"].Math;
  const q = bank[qIdx % bank.length];

  const startBattle = (boss) => {
    SFX.play("boss");
    setSelectedBoss(boss);
    setBossHp(boss.hp);
    setPlayerHearts(profile.hearts);
    setQIdx(0); setSelected(null); setAnswered(false); setCombo(0);
    setPhase("battle");
  };

  const handleAnswer = (i, e) => {
    if (answered) return;
    setSelected(i); setAnswered(true);
    const correct = i === q.ans;
    if (correct) {
      SFX.play("correct");
      burst(e.clientX, e.clientY, 20, [C.green, C.gold, C.blue]);
      setCombo(c => c + 1);
      const dmg = combo >= 5 ? 3 : combo >= 3 ? 2 : 1;
      const newHp = Math.max(0, bossHp - dmg);
      setBossHp(newHp);
      if (newHp === 0) {
        setTimeout(() => {
          SFX.play("levelup");
          burst(window.innerWidth / 2, window.innerHeight / 2, 60, [C.gold, C.green, C.blue, C.pink]);
          setReward(selectedBoss.reward);
          setPhase("victory");
        }, 600);
      }
    } else {
      SFX.play("wrong");
      shake();
      setBossShaking(true);
      setTimeout(() => setBossShaking(false), 500);
      setCombo(0);
      const newHearts = playerHearts - 1;
      setPlayerHearts(newHearts);
      if (newHearts <= 0) {
        setTimeout(() => setPhase("defeat"), 800);
      }
    }
  };

  const next = () => {
    setQIdx(i => i + 1);
    setSelected(null);
    setAnswered(false);
  };

  // ── MAP VIEW ──
  if (phase === "map") return (
    <div style={{ padding: 16, animation: "fadeIn 0.4s ease" }}>
      <div style={{ color: C.gold, fontFamily: fp, fontSize: 12, marginBottom: 4, letterSpacing: 2 }}>⚔️ STORY MODE</div>
      <div style={{ color: C.muted, fontFamily: fn, fontSize: 12, marginBottom: 20 }}>
        Defeat all bosses to become a Galactic Champion!
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {BOSSES.map((boss, idx) => {
          const defeated = profile.bossesDefeated?.includes(boss.id);
          const locked = idx > 0 && !profile.bossesDefeated?.includes(BOSSES[idx - 1].id);
          return (
            <PixelBorder key={boss.id}
              color={defeated ? C.green : locked ? C.dim : boss.color}
              style={{ background: C.card, padding: 16, opacity: locked ? 0.5 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  fontSize: 40, width: 56, height: 56, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  background: `${boss.color}20`, border: `2px solid ${boss.color}44`,
                  borderRadius: 4, flexShrink: 0,
                }}>
                  {defeated ? "✅" : locked ? "🔒" : boss.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: defeated ? C.green : locked ? C.dim : boss.color, fontFamily: fp, fontSize: 8, letterSpacing: 1, marginBottom: 4 }}>
                    {boss.name}
                  </div>
                  <div style={{ color: C.muted, fontFamily: fn, fontSize: 11, marginBottom: 6 }}>
                    {boss.world} • {boss.hp} HP
                  </div>
                  <div style={{ color: C.gold, fontFamily: fn, fontSize: 10, fontStyle: "italic" }}>
                    "{boss.taunt}"
                  </div>
                </div>
                {!defeated && !locked && (
                  <NeonBtn ch="FIGHT!" color={boss.color} sm
                    onClick={() => startBattle(boss)} />
                )}
                {defeated && <span style={{ color: C.green, fontFamily: fp, fontSize: 8 }}>SLAIN!</span>}
              </div>
              {!locked && !defeated && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ color: C.dim, fontFamily: fp, fontSize: 7, marginBottom: 4 }}>REWARD:</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ color: C.gold, fontFamily: fn, fontSize: 10 }}>⭐ {boss.reward.coins}</span>
                    <span style={{ color: C.blue, fontFamily: fn, fontSize: 10 }}>✨ {boss.reward.xp} XP</span>
                    <span style={{ color: C.pink, fontFamily: fn, fontSize: 10 }}>{boss.reward.badge}</span>
                  </div>
                </div>
              )}
            </PixelBorder>
          );
        })}
      </div>
    </div>
  );

  // ── BATTLE VIEW ──
  if (phase === "battle") return (
    <div style={{ padding: 16, animation: "fadeIn 0.3s ease" }}>
      <ComboFlash combo={combo} />

      {/* Boss HP */}
      <PixelBorder color={selectedBoss.color} style={{ background: C.card, padding: 14, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ color: selectedBoss.color, fontFamily: fp, fontSize: 8, letterSpacing: 1 }}>
            {selectedBoss.name}
          </div>
          <div style={{ color: C.red, fontFamily: fp, fontSize: 8 }}>HP: {bossHp}/{selectedBoss.hp}</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 2, height: 16, border: `1px solid ${C.red}55` }}>
          <div style={{
            width: `${(bossHp / selectedBoss.hp) * 100}%`,
            height: "100%",
            background: bossHp > selectedBoss.hp * 0.5 ? C.red : bossHp > selectedBoss.hp * 0.25 ? C.orange : C.gold,
            boxShadow: `0 0 8px ${C.red}`,
            transition: "width 0.5s",
          }} />
        </div>
        <div className={bossShaking ? "shake" : ""} style={{ textAlign: "center", fontSize: 56, marginTop: 8 }}>
          {selectedBoss.emoji}
        </div>
        {answered && !selected !== q.ans && (
          <div style={{ color: selectedBoss.color, fontFamily: fn, fontSize: 11, textAlign: "center", fontStyle: "italic" }}>
            "{selectedBoss.taunt}"
          </div>
        )}
      </PixelBorder>

      {/* Player HP */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <HeartBar hearts={playerHearts} />
        {combo >= 3 && <div style={{ color: C.green, fontFamily: fp, fontSize: 7 }}>×{combo} COMBO!</div>}
        <div style={{ color: C.dim, fontFamily: fp, fontSize: 7 }}>Q {qIdx + 1}</div>
      </div>

      {/* Question */}
      <PixelBorder color={C.blue} style={{ background: C.card, padding: 14, marginBottom: 12 }}>
        <div style={{ color: C.text, fontFamily: fn, fontSize: 15, fontWeight: 800, lineHeight: 1.5, textAlign: "center" }}>
          {q.q}
        </div>
      </PixelBorder>

      {/* Answers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {q.opts.map((opt, i) => {
          const isCorrect = i === q.ans;
          const isSelected = i === selected;
          const color = answered
            ? isCorrect ? C.green : isSelected ? C.red : C.border
            : C.blue;
          return (
            <PixelBorder key={i} color={color}
              style={{
                background: answered && isCorrect ? `${C.green}20` : answered && isSelected ? `${C.red}20` : C.card,
                padding: 14,
              }}
              onClick={answered ? undefined : (e) => handleAnswer(i, e)}>
              <div style={{ color: answered ? (isCorrect ? C.green : isSelected ? C.red : C.dim) : C.text, fontFamily: fn, fontSize: 14, fontWeight: 800 }}>
                {opt}
              </div>
            </PixelBorder>
          );
        })}
      </div>

      {answered && bossHp > 0 && playerHearts > 0 && (
        <NeonBtn ch={`${selected === q.ans ? "⚔️ ATTACK AGAIN!" : "💪 KEEP FIGHTING!"}`}
          color={selected === q.ans ? C.green : C.orange}
          onClick={next}
          style={{ width: "100%", marginTop: 12 }} />
      )}
    </div>
  );

  // ── VICTORY ──
  if (phase === "victory") return (
    <div style={{ padding: 24, textAlign: "center", animation: "fadeIn 0.4s ease" }}>
      <div style={{ fontSize: 80, marginBottom: 16, animation: "bounce 0.6s ease infinite alternate" }}>🏆</div>
      <div style={{ color: C.gold, fontFamily: fp, fontSize: 18, letterSpacing: 3, marginBottom: 8,
        textShadow: `0 0 30px ${C.gold}` }}>
        VICTORY!
      </div>
      <div style={{ color: C.muted, fontFamily: fn, fontSize: 14, marginBottom: 24 }}>
        {selectedBoss.name} has been defeated!
      </div>
      {reward && (
        <PixelBorder color={C.gold} style={{ background: C.card, padding: 20, marginBottom: 20, textAlign: "left" }}>
          <div style={{ color: C.gold, fontFamily: fp, fontSize: 10, marginBottom: 12, textAlign: "center", letterSpacing: 2 }}>
            🎁 LOOT DROP!
          </div>
          {[
            { label: "Star Coins", value: `+${reward.coins} ⭐`, color: C.gold },
            { label: "XP Earned", value: `+${reward.xp} XP`, color: C.blue },
            { label: "New Badge", value: reward.badge, color: C.pink },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.muted, fontFamily: fn, fontSize: 12 }}>{r.label}</span>
              <span style={{ color: r.color, fontFamily: fp, fontSize: 10 }}>{r.value}</span>
            </div>
          ))}
        </PixelBorder>
      )}
      <NeonBtn ch="← BACK TO MAP" color={C.gold} onClick={() => setPhase("map")} style={{ width: "100%" }} />
    </div>
  );

  // ── DEFEAT ──
  if (phase === "defeat") return (
    <div style={{ padding: 24, textAlign: "center", animation: "fadeIn 0.4s ease" }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>💀</div>
      <div style={{ color: C.red, fontFamily: fp, fontSize: 18, letterSpacing: 3, marginBottom: 8,
        textShadow: `0 0 30px ${C.red}` }}>
        DEFEATED...
      </div>
      <div style={{ color: C.muted, fontFamily: fn, fontSize: 14, marginBottom: 8 }}>
        {selectedBoss.name} wins this round!
      </div>
      <div style={{ color: selectedBoss.color, fontFamily: fn, fontSize: 13, fontStyle: "italic", marginBottom: 24 }}>
        "{selectedBoss.taunt}"
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <NeonBtn ch="🔄 TRY AGAIN" color={C.red} onClick={() => startBattle(selectedBoss)} style={{ flex: 1 }} />
        <NeonBtn ch="← MAP" color={C.dim} onClick={() => setPhase("map")} style={{ flex: 1 }} />
      </div>
    </div>
  );

  return null;
}

// ═══════════════════════════════════════════════════════════════════
// ── SCREEN: LEADERBOARD ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════
function LeaderboardScreen({ profile }) {
  const [tab, setTab] = useState("class");

  const rankColors = [C.gold, C.muted, "#CD7F32"];

  return (
    <div style={{ padding: 16, animation: "fadeIn 0.4s ease" }}>
      <div style={{ color: C.gold, fontFamily: fp, fontSize: 12, marginBottom: 4, letterSpacing: 2 }}>🏆 LEADERBOARD</div>

      {/* Week timer */}
      <PixelBorder color={C.purple} style={{ background: C.card, padding: 12, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: C.purple, fontFamily: fp, fontSize: 7, letterSpacing: 1 }}>SEASON RESETS IN</div>
          <div style={{ color: C.text, fontFamily: fp, fontSize: 11, marginTop: 4 }}>3d 14h 22m</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: C.dim, fontFamily: fp, fontSize: 7 }}>TOP PRIZE</div>
          <div style={{ color: C.gold, fontFamily: fp, fontSize: 9, marginTop: 4 }}>👑 500 ⭐ + CROWN</div>
        </div>
      </PixelBorder>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["class", "school", "global"].map(t => (
          <NeonBtn key={t} ch={t.toUpperCase()} color={tab === t ? C.gold : C.dim}
            sm onClick={() => setTab(t)} style={{ flex: 1 }} />
        ))}
      </div>

      {/* Podium — top 3 */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 8, marginBottom: 16, height: 110 }}>
        {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((player, idx) => {
          const isFirst = idx === 1;
          const podiumColors = [C.muted, C.gold, "#CD7F32"];
          const heights = [80, 110, 60];
          return (
            <div key={player.rank} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 90 }}>
              <div style={{ fontSize: isFirst ? 36 : 28, marginBottom: 4 }}>{player.avatar}</div>
              {isFirst && <div style={{ fontSize: 18, marginBottom: 2 }}>👑</div>}
              <div style={{ color: podiumColors[idx], fontFamily: fp, fontSize: 7, marginBottom: 4, textAlign: "center" }}>
                {player.name.toUpperCase()}
              </div>
              <div style={{
                background: `${podiumColors[idx]}33`,
                border: `2px solid ${podiumColors[idx]}`,
                borderRadius: "4px 4px 0 0",
                width: "100%", height: heights[idx],
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column",
              }}>
                <div style={{ color: podiumColors[idx], fontFamily: fp, fontSize: 14, fontWeight: 900 }}>
                  #{isFirst ? 1 : idx === 0 ? 2 : 3}
                </div>
                <div style={{ color: C.dim, fontFamily: fn, fontSize: 9 }}>
                  {player.xp.toLocaleString()} XP
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {LEADERBOARD.map((player) => {
          const isMe = player.name === profile.name;
          const color = player.rank <= 3 ? rankColors[player.rank - 1] : isMe ? C.blue : C.border;
          return (
            <PixelBorder key={player.rank} color={color}
              style={{ background: isMe ? `${C.blue}15` : C.card, padding: "10px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ color: player.rank <= 3 ? rankColors[player.rank - 1] : C.dim, fontFamily: fp, fontSize: 10, width: 24, textAlign: "center" }}>
                  {player.rank <= 3 ? ["🥇","🥈","🥉"][player.rank - 1] : `#${player.rank}`}
                </div>
                <div style={{ fontSize: 24 }}>{player.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: isMe ? C.blue : C.text, fontFamily: fp, fontSize: 8 }}>
                      {player.name.toUpperCase()}
                    </span>
                    {player.crown && <span>👑</span>}
                    {isMe && <span style={{ color: C.blue, fontFamily: fp, fontSize: 6 }}>YOU</span>}
                  </div>
                  <div style={{ color: C.dim, fontFamily: fn, fontSize: 10, marginTop: 2 }}>
                    🔥 {player.streak}d streak
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: C.text, fontFamily: fp, fontSize: 9 }}>{player.xp.toLocaleString()}</div>
                  <div style={{ color: player.change > 0 ? C.green : player.change < 0 ? C.red : C.dim, fontFamily: fp, fontSize: 7, marginTop: 2 }}>
                    {player.change > 0 ? `↑${player.change}` : player.change < 0 ? `↓${Math.abs(player.change)}` : "—"}
                  </div>
                </div>
              </div>
            </PixelBorder>
          );
        })}
      </div>

      {/* My position card */}
      <PixelBorder color={C.blue} style={{ background: `${C.blue}15`, padding: 14, marginTop: 12 }}>
        <div style={{ color: C.blue, fontFamily: fp, fontSize: 8, marginBottom: 8 }}>YOUR STANDING</div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {[
            { label: "RANK", value: `#${profile.rank}` },
            { label: "XP", value: profile.xp.toLocaleString() },
            { label: "STREAK", value: `${profile.streak}d 🔥` },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ color: C.dim, fontFamily: fp, fontSize: 6, marginBottom: 4 }}>{s.label}</div>
              <div style={{ color: C.blue, fontFamily: fp, fontSize: 10 }}>{s.value}</div>
            </div>
          ))}
        </div>
      </PixelBorder>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ── SCREEN: COMPETE (ADAPTIVE QUIZ WITH COMBO SYSTEM) ─────────────
// ═══════════════════════════════════════════════════════════════════
function CompeteScreen({ profile, burst, shake }) {
  const [phase, setPhase] = useState("lobby");
  const [subject, setSubject] = useState("Math");
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [level, setLevel] = useState(profile.adaptLevel || 1);
  const [levelUpRank, setLevelUpRank] = useState(null);
  const TOTAL = 8;

  const bank = (QUESTION_BANK[profile.grade]?.[subject] || QUESTION_BANK["2-3"].Math).filter(q => q.diff === level);
  const q = bank[qIdx % Math.max(bank.length, 1)] || QUESTION_BANK["2-3"].Math[0];

  const handleAnswer = (i, e) => {
    if (answered) return;
    setSelected(i); setAnswered(true);
    const correct = i === q.ans;
    if (correct) {
      SFX.play(combo >= 4 ? "combo" : "correct");
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(m => Math.max(m, newCombo));
      const multiplier = newCombo >= 10 ? 4 : newCombo >= 5 ? 3 : newCombo >= 3 ? 2 : 1;
      const xp = 50 * multiplier;
      const coins = 10 * multiplier;
      setXpEarned(x => x + xp);
      setCoinsEarned(c => c + coins);
      setScore(s => s + 1);
      burst(e.clientX, e.clientY, newCombo >= 5 ? 35 : 18,
        newCombo >= 5 ? [C.gold, C.green, C.blue, C.pink, C.purple] : [C.green, C.gold]);
      // Check rank up
      const newXp = profile.xp + xpEarned + xp;
      const newRank = getRank(newXp);
      const oldRank = getRank(profile.xp + xpEarned);
      if (newRank.name !== oldRank.name) {
        SFX.play("levelup");
        setLevelUpRank(newRank);
        burst(window.innerWidth / 2, window.innerHeight / 2, 60, [newRank.color, C.gold, C.white]);
        setTimeout(() => setLevelUpRank(null), 3000);
      }
    } else {
      SFX.play("wrong");
      shake();
      setCombo(0);
    }
  };

  const next = () => {
    if (qIdx + 1 >= TOTAL) { setPhase("results"); return; }
    setQIdx(i => i + 1);
    setSelected(null); setAnswered(false);
  };

  if (levelUpRank) return <LevelUpBanner rank={levelUpRank} />;

  if (phase === "lobby") return (
    <div style={{ padding: 16, animation: "fadeIn 0.4s ease" }}>
      <div style={{ color: C.blue, fontFamily: fp, fontSize: 12, marginBottom: 4, letterSpacing: 2 }}>⚡ QUICK QUIZ</div>
      <div style={{ color: C.muted, fontFamily: fn, fontSize: 12, marginBottom: 20 }}>
        Chain correct answers for COMBO multipliers!
      </div>

      {/* Multiplier guide */}
      <PixelBorder color={C.gold} style={{ background: C.card, padding: 14, marginBottom: 14 }}>
        <div style={{ color: C.gold, fontFamily: fp, fontSize: 8, marginBottom: 10, letterSpacing: 1 }}>COMBO MULTIPLIERS</div>
        {[
          { combo: "3x", label: "COMBO!", mult: "2×", color: C.green },
          { combo: "5x", label: "ULTRA COMBO!", mult: "3×", color: C.blue },
          { combo: "10x", label: "🔥 LEGENDARY!", mult: "4×", color: C.gold },
        ].map(m => (
          <div key={m.combo} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ color: m.color, fontFamily: fp, fontSize: 7 }}>{m.combo} correct → {m.label}</span>
            <span style={{ color: m.color, fontFamily: fp, fontSize: 7 }}>{m.mult} XP+COINS</span>
          </div>
        ))}
      </PixelBorder>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {["Math", "Science"].map(s => (
          <PixelBorder key={s} color={subject === s ? C.blue : C.border}
            style={{ background: subject === s ? `${C.blue}20` : C.card, flex: 1, padding: 14, textAlign: "center" }}
            onClick={() => { SFX.play("click"); setSubject(s); }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{s === "Math" ? "🔢" : "🔬"}</div>
            <div style={{ color: subject === s ? C.blue : C.dim, fontFamily: fp, fontSize: 8 }}>{s.toUpperCase()}</div>
          </PixelBorder>
        ))}
      </div>
      <NeonBtn ch={`⚡ START QUIZ — ${TOTAL} QUESTIONS`} color={C.blue}
        onClick={() => { SFX.play("click"); setPhase("quiz"); }}
        style={{ width: "100%", padding: "16px" }} />
    </div>
  );

  if (phase === "quiz") return (
    <div style={{ padding: 16, animation: "fadeIn 0.3s ease" }}>
      <ComboFlash combo={combo} />

      {/* HUD */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ color: C.text, fontFamily: fp, fontSize: 8 }}>{qIdx + 1}/{TOTAL}</div>
        <div style={{ display: "flex", gap: 12 }}>
          {combo >= 3 && <span style={{ color: C.green, fontFamily: fp, fontSize: 7, animation: "blink 1s infinite" }}>🔥×{combo}</span>}
          <span style={{ color: C.gold, fontFamily: fp, fontSize: 7 }}>+{xpEarned}XP</span>
          <span style={{ color: C.gold, fontFamily: fp, fontSize: 7 }}>+{coinsEarned}⭐</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 2, height: 6, marginBottom: 16, border: `1px solid ${C.blue}33` }}>
        <div style={{ width: `${((qIdx) / TOTAL) * 100}%`, height: "100%", background: C.blue, boxShadow: `0 0 8px ${C.blue}`, transition: "width 0.4s" }} />
      </div>

      {/* Question */}
      <PixelBorder color={C.blue} style={{ background: C.card, padding: 18, marginBottom: 14 }}>
        <div style={{ color: C.dim, fontFamily: fp, fontSize: 7, marginBottom: 8 }}>{q.topic?.toUpperCase()}</div>
        <div style={{ color: C.text, fontFamily: fn, fontSize: 16, fontWeight: 800, lineHeight: 1.6, textAlign: "center" }}>
          {q.q}
        </div>
      </PixelBorder>

      {/* Options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {q.opts.map((opt, i) => {
          const isCorrect = i === q.ans;
          const isSelected = i === selected;
          const col = answered
            ? isCorrect ? C.green : isSelected ? C.red : C.border
            : C.blue;
          return (
            <PixelBorder key={i} color={col}
              style={{
                background: answered && isCorrect ? `${C.green}20` : answered && isSelected ? `${C.red}20` : C.card,
                padding: 16,
              }}
              onClick={answered ? undefined : (e) => handleAnswer(i, e)}>
              <div style={{ color: answered ? (isCorrect ? C.green : isSelected ? C.red : C.dim) : C.text, fontFamily: fn, fontSize: 14, fontWeight: 800 }}>
                {opt}
              </div>
              {answered && isCorrect && <div style={{ color: C.green, fontFamily: fp, fontSize: 7, marginTop: 4 }}>CORRECT!</div>}
              {answered && isSelected && !isCorrect && <div style={{ color: C.red, fontFamily: fp, fontSize: 7, marginTop: 4 }}>WRONG!</div>}
            </PixelBorder>
          );
        })}
      </div>

      {answered && (
        <NeonBtn
          ch={qIdx + 1 >= TOTAL ? "🏁 SEE RESULTS!" : `NEXT QUESTION → (${qIdx + 1}/${TOTAL})`}
          color={selected === q.ans ? C.green : C.orange}
          onClick={next}
          style={{ width: "100%", marginTop: 14 }}
        />
      )}
    </div>
  );

  if (phase === "results") {
    const pct = Math.round((score / TOTAL) * 100);
    const grade = pct >= 90 ? "S" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : "D";
    const gradeColor = pct >= 90 ? C.gold : pct >= 80 ? C.green : pct >= 70 ? C.blue : pct >= 60 ? C.orange : C.red;
    return (
      <div style={{ padding: 24, textAlign: "center", animation: "fadeIn 0.4s ease" }}>
        <div style={{ color: gradeColor, fontFamily: fp, fontSize: 64, letterSpacing: 4,
          textShadow: `0 0 30px ${gradeColor}, 0 0 60px ${gradeColor}`, marginBottom: 8 }}>
          {grade}
        </div>
        <div style={{ color: C.text, fontFamily: fp, fontSize: 14, marginBottom: 4 }}>{score}/{TOTAL} CORRECT</div>
        <div style={{ color: C.dim, fontFamily: fn, fontSize: 12, marginBottom: 24 }}>{pct}% accuracy</div>

        <PixelBorder color={C.gold} style={{ background: C.card, padding: 16, marginBottom: 20, textAlign: "left" }}>
          <div style={{ color: C.gold, fontFamily: fp, fontSize: 8, marginBottom: 12, textAlign: "center", letterSpacing: 2 }}>
            SESSION REWARDS
          </div>
          {[
            { label: "XP Earned", value: `+${xpEarned}`, color: C.blue },
            { label: "Coins Earned", value: `+${coinsEarned} ⭐`, color: C.gold },
            { label: "Best Combo", value: `×${maxCombo}`, color: maxCombo >= 5 ? C.green : C.muted },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.muted, fontFamily: fn, fontSize: 12 }}>{r.label}</span>
              <span style={{ color: r.color, fontFamily: fp, fontSize: 10 }}>{r.value}</span>
            </div>
          ))}
        </PixelBorder>

        <div style={{ display: "flex", gap: 10 }}>
          <NeonBtn ch="🔄 PLAY AGAIN" color={C.blue}
            onClick={() => { setPhase("lobby"); setScore(0); setQIdx(0); setCombo(0); setXpEarned(0); setCoinsEarned(0); setSelected(null); setAnswered(false); }}
            style={{ flex: 1 }} />
        </div>
      </div>
    );
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════
// ── SCREEN: LEARN ─────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════
const UNITS = [
  { id:1, title:"Number Nebula",  emoji:"🔢", color:C.blue,   xp:100, progress:75, locked:false,
    lessons:[
      { id:"1a", title:"Counting to 100",  emoji:"🔢", type:"📖", steps:["Numbers 1–100 follow a pattern: ones, tens, hundreds!", "After 9 comes 10. After 19 comes 20. See the pattern?", "Pro tip: count by 10s first — 10, 20, 30... then fill in the gaps!"], quiz:["2-3"] },
      { id:"1b", title:"Addition Basics",  emoji:"➕", type:"💡", steps:["Addition means putting groups together.", "Think of it like collecting coins — 3 coins + 4 coins = 7 coins!", "Pro tip: always start with the bigger number and count up."], quiz:["2-3"] },
      { id:"1c", title:"Subtraction",      emoji:"➖", type:"🌟", steps:["Subtraction is taking away from a group.", "If you have 10 stars and give 3 away, you have 7 left.", "Pro tip: subtraction is just addition backwards!"], quiz:["2-3"] },
    ]
  },
  { id:2, title:"Fraction Forest", emoji:"🍕", color:C.green,  xp:150, progress:40, locked:false,
    lessons:[
      { id:"2a", title:"What is a Fraction?", emoji:"🍕", type:"📖", steps:["A fraction is a part of a whole.", "If you cut a pizza into 4 equal slices, each slice is 1/4.", "The bottom number (denominator) = total slices. Top number (numerator) = slices you have."], quiz:["2-3"] },
      { id:"2b", title:"Comparing Fractions", emoji:"⚖️", type:"💡", steps:["Which is bigger: 1/2 or 1/4?", "Imagine the same pizza — half is a bigger slice than a quarter!", "Bigger denominator = smaller pieces (when numerators are equal)."], quiz:["2-3"] },
    ]
  },
  { id:3, title:"Geometry Galaxy", emoji:"📐", color:C.purple, xp:200, progress:10, locked:false,
    lessons:[
      { id:"3a", title:"2D Shapes",        emoji:"🔷", type:"📖", steps:["2D shapes are flat — they only have length and width.", "Triangle=3 sides, Square=4 equal sides, Pentagon=5 sides.", "Pro tip: count the corners — corners always equal sides!"], quiz:["2-3"] },
      { id:"3b", title:"Area & Perimeter", emoji:"📏", type:"💡", steps:["Perimeter = distance all the way around a shape.", "Area = the space inside a shape.", "Rectangle perimeter: add all 4 sides. Area: length × width."], quiz:["4-5"] },
    ]
  },
  { id:4, title:"Science Station",  emoji:"🔬", color:C.orange, xp:200, progress:0, locked:true,  lessons:[] },
  { id:5, title:"Final Frontier",   emoji:"🚀", color:C.gold,   xp:500, progress:0, locked:true,  lessons:[] },
];

function LessonView({ lesson, unit, onBack, burst }) {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("learn"); // learn | quiz | done
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const bank = QUESTION_BANK["2-3"]?.Math || [];
  const q = bank[qIdx % bank.length];
  const QUIZ_Q = 3;

  const handleAnswer = (i, e) => {
    if (answered) return;
    setSelected(i); setAnswered(true);
    if (i === q.ans) {
      SFX.play("correct");
      burst(e.clientX, e.clientY, 16, [unit.color, C.gold]);
      setScore(s => s + 1);
    } else {
      SFX.play("wrong");
    }
  };

  // ── LEARN PHASE ──
  if (phase === "learn") return (
    <div style={{ padding: 16, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <NeonBtn ch="← BACK" color={C.dim} sm onClick={onBack} />
        <div style={{ flex:1, color:unit.color, fontFamily:fp, fontSize:8, letterSpacing:1 }}>
          {lesson.emoji} {lesson.title.toUpperCase()}
        </div>
        <div style={{ color:C.dim, fontFamily:fp, fontSize:7 }}>{step+1}/{lesson.steps.length}</div>
      </div>

      {/* Step progress */}
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {lesson.steps.map((_,i) => (
          <div key={i} style={{ flex:1, height:6, borderRadius:2,
            background: i <= step ? unit.color : "rgba(255,255,255,0.08)",
            boxShadow: i === step ? `0 0 8px ${unit.color}` : "none",
            transition:"all 0.3s" }} />
        ))}
      </div>

      {/* Step card */}
      <PixelBorder color={unit.color} style={{ background:C.card, padding:20, marginBottom:16, minHeight:160,
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ color:C.text, fontFamily:fn, fontSize:16, fontWeight:800,
          lineHeight:1.7, textAlign:"center" }}>
          {lesson.steps[step]}
        </div>
      </PixelBorder>

      {/* Nav buttons */}
      <div style={{ display:"flex", gap:10 }}>
        {step > 0 && (
          <NeonBtn ch="◀ PREV" color={C.dim} onClick={() => setStep(s=>s-1)} style={{ flex:1 }} />
        )}
        {step < lesson.steps.length - 1 ? (
          <NeonBtn ch="NEXT ▶" color={unit.color} onClick={() => { SFX.play("click"); setStep(s=>s+1); }} style={{ flex:2 }} />
        ) : (
          <NeonBtn ch="⚡ TAKE QUIZ!" color={C.gold}
            onClick={() => { SFX.play("levelup"); setPhase("quiz"); }} style={{ flex:2 }} />
        )}
      </div>
    </div>
  );

  // ── QUIZ PHASE ──
  if (phase === "quiz") return (
    <div style={{ padding:16, animation:"fadeIn 0.3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div style={{ color:unit.color, fontFamily:fp, fontSize:8 }}>MINI QUIZ</div>
        <div style={{ color:C.dim, fontFamily:fp, fontSize:7 }}>{qIdx+1}/{QUIZ_Q}</div>
      </div>

      <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:2, height:6, marginBottom:16 }}>
        <div style={{ width:`${(qIdx/QUIZ_Q)*100}%`, height:"100%", background:unit.color, transition:"width 0.4s" }} />
      </div>

      <PixelBorder color={unit.color} style={{ background:C.card, padding:18, marginBottom:14 }}>
        <div style={{ color:C.text, fontFamily:fn, fontSize:15, fontWeight:800, lineHeight:1.6, textAlign:"center" }}>
          {q.q}
        </div>
      </PixelBorder>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
        {q.opts.map((opt,i) => {
          const isCorrect = i === q.ans, isSelected = i === selected;
          const col = answered ? (isCorrect ? C.green : isSelected ? C.red : C.border) : unit.color;
          return (
            <PixelBorder key={i} color={col}
              style={{ background: answered&&isCorrect ? `${C.green}20` : answered&&isSelected ? `${C.red}20` : C.card, padding:16, textAlign:"center" }}
              onClick={answered ? undefined : (e) => handleAnswer(i,e)}>
              <div style={{ color: answered?(isCorrect?C.green:isSelected?C.red:C.dim):C.text, fontFamily:fn, fontSize:14, fontWeight:800 }}>
                {opt}
              </div>
            </PixelBorder>
          );
        })}
      </div>

      {answered && (
        <NeonBtn
          ch={qIdx+1 >= QUIZ_Q ? "🏁 FINISH!" : "NEXT →"}
          color={selected===q.ans ? C.green : C.orange}
          onClick={() => {
            if (qIdx+1 >= QUIZ_Q) { setPhase("done"); }
            else { setQIdx(i=>i+1); setSelected(null); setAnswered(false); }
          }}
          style={{ width:"100%" }}
        />
      )}
    </div>
  );

  // ── DONE PHASE ──
  if (phase === "done") {
    const pct = Math.round((score/QUIZ_Q)*100);
    const grade = pct===100?"S+":pct>=67?"A":"B";
    const gc = pct===100?C.gold:pct>=67?C.green:C.blue;
    return (
      <div style={{ padding:24, textAlign:"center", animation:"fadeIn 0.4s ease" }}>
        <div style={{ fontSize:60, marginBottom:8 }}>{lesson.emoji}</div>
        <div style={{ color:gc, fontFamily:fp, fontSize:28, textShadow:`0 0 20px ${gc}`, marginBottom:4 }}>{grade}</div>
        <div style={{ color:C.text, fontFamily:fp, fontSize:11, marginBottom:4 }}>LESSON COMPLETE!</div>
        <div style={{ color:C.muted, fontFamily:fn, fontSize:12, marginBottom:24 }}>{score}/{QUIZ_Q} correct • +{unit.xp} XP • +{Math.round(unit.xp/5)} ⭐</div>
        <PixelBorder color={gc} style={{ background:C.card, padding:14, marginBottom:20 }}>
          {[{l:"XP Earned",v:`+${unit.xp}`,c:C.blue},{l:"Coins",v:`+${Math.round(unit.xp/5)} ⭐`,c:C.gold},{l:"Score",v:`${pct}%`,c:gc}].map(r=>(
            <div key={r.l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ color:C.muted, fontFamily:fn, fontSize:12 }}>{r.l}</span>
              <span style={{ color:r.c, fontFamily:fp, fontSize:10 }}>{r.v}</span>
            </div>
          ))}
        </PixelBorder>
        <NeonBtn ch="← BACK TO UNITS" color={unit.color} onClick={onBack} style={{ width:"100%" }} />
      </div>
    );
  }
  return null;
}

function LearnScreen({ profile, burst }) {
  const [openUnit, setOpenUnit] = useState(null);
  const [openLesson, setOpenLesson] = useState(null);

  // ── Lesson view ──
  if (openLesson && openUnit) return (
    <LessonView
      lesson={openLesson} unit={openUnit} burst={burst}
      onBack={() => setOpenLesson(null)}
    />
  );

  // ── Unit lesson list ──
  if (openUnit) return (
    <div style={{ padding:16, animation:"fadeIn 0.3s ease" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <NeonBtn ch="← BACK" color={C.dim} sm onClick={() => setOpenUnit(null)} />
        <div style={{ color:openUnit.color, fontFamily:fp, fontSize:9, letterSpacing:1 }}>
          {openUnit.emoji} {openUnit.title.toUpperCase()}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {openUnit.lessons.map((lesson, idx) => (
          <PixelBorder key={lesson.id} color={openUnit.color}
            style={{ background:C.card, padding:16 }}
            onClick={() => { SFX.play("click"); setOpenLesson(lesson); }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:4, background:`${openUnit.color}20`,
                border:`2px solid ${openUnit.color}55`, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:22, flexShrink:0 }}>
                {lesson.emoji}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ color:openUnit.color, fontFamily:fp, fontSize:8, letterSpacing:1, marginBottom:3 }}>
                  LESSON {idx+1}
                </div>
                <div style={{ color:C.text, fontFamily:fn, fontSize:13, fontWeight:800 }}>
                  {lesson.title}
                </div>
                <div style={{ color:C.dim, fontFamily:fn, fontSize:10, marginTop:2 }}>
                  {lesson.type} {lesson.steps.length} steps + mini quiz
                </div>
              </div>
              <div style={{ color:openUnit.color, fontFamily:fp, fontSize:14 }}>▶</div>
            </div>
          </PixelBorder>
        ))}
      </div>
    </div>
  );

  // ── Unit list (main view) ──
  return (
    <div style={{ padding:16, animation:"fadeIn 0.4s ease" }}>
      <div style={{ color:C.green, fontFamily:fp, fontSize:12, marginBottom:4, letterSpacing:2 }}>📚 LEARN</div>
      <div style={{ color:C.muted, fontFamily:fn, fontSize:12, marginBottom:16 }}>
        Complete units to unlock boss battles!
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {UNITS.map(u => (
          <PixelBorder key={u.id} color={u.locked ? C.dim : u.color}
            style={{ background:C.card, padding:16, opacity:u.locked?0.5:1 }}
            onClick={u.locked ? undefined : () => { SFX.play("click"); setOpenUnit(u); }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:u.locked?0:10 }}>
              <div style={{ fontSize:32, width:48, height:48, display:"flex", alignItems:"center",
                justifyContent:"center", background:`${u.color}20`, border:`2px solid ${u.color}44`,
                borderRadius:4, flexShrink:0 }}>
                {u.locked ? "🔒" : u.emoji}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ color:u.locked?C.dim:u.color, fontFamily:fp, fontSize:8, letterSpacing:1, marginBottom:4 }}>
                  {u.title.toUpperCase()}
                </div>
                <div style={{ color:C.dim, fontFamily:fn, fontSize:10 }}>
                  {u.locked ? "Complete previous unit to unlock" : `${u.lessons.length} lessons • +${u.xp} XP`}
                </div>
              </div>
              {!u.locked && <div style={{ color:u.color, fontFamily:fp, fontSize:8 }}>{u.progress}%</div>}
            </div>
            {!u.locked && (
              <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:2, height:8, border:`1px solid ${u.color}33` }}>
                <div style={{ width:`${u.progress}%`, height:"100%", background:u.color,
                  boxShadow:`0 0 6px ${u.color}`, transition:"width 1s" }} />
              </div>
            )}
          </PixelBorder>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ── SCREEN: STORE ─────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════
function StoreScreen({ profile, burst }) {
  const items = [
    { id: 1, name: "400 Robux", emoji: "🎮", coins: 500, hot: true },
    { id: 2, name: "$5 Amazon", emoji: "🛍️", coins: 600 },
    { id: 3, name: "Minecraft Card", emoji: "⛏️", coins: 700, hot: true },
    { id: 4, name: "Ice Cream", emoji: "🍦", coins: 150 },
    { id: 5, name: "Pizza Night", emoji: "🍕", coins: 200 },
    { id: 6, name: "LEGO Set", emoji: "🧱", coins: 800 },
  ];

  const buy = (item, e) => {
    if (profile.coins < item.coins) { SFX.play("wrong"); return; }
    SFX.play("coin");
    burst(e.clientX, e.clientY, 30, [C.gold, C.orange, C.green]);
  };

  return (
    <div style={{ padding: 16, animation: "fadeIn 0.4s ease" }}>
      <div style={{ color: C.gold, fontFamily: fp, fontSize: 12, marginBottom: 4, letterSpacing: 2 }}>⭐ REWARD STORE</div>

      <PixelBorder color={C.gold} style={{ background: `${C.gold}15`, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 24 }}>⭐</span>
        <div>
          <div style={{ color: C.dim, fontFamily: fp, fontSize: 7 }}>YOUR BALANCE</div>
          <div style={{ color: C.gold, fontFamily: fp, fontSize: 16 }}>{profile.coins.toLocaleString()} COINS</div>
        </div>
      </PixelBorder>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {items.map(item => {
          const canAfford = profile.coins >= item.coins;
          return (
            <PixelBorder key={item.id} color={canAfford ? C.gold : C.dim}
              style={{ background: C.card, padding: 14, textAlign: "center" }}>
              {item.hot && (
                <div style={{ color: C.red, fontFamily: fp, fontSize: 6, marginBottom: 6, letterSpacing: 1 }}>🔥 HOT</div>
              )}
              <div style={{ fontSize: 40, marginBottom: 8 }}>{item.emoji}</div>
              <div style={{ color: C.text, fontFamily: fn, fontSize: 11, fontWeight: 800, marginBottom: 6 }}>{item.name}</div>
              <div style={{ color: C.gold, fontFamily: fp, fontSize: 8, marginBottom: 10 }}>⭐ {item.coins}</div>
              <NeonBtn ch={canAfford ? "BUY!" : "NEED MORE ⭐"}
                color={canAfford ? C.gold : C.dim}
                sm onClick={(e) => buy(item, e)}
                style={{ width: "100%" }} />
            </PixelBorder>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ── PARENT PORTAL ─────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════
const PARENT_DATA = {
  children: [
    { name:"Alex", avatar:"🧒", grade:"3rd Grade", xp:2840, streak:9, coins:420,
      weeklyXP:480, lessonsThisWeek:7, quizzesThisWeek:4, avgScore:84,
      badges:["🧛 Minus Slayer","⚡ Speed Demon"],
      rewardRequests:[{ id:1, item:"Ice Cream", coins:150, status:"pending" }],
      subjects:{ Math:87, Science:72 }
    },
    { name:"Mia", avatar:"👧", grade:"1st Grade", xp:980, streak:5, coins:210,
      weeklyXP:210, lessonsThisWeek:3, quizzesThisWeek:2, avgScore:76,
      badges:["🌟 Star Gazer"],
      rewardRequests:[],
      subjects:{ Math:76, Science:70 }
    },
  ]
};

function ParentPortal({ onBack }) {
  const [view, setView] = useState("dashboard"); // dashboard | child | rewards | settings
  const [selectedChild, setSelectedChild] = useState(null);

  if (view === "child" && selectedChild) {
    const c = selectedChild;
    return (
      <div style={{ padding:16, animation:"fadeIn 0.3s ease" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <NeonBtn ch="← BACK" color={C.dim} sm onClick={() => setView("dashboard")} />
          <div style={{ color:C.blue, fontFamily:fp, fontSize:9 }}>{c.avatar} {c.name.toUpperCase()}</div>
        </div>

        {/* Stats grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
          {[
            { label:"WEEKLY XP", value:c.weeklyXP, color:C.blue, icon:"✨" },
            { label:"STREAK", value:`${c.streak}d`, color:C.orange, icon:"🔥" },
            { label:"AVG SCORE", value:`${c.avgScore}%`, color:C.green, icon:"📊" },
            { label:"COINS", value:c.coins, color:C.gold, icon:"⭐" },
          ].map(s=>(
            <PixelBorder key={s.label} color={s.color} style={{ background:C.card, padding:14, textAlign:"center" }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
              <div style={{ color:s.color, fontFamily:fp, fontSize:14, marginBottom:2 }}>{s.value}</div>
              <div style={{ color:C.dim, fontFamily:fp, fontSize:6 }}>{s.label}</div>
            </PixelBorder>
          ))}
        </div>

        {/* Subject scores */}
        <PixelBorder color={C.purple} style={{ background:C.card, padding:14, marginBottom:12 }}>
          <div style={{ color:C.purple, fontFamily:fp, fontSize:8, marginBottom:10 }}>SUBJECT SCORES</div>
          {Object.entries(c.subjects).map(([subj, score])=>(
            <div key={subj} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ color:C.muted, fontFamily:fn, fontSize:11 }}>{subj}</span>
                <span style={{ color:score>=80?C.green:score>=60?C.orange:C.red, fontFamily:fp, fontSize:8 }}>{score}%</span>
              </div>
              <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:2, height:8 }}>
                <div style={{ width:`${score}%`, height:"100%", background:score>=80?C.green:score>=60?C.orange:C.red, borderRadius:2, transition:"width 1s" }} />
              </div>
            </div>
          ))}
        </PixelBorder>

        {/* Badges */}
        <PixelBorder color={C.gold} style={{ background:C.card, padding:14 }}>
          <div style={{ color:C.gold, fontFamily:fp, fontSize:8, marginBottom:10 }}>BADGES EARNED</div>
          {c.badges.map((b,i)=>(
            <div key={i} style={{ color:C.text, fontFamily:fn, fontSize:12, padding:"6px 0",
              borderBottom:`1px solid ${C.border}` }}>{b}</div>
          ))}
          {c.badges.length===0 && <div style={{ color:C.dim, fontFamily:fn, fontSize:11 }}>No badges yet — keep going! 💪</div>}
        </PixelBorder>
      </div>
    );
  }

  return (
    <div style={{ padding:16, animation:"fadeIn 0.4s ease" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ color:C.blue, fontFamily:fp, fontSize:12, letterSpacing:2 }}>👨‍👩‍👧 PARENT HQ</div>
          <div style={{ color:C.dim, fontFamily:fn, fontSize:11, marginTop:4 }}>Monitor your children's progress</div>
        </div>
        <NeonBtn ch="SIGN OUT" color={C.dim} sm onClick={onBack} />
      </div>

      {/* Children cards */}
      <div style={{ color:C.muted, fontFamily:fp, fontSize:7, marginBottom:10, letterSpacing:1 }}>YOUR CHILDREN</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
        {PARENT_DATA.children.map(c => (
          <PixelBorder key={c.name} color={C.blue} style={{ background:C.card, padding:16 }}
            onClick={() => { SFX.play("click"); setSelectedChild(c); setView("child"); }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ fontSize:36, width:52, height:52, display:"flex", alignItems:"center",
                justifyContent:"center", background:`${C.blue}20`, border:`2px solid ${C.blue}44`, borderRadius:4 }}>
                {c.avatar}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ color:C.text, fontFamily:fp, fontSize:10, marginBottom:3 }}>{c.name.toUpperCase()}</div>
                <div style={{ color:C.dim, fontFamily:fn, fontSize:11 }}>{c.grade}</div>
                <div style={{ display:"flex", gap:10, marginTop:4 }}>
                  <span style={{ color:C.blue, fontFamily:fn, fontSize:10 }}>✨ {c.xp} XP</span>
                  <span style={{ color:C.orange, fontFamily:fn, fontSize:10 }}>🔥 {c.streak}d</span>
                  <span style={{ color:C.gold, fontFamily:fn, fontSize:10 }}>⭐ {c.coins}</span>
                </div>
              </div>
              <div style={{ color:C.blue, fontFamily:fp, fontSize:14 }}>▶</div>
            </div>
            {/* This week */}
            <div style={{ marginTop:10, padding:"8px 0 0", borderTop:`1px solid ${C.border}`,
              display:"flex", gap:16 }}>
              <span style={{ color:C.dim, fontFamily:fn, fontSize:10 }}>📚 {c.lessonsThisWeek} lessons this week</span>
              <span style={{ color:C.dim, fontFamily:fn, fontSize:10 }}>⚡ {c.quizzesThisWeek} quizzes</span>
            </div>
          </PixelBorder>
        ))}
      </div>

      {/* Reward requests */}
      <div style={{ color:C.muted, fontFamily:fp, fontSize:7, marginBottom:10, letterSpacing:1 }}>
        REWARD REQUESTS {PARENT_DATA.children.flatMap(c=>c.rewardRequests).length > 0 &&
          <span style={{ color:C.red, marginLeft:6 }}>● {PARENT_DATA.children.flatMap(c=>c.rewardRequests).length} PENDING</span>}
      </div>
      {PARENT_DATA.children.flatMap(c=>c.rewardRequests.map(r=>({...r, childName:c.name}))).length === 0 ? (
        <PixelBorder color={C.dim} style={{ background:C.card, padding:14, textAlign:"center" }}>
          <div style={{ color:C.dim, fontFamily:fn, fontSize:11 }}>No pending reward requests 🎉</div>
        </PixelBorder>
      ) : (
        PARENT_DATA.children.flatMap(c=>c.rewardRequests.map(r=>({...r, childName:c.name}))).map(r=>(
          <PixelBorder key={r.id} color={C.gold} style={{ background:C.card, padding:14, marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div>
                <div style={{ color:C.text, fontFamily:fn, fontSize:13, fontWeight:800 }}>{r.item}</div>
                <div style={{ color:C.dim, fontFamily:fn, fontSize:10, marginTop:2 }}>{r.childName} • ⭐ {r.coins} coins</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <NeonBtn ch="✅ APPROVE" color={C.green} sm onClick={()=>SFX.play("coin")} style={{ flex:1 }} />
              <NeonBtn ch="❌ DENY" color={C.red} sm onClick={()=>SFX.play("wrong")} style={{ flex:1 }} />
            </div>
          </PixelBorder>
        ))
      )}

      {/* Settings */}
      <div style={{ marginTop:20 }}>
        <div style={{ color:C.muted, fontFamily:fp, fontSize:7, marginBottom:10, letterSpacing:1 }}>ACCOUNT</div>
        {[
          { label:"🔔 Notification Settings", color:C.blue },
          { label:"🛡️ Privacy & Data", color:C.green },
          { label:"💳 Subscription", color:C.gold },
        ].map(s=>(
          <PixelBorder key={s.label} color={C.dim} style={{ background:C.card, padding:14, marginBottom:8 }}
            onClick={() => SFX.play("click")}>
            <div style={{ color:C.text, fontFamily:fn, fontSize:13, fontWeight:700 }}>{s.label}</div>
          </PixelBorder>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ── LOGIN SCREEN ──────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════
function LoginScreen({ onStudentLogin, onParentLogin }) {
  const [mode, setMode] = useState("select"); // select | student | parent
  const [parentPin, setParentPin] = useState("");
  const PARENT_PIN = "1234";

  // ── Portal selector ──
  if (mode === "select") return (
    <div style={{ padding:"32px 20px", display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", minHeight:"100%", textAlign:"center" }}>

      <div style={{
        width:100, height:100, borderRadius:8, marginBottom:20,
        background:`linear-gradient(135deg, ${C.purple}, ${C.blue})`,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:56,
        border:`3px solid ${C.blue}`, boxShadow:`0 0 30px ${C.blue}55, 0 0 60px ${C.purple}33`,
        animation:"glowPulse 2s ease infinite",
      }}>🌟</div>

      <div style={{ color:C.green, fontFamily:fp, fontSize:14, letterSpacing:3, marginBottom:4, textShadow:`0 0 20px ${C.green}` }}>
        STELLAR
      </div>
      <div style={{ color:C.blue, fontFamily:fp, fontSize:14, letterSpacing:3, marginBottom:6, textShadow:`0 0 20px ${C.blue}` }}>
        MINDS
      </div>
      <div style={{ color:C.dim, fontFamily:fn, fontSize:11, marginBottom:36, letterSpacing:2 }}>
        LEARN. BATTLE. EARN. REPEAT.
      </div>

      <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:12 }}>
        <PixelBorder color={C.green} style={{ background:C.card, padding:20 }}
          onClick={() => { SFX.play("click"); setMode("student"); }}>
          <div style={{ fontSize:40, marginBottom:8 }}>🧒</div>
          <div style={{ color:C.green, fontFamily:fp, fontSize:11, letterSpacing:2, marginBottom:4 }}>STUDENT LOGIN</div>
          <div style={{ color:C.dim, fontFamily:fn, fontSize:11 }}>Start learning & battling!</div>
        </PixelBorder>

        <PixelBorder color={C.blue} style={{ background:C.card, padding:20 }}
          onClick={() => { SFX.play("click"); setMode("parent"); }}>
          <div style={{ fontSize:40, marginBottom:8 }}>👨‍👩‍👧</div>
          <div style={{ color:C.blue, fontFamily:fp, fontSize:11, letterSpacing:2, marginBottom:4 }}>PARENT PORTAL</div>
          <div style={{ color:C.dim, fontFamily:fn, fontSize:11 }}>Monitor progress & approve rewards</div>
        </PixelBorder>
      </div>

      <div style={{ color:C.dim, fontFamily:fn, fontSize:10, marginTop:24 }}>
        🛡️ COPPA compliant • No ads • Kid safe
      </div>
    </div>
  );

  // ── Student picker ──
  if (mode === "student") return (
    <div style={{ padding:"28px 20px", animation:"fadeIn 0.3s ease" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <NeonBtn ch="←" color={C.dim} sm onClick={() => setMode("select")} />
        <div style={{ color:C.green, fontFamily:fp, fontSize:11, letterSpacing:2 }}>WHO'S PLAYING?</div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {PROFILES.map(p => {
          const rank = getRank(p.xp);
          return (
            <PixelBorder key={p.id} color={rank.color} style={{ background:C.card, padding:18 }}
              onClick={() => { SFX.play("levelup"); onStudentLogin(p); }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ fontSize:38, width:54, height:54, display:"flex", alignItems:"center",
                  justifyContent:"center", background:`${rank.color}22`,
                  border:`2px solid ${rank.color}`, borderRadius:4 }}>
                  {p.avatar}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ color:rank.color, fontFamily:fp, fontSize:11, letterSpacing:1 }}>{p.name.toUpperCase()}</div>
                  <div style={{ color:C.dim, fontFamily:fn, fontSize:11, marginTop:3 }}>{p.gradeLabel}</div>
                  <div style={{ color:rank.color, fontFamily:fn, fontSize:10, marginTop:2 }}>
                    {rank.emoji} {rank.name} • {p.xp.toLocaleString()} XP
                  </div>
                </div>
                <div style={{ color:rank.color, fontFamily:fp, fontSize:18 }}>▶</div>
              </div>
            </PixelBorder>
          );
        })}
      </div>
    </div>
  );

  // ── Parent PIN ──
  if (mode === "parent") return (
    <div style={{ padding:"40px 20px", display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", minHeight:"100%", animation:"fadeIn 0.3s ease" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28, alignSelf:"flex-start" }}>
        <NeonBtn ch="←" color={C.dim} sm onClick={() => { setMode("select"); setParentPin(""); }} />
        <div style={{ color:C.blue, fontFamily:fp, fontSize:11 }}>PARENT LOGIN</div>
      </div>

      <div style={{ fontSize:56, marginBottom:16 }}>👨‍👩‍👧</div>
      <div style={{ color:C.blue, fontFamily:fp, fontSize:12, letterSpacing:2, marginBottom:8 }}>ENTER PIN</div>
      <div style={{ color:C.dim, fontFamily:fn, fontSize:11, marginBottom:28, textAlign:"center" }}>
        Enter your 4-digit parent PIN to access the dashboard
      </div>

      {/* PIN display */}
      <div style={{ display:"flex", gap:12, marginBottom:28 }}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{ width:48, height:56, borderRadius:4,
            background: i < parentPin.length ? `${C.blue}30` : C.card,
            border:`3px solid ${i < parentPin.length ? C.blue : C.dim}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow: i < parentPin.length ? `0 0 10px ${C.blue}55` : "none",
          }}>
            <div style={{ color:C.blue, fontFamily:fp, fontSize:20 }}>
              {i < parentPin.length ? "●" : ""}
            </div>
          </div>
        ))}
      </div>

      {/* Keypad */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, width:"100%", maxWidth:280 }}>
        {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k,i)=>(
          <NeonBtn key={i} ch={String(k)} color={k===""?C.bg:C.blue}
            disabled={k===""}
            onClick={() => {
              if (k==="⌫") { setParentPin(p=>p.slice(0,-1)); return; }
              if (parentPin.length >= 4) return;
              const next = parentPin + k;
              setParentPin(next);
              if (next.length===4) {
                if (next === PARENT_PIN) { setTimeout(()=>{ SFX.play("levelup"); onParentLogin(); }, 200); }
                else { SFX.play("wrong"); setTimeout(()=>setParentPin(""), 600); }
              }
            }}
            style={{ padding:"16px 0", fontSize:14 }} />
        ))}
      </div>
      <div style={{ color:C.dim, fontFamily:fn, fontSize:10, marginTop:20 }}>Demo PIN: 1234</div>
    </div>
  );

  return null;
}

// ═══════════════════════════════════════════════════════════════════
// ── BOTTOM NAV ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════
function BottomNav({ tab, onTab }) {
  const tabs = [
    { id: "home", icon: "🏠", label: "HOME" },
    { id: "learn", icon: "📚", label: "LEARN" },
    { id: "boss", icon: "⚔️", label: "BOSS" },
    { id: "compete", icon: "⚡", label: "QUIZ" },
    { id: "leaderboard", icon: "🏆", label: "RANKS" },
  ];
  return (
    <div style={{
      display: "flex", background: C.card,
      borderTop: `3px solid ${C.border}`,
      paddingBottom: "env(safe-area-inset-bottom, 8px)",
    }}>
      {tabs.map(t => {
        const active = tab === t.id;
        const color = active ? C.green : C.dim;
        return (
          <div key={t.id}
            onPointerUp={() => { SFX.play("click"); onTab(t.id); }}
            style={{ flex: 1, padding: "12px 4px 10px", textAlign: "center", cursor: "pointer",
              borderTop: active ? `3px solid ${C.green}` : "3px solid transparent",
              background: active ? `${C.green}10` : "transparent", transition: "all 0.15s",
              touchAction: "manipulation", userSelect: "none",
              WebkitTapHighlightColor: "transparent", minHeight: 56 }}>
            <div style={{ fontSize: 22, marginBottom: 3 }}>{t.icon}</div>
            <div style={{ color, fontFamily: fp, fontSize: 5, letterSpacing: 0.5 }}>{t.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ── ROOT APP ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("login"); // login | game | parent
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("home");
  const { particles, burst } = useParticles();
  const { shaking, shake } = useShake();
  const isTablet = useIsTablet();

  const screens = {
    home:        <HomeScreen profile={profile} onNav={setTab} burst={burst} />,
    learn:       <LearnScreen profile={profile} burst={burst} />,
    boss:        <BossScreen profile={profile} burst={burst} shake={shake} />,
    compete:     <CompeteScreen profile={profile} burst={burst} shake={shake} />,
    leaderboard: <LeaderboardScreen profile={profile} />,
    store:       <StoreScreen profile={profile} burst={burst} />,
  };

  const NAV_TABS = [
    { id:"home",        icon:"🏠", label:"HOME" },
    { id:"learn",       icon:"📚", label:"LEARN" },
    { id:"boss",        icon:"⚔️",  label:"BOSS" },
    { id:"compete",     icon:"⚡", label:"QUIZ" },
    { id:"leaderboard", icon:"🏆", label:"RANKS" },
    { id:"store",       icon:"⭐", label:"STORE" },
  ];

  // ── TABLET LAYOUT ─────────────────────────────────────────────
  if (isTablet) return (
    <div style={{ background: C.bg, minHeight:"100vh", display:"flex",
      flexDirection:"column", fontFamily:fn, color:C.text }}>
      <Bg />
      <Particles particles={particles} />
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1,
        backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px)" }} />

      {/* Top bar */}
      <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:100,
        background:C.card, borderBottom:`3px solid ${C.border}`,
        padding:"0 24px", height:56,
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ color:C.green, fontFamily:fp, fontSize:13, letterSpacing:3,
          textShadow:`0 0 12px ${C.green}` }}>STELLAR★MINDS</div>
        {screen==="game" && profile && (
          <div style={{ display:"flex", gap:20, alignItems:"center" }}>
            <span style={{ color:C.gold,   fontFamily:fp, fontSize:9 }}>⭐ {profile.coins}</span>
            <span style={{ color:C.orange, fontFamily:fp, fontSize:9 }}>🔥 {profile.streak}d</span>
            <span style={{ color:getRank(profile.xp).color, fontFamily:fp, fontSize:9 }}>
              {getRank(profile.xp).emoji} {getRank(profile.xp).name}
            </span>
            <NeonBtn ch="SIGN OUT" color={C.dim} sm onClick={()=>{ setScreen("login"); setProfile(null); setTab("home"); }} />
          </div>
        )}
        {screen==="parent" && (
          <NeonBtn ch="← EXIT" color={C.dim} sm onClick={()=>setScreen("login")} />
        )}
      </div>

      {/* Body */}
      <div style={{ display:"flex", paddingTop:56, minHeight:"100vh", position:"relative", zIndex:2 }}>

        {/* Sidebar — only in game mode */}
        {screen==="game" && profile && (
          <div style={{ width:220, flexShrink:0, position:"fixed", top:56, bottom:0, left:0,
            background:C.card, borderRight:`3px solid ${C.border}`,
            display:"flex", flexDirection:"column", overflowY:"auto", padding:"16px 12px" }}>

            {/* Player mini card */}
            <div style={{ padding:"12px", background:`${getRank(profile.xp).color}15`,
              border:`2px solid ${getRank(profile.xp).color}44`, borderRadius:4, marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <div style={{ fontSize:28 }}>{profile.avatar}</div>
                <div>
                  <div style={{ color:getRank(profile.xp).color, fontFamily:fp, fontSize:8 }}>{profile.name.toUpperCase()}</div>
                  <div style={{ color:C.dim, fontFamily:fn, fontSize:10, marginTop:2 }}>{profile.gradeLabel}</div>
                </div>
              </div>
              <XPBar xp={profile.xp} />
            </div>

            {/* Nav items */}
            {NAV_TABS.map(t => {
              const active = tab === t.id;
              return (
                <div key={t.id}
                  onPointerUp={() => { SFX.play("click"); setTab(t.id); }}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
                    borderRadius:4, marginBottom:4, cursor:"pointer",
                    background: active ? `${C.green}18` : "transparent",
                    border: `2px solid ${active ? C.green : "transparent"}`,
                    boxShadow: active ? `0 0 10px ${C.green}33` : "none",
                    transition:"all 0.15s",
                    touchAction:"manipulation", WebkitTapHighlightColor:"transparent" }}>
                  <span style={{ fontSize:18 }}>{t.icon}</span>
                  <span style={{ color: active ? C.green : C.muted, fontFamily:fp, fontSize:7, letterSpacing:1 }}>
                    {t.label}
                  </span>
                  {active && <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%",
                    background:C.green, boxShadow:`0 0 6px ${C.green}` }} />}
                </div>
              );
            })}

            {/* Hearts */}
            <div style={{ marginTop:"auto", padding:"12px 0", borderTop:`1px solid ${C.border}` }}>
              <div style={{ color:C.dim, fontFamily:fp, fontSize:6, marginBottom:6 }}>LIVES</div>
              <HeartBar hearts={profile.hearts} />
            </div>
          </div>
        )}

        {/* Main content */}
        <div style={{
          flex:1,
          marginLeft: screen==="game" && profile ? 220 : 0,
          maxWidth: screen==="game" && profile ? 760 : "100%",
          padding:"24px",
          overflowY:"auto",
        }}
          className={shaking ? "shake" : ""}>

          {screen==="login" && (
            <div style={{ maxWidth:560, margin:"0 auto" }}>
              <LoginScreen
                onStudentLogin={(p) => { setProfile(p); setTab("home"); setScreen("game"); }}
                onParentLogin={() => setScreen("parent")}
              />
            </div>
          )}

          {screen==="parent" && (
            <div style={{ maxWidth:700, margin:"0 auto" }}>
              <ParentPortal onBack={() => setScreen("login")} />
            </div>
          )}

          {screen==="game" && profile && (screens[tab] || screens.home)}
        </div>
      </div>
    </div>
  );

  // ── PHONE LAYOUT ──────────────────────────────────────────────
  return (
    <div style={{ background:C.bg, minHeight:"100vh", maxWidth:430, margin:"0 auto",
      display:"flex", flexDirection:"column", position:"relative",
      fontFamily:fn, color:C.text,
      boxShadow:"0 0 60px rgba(0,212,255,0.1)" }}>
      <Bg />
      <Particles particles={particles} />

      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1,
        backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)" }} />

      <div className={shaking ? "shake" : ""} style={{ flex:1, display:"flex", flexDirection:"column", position:"relative", zIndex:2 }}>

        {screen==="login" && (
          <div style={{ flex:1, overflowY:"auto" }}>
            <LoginScreen
              onStudentLogin={(p) => { setProfile(p); setTab("home"); setScreen("game"); }}
              onParentLogin={() => setScreen("parent")}
            />
          </div>
        )}

        {screen==="parent" && (
          <div style={{ flex:1, overflowY:"auto" }}>
            <ParentPortal onBack={() => setScreen("login")} />
          </div>
        )}

        {screen==="game" && profile && (
          <>
            {/* Top bar */}
            <div style={{ padding:"10px 16px", background:C.card,
              borderBottom:`3px solid ${C.border}`,
              display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
              <div style={{ color:C.green, fontFamily:fp, fontSize:9, letterSpacing:2,
                textShadow:`0 0 10px ${C.green}` }}>STELLAR★MINDS</div>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <span style={{ color:C.gold,   fontFamily:fp, fontSize:8 }}>⭐{profile.coins}</span>
                <span style={{ color:C.orange, fontFamily:fp, fontSize:8 }}>🔥{profile.streak}</span>
                <span style={{ color:getRank(profile.xp).color, fontFamily:fp, fontSize:8 }}>
                  {getRank(profile.xp).emoji}
                </span>
              </div>
            </div>

            {/* Content */}
            <div style={{ flex:1, overflowY:"auto" }}>
              {screens[tab] || screens.home}
            </div>

            <BottomNav tab={tab} onTab={setTab} />
          </>
        )}
      </div>
    </div>
  );
}



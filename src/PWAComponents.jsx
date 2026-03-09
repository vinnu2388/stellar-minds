import { useState } from 'react';

// ─── Design tokens (must match main app) ─────────────────────────
const C = {
  bg:"#05070E", card:"#0E1320",
  purple:"#7C3AED", purpleBright:"#8B5CF6", purpleLight:"#C4B5FD",
  cyan:"#06B6D4", green:"#34D399", gold:"#FBBF24", goldLight:"#FDE68A",
  orange:"#FB923C", red:"#F87171",
  text:"#F8FAFC", muted:"rgba(248,250,252,0.78)", dim:"rgba(248,250,252,0.40)",
  border:"rgba(255,255,255,0.10)",
};
const ff = "'Fredoka One',cursive";
const fn = "'Nunito',sans-serif";

// ─── PWA Install Banner ───────────────────────────────────────────
// Shows on Android/desktop when browser install prompt is available
export function PWAInstallBanner({ onInstall, onDismiss }) {
  return (
    <div style={{
      position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
      width: 'min(380px, calc(100vw - 32px))',
      background: `linear-gradient(135deg, ${C.purple}ee, #1a0a2e)`,
      borderRadius: 20, padding: '16px 18px',
      border: `1px solid ${C.purpleLight}44`,
      boxShadow: `0 20px 60px rgba(124,58,237,0.5), 0 0 0 1px ${C.purpleLight}22`,
      zIndex: 10000, animation: 'slideUp 0.35s ease',
      display: 'flex', gap: 14, alignItems: 'center',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 16, flexShrink: 0,
        background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
      }}>🌟</div>

      <div style={{ flex: 1 }}>
        <div style={{ color: C.text, fontWeight: 800, fontSize: 15, fontFamily: ff, marginBottom: 2 }}>
          Add to Home Screen!
        </div>
        <div style={{ color: C.purpleLight, fontSize: 11, fontFamily: fn, lineHeight: 1.5 }}>
          Install MathSci Stars for faster access, offline lessons & streak alerts 🔥
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
        <button onClick={onInstall} style={{
          background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`,
          border: 'none', borderRadius: 10, padding: '8px 14px',
          color: 'white', fontWeight: 800, fontSize: 12, fontFamily: ff, cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}>
          ⬇ Install
        </button>
        <button onClick={onDismiss} style={{
          background: 'transparent', border: `1px solid ${C.border}`,
          borderRadius: 10, padding: '6px 14px',
          color: C.muted, fontSize: 11, fontFamily: fn, cursor: 'pointer',
        }}>
          Not now
        </button>
      </div>
    </div>
  );
}

// ─── iOS Install Instructions ─────────────────────────────────────
// iOS doesn't support the beforeinstallprompt event — we show manual steps
export function IOSInstallInstructions({ onDismiss }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      zIndex: 10001, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      padding: '0 16px 20px',
    }} onClick={onDismiss}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.card, borderRadius: 24, padding: '24px 22px',
        width: '100%', maxWidth: 400,
        border: `1px solid ${C.border}`,
        boxShadow: `0 -20px 60px rgba(124,58,237,0.3)`,
        animation: 'slideUp 0.35s ease',
      }}>
        {/* Arrow pointing to Safari share button */}
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <div style={{
            display: 'inline-block',
            width: 0, height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: `12px solid ${C.purpleLight}`,
            marginBottom: 8,
          }} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🌟</div>
          <div style={{ color: C.text, fontWeight: 800, fontSize: 18, fontFamily: ff }}>
            Add MathSci Stars to your Home Screen
          </div>
          <div style={{ color: C.muted, fontSize: 12, fontFamily: fn, marginTop: 6 }}>
            Get the full app experience — works like a real app!
          </div>
        </div>

        {[
          { step: 1, icon: '⬆️', text: 'Tap the Share button at the bottom of Safari' },
          { step: 2, icon: '📲', text: 'Scroll down and tap "Add to Home Screen"' },
          { step: 3, icon: '✅', text: 'Tap "Add" in the top right corner' },
          { step: 4, icon: '🚀', text: 'Open MathSci Stars from your home screen!' },
        ].map(({ step, icon, text }) => (
          <div key={step} style={{
            display: 'flex', gap: 14, alignItems: 'center',
            padding: '12px 14px', borderRadius: 14, marginBottom: 8,
            background: `${C.purple}15`, border: `1px solid ${C.purple}33`,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleBright})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: 13, fontFamily: ff,
            }}>{step}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{icon}</div>
              <div style={{ color: C.text, fontSize: 13, fontFamily: fn }}>{text}</div>
            </div>
          </div>
        ))}

        <button onClick={onDismiss} style={{
          width: '100%', marginTop: 8,
          background: `linear-gradient(135deg, ${C.purple}, ${C.purpleBright})`,
          border: 'none', borderRadius: 14, padding: '14px',
          color: 'white', fontWeight: 800, fontSize: 15, fontFamily: ff, cursor: 'pointer',
        }}>
          Got it! 👍
        </button>
      </div>
    </div>
  );
}

// ─── Update Available Banner ──────────────────────────────────────
export function UpdateBanner({ onUpdate, onDismiss }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      background: `linear-gradient(135deg, ${C.green}dd, #064e3b)`,
      padding: '12px 16px', zIndex: 10000,
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: `0 4px 20px rgba(52,211,153,0.4)`,
    }}>
      <div style={{ fontSize: 20 }}>🆕</div>
      <div style={{ flex: 1 }}>
        <div style={{ color: 'white', fontWeight: 800, fontSize: 13, fontFamily: ff }}>
          New version available!
        </div>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontFamily: fn }}>
          Tap to update — it only takes a second
        </div>
      </div>
      <button onClick={onUpdate} style={{
        background: 'white', border: 'none', borderRadius: 10,
        padding: '8px 14px', color: '#064e3b',
        fontWeight: 800, fontSize: 12, fontFamily: ff, cursor: 'pointer',
      }}>
        Update ↺
      </button>
      <button onClick={onDismiss} style={{
        background: 'transparent', border: 'none',
        color: 'rgba(255,255,255,0.7)', fontSize: 20, cursor: 'pointer', padding: '0 4px',
      }}>×</button>
    </div>
  );
}

// ─── Offline Banner ───────────────────────────────────────────────
export function OfflineBanner() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      background: `linear-gradient(135deg, #7f1d1d, ${C.red}cc)`,
      padding: '10px 16px', zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      boxShadow: `0 4px 20px rgba(248,113,113,0.4)`,
    }}>
      <div style={{ fontSize: 18 }}>📡</div>
      <div style={{ color: 'white', fontWeight: 800, fontSize: 13, fontFamily: ff }}>
        You're offline — cached lessons still work!
      </div>
    </div>
  );
}

// ─── Back Online Toast ────────────────────────────────────────────
export function BackOnlineToast() {
  return (
    <div style={{
      position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)',
      background: `linear-gradient(135deg, ${C.green}, #059669)`,
      borderRadius: 14, padding: '12px 22px',
      color: 'white', fontWeight: 800, fontSize: 14, fontFamily: ff,
      whiteSpace: 'nowrap', zIndex: 10000,
      boxShadow: `0 8px 30px rgba(52,211,153,0.5)`,
      animation: 'fadeIn 0.3s ease',
    }}>
      ✅ Back online! Progress syncing...
    </div>
  );
}

// ─── PWA Install Prompt Orchestrator ─────────────────────────────
// Drop this into your App root to handle all install/update UI
export function PWAPrompts({ pwa }) {
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [showInstallBanner, setShowInstallBanner]     = useState(true);
  const [showUpdateBanner, setShowUpdateBanner]       = useState(true);
  const [showBackOnline, setShowBackOnline]           = useState(false);

  // When coming back online, briefly show the "back online" toast
  const prevOnline = useState(pwa.isOnline);
  if (prevOnline[0] !== pwa.isOnline) {
    prevOnline[0] = pwa.isOnline;
    if (pwa.isOnline) {
      setShowBackOnline(true);
      setTimeout(() => setShowBackOnline(false), 3000);
    }
  }

  return (
    <>
      {/* Offline banner */}
      {!pwa.isOnline && <OfflineBanner />}

      {/* Back online toast */}
      {showBackOnline && <BackOnlineToast />}

      {/* New version available */}
      {pwa.updateReady && showUpdateBanner && (
        <UpdateBanner
          onUpdate={pwa.applyUpdate}
          onDismiss={() => setShowUpdateBanner(false)}
        />
      )}

      {/* Android/desktop install prompt */}
      {pwa.installReady && !pwa.isInstalled && showInstallBanner && (
        <PWAInstallBanner
          onInstall={async () => {
            await pwa.triggerInstall();
            setShowInstallBanner(false);
          }}
          onDismiss={() => setShowInstallBanner(false)}
        />
      )}

      {/* iOS manual install instructions */}
      {pwa.isIOS && !pwa.isStandalone && showIOSInstructions && (
        <IOSInstallInstructions onDismiss={() => setShowIOSInstructions(false)} />
      )}
    </>
  );
}

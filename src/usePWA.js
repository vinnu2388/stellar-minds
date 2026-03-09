import { useState, useEffect, useCallback, useRef } from 'react';

// ─── usePWA ───────────────────────────────────────────────────────
// Master hook for all PWA functionality:
//   - Install prompt (Android + desktop)
//   - iOS install instructions
//   - New version update detection
//   - Online/offline status
//   - Push notification subscription

export function usePWA() {
  const [installReady, setInstallReady]     = useState(false);
  const [isInstalled, setIsInstalled]       = useState(false);
  const [updateReady, setUpdateReady]       = useState(false);
  const [isOnline, setIsOnline]             = useState(navigator.onLine);
  const [isIOS, setIsIOS]                   = useState(false);
  const [isStandalone, setIsStandalone]     = useState(false);
  const [pushSupported, setPushSupported]   = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const swRegistrationRef = useRef(null);

  useEffect(() => {
    // Detect iOS and standalone mode
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;
    setIsIOS(ios);
    setIsStandalone(standalone);
    setIsInstalled(standalone);

    // Push support
    setPushSupported('PushManager' in window && 'Notification' in window);

    // Online/offline listeners
    const goOnline  = () => setIsOnline(true);
    const goOffline = () => setIsOffline(false);
    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);

    // Install prompt ready (Android/desktop)
    const onInstallReady = () => setInstallReady(true);
    const onInstalled    = () => { setIsInstalled(true); setInstallReady(false); };
    window.addEventListener('pwaInstallReady', onInstallReady);
    window.addEventListener('pwaInstalled',    onInstalled);

    // New SW version available
    const onUpdate = () => setUpdateReady(true);
    window.addEventListener('swUpdateAvailable', onUpdate);

    // Get SW registration reference
    navigator.serviceWorker?.ready.then(reg => {
      swRegistrationRef.current = reg;
      // Check if already subscribed to push
      reg.pushManager?.getSubscription().then(sub => {
        setPushSubscribed(!!sub);
      });
    });

    return () => {
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('pwaInstallReady', onInstallReady);
      window.removeEventListener('pwaInstalled',    onInstalled);
      window.removeEventListener('swUpdateAvailable', onUpdate);
    };
  }, []);

  // Trigger the browser's native install prompt
  const triggerInstall = useCallback(async () => {
    if (window.triggerPWAInstall) {
      const accepted = await window.triggerPWAInstall();
      if (accepted) setIsInstalled(true);
      return accepted;
    }
    return false;
  }, []);

  // Apply the waiting service worker (triggers app reload with new version)
  const applyUpdate = useCallback(() => {
    const reg = swRegistrationRef.current;
    if (reg?.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }, []);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async (vapidPublicKey) => {
    if (!pushSupported || !swRegistrationRef.current) return null;
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return null;

      const subscription = await swRegistrationRef.current.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      setPushSubscribed(true);
      // Send subscription to your backend here:
      // await fetch('/api/push/subscribe', { method:'POST', body: JSON.stringify(subscription) })
      return subscription;
    } catch (error) {
      console.error('[PWA] Push subscription failed:', error);
      return null;
    }
  }, [pushSupported]);

  // Unsubscribe from push notifications
  const unsubscribeFromPush = useCallback(async () => {
    const reg = swRegistrationRef.current;
    if (!reg) return;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await sub.unsubscribe();
      setPushSubscribed(false);
    }
  }, []);

  return {
    installReady,      // true = browser install prompt is available
    isInstalled,       // true = running as installed PWA
    isIOS,             // true = iOS device
    isStandalone,      // true = running in standalone mode (installed)
    updateReady,       // true = new version of the app is available
    isOnline,          // true = device has internet connection
    pushSupported,     // true = device supports push notifications
    pushSubscribed,    // true = user has subscribed to push
    triggerInstall,    // fn() = show the browser install prompt
    applyUpdate,       // fn() = apply new version and reload
    subscribeToPush,   // fn(vapidKey) = subscribe to push
    unsubscribeFromPush, // fn() = unsubscribe
  };
}

// Helper: convert VAPID key for push subscription
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

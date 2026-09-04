// Web Audio API based chime for notifications without external asset dependencies
export const playNotificationChime = (): void => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    
    // Play a smooth 2-tone melodic chime (C6 -> G6)
    const now = ctx.currentTime;
    
    // First tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1046.5, now); // C6
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second tone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1567.98, now + 0.12); // G6
    gain2.gain.setValueAtTime(0, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.35, now + 0.17);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (e) {
    console.warn('Audio notification sound could not play:', e);
  }
};

export type PushPermissionResult = 'granted' | 'denied' | 'default' | 'unsupported' | 'iframe_blocked';

// Request push notification permission with detailed feedback
export const getPushPermissionStatus = (): PushPermissionResult => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission as PushPermissionResult;
};

export const requestPushPermission = async (): Promise<PushPermissionResult> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission as PushPermissionResult;
  } catch (err) {
    console.warn('Notification permission request error:', err);
    return 'iframe_blocked';
  }
};

// Send browser push notification
export const sendPushNotification = (title: string, body: string, icon?: string): void => {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: icon || '/vite.svg',
        badge: '/vite.svg'
      });
    } catch (e) {
      console.warn('Push notification error:', e);
    }
  }
};

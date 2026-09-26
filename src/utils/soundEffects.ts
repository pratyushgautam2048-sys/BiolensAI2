/**
 * Web Audio API Sound Effects Engine
 * Generates tactile, organic UI pop sounds and confirmation chimes
 * without external audio assets or network latency.
 */

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!sharedAudioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        sharedAudioCtx = new AudioCtxClass();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch (err) {
    console.warn('AudioContext not available:', err);
    return null;
  }
}

/**
 * Play a crisp, gentle bubble/popup sound for UI clicks
 */
export function playPopupSound(volume = 0.25): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    
    // Primary bubble pop oscillator (frequency sweep up)
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    
    // Rapid pitch sweep (simulates a popping bubble / droplet)
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);

    // Natural exponential decay envelope
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.008);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    // Secondary subtle high tick for tactile crispness
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(1400, now);
    clickOsc.frequency.exponentialRampToValueAtTime(600, now + 0.02);

    clickGain.gain.setValueAtTime(0.001, now);
    clickGain.gain.linearRampToValueAtTime(volume * 0.4, now + 0.004);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    // Connect nodes
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);

    // Start and stop
    osc.start(now);
    osc.stop(now + 0.1);

    clickOsc.start(now);
    clickOsc.stop(now + 0.04);
  } catch (e) {
    // Ignore audio playback errors if user hasn't interacted
  }
}

/**
 * Play a cheerful, medical-grade confirmation chime when permission is confirmed
 */
export function playConfirmChime(volume = 0.25): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Note 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(volume * 0.7, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.22);

    // Note 2: B5 (987.77 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.1);
    gain2.gain.setValueAtTime(0.001, now + 0.1);
    gain2.gain.linearRampToValueAtTime(volume, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.4);
  } catch (e) {
    // Graceful fallback
  }
}

/**
 * Play a soft mute indicator click
 */
export function playMuteClick(volume = 0.2): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume * 0.5, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {
    // Graceful fallback
  }
}

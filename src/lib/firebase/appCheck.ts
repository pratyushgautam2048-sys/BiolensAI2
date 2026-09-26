import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { app } from './index';

export function initializeFirebaseAppCheck() {
  if (!app) return;

  const recaptchaKey = import.meta.env.VITE_FIREBASE_RECAPTCHA_KEY;
  if (!recaptchaKey) {
    // Gracefully bypass if reCAPTCHA key not provided for local development
    return;
  }

  try {
    // In development, debug token can be enabled
    if (import.meta.env.DEV) {
      // @ts-ignore
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(recaptchaKey),
      isTokenAutoRefreshEnabled: true
    });
  } catch (err) {
    console.warn('Firebase App Check initialization notice:', err);
  }
}

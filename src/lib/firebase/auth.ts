import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { auth, googleProvider } from './index';

export const firebaseAuthService = {
  /**
   * Register with Email & Password
   */
  async register(email: string, password: string, displayName?: string): Promise<FirebaseUser> {
    if (!auth) throw new Error('Firebase Auth is not initialized. Running in demo mode.');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateFirebaseProfile(userCredential.user, { displayName });
    }
    // Optionally trigger email verification without blocking
    try {
      await sendEmailVerification(userCredential.user);
    } catch (e) {
      console.warn('Email verification dispatch notice:', e);
    }
    return userCredential.user;
  },

  /**
   * Login with Email & Password
   */
  async login(email: string, password: string): Promise<FirebaseUser> {
    if (!auth) throw new Error('Firebase Auth is not initialized.');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  /**
   * Sign In with Google
   */
  async signInWithGoogle(): Promise<FirebaseUser> {
    if (!auth) throw new Error('Firebase Auth is not initialized.');
    const userCredential = await signInWithPopup(auth, googleProvider);
    return userCredential.user;
  },

  /**
   * Send Password Reset Email
   */
  async resetPassword(email: string): Promise<void> {
    if (!auth) throw new Error('Firebase Auth is not initialized.');
    await sendPasswordResetEmail(auth, email);
  },

  /**
   * Sign out current user
   */
  async logout(): Promise<void> {
    if (!auth) return;
    await signOut(auth);
  },

  /**
   * Subscribe to auth changes
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    if (!auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  }
};

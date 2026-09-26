import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { firebaseAuthService } from '../lib/firebase/auth';
import { firestoreService } from '../lib/firebase/firestore';
import { isFirebaseConfigured } from '../lib/firebase/config';
import { UserProfile } from '../types';
import { INITIAL_USER } from '../data/mockData';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileData: (updates: Partial<UserProfile>) => Promise<void>;
  setDemoUser: (user: Partial<UserProfile>) => void;
  enterDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(!isFirebaseConfigured);

  useEffect(() => {
    // If Firebase isn't configured, stay in Demo mode with Eleanor Vance
    if (!isFirebaseConfigured) {
      setIsDemoMode(true);
      setUserProfile(INITIAL_USER);
      setIsLoading(false);
      return;
    }

    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsDemoMode(false);
        try {
          // Fetch or initialize user profile in Firestore
          const profile = await firestoreService.getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
          } else {
            const newProfile: UserProfile = {
              id: user.uid,
              name: user.displayName || user.email?.split('@')[0] || 'Patient',
              email: user.email || '',
              dateOfBirth: '',
              gender: 'Not specified',
              bloodGroup: 'Not specified',
              height: '',
              weight: '',
              emergencyContact: { name: '', relationship: '', phone: '' },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await firestoreService.setUserProfile(user.uid, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.warn('Profile sync notice:', err);
        }
      } else {
        // Logged out
        if (!isDemoMode) {
          setUserProfile(INITIAL_USER);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      await firebaseAuthService.login(email, pass);
      setIsDemoMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name?: string) => {
    setIsLoading(true);
    try {
      const user = await firebaseAuthService.register(email, pass, name);
      setIsDemoMode(false);
      const initial: UserProfile = {
        id: user.uid,
        name: name || user.email?.split('@')[0] || 'Patient',
        email: user.email || '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        height: '',
        weight: '',
        emergencyContact: { name: '', relationship: '', phone: '' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await firestoreService.setUserProfile(user.uid, initial);
      setUserProfile(initial);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await firebaseAuthService.signInWithGoogle();
      setIsDemoMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await firebaseAuthService.logout();
      setCurrentUser(null);
      setIsDemoMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await firebaseAuthService.resetPassword(email);
  };

  const updateProfileData = async (updates: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...updates, updatedAt: new Date().toISOString() };
    setUserProfile(updated);
    if (currentUser) {
      await firestoreService.setUserProfile(currentUser.uid, updates);
    }
  };

  const setDemoUser = (user: Partial<UserProfile>) => {
    setIsDemoMode(true);
    setUserProfile((prev) => ({ ...prev, ...user }));
  };

  const enterDemoMode = () => {
    setIsDemoMode(true);
    setUserProfile(INITIAL_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAuthenticated: Boolean(currentUser) || isDemoMode,
        isLoading,
        isDemoMode,
        loginWithEmail,
        registerWithEmail,
        signInWithGoogle,
        logout,
        resetPassword,
        updateProfileData,
        setDemoUser,
        enterDemoMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

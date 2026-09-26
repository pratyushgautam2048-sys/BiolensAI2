import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { playPopupSound, playConfirmChime, playMuteClick } from '../utils/soundEffects';

export type SoundPermissionState = 'prompt' | 'granted' | 'denied';

interface SoundContextType {
  soundPermission: SoundPermissionState;
  isSoundEnabled: boolean;
  volume: number;
  setVolume: (vol: number) => void;
  isPermissionModalOpen: boolean;
  setIsPermissionModalOpen: (open: boolean) => void;
  confirmationToast: { message: string; type: 'success' | 'info' } | null;
  clearConfirmationToast: () => void;
  requestPermission: (targetSection?: string) => void;
  confirmPermission: (granted: boolean) => void;
  toggleSound: () => void;
  playNavPop: (sectionName?: string) => void;
  testSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const STORAGE_KEY_PERMISSION = 'biolens_sound_permission';
const STORAGE_KEY_ENABLED = 'biolens_sound_enabled';
const STORAGE_KEY_VOLUME = 'biolens_sound_volume';

// Fallback legacy keys
const LEGACY_STORAGE_KEY_PERMISSION = 'medora_sound_permission';
const LEGACY_STORAGE_KEY_ENABLED = 'medora_sound_enabled';
const LEGACY_STORAGE_KEY_VOLUME = 'medora_sound_volume';

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [soundPermission, setSoundPermission] = useState<SoundPermissionState>(() => {
    if (typeof window === 'undefined') return 'prompt';
    const saved = localStorage.getItem(STORAGE_KEY_PERMISSION) || localStorage.getItem(LEGACY_STORAGE_KEY_PERMISSION);
    if (saved === 'granted' || saved === 'denied') return saved;
    return 'prompt';
  });

  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const savedEnabled = localStorage.getItem(STORAGE_KEY_ENABLED) || localStorage.getItem(LEGACY_STORAGE_KEY_ENABLED);
    const savedPerm = localStorage.getItem(STORAGE_KEY_PERMISSION) || localStorage.getItem(LEGACY_STORAGE_KEY_PERMISSION);
    if (savedPerm === 'granted') {
      return savedEnabled !== 'false';
    }
    return false;
  });

  const [volume, setVolumeState] = useState<number>(() => {
    if (typeof window === 'undefined') return 0.25;
    const saved = localStorage.getItem(STORAGE_KEY_VOLUME);
    return saved ? parseFloat(saved) : 0.25;
  });

  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState<boolean>(false);
  const [pendingSection, setPendingSection] = useState<string | null>(null);
  const [confirmationToast, setConfirmationToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Set and persist volume
  const setVolume = useCallback((newVol: number) => {
    const clamped = Math.max(0.05, Math.min(1.0, newVol));
    setVolumeState(clamped);
    localStorage.setItem(STORAGE_KEY_VOLUME, clamped.toString());
  }, []);

  const clearConfirmationToast = useCallback(() => {
    setConfirmationToast(null);
  }, []);

  // Request permission explicitly (e.g. from nav click or button)
  const requestPermission = useCallback((targetSection?: string) => {
    if (targetSection) {
      setPendingSection(targetSection);
    }
    setIsPermissionModalOpen(true);
  }, []);

  // Confirm user choice: Yes (enable) or No (mute)
  const confirmPermission = useCallback((granted: boolean) => {
    setIsPermissionModalOpen(false);
    
    if (granted) {
      setSoundPermission('granted');
      setIsSoundEnabled(true);
      localStorage.setItem(STORAGE_KEY_PERMISSION, 'granted');
      localStorage.setItem(STORAGE_KEY_ENABLED, 'true');
      
      // Play instant confirmation chime as audio verification
      playConfirmChime(volume);
      
      setConfirmationToast({
        message: 'Navigation sounds confirmed! Pop audio is now active for dashboard and clinical sections.',
        type: 'success'
      });
    } else {
      setSoundPermission('denied');
      setIsSoundEnabled(false);
      localStorage.setItem(STORAGE_KEY_PERMISSION, 'denied');
      localStorage.setItem(STORAGE_KEY_ENABLED, 'false');

      playMuteClick(volume);

      setConfirmationToast({
        message: 'Sounds kept muted. You can enable them anytime from the header or settings.',
        type: 'info'
      });
    }

    setPendingSection(null);
  }, [volume]);

  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    if (soundPermission === 'prompt') {
      setIsPermissionModalOpen(true);
      return;
    }

    const nextState = !isSoundEnabled;
    setIsSoundEnabled(nextState);
    localStorage.setItem(STORAGE_KEY_ENABLED, nextState ? 'true' : 'false');

    if (nextState) {
      playPopupSound(volume);
      setConfirmationToast({
        message: 'Navigation sounds unmuted.',
        type: 'success'
      });
    } else {
      playMuteClick(volume);
      setConfirmationToast({
        message: 'Navigation sounds muted.',
        type: 'info'
      });
    }
  }, [isSoundEnabled, soundPermission, volume]);

  // Play popup sound when clicking on dashboard, reports, equipment, profile, appointments, privacy
  const playNavPop = useCallback((sectionName?: string) => {
    // If user has not yet decided, prompt them for permission!
    if (soundPermission === 'prompt') {
      requestPermission(sectionName);
      return;
    }

    if (isSoundEnabled) {
      playPopupSound(volume);
    }
  }, [soundPermission, isSoundEnabled, volume, requestPermission]);

  // Test sound for previewing
  const testSound = useCallback(() => {
    playPopupSound(volume);
  }, [volume]);

  // Auto-dismiss confirmation toast after 4 seconds
  useEffect(() => {
    if (!confirmationToast) return;
    const timer = setTimeout(() => {
      setConfirmationToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [confirmationToast]);

  return (
    <SoundContext.Provider
      value={{
        soundPermission,
        isSoundEnabled,
        volume,
        setVolume,
        isPermissionModalOpen,
        setIsPermissionModalOpen,
        confirmationToast,
        clearConfirmationToast,
        requestPermission,
        confirmPermission,
        toggleSound,
        playNavPop,
        testSound
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

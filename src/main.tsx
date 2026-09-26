import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { SoundProvider } from './context/SoundContext';
import { initializeFirebaseAppCheck } from './lib/firebase/appCheck';

// Prevent unhandled ViewTransition skipped abort errors from bubbling up to browser console
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const msg = event?.reason?.message || (typeof event?.reason === 'string' ? event.reason : '');
    if (
      event?.reason?.name === 'AbortError' ||
      msg.includes('Transition was skipped') ||
      msg.includes('ViewTransition')
    ) {
      event.preventDefault();
    }
  });
}

// Initialize App Check if configured
initializeFirebaseAppCheck();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SoundProvider>
        <App />
      </SoundProvider>
    </AuthProvider>
  </StrictMode>,
);

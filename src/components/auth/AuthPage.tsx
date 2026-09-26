import React, { useState } from 'react';
import { 
  Activity, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BackgroundBlobs } from '../layout/BackgroundBlobs';

interface AuthPageProps {
  mode: 'login' | 'signup' | 'forgot-password';
  onNavigate: (route: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode, onNavigate }) => {
  const { loginWithEmail, registerWithEmail, signInWithGoogle, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === 'forgot-password') {
        if (!email) {
          throw new Error('Please enter your email address to receive reset instructions.');
        }
        await resetPassword(email);
        setSuccessMessage(`Password recovery instructions have been sent to ${email}. Check your inbox.`);
      } else if (mode === 'signup') {
        if (!email || !password) {
          throw new Error('Please fill in all required fields.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        await registerWithEmail(email, password, name.trim() || undefined);
        // After signup, redirect to onboarding health profile setup
        onNavigate('/onboarding');
      } else {
        // login
        if (!email || !password) {
          throw new Error('Please enter your email and password.');
        }
        await loginWithEmail(email, password);
        onNavigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Authentication action error:', err);
      let userFriendly = err.message || 'Authentication failed. Please verify your credentials.';
      if (userFriendly.includes('auth/invalid-credential') || userFriendly.includes('auth/user-not-found') || userFriendly.includes('auth/wrong-password')) {
        userFriendly = 'Invalid email or password. Please verify and try again, or use Demo Sign In.';
      } else if (userFriendly.includes('auth/email-already-in-use')) {
        userFriendly = 'An account with this email address already exists. Please sign in instead.';
      } else if (userFriendly.includes('auth/weak-password')) {
        userFriendly = 'Password should be at least 6 characters.';
      }
      setErrorMessage(userFriendly);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      onNavigate('/dashboard');
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(err.message || 'Google Sign-In failed. Please try again or use email sign in.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-100 selection:text-[#0F7F51]">
      <BackgroundBlobs />

      {/* Main Container */}
      <div className="relative w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-[#0F7F51] via-[#18A66A] to-emerald-400 p-0.5 shadow-xl shadow-emerald-700/25 mb-3">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
              <Activity className="w-7 h-7 text-[#18A66A]" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-[#12201B] tracking-tight">
            Bio<span className="text-[#18A66A]">Lens</span>
          </h1>
          <p className="text-xs font-semibold text-[#0F7F51] tracking-wide uppercase mt-0.5">
            Clinical Health Intelligence
          </p>
          <p className="text-xs text-[#6C7C75] mt-2 max-w-sm mx-auto">
            {mode === 'login' && 'Sign in to access your private medical records, report analyses, and personalized health guidance.'}
            {mode === 'signup' && 'Create your secure BioLens account to understand lab reports and scan medical equipment.'}
            {mode === 'forgot-password' && 'Enter your registered email address and we will dispatch a secure reset link.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/20 space-y-6">
          {/* Mode Switcher Tabs */}
          {mode !== 'forgot-password' && (
            <div className="flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  mode === 'login'
                    ? 'bg-white text-[#0F7F51] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/signup')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-[#0F7F51] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50/90 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#18A66A] shrink-0 mt-0.5" />
              <div className="flex-1">{successMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-[#12201B] mb-1.5">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:outline-none focus:border-[#18A66A] text-xs font-medium text-slate-800 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#12201B] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="patient@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:outline-none focus:border-[#18A66A] text-xs font-medium text-slate-800 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {mode !== 'forgot-password' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#12201B]">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => onNavigate('/forgot-password')}
                      className="text-[11px] font-semibold text-[#0F7F51] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:outline-none focus:border-[#18A66A] text-xs font-medium text-slate-800 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'signup' && (
                  <p className="text-[10px] text-[#6C7C75] mt-1">Must be at least 6 characters.</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0F7F51] via-[#18A66A] to-emerald-500 hover:from-[#0b633f] hover:to-[#148b59] text-white text-xs font-extrabold shadow-lg shadow-emerald-700/20 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' && 'Sign In to Health Portal'}
                  {mode === 'signup' && 'Create Account & Begin Onboarding'}
                  {mode === 'forgot-password' && 'Send Password Recovery Link'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Google Sign-in */}
          {mode !== 'forgot-password' && (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white/95 px-3 text-[#6C7C75] font-medium">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs hover:border-emerald-300 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Sign In with Google
              </button>
            </div>
          )}

          {/* Return link for forgot-password */}
          {mode === 'forgot-password' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="text-xs font-bold text-[#0F7F51] hover:underline"
              >
                Return to Sign In
              </button>
            </div>
          )}

          {/* Privacy badge */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#6C7C75]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#18A66A]" />
            <span>Encrypted patient confidentiality & HIPAA guidelines</span>
          </div>
        </div>
      </div>
    </div>
  );
};

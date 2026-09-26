import React, { useState } from 'react';
import { Activity, Lock, Mail, User, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: Partial<UserProfile>, isNewUser?: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (authMode === 'forgot') {
      if (!email) {
        setError('Please enter your email address.');
        return;
      }
      setResetSent(true);
      return;
    }

    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }

    if (authMode === 'signup') {
      onLoginSuccess(
        {
          name: name || 'New Patient',
          email: email
        },
        true // isNewUser -> trigger setup wizard!
      );
    } else {
      onLoginSuccess({
        email: email
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/20 z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F7F51] via-[#18A66A] to-emerald-400 p-0.5 shadow-md shadow-emerald-600/20">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#18A66A]" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#12201B]">BioLens</h3>
              <p className="text-[11px] text-[#6C7C75]">Secure Health Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        {authMode !== 'forgot' && (
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => {
                setAuthMode('login');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'login' ? 'bg-white text-[#0F7F51] shadow-xs' : 'text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'signup' ? 'bg-white text-[#0F7F51] shadow-xs' : 'text-slate-600'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {resetSent ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-6 h-6 text-[#18A66A] mx-auto" />
              <p className="font-bold">Password Reset Link Dispatched</p>
              <p className="text-[11px] text-[#6C7C75]">
                If an account exists for {email}, a recovery link has been delivered.
              </p>
              <button
                type="button"
                onClick={() => {
                  setResetSent(false);
                  setAuthMode('login');
                }}
                className="text-xs font-bold text-[#0F7F51] underline pt-2 block"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              {authMode === 'signup' && (
                <div>
                  <label className="block font-semibold mb-1 text-[#12201B]">Full Legal Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g., Eleanor Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1 text-[#12201B]">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
                    required
                  />
                </div>
              </div>

              {authMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-[#12201B]">Password</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot');
                          setError(null);
                        }}
                        className="text-[11px] text-[#0F7F51] hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#18A66A] hover:bg-[#0F7F51] text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {authMode === 'login' && 'Sign In to Health Portal'}
                {authMode === 'signup' && 'Create Account & Begin Setup'}
                {authMode === 'forgot' && 'Send Reset Instructions'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {authMode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="w-full text-center text-[11px] text-[#6C7C75] hover:text-[#12201B]"
                >
                  Return to Sign In
                </button>
              )}
            </>
          )}
        </form>

        <p className="text-[11px] text-center text-[#6C7C75]">
          By continuing, you agree to BioLens's patient confidentiality guidelines and educational health disclosures.
        </p>
      </div>
    </div>
  );
};

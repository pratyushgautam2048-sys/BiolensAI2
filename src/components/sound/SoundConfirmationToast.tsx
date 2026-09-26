import React from 'react';
import { Volume2, VolumeX, CheckCircle2, X } from 'lucide-react';
import { useSound } from '../../context/SoundContext';

export const SoundConfirmationToast: React.FC = () => {
  const { confirmationToast, clearConfirmationToast, isSoundEnabled, toggleSound } = useSound();

  if (!confirmationToast) return null;

  const isSuccess = confirmationToast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`p-4 rounded-2xl shadow-xl border backdrop-blur-xl flex items-start gap-3 ${
        isSuccess
          ? 'bg-white/95 border-emerald-500/30 text-slate-800'
          : 'bg-white/95 border-slate-300 text-slate-800'
      }`}>
        <div className={`p-2 rounded-xl shrink-0 ${
          isSuccess ? 'bg-[#EAFFF4] text-[#18A66A]' : 'bg-slate-100 text-slate-600'
        }`}>
          {isSuccess ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold text-[#12201B]">
              {isSuccess ? 'Navigation Audio Confirmed' : 'Audio Status Updated'}
            </h4>
            {isSuccess && <CheckCircle2 className="w-3.5 h-3.5 text-[#18A66A]" />}
          </div>
          <p className="text-xs text-[#6C7C75] mt-0.5 leading-relaxed">
            {confirmationToast.message}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={clearConfirmationToast}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

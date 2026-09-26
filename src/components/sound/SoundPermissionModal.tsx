import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Play, 
  Sliders,
  ShieldCheck,
  LayoutDashboard,
  FileText,
  Camera,
  UserCheck,
  Calendar
} from 'lucide-react';
import { useSound } from '../../context/SoundContext';

export const SoundPermissionModal: React.FC = () => {
  const { 
    isPermissionModalOpen, 
    setIsPermissionModalOpen, 
    confirmPermission, 
    testSound,
    volume,
    setVolume
  } = useSound();

  if (!isPermissionModalOpen) return null;

  const sections = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Report Analyzer', icon: FileText },
    { name: 'Scan Equipment', icon: Camera },
    { name: 'My Health Profile', icon: UserCheck },
    { name: 'Appointments', icon: Calendar },
    { name: 'Security & Privacy', icon: ShieldCheck }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl border border-emerald-500/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="sound-permission-title"
        aria-modal="true"
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#0F7F51] via-[#18A66A] to-emerald-500 p-6 text-white relative">
          <button
            onClick={() => confirmPermission(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="sound-permission-title" className="text-xl font-bold tracking-tight">
                  Enable Navigation Audio?
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
                  Permission Request
                </span>
              </div>
              <p className="text-xs text-white/90 mt-1">
                Subtle, tactile pop sound feedback while switching clinical sections
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-[#12201B] font-medium leading-relaxed">
              BioLens can play a gentle, organic <strong>popup sound</strong> whenever you click between clinical navigation views:
            </p>

            {/* Visual list of the 6 targeted sections */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {sections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <div 
                    key={sec.name}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-700"
                  >
                    <Icon className="w-4 h-4 text-[#18A66A] shrink-0" />
                    <span className="truncate">{sec.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Sound Preview & Volume */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#18A66A]" />
                <span className="text-xs font-bold text-[#0F7F51]">Audio Preview</span>
              </div>
              <button
                type="button"
                onClick={testSound}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-100 text-[#0F7F51] border border-emerald-500/30 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-[#0F7F51]" />
                <span>Test Pop Sound</span>
              </button>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-3 pt-1">
              <Sliders className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="range"
                  min="0.05"
                  max="0.6"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    setVolume(newVol);
                    testSound();
                  }}
                  className="w-full h-1.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-[#18A66A]"
                  aria-label="Sound volume"
                />
              </div>
              <span className="text-[11px] font-bold text-[#0F7F51] w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <p className="text-[11px] text-[#6C7C75]">
              Generated natively with browser Web Audio API — zero network delay and completely private.
            </p>
          </div>

          {/* Decision Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => confirmPermission(false)}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-all cursor-pointer"
            >
              <VolumeX className="w-4 h-4 text-slate-500" />
              <span>Keep Muted</span>
            </button>

            <button
              type="button"
              onClick={() => confirmPermission(true)}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#18A66A] hover:bg-[#0F7F51] text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Enable</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

interface MedicalDisclaimerProps {
  compact?: boolean;
  className?: string;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({
  compact = false,
  className = ''
}) => {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-xs text-[#6C7C75] bg-emerald-50/70 border border-emerald-500/15 rounded-xl px-3.5 py-2 ${className}`}>
        <Info className="w-3.5 h-3.5 text-[#0F7F51] shrink-0" />
        <span>
          <strong>Medical Notice:</strong> BioLens provides educational information and does not replace professional medical advice, diagnosis, or treatment.
        </span>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-white/80 to-[#EAFFF4]/60 border border-emerald-500/20 backdrop-blur-md shadow-sm ${className}`}>
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-emerald-500/10 text-[#0F7F51] shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5 text-[#18A66A]" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0F7F51]">
            Important Medical Disclaimer
          </h4>
          <p className="text-sm text-[#12201B]/80 leading-relaxed">
            BioLens provides educational information and does not replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. If you think you may have a medical emergency, immediately call your doctor or local emergency services.
          </p>
        </div>
      </div>
    </div>
  );
};

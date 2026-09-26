import React, { useEffect, useState } from 'react';
import { Sparkles, FileText, Camera, Stethoscope } from 'lucide-react';

interface LoadingStateProps {
  type: 'report' | 'equipment' | 'assistant';
  title?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ type, title }) => {
  const reportSteps = [
    'Reading your report...',
    'Extracting medical values...',
    'Preparing a clear explanation...'
  ];

  const equipmentSteps = [
    'Analyzing image...',
    'Identifying equipment...',
    'Preparing usage information...'
  ];

  const assistantSteps = [
    'Reviewing health records...',
    'Formulating clinical context...',
    'Preparing clear response...'
  ];

  const steps = type === 'report' ? reportSteps : type === 'equipment' ? equipmentSteps : assistantSteps;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center">
      {/* Outer Glowing Liquid Rings */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-emerald-100/60 animate-ping absolute inset-0 opacity-40" />
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#18A66A] to-[#4ade80] p-1 shadow-lg shadow-emerald-500/25 animate-spin" style={{ animationDuration: '6s' }}>
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
            {type === 'report' && <FileText className="w-9 h-9 text-[#18A66A] animate-pulse" />}
            {type === 'equipment' && <Camera className="w-9 h-9 text-[#18A66A] animate-pulse" />}
            {type === 'assistant' && <Stethoscope className="w-9 h-9 text-[#18A66A] animate-pulse" />}
          </div>
        </div>
        <div className="absolute -top-1 -right-1 p-1.5 bg-[#EAFFF4] rounded-full border border-emerald-400 shadow-sm animate-bounce">
          <Sparkles className="w-4 h-4 text-[#0F7F51]" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-[#12201B] mb-2">
        {title || (type === 'report' ? 'Analyzing Medical Document' : 'Scanning Medical Equipment')}
      </h3>

      {/* Step Indicators */}
      <div className="h-8 flex items-center justify-center">
        <p className="text-base font-semibold text-[#0F7F51] transition-all duration-300 transform">
          {steps[currentStepIndex]}
        </p>
      </div>

      {/* Progress Bars */}
      <div className="flex items-center gap-2 mt-4">
        {steps.map((step, idx) => (
          <div
            key={step}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx <= currentStepIndex ? 'w-10 bg-[#18A66A]' : 'w-4 bg-emerald-100'
            }`}
          />
        ))}
      </div>

      <p className="text-xs text-[#6C7C75] mt-6 max-w-sm">
        BioLens adheres strictly to medical safety protocols. No personal identifying records are stored without your consent.
      </p>
    </div>
  );
};

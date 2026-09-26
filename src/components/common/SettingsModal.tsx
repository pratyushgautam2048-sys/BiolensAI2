import React, { useState } from 'react';
import { X, Shield, Lock, Trash2, Download, Check, AlertTriangle, Eye, Server, Volume2, VolumeX, Sliders, Play } from 'lucide-react';
import { UserProfile } from '../../types';
import { useSound } from '../../context/SoundContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onResetData
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'export' | 'compliance'>('privacy');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [aiConsent, setAiConsent] = useState(true);
  const [localAuditLog, setLocalAuditLog] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const { isSoundEnabled, toggleSound, soundPermission, requestPermission, testSound, volume, setVolume } = useSound();

  if (!isOpen) return null;

  const handleExportData = () => {
    const dataToExport = {
      userProfile: user,
      exportedAt: new Date().toISOString(),
      platform: 'BioLens Healthcare Information Engine',
      disclaimer: 'Educational medical data export.'
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biolens_health_export_${user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrintRecords = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-emerald-500/20 shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="px-6 py-5 border-b border-emerald-500/15 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 via-white to-[#EAFFF4]/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-2xl text-[#0F7F51]">
              <Shield className="w-5 h-5 text-[#18A66A]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#12201B]">Settings & Privacy Vault</h3>
              <p className="text-xs text-[#6C7C75]">Data confidentiality, AI consent & export controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-emerald-500/10 px-6 pt-3 bg-emerald-50/30">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'privacy'
                ? 'border-[#18A66A] text-[#0F7F51]'
                : 'border-transparent text-[#6C7C75] hover:text-[#12201B]'
            }`}
          >
            Privacy & AI Consent
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'export'
                ? 'border-[#18A66A] text-[#0F7F51]'
                : 'border-transparent text-[#6C7C75] hover:text-[#12201B]'
            }`}
          >
            Data Portability & Export
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'compliance'
                ? 'border-[#18A66A] text-[#0F7F51]'
                : 'border-transparent text-[#6C7C75] hover:text-[#12201B]'
            }`}
          >
            Security Architecture
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'privacy' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-500/15 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#18A66A]" />
                    <h4 className="text-sm font-semibold text-[#12201B]">AI Processing Consent</h4>
                  </div>
                  <p className="text-xs text-[#6C7C75] leading-relaxed">
                    Allow BioLens's HIPAA/GDPR-isolated server endpoint to process uploaded documents with Google Gemini API for medical report explanations. Keys are never exposed to browser clients.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={aiConsent}
                    onChange={(e) => setAiConsent(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#18A66A]"></div>
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-sm font-semibold text-[#12201B]">Session Audit Logging</h4>
                  </div>
                  <p className="text-xs text-[#6C7C75] leading-relaxed">
                    Track document analysis timestamps and equipment scan history strictly for your own chronological timeline review.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={localAuditLog}
                    onChange={(e) => setLocalAuditLog(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#18A66A]"></div>
                </label>
              </div>

              {/* Navigation Audio Feedback Setting */}
              <div className="p-4 rounded-2xl bg-[#EAFFF4]/40 border border-emerald-500/20 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-[#18A66A]" />
                      <h4 className="text-sm font-semibold text-[#12201B]">Navigation Audio & Popup Sounds</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        soundPermission === 'granted'
                          ? 'bg-[#EAFFF4] text-[#0F7F51] border border-emerald-500/20'
                          : soundPermission === 'denied'
                          ? 'bg-slate-100 text-slate-600 border border-slate-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {soundPermission === 'granted' ? 'Confirmed' : soundPermission === 'denied' ? 'Muted' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-[#6C7C75] leading-relaxed">
                      Tactile popup sound when clicking in Dashboard, Report Analyzer, Scan Equipment, My Health Profile, Appointments, and Security & Privacy.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={isSoundEnabled}
                      onChange={toggleSound}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#18A66A]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-emerald-500/10">
                  <div className="flex items-center gap-2.5 flex-1 max-w-xs">
                    <Sliders className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
                      className="w-full h-1 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-[#18A66A]"
                      aria-label="Volume slider"
                    />
                    <span className="text-[11px] font-bold text-[#0F7F51] w-8 text-right shrink-0">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={testSound}
                      className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-emerald-50 text-[#0F7F51] border border-emerald-500/30 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-[#0F7F51]" />
                      <span>Test Pop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => requestPermission()}
                      className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      Re-prompt
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Deletion Zone */}
              <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200/80 space-y-3">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-4 h-4" />
                  <h4 className="text-sm font-bold">Right to Erasure & Data Deletion</h4>
                </div>
                <p className="text-xs text-red-900/80 leading-relaxed">
                  Permanently remove all medical reports, equipment scans, medications, and timeline history. This action cannot be reversed.
                </p>

                {!showConfirmReset ? (
                  <button
                    onClick={() => setShowConfirmReset(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-700 bg-white border border-red-300 rounded-xl hover:bg-red-50 transition-colors shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear All Health Records
                  </button>
                ) : (
                  <div className="p-3 bg-white rounded-xl border border-red-300 space-y-2">
                    <p className="text-xs font-semibold text-red-800">
                      Are you sure you want to permanently erase all records?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onResetData();
                          setShowConfirmReset(false);
                          onClose();
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
                      >
                        Yes, Erase Everything
                      </button>
                      <button
                        onClick={() => setShowConfirmReset(false)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <p className="text-xs text-[#6C7C75] leading-relaxed">
                You retain complete ownership of your health records. Download a comprehensive JSON dossier or print a consolidated clinic summary for your next physician consultation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-500/20 space-y-3">
                  <h4 className="text-sm font-bold text-[#12201B]">Digital Health JSON Dossier</h4>
                  <p className="text-xs text-[#6C7C75]">
                    Machine-readable export of all your conditions, allergies, active medications, and report analyses.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#18A66A] hover:bg-[#0F7F51] rounded-xl transition-colors shadow-sm"
                  >
                    {downloadSuccess ? (
                      <>
                        <Check className="w-4 h-4" /> Exported Successfully
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" /> Download JSON Dossier
                      </>
                    )}
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h4 className="text-sm font-bold text-[#12201B]">Physician Printout Summary</h4>
                  <p className="text-xs text-[#6C7C75]">
                    Clean printable summary formatted for hand-delivery or faxing to your primary care clinic.
                  </p>
                  <button
                    onClick={handlePrintRecords}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#12201B] bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors shadow-xs"
                  >
                    <Download className="w-4 h-4" /> Print / Save as PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-4 text-xs text-[#12201B]/80 leading-relaxed">
              <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-500/15 space-y-2">
                <div className="flex items-center gap-2 text-[#0F7F51] font-semibold">
                  <Server className="w-4 h-4" />
                  <span>Zero Frontend Secret Exposure</span>
                </div>
                <p>
                  All Gemini AI calls route through our proxy backend on port 3000. API keys are injected via server environment variables and never touch client-side bundles.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <Lock className="w-4 h-4" />
                  <span>Payload Integrity & File Limits</span>
                </div>
                <p>
                  Documents are validated against supported MIME types (PDF, JPEG, PNG, WEBP) with an enforced 25MB ceiling.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#EAFFF4]/40 border border-emerald-500/15 space-y-2">
                <div className="flex items-center gap-2 text-[#0F7F51] font-semibold">
                  <Shield className="w-4 h-4" />
                  <span>Medical Device Safety & Training Boundaries</span>
                </div>
                <p>
                  When scanning unfamiliar equipment, the system defaults to "Device identification is uncertain." rather than providing risky or unauthorized operating directions.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-emerald-500/15 bg-slate-50/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#18A66A] hover:bg-[#0F7F51] rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

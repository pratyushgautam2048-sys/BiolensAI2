import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  HelpCircle, 
  Printer, 
  Save, 
  Sparkles, 
  X, 
  ShieldCheck, 
  Info,
  Clock,
  RefreshCw,
  FileCheck,
  Bot,
  MessageSquare,
  AlignLeft
} from 'lucide-react';
import { ReportAnalysis, TestResultItem } from '../../types';
import { SAMPLE_REPORTS_FOR_DEMO } from '../../data/mockData';
import { GlassCard } from '../common/GlassCard';
import { LoadingState } from '../common/LoadingState';
import { MedicalDisclaimer } from '../common/MedicalDisclaimer';
import { useAuth } from '../../context/AuthContext';

interface ReportAnalyzerProps {
  onSaveReport: (report: ReportAnalysis) => void;
  onOpenAssistantWithPrompt?: (prompt: string) => void;
  preselectedReport?: ReportAnalysis | null;
}

export const ReportAnalyzer: React.FC<ReportAnalyzerProps> = ({
  onSaveReport,
  onOpenAssistantWithPrompt,
  preselectedReport
}) => {
  const { currentUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<ReportAnalysis | null>(preselectedReport || null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [inputMode, setInputMode] = useState<'upload' | 'text'>('upload');
  const [pastedTitle, setPastedTitle] = useState('');
  const [pastedText, setPastedText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync if preselectedReport changes
  React.useEffect(() => {
    if (preselectedReport) {
      setCurrentAnalysis(preselectedReport);
    }
  }, [preselectedReport]);

  const validateAndProcessFile = (file: File) => {
    setErrorMsg(null);
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isPdf = file.type === 'application/pdf' || file.type === 'application/x-pdf' || ext === 'pdf';
    const isImage = file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'heic', 'bmp'].includes(ext);
    const isText = file.type.startsWith('text/') || ['txt', 'csv', 'tsv', 'json', 'log'].includes(ext);

    if (!isPdf && !isImage && !isText) {
      setErrorMsg('Unsupported format. Please upload a PDF, image (JPG, PNG, WEBP), or text document.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 25MB threshold. Please upload a smaller scan or image.');
      return;
    }

    setSelectedFile(file);
    setUploadProgress(20);

    if (isText) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setPastedText(text);
        setPastedTitle(file.name.replace(/\.[^/.]+$/, ''));
        setInputMode('text');
        setUploadProgress(100);
      };
      reader.onerror = () => {
        setErrorMsg("Couldn't read text document. Try copying and pasting its contents.");
      };
      reader.readAsText(file);
      return;
    }

    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(percent);
      }
    };

    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      setFileBase64(base64);
      setUploadProgress(100);
    };

    reader.onerror = () => {
      setErrorMsg("We couldn't read this document clearly. Try uploading a higher-quality scan or image.");
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  // Run AI Analysis via backend endpoint
  const handleAnalyze = async (sampleType?: string) => {
    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const reportId = `rep_${Date.now()}`;
      const uploadedFileUrl = selectedFile ? URL.createObjectURL(selectedFile) : undefined;

      const payload: any = {};
      if (sampleType) {
        payload.sampleType = sampleType;
      } else if (inputMode === 'text') {
        if (!pastedText.trim()) {
          throw new Error('Please paste or type your laboratory report text.');
        }
        payload.textContent = pastedText.trim();
        payload.fileName = (pastedTitle.trim() || 'Laboratory Findings') + '.txt';
        payload.fileSize = `${(pastedText.length / 1024).toFixed(1)} KB`;
      } else if (selectedFile) {
        let base64 = fileBase64;
        if (!base64) {
          base64 = await new Promise<string>((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => {
              const res = r.result as string;
              resolve(res.includes(',') ? res.split(',')[1] : res);
            };
            r.onerror = reject;
            r.readAsDataURL(selectedFile);
          });
          setFileBase64(base64);
        }
        payload.fileBase64 = base64;
        payload.mimeType = selectedFile.type || (selectedFile.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
        payload.fileName = selectedFile.name;
        payload.fileSize = `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`;
        if (uploadedFileUrl) {
          payload.fileUrl = uploadedFileUrl;
        }
      } else {
        throw new Error('Please select a file, paste your report text, or try a sample report.');
      }

      const res = await fetch('/api/reports/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.analysis) {
        throw new Error(data.message || 'Analysis could not be completed.');
      }

      const completeAnalysis: ReportAnalysis = {
        ...data.analysis,
        id: reportId,
        userId: currentUser?.uid,
        fileUrl: uploadedFileUrl || data.analysis.fileUrl,
        analysisStatus: 'completed'
      };

      setCurrentAnalysis(completeAnalysis);
      setSavedSuccess(false);
    } catch (err: any) {
      console.error('Report analysis error:', err);
      setErrorMsg(err.message || "We couldn't analyze this document. Please verify your file or try a sample report.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToProfile = () => {
    if (currentAnalysis) {
      onSaveReport(currentAnalysis);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Render Status Badge for Test Results
  const renderStatusBadge = (status: TestResultItem['status']) => {
    switch (status) {
      case 'Within range':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#18A66A]" />
            Within range
          </span>
        );
      case 'Above range':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-500/20">
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
            Above range
          </span>
        );
      case 'Below range':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-500/20">
            <ArrowDownRight className="w-3.5 h-3.5 text-blue-600" />
            Below range
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            Reference Unknown
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title & Subtitle */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12201B] tracking-tight">
          Medical Report Analyzer
        </h1>
        <p className="text-base text-[#6C7C75] max-w-2xl">
          Upload your medical scan/PDF or paste laboratory notes to extract biomarkers, assess physiological reference intervals, and generate patient-friendly clinical explanations.
        </p>
      </div>

      {/* Main Input Zone */}
      {!currentAnalysis && !isAnalyzing && (
        <div className="space-y-6">
          {/* Input Method Switcher */}
          <div className="flex items-center gap-2 p-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-emerald-500/20 max-w-md shadow-xs">
            <button
              onClick={() => setInputMode('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                inputMode === 'upload'
                  ? 'bg-[#18A66A] text-white shadow-xs'
                  : 'text-[#6C7C75] hover:text-[#12201B] hover:bg-slate-50'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              Upload Scan / PDF
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                inputMode === 'text'
                  ? 'bg-[#18A66A] text-white shadow-xs'
                  : 'text-[#6C7C75] hover:text-[#12201B] hover:bg-slate-50'
              }`}
            >
              <AlignLeft className="w-4 h-4" />
              Paste Lab / Report Text
            </button>
          </div>

          {/* Mode 1: File Upload */}
          {inputMode === 'upload' && (
            <GlassCard className="p-8 sm:p-10 border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 transition-all text-center relative">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`rounded-2xl p-6 sm:p-8 transition-colors ${
                  isDragging ? 'bg-emerald-50/80' : 'bg-transparent'
                }`}
              >
                <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-100 to-[#EAFFF4] flex items-center justify-center text-[#18A66A] shadow-inner mb-4">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <h3 className="text-lg font-bold text-[#12201B]">
                  Drop your medical report here, or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#18A66A] hover:text-[#0F7F51] underline font-bold cursor-pointer"
                  >
                    browse files
                  </button>
                </h3>

                <p className="text-xs text-[#6C7C75] mt-2 max-w-md mx-auto">
                  Supported formats: <strong>PDF, JPG, JPEG, PNG, WEBP</strong> (Max 25MB). Uploads are securely processed with isolated server encryption.
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Selected File Feedback */}
                {selectedFile && (
                  <div className="mt-6 max-w-md mx-auto p-4 rounded-2xl bg-white/90 border border-emerald-500/25 shadow-xs text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-xl bg-emerald-50 text-[#18A66A]">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#12201B] truncate">{selectedFile.name}</p>
                          <p className="text-[11px] text-[#6C7C75]">
                            {(selectedFile.size / 1024).toFixed(0)} KB · {selectedFile.type || 'Document'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setFileBase64(null);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                      <div
                        className="bg-[#18A66A] h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>

                    <button
                      onClick={() => handleAnalyze()}
                      className="w-full mt-4 py-2.5 px-4 rounded-xl bg-[#18A66A] hover:bg-[#0F7F51] text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Analyze Medical Report
                    </button>
                  </div>
                )}
              </div>
            </GlassCard>
          )}

          {/* Mode 2: Paste Lab / Report Text */}
          {inputMode === 'text' && (
            <GlassCard className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#12201B] flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-[#18A66A]" />
                    Paste Lab Results or Clinical Notes
                  </h3>
                  <p className="text-xs text-[#6C7C75] mt-0.5">
                    Copy and paste directly from your patient portal (MyChart, Quest, Labcorp, hospital summaries)
                  </p>
                </div>
                {/* 1-Click Quick Samples to Paste */}
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-[#6C7C75] font-medium hidden sm:inline">Try template:</span>
                  <button
                    onClick={() => {
                      setPastedTitle('Complete Blood Count with Diff');
                      setPastedText(`Complete Blood Count (CBC) with Differential
Patient: Eleanor Vance | Date: Aug 14, 2026
WBC: 7.4 x10^3/uL (Reference: 4.5 - 11.0)
RBC: 4.62 x10^6/uL (Reference: 4.00 - 5.20)
Hemoglobin: 13.8 g/dL (Reference: 12.0 - 15.5)
Hematocrit: 41.2 % (Reference: 36.0 - 46.0)
Platelet Count: 425 x10^3/uL (Reference: 150 - 400) [HIGH - Mild Reactive Elevation]
Neutrophils %: 58.4 % (Reference: 45.0 - 75.0)
Lymphocytes %: 31.2 % (Reference: 20.0 - 40.0)
Monocytes %: 6.8 % (Reference: 2.0 - 10.0)`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#0F7F51] hover:bg-emerald-100 font-semibold transition-colors"
                  >
                    + CBC Panel
                  </button>
                  <button
                    onClick={() => {
                      setPastedTitle('Comprehensive Metabolic Panel (CMP)');
                      setPastedText(`Comprehensive Metabolic Panel (CMP)
Patient: Eleanor Vance | Fasting
Glucose, Fasting: 96 mg/dL (Reference: 70 - 99)
BUN: 15 mg/dL (Reference: 7 - 20)
Creatinine: 0.82 mg/dL (Reference: 0.50 - 1.10)
eGFR: >90 mL/min/1.73 (Reference: >60)
Sodium: 140 mEq/L (Reference: 135 - 145)
Potassium: 4.4 mEq/L (Reference: 3.5 - 5.1)
Chloride: 102 mEq/L (Reference: 96 - 106)
Calcium: 9.4 mg/dL (Reference: 8.5 - 10.2)
Total Protein: 7.1 g/dL (Reference: 6.0 - 8.3)
Albumin: 4.3 g/dL (Reference: 3.5 - 5.0)
ALT (SGPT): 28 U/L (Reference: 7 - 45)
AST (SGOT): 24 U/L (Reference: 8 - 40)`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#0F7F51] hover:bg-emerald-100 font-semibold transition-colors"
                  >
                    + Metabolic Panel
                  </button>
                  <button
                    onClick={() => {
                      setPastedTitle('Lipid & Cholesterol Profile');
                      setPastedText(`Fasting Lipid Panel
Patient: Eleanor Vance | Fasting: 12h
Total Cholesterol: 208 mg/dL (Desirable: <200) [HIGH]
HDL "Good" Cholesterol: 62 mg/dL (Desirable: >50) [PROTECTIVE]
LDL "Direct" Cholesterol: 126 mg/dL (Desirable: <100) [BORDERLINE]
Triglycerides: 102 mg/dL (Normal: <150)
Non-HDL Cholesterol: 146 mg/dL (Desirable: <130)`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#0F7F51] hover:bg-emerald-100 font-semibold transition-colors"
                  >
                    + Lipid Panel
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#12201B] mb-1">
                  Report Title (Optional)
                </label>
                <input
                  type="text"
                  value={pastedTitle}
                  onChange={(e) => setPastedTitle(e.target.value)}
                  placeholder="e.g., Quest Diagnostics CBC Panel, Annual Checkup Bloodwork..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-emerald-500/25 text-xs text-[#12201B] focus:outline-none focus:ring-2 focus:ring-[#18A66A]/30 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#12201B] mb-1">
                  Report Text & Test Values
                </label>
                <textarea
                  rows={8}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your lab values, physician notes, or diagnostic report text here..."
                  className="w-full p-3.5 rounded-xl bg-white border border-emerald-500/25 text-xs text-[#12201B] focus:outline-none focus:ring-2 focus:ring-[#18A66A]/30 placeholder:text-slate-400 font-mono leading-relaxed resize-y"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#6C7C75]">
                  {pastedText.length > 0 ? `${pastedText.length} characters entered` : 'Supports plain text, tables, and numerical ranges'}
                </span>
                <button
                  onClick={() => handleAnalyze()}
                  disabled={!pastedText.trim()}
                  className="py-2.5 px-5 rounded-xl bg-[#18A66A] hover:bg-[#0F7F51] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Analyze Medical Notes
                </button>
              </div>
            </GlassCard>
          )}

          {/* Quick Demo Preloaded Reports Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F7F51] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#18A66A]" />
                Or explore preloaded clinical sample panels:
              </h3>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-300/60">
                SAMPLE TRANSCRIPTS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SAMPLE_REPORTS_FOR_DEMO.map((sample) => (
                <GlassCard
                  key={sample.id}
                  interactive
                  onClick={() => handleAnalyze(sample.id)}
                  className="p-5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#0F7F51] uppercase tracking-wider">
                        Sample Panel
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                    </div>
                    <h4 className="text-sm font-bold text-[#12201B]">{sample.title}</h4>
                    <p className="text-xs text-[#6C7C75] leading-relaxed">{sample.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center justify-between text-xs text-[#0F7F51] font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#18A66A]" />
                      Analyze Report
                    </span>
                    <span>→</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading Experience */}
      {isAnalyzing && (
        <GlassCard className="p-8">
          <LoadingState type="report" title="Translating Medical Document" />
        </GlassCard>
      )}

      {/* Error state */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Notice</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-red-600 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Structured Analysis Results */}
      {currentAnalysis && !isAnalyzing && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-emerald-500/15 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentAnalysis(null);
                  setSelectedFile(null);
                  setFileBase64(null);
                  setPastedText('');
                  setPastedTitle('');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C7C75] hover:text-[#12201B] px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Analyze Another Document
              </button>
              {currentAnalysis.isDemo && (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300/50">
                  DEMO DATA — NOT A REAL MEDICAL REPORT
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>

              <button
                onClick={handleSaveToProfile}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#18A66A] hover:bg-[#0F7F51] px-4 py-2 rounded-xl shadow-sm transition-colors"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved to Profile
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save to My Health Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Urgency Alert if applicable */}
          {currentAnalysis.urgency?.level === 'discuss_promptly' && (
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-400/40 text-amber-900 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">Discuss this promptly with a healthcare professional</h4>
                <p className="text-xs text-amber-800/90 mt-0.5">
                  {currentAnalysis.urgency?.details || 'Some parameters deviate notably from target ranges and deserve timely evaluation.'}
                </p>
              </div>
            </div>
          )}

          {currentAnalysis.urgency?.level === 'emergency' && (
            <div className="p-5 rounded-2xl bg-red-600 text-white shadow-lg space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertCircle className="w-5 h-5" />
                <span>URGENT MEDICAL ADVICE</span>
              </div>
              <p className="text-xs text-red-100 leading-relaxed">
                {currentAnalysis.urgency?.details || 'These values indicate potential acute distress. Please contact emergency medical services or proceed to the nearest emergency department immediately.'}
              </p>
            </div>
          )}

          {/* Section 1: Report Summary */}
          <GlassCard className="p-6 sm:p-8 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F7F51]">
                    {currentAnalysis.reportType || 'Laboratory Panel'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-[#0F7F51] border border-emerald-300/40">
                    <Sparkles className="w-3 h-3 text-[#18A66A]" />
                    BioLens Clinical Intelligence
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#12201B] mt-1">
                  {currentAnalysis.reportTitle}
                </h2>
              </div>
              <div className="text-right text-xs text-[#6C7C75]">
                <p>Report Date: <strong>{currentAnalysis.reportDate || 'Recent'}</strong></p>
                {currentAnalysis.fileName && <p className="text-[11px]">{currentAnalysis.fileName}</p>}
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <h3 className="text-xs font-bold text-[#0F7F51] uppercase tracking-wider">
                Report Summary
              </h3>
              <p className="text-sm text-[#12201B]/90 leading-relaxed">
                {currentAnalysis.summary}
              </p>
            </div>
          </GlassCard>

          {/* Section 2: Key Findings */}
          <GlassCard className="p-6 sm:p-8 space-y-3">
            <h3 className="text-sm font-bold text-[#12201B] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#18A66A]" />
              Key Findings
            </h3>
            <ul className="space-y-2">
              {(currentAnalysis.keyFindings || []).map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#12201B]/85 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#18A66A] mt-1.5 shrink-0" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Section 3: Test Results Table */}
          <GlassCard className="p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#12201B] flex items-center gap-2">
                  <span>Detected Test Results</span>
                  <span className="text-[11px] font-normal text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Biomarkers Extracted
                  </span>
                </h3>
                <p className="text-xs text-[#6C7C75]">
                  Extracted values compared against standard reference intervals with 1-click clinical inquiry
                </p>
              </div>
              <span className="text-xs font-semibold text-[#0F7F51] bg-[#EAFFF4] px-2.5 py-1 rounded-lg">
                {(currentAnalysis.testResults || []).length} Markers Evaluated
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-emerald-500/15 text-[#6C7C75] uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3 font-semibold">Test Name</th>
                    <th className="py-3 px-3 font-semibold">Patient Value</th>
                    <th className="py-3 px-3 font-semibold">Reference Range</th>
                    <th className="py-3 px-3 font-semibold">Status</th>
                    <th className="py-3 px-3 font-semibold hidden md:table-cell">Context</th>
                    {onOpenAssistantWithPrompt && (
                      <th className="py-3 px-3 font-semibold text-right">Inquire</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/10">
                  {(currentAnalysis.testResults || []).map((item, idx) => (
                    <tr key={idx} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-[#12201B]">
                        {item.testName}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-sm text-[#0F7F51]">
                        {item.patientValue} <span className="text-[11px] font-normal text-[#6C7C75]">{item.unit}</span>
                      </td>
                      <td className="py-3.5 px-3 text-[#6C7C75] font-mono">
                        {item.referenceRange} {item.unit}
                      </td>
                      <td className="py-3.5 px-3">
                        {renderStatusBadge(item.status)}
                      </td>
                      <td className="py-3.5 px-3 text-[#6C7C75] hidden md:table-cell leading-relaxed">
                        {item.interpretation || 'Standard baseline parameter.'}
                      </td>
                      {onOpenAssistantWithPrompt && (
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() =>
                              onOpenAssistantWithPrompt(
                                `Can you explain my ${item.testName} result of ${item.patientValue} ${item.unit} (Status: ${item.status}, Reference Range: ${item.referenceRange} ${item.unit}) from my ${currentAnalysis.reportTitle}, and what questions I should ask my doctor?`
                              )
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F7F51] hover:text-[#18A66A] bg-emerald-50 hover:bg-emerald-100/90 px-2.5 py-1 rounded-lg transition-colors border border-emerald-500/20 shadow-2xs"
                            title={`Ask Assistant about ${item.testName}`}
                          >
                            <Bot className="w-3 h-3 text-[#18A66A]" />
                            <span>Ask Assistant</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Section 4: What This May Mean (Safety Phrasing) */}
          <GlassCard className="p-6 sm:p-8 space-y-3 bg-gradient-to-br from-white/90 via-[#EAFFF4]/30 to-emerald-50/40">
            <div className="flex items-center gap-2 text-[#0F7F51]">
              <Info className="w-4 h-4 text-[#18A66A]" />
              <h3 className="text-sm font-bold text-[#12201B]">
                What This May Mean
              </h3>
            </div>
            <p className="text-xs text-[#12201B]/85 leading-relaxed">
              {currentAnalysis.whatThisMayMean}
            </p>
            <p className="text-[11px] text-[#6C7C75] italic pt-1">
              *Educational interpretation only. Laboratory values must always be evaluated in conjunction with your personal clinical history, symptoms, and examination by a licensed medical provider.
            </p>
          </GlassCard>

          {/* Section 5: Things to Discuss With Your Doctor */}
          <GlassCard className="p-6 sm:p-8 space-y-3 border-emerald-500/25">
            <h3 className="text-sm font-bold text-[#12201B] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#18A66A]" />
              Things to Discuss With Your Doctor
            </h3>
            <p className="text-xs text-[#6C7C75]">
              You can bring these questions to your next physician consultation:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {(currentAnalysis.questionsForDoctor || []).map((question, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/90 border border-emerald-500/15 shadow-xs flex flex-col justify-between gap-2 text-xs text-[#12201B]/90 font-medium leading-relaxed"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0F7F51] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{question}</span>
                  </div>
                  {onOpenAssistantWithPrompt && (
                    <button
                      onClick={() =>
                        onOpenAssistantWithPrompt(
                          `In my recent ${currentAnalysis.reportTitle}, my report suggests asking my doctor: "${question}". Can you explain the medical rationale behind this question and what information my doctor will look for?`
                        )
                      }
                      className="self-start inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0F7F51] hover:text-[#18A66A] hover:underline pt-1"
                    >
                      <MessageSquare className="w-3 h-3 text-[#18A66A]" />
                      <span>Ask Assistant how to frame this</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Section 6: General Next Steps */}
          <GlassCard className="p-6 sm:p-8 space-y-3">
            <h3 className="text-sm font-bold text-[#12201B] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#18A66A]" />
              General Next Steps
            </h3>
            <ul className="space-y-2">
              {(currentAnalysis.generalNextSteps || []).map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#12201B]/85 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#18A66A] mt-1.5 shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Ask AI Assistant Followup Prompt */}
          {onOpenAssistantWithPrompt && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-[#EAFFF4] to-white border border-emerald-500/25 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#12201B] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#18A66A]" />
                  Have questions about this report?
                </h4>
                <p className="text-xs text-[#6C7C75]">
                  BioLens Assistant can explain specific test markers or help you formulate additional questions.
                </p>
              </div>
              <button
                onClick={() =>
                  onOpenAssistantWithPrompt(
                    `Can you explain my recent ${currentAnalysis.reportTitle} and what questions I should ask my doctor?`
                  )
                }
                className="px-4 py-2.5 rounded-xl bg-[#18A66A] hover:bg-[#0F7F51] text-white text-xs font-bold shadow-xs transition-colors"
              >
                Ask Assistant About This Report
              </button>
            </div>
          )}
        </div>
      )}

      {/* Medical Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
};

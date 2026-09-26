import React, { useState, useRef } from 'react';
import { 
  Camera, 
  UploadCloud, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  BookOpen, 
  Save, 
  RefreshCw, 
  X, 
  Eye, 
  Check, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { EquipmentScan } from '../../types';
import { SAMPLE_EQUIPMENT_FOR_DEMO } from '../../data/mockData';
import { GlassCard } from '../common/GlassCard';
import { LoadingState } from '../common/LoadingState';
import { MedicalDisclaimer } from '../common/MedicalDisclaimer';
import { useAuth } from '../../context/AuthContext';

interface EquipmentScannerProps {
  onSaveEquipment: (equipment: EquipmentScan) => void;
  preselectedEquipment?: EquipmentScan | null;
}

export const EquipmentScanner: React.FC<EquipmentScannerProps> = ({
  onSaveEquipment,
  preselectedEquipment
}) => {
  const { currentUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState<EquipmentScan | null>(preselectedEquipment || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sync if preselected
  React.useEffect(() => {
    if (preselectedEquipment) {
      setCurrentScan(preselectedEquipment);
    }
  }, [preselectedEquipment]);

  // Clean up camera stream on unmount
  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please select a valid image file (JPEG, PNG, WEBP).');
        return;
      }
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start live webcam if user chooses
  const startLiveCamera = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Live webcam access failed or not permitted, falling back to file camera input:', err);
      cameraInputRef.current?.click();
    }
  };

  const capturePhotoFromLiveVideo = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setSelectedImage(dataUrl);
        setMimeType('image/jpeg');
      }
      // Stop stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
    }
  };

  const cancelLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Run AI analysis
  const handleAnalyze = async (sampleId?: string, overrideImage?: string) => {
    setIsScanning(true);
    setErrorMsg(null);

    try {
      const scanId = `scan_${Date.now()}`;
      const img = overrideImage || selectedImage;
      const uploadedImageUrl = img || undefined;

      const payload: any = {};
      if (sampleId) {
        payload.sampleId = sampleId;
      } else {
        if (!img) throw new Error('Please upload or take a photo first.');
        const base64 = img.includes(',') ? img.split(',')[1] : img;
        payload.imageBase64 = base64;
        payload.mimeType = mimeType;
      }

      const res = await fetch('/api/equipment/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Equipment could not be identified.');
      }

      const completeScan: EquipmentScan = {
        ...data.analysis,
        id: scanId,
        userId: currentUser?.uid,
        imageUrl: uploadedImageUrl || data.analysis.imageUrl || selectedImage || ''
      };

      setCurrentScan(completeScan);
      setSavedSuccess(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to analyze image. Please ensure good lighting and try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSaveToProfile = () => {
    if (currentScan) {
      onSaveEquipment(currentScan);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title & Subtitle */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-xs font-bold text-teal-800 border border-teal-500/20">
          <Camera className="w-3.5 h-3.5 text-teal-600" />
          Vision Device Identifier
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12201B] tracking-tight">
          Scan Medical Equipment
        </h1>
        <p className="text-base text-[#6C7C75] max-w-2xl">
          Take or upload a photo of medical equipment to understand what it is, its intended purpose, standard operating workflow, and vital safety precautions.
        </p>
      </div>

      {/* Main Upload / Camera Area */}
      {!currentScan && !isScanning && (
        <div className="space-y-6">
          <GlassCard className="p-8 sm:p-10 border-2 border-dashed border-teal-500/30 text-center relative overflow-hidden">
            {/* Live Camera View if Active */}
            {isCameraActive ? (
              <div className="space-y-4 max-w-lg mx-auto">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-lg">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute inset-0 border-2 border-emerald-400/50 rounded-2xl pointer-events-none" />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={capturePhotoFromLiveVideo}
                    className="px-6 py-3 rounded-xl bg-[#18A66A] hover:bg-[#0F7F51] text-white text-xs font-bold shadow-md shadow-emerald-600/25 flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Capture Photo
                  </button>
                  <button
                    onClick={cancelLiveCamera}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : !selectedImage ? (
              /* Photo Select Options */
              <div className="space-y-5">
                <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-100 to-[#EAFFF4] flex items-center justify-center text-teal-600 shadow-inner">
                  <Camera className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#12201B]">
                    Take or select a photo of medical equipment
                  </h3>
                  <p className="text-xs text-[#6C7C75] max-w-md mx-auto">
                    Position the device in a well-lit area showing any visible labels, buttons, or display screens.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={startLiveCamera}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#18A66A] hover:bg-[#0F7F51] text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    Open Camera
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#12201B] border border-teal-500/25 text-xs font-bold hover:bg-teal-50 transition-all cursor-pointer shadow-xs"
                  >
                    <UploadCloud className="w-4 h-4 text-teal-600" />
                    Upload from Gallery
                  </button>
                </div>

                {/* Hidden input for mobile capture="environment" fallback */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              /* Image Preview & Confirmation */
              <div className="max-w-md mx-auto space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20 shadow-md">
                  <img
                    src={selectedImage}
                    alt="Equipment Preview"
                    className="w-full max-h-72 object-contain bg-slate-900/5"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAnalyze()}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#18A66A] hover:bg-[#0F7F51] text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Analyze Equipment Now
                  </button>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="py-3 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                  >
                    Retake
                  </button>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Sample Equipment Previews for Quick Demo Testing */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F7F51] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#18A66A]" />
              Or test with preloaded equipment photos:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SAMPLE_EQUIPMENT_FOR_DEMO.map((item) => (
                <GlassCard
                  key={item.id}
                  interactive
                  onClick={() => {
                    setSelectedImage(item.image);
                    handleAnalyze(item.id, item.image);
                  }}
                  className="p-3 overflow-hidden flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold text-[#12201B] mt-1 line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-[#6C7C75] line-clamp-2 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-emerald-500/10 text-[11px] font-bold text-[#0F7F51] flex items-center justify-between">
                    <span>Inspect Device</span>
                    <span>→</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading Experience */}
      {isScanning && (
        <GlassCard className="p-8">
          <LoadingState type="equipment" title="Recognizing Medical Equipment" />
        </GlassCard>
      )}

      {/* Error Notice */}
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

      {/* Structured Scan Results */}
      {currentScan && !isScanning && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-emerald-500/15 shadow-xs">
            <button
              onClick={() => {
                setCurrentScan(null);
                setSelectedImage(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C7C75] hover:text-[#12201B] px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Scan Another Device
            </button>

            <button
              onClick={handleSaveToProfile}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#18A66A] hover:bg-[#0F7F51] px-4 py-2 rounded-xl shadow-sm transition-colors"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Saved to My Equipment
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Save Device to Profile
                </>
              )}
            </button>
          </div>

          {/* Uncertainty Warning if Confidence is Low */}
          {currentScan.confidence === 'Uncertain' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Device identification is uncertain.</h4>
                <p className="mt-0.5 leading-relaxed">
                  The visual markers on this device were insufficient or ambiguous. Please check the model stamping on the casing or consult the official manufacturer packaging before operating.
                </p>
              </div>
            </div>
          )}

          {/* Professional Training Requirement Warning */}
          {currentScan.requiresProfessionalTraining && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 flex items-start gap-3 text-xs">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Professional Medical Training Required</h4>
                <p className="mt-0.5 leading-relaxed">
                  This device is categorized as clinical-grade or advanced diagnostic equipment. It requires formal medical training and clinical authorization to operate safely. Do not attempt unassisted operation.
                </p>
              </div>
            </div>
          )}

          {/* Top Device Banner */}
          <GlassCard className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {currentScan.imageUrl && (
                <div className="w-full md:w-56 h-48 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-emerald-500/20">
                  <img
                    src={currentScan.imageUrl}
                    alt={currentScan.deviceName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-500/20">
                    {currentScan.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F7F51] bg-[#EAFFF4] px-2.5 py-1 rounded-lg">
                    <span>Confidence: {currentScan.confidence}</span>
                    {currentScan.confidenceScore && <span>({currentScan.confidenceScore}%)</span>}
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12201B]">
                  {currentScan.deviceName}
                </h2>

                <div className="space-y-1 pt-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F7F51]">
                    What Is This?
                  </h3>
                  <p className="text-sm text-[#12201B]/85 leading-relaxed">
                    {currentScan.whatIsThis}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Section: What Is It Used For? & How It Generally Works */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 sm:p-8 space-y-2.5">
              <h3 className="text-sm font-bold text-[#12201B] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#18A66A]" />
                What Is It Used For?
              </h3>
              <p className="text-xs text-[#12201B]/85 leading-relaxed">
                {currentScan.whatIsItUsedFor}
              </p>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8 space-y-2.5">
              <h3 className="text-sm font-bold text-[#12201B] flex items-center gap-2">
                <Eye className="w-4 h-4 text-teal-600" />
                How It Generally Works
              </h3>
              <p className="text-xs text-[#12201B]/85 leading-relaxed">
                {currentScan.howItWorks}
              </p>
            </GlassCard>
          </div>

          {/* Section: How To Use It (General Educational Steps) */}
          <GlassCard className="p-6 sm:p-8 space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#12201B] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#18A66A]" />
                Standard Operating Workflow (General Educational Guidance)
              </h3>
              <p className="text-xs text-[#6C7C75]">
                General steps for routine hygienic operation. Always prioritize the instructions printed in your device's physical user manual.
              </p>
            </div>

            <div className="space-y-2.5">
              {currentScan.howToUse.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/90 border border-emerald-500/15 shadow-xs flex items-start gap-3 text-xs text-[#12201B]/90 font-medium"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0F7F51] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Section: Safety Information */}
          <GlassCard className="p-6 sm:p-8 space-y-3 bg-amber-50/40 border-amber-300/40">
            <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Safety Information & Precautions
            </h3>
            <ul className="space-y-2">
              {currentScan.safetyInformation.map((info, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Section: Manufacturer Information */}
          <GlassCard className="p-6 sm:p-8 space-y-3">
            <h3 className="text-sm font-bold text-[#12201B] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#18A66A]" />
              Manufacturer & Model Information
            </h3>
            <div className="text-xs space-y-1.5 text-[#6C7C75]">
              {currentScan.manufacturerInfo.identifiedManufacturer && (
                <p>
                  Identified Design Architecture:{' '}
                  <strong className="text-[#12201B]">{currentScan.manufacturerInfo.identifiedManufacturer}</strong>
                </p>
              )}
              {currentScan.manufacturerInfo.identifiedModel && (
                <p>
                  Model Type:{' '}
                  <strong className="text-[#12201B]">{currentScan.manufacturerInfo.identifiedModel}</strong>
                </p>
              )}
              <p className="text-[#12201B]/80 pt-1 leading-relaxed">
                {currentScan.manufacturerInfo.checkUserManualNote}
              </p>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Medical Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
};

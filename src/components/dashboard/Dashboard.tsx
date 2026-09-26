import React from 'react';
import { 
  FileText, 
  Camera, 
  Activity, 
  ShieldCheck, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  HeartPulse, 
  Clock, 
  Pill, 
  FileCheck2,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  UserProfile, 
  ReportAnalysis, 
  EquipmentScan, 
  TimelineItem, 
  Appointment, 
  Medication 
} from '../../types';
import { GlassCard } from '../common/GlassCard';
import { MedicalDisclaimer } from '../common/MedicalDisclaimer';

interface DashboardProps {
  user: UserProfile;
  reports: ReportAnalysis[];
  equipment: EquipmentScan[];
  timeline: TimelineItem[];
  appointments: Appointment[];
  medications: Medication[];
  onNavigate: (page: string) => void;
  onOpenReportDetails: (report: ReportAnalysis) => void;
  onOpenEquipmentDetails: (equipment: EquipmentScan) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  reports,
  equipment,
  timeline,
  appointments,
  medications,
  onNavigate,
  onOpenReportDetails,
  onOpenEquipmentDetails
}) => {
  // Calculate profile completeness score
  const completenessChecks = [
    Boolean(user.name),
    Boolean(user.dateOfBirth),
    Boolean(user.bloodGroup),
    Boolean(user.emergencyContact?.name),
    medications.length > 0,
    reports.length > 0
  ];
  const completenessPercent = Math.round(
    (completenessChecks.filter(Boolean).length / completenessChecks.length) * 100
  );

  const nextAppointment = appointments.find((a) => a.status === 'upcoming');
  const activeMedications = medications.filter((m) => m.type === 'current');

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Main Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 via-[#EAFFF4]/40 to-emerald-100/25 border border-emerald-500/20 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-lg shadow-emerald-900/5">
        {/* Subtle decorative glow circle inside card */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-300/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          {/* AI Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-emerald-500/20 shadow-xs backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#18A66A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#18A66A]"></span>
            </span>
            <span className="text-xs font-semibold text-[#0F7F51] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#18A66A]" />
              AI Health Assistant Ready
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-[#6C7C75]">Welcome back, {user.name.split(' ')[0]}</span>
          </div>

          {/* Headline & Supporting Text */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#12201B] tracking-tight leading-[1.15]">
            Your health, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F7F51] via-[#18A66A] to-teal-500">explained.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#6C7C75] leading-relaxed max-w-2xl font-normal">
            Understand your medical information with AI-powered explanations designed to make complex health information easier to understand.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('reports')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#0F7F51] via-[#18A66A] to-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Analyze Medical Report
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('equipment')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/90 text-[#12201B] border border-emerald-500/25 font-bold text-sm shadow-xs hover:bg-emerald-50 hover:border-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-[#18A66A]" />
              Scan Medical Equipment
            </button>
          </div>
        </div>
      </section>

      {/* 2. Health Overview Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#12201B] flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-[#18A66A]" />
            Health Overview
          </h2>
          <span className="text-xs text-[#6C7C75]">Updated recently</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Reports Analyzed */}
          <GlassCard
            interactive
            onClick={() => onNavigate('reports')}
            className="p-5"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-2xl bg-emerald-50 text-[#0F7F51] border border-emerald-500/15">
                <FileCheck2 className="w-6 h-6 text-[#18A66A]" />
              </div>
              <span className="text-xs font-semibold text-[#0F7F51] bg-[#EAFFF4] px-2 py-0.5 rounded-md">
                Verified
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#12201B]">
                {reports.length}
              </p>
              <p className="text-xs font-semibold text-[#6C7C75] mt-0.5">
                Reports Analyzed
              </p>
              <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#18A66A]" />
                Latest: {reports[0]?.reportTitle ? reports[0].reportTitle.slice(0, 22) + '...' : 'None on file'}
              </p>
            </div>
          </GlassCard>

          {/* Card 2: Health Records */}
          <GlassCard
            interactive
            onClick={() => onNavigate('profile')}
            className="p-5"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-2xl bg-teal-50 text-teal-700 border border-teal-500/15">
                <Activity className="w-6 h-6 text-teal-600" />
              </div>
              <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                {activeMedications.length} Active Meds
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#12201B]">
                {activeMedications.length + equipment.length + reports.length}
              </p>
              <p className="text-xs font-semibold text-[#6C7C75] mt-0.5">
                Health Records
              </p>
              <p className="text-[11px] text-slate-500 mt-2">
                Across labs, equipment & therapies
              </p>
            </div>
          </GlassCard>

          {/* Card 3: Profile Completeness */}
          <GlassCard
            interactive
            onClick={() => onNavigate('profile')}
            className="p-5"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-2xl bg-emerald-50 text-[#0F7F51] border border-emerald-500/15">
                <ShieldCheck className="w-6 h-6 text-[#18A66A]" />
              </div>
              <span className="text-xs font-bold text-[#0F7F51]">
                {completenessPercent}%
              </span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#18A66A] to-emerald-400 h-2 rounded-full transition-all duration-700" 
                  style={{ width: `${completenessPercent}%` }}
                />
              </div>
              <p className="text-sm font-bold text-[#12201B]">
                Profile Completeness
              </p>
              <p className="text-[11px] text-[#6C7C75] mt-0.5">
                {completenessPercent === 100 ? 'All essential metrics recorded' : 'Add allergies or emergency contacts'}
              </p>
            </div>
          </GlassCard>

          {/* Card 4: Next Health Check-in */}
          <GlassCard
            interactive
            onClick={() => onNavigate('appointments')}
            className="p-5"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-500/15">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                Scheduled
              </span>
            </div>
            <div className="mt-4">
              {nextAppointment ? (
                <>
                  <p className="text-base font-extrabold text-[#12201B] truncate">
                    {nextAppointment.date}
                  </p>
                  <p className="text-xs font-semibold text-[#6C7C75] mt-0.5 truncate">
                    {nextAppointment.doctor}
                  </p>
                  <p className="text-[11px] text-[#18A66A] mt-1 font-medium truncate">
                    {nextAppointment.specialty}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-[#12201B]">No Check-in</p>
                  <p className="text-xs text-[#6C7C75] mt-1">Schedule a preventative consult</p>
                </>
              )}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* 3. Quick Action Feature Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analyze Medical Report Spotlight */}
        <GlassCard className="p-6 sm:p-7 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="space-y-2 max-w-md">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F7F51] bg-[#EAFFF4] px-3 py-1 rounded-full">
                <FileText className="w-3.5 h-3.5" />
                Medical Document Intelligence
              </div>
              <h3 className="text-xl font-bold text-[#12201B]">
                Decode complex lab results
              </h3>
              <p className="text-xs text-[#6C7C75] leading-relaxed">
                Upload your blood test, metabolic panel, or imaging summary (PDF, JPG, PNG). BioLens highlights reference ranges, flags questions for your clinician, and breaks down terminology into human language.
              </p>
            </div>
            <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-emerald-50 items-center justify-center text-[#18A66A] shrink-0 border border-emerald-500/20">
              <FileText className="w-8 h-8" />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-500/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#6C7C75]">
              <CheckCircle2 className="w-4 h-4 text-[#18A66A]" />
              <span>Reference range analysis</span>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F7F51] hover:text-[#18A66A] group-hover:translate-x-0.5 transition-all"
            >
              Start Analysis <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>

        {/* Scan Medical Equipment Spotlight */}
        <GlassCard className="p-6 sm:p-7 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="space-y-2 max-w-md">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full">
                <Camera className="w-3.5 h-3.5 text-teal-600" />
                Vision Device Recognition
              </div>
              <h3 className="text-xl font-bold text-[#12201B]">
                Identify home medical equipment
              </h3>
              <p className="text-xs text-[#6C7C75] leading-relaxed">
                Take or upload a photo of medical monitors, pulse oximeters, blood pressure cuffs, or nebulizers. Learn their operating mechanism, verified safety guidelines, and manufacturer manual notes.
              </p>
            </div>
            <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-teal-50 items-center justify-center text-teal-600 shrink-0 border border-teal-500/20">
              <Camera className="w-8 h-8" />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-500/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#6C7C75]">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Camera capture enabled</span>
            </div>
            <button
              onClick={() => onNavigate('scanner')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-600 group-hover:translate-x-0.5 transition-all"
            >
              Scan Equipment <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      </section>

      {/* 4. Recent Health Activity Timeline */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#12201B] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#18A66A]" />
              Recent Health Activity
            </h2>
            <p className="text-xs text-[#6C7C75]">
              Chronological log of reports, scans, medication reviews, and appointments
            </p>
          </div>

          <button
            onClick={() => onNavigate('profile')}
            className="text-xs font-bold text-[#0F7F51] hover:underline"
          >
            View Complete History
          </button>
        </div>

        <GlassCard className="p-6">
          <div className="divide-y divide-emerald-500/10">
            {timeline.slice(0, 5).map((item) => (
              <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-[#0F7F51] border border-emerald-500/15 shrink-0 mt-0.5">
                  {item.type === 'report' && <FileText className="w-4 h-4 text-[#18A66A]" />}
                  {item.type === 'equipment' && <Camera className="w-4 h-4 text-teal-600" />}
                  {item.type === 'medication' && <Pill className="w-4 h-4 text-emerald-700" />}
                  {item.type === 'appointment' && <Calendar className="w-4 h-4 text-amber-600" />}
                  {item.type === 'profile' && <ShieldCheck className="w-4 h-4 text-[#0F7F51]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-[#12201B] truncate">{item.title}</h4>
                    <span className="text-xs text-[#6C7C75] shrink-0 font-medium">{item.date}</span>
                  </div>
                  <p className="text-xs text-[#6C7C75] mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {item.referenceId && (
                  <button
                    onClick={() => {
                      if (item.type === 'report') {
                        const r = reports.find((x) => x.id === item.referenceId);
                        if (r) onOpenReportDetails(r);
                        else onNavigate('reports');
                      } else if (item.type === 'equipment') {
                        const eq = equipment.find((x) => x.id === item.referenceId);
                        if (eq) onOpenEquipmentDetails(eq);
                        else onNavigate('scanner');
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F7F51] hover:bg-emerald-50 transition-colors shrink-0"
                    title="View details"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* 5. Medical Disclaimer Banner */}
      <MedicalDisclaimer />
    </div>
  );
};

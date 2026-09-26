import React, { useState } from 'react';
import { 
  User, 
  AlertOctagon, 
  Activity, 
  Pill, 
  FileText, 
  Camera, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ChevronRight, 
  ShieldAlert, 
  ExternalLink,
  Heart,
  Droplet
} from 'lucide-react';
import { 
  UserProfile, 
  Allergy, 
  MedicalCondition, 
  Medication, 
  ReportAnalysis, 
  EquipmentScan, 
  Appointment, 
  TimelineItem 
} from '../../types';
import { GlassCard } from '../common/GlassCard';
import { MedicalDisclaimer } from '../common/MedicalDisclaimer';

interface HealthProfileProps {
  user: UserProfile;
  allergies: Allergy[];
  conditions: MedicalCondition[];
  medications: Medication[];
  reports: ReportAnalysis[];
  equipment: EquipmentScan[];
  appointments: Appointment[];
  timeline: TimelineItem[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onAddAllergy: (allergy: Omit<Allergy, 'id'>) => void;
  onDeleteAllergy: (id: string) => void;
  onAddCondition: (cond: Omit<MedicalCondition, 'id'>) => void;
  onDeleteCondition: (id: string) => void;
  onAddMedication: (med: Omit<Medication, 'id'>) => void;
  onDeleteMedication: (id: string) => void;
  onAddAppointment: (apt: Omit<Appointment, 'id'>) => void;
  onDeleteAppointment: (id: string) => void;
  onSelectReport: (report: ReportAnalysis) => void;
  onSelectEquipment: (equipment: EquipmentScan) => void;
  initialTab?: string;
}

export const HealthProfile: React.FC<HealthProfileProps> = ({
  user,
  allergies,
  conditions,
  medications,
  reports,
  equipment,
  appointments,
  timeline,
  onUpdateUser,
  onAddAllergy,
  onDeleteAllergy,
  onAddCondition,
  onDeleteCondition,
  onAddMedication,
  onDeleteMedication,
  onAddAppointment,
  onDeleteAppointment,
  onSelectReport,
  onSelectEquipment,
  initialTab = 'personal'
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Modals state
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isAddAllergyOpen, setIsAddAllergyOpen] = useState(false);
  const [isAddConditionOpen, setIsAddConditionOpen] = useState(false);
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);

  // Form states
  const [userFormData, setUserFormData] = useState<UserProfile>(user);
  const [allergyForm, setAllergyForm] = useState({ allergy: '', reaction: '', severity: 'Moderate' as 'Mild' | 'Moderate' | 'Severe' });
  const [conditionForm, setConditionForm] = useState({ name: '', dateDiagnosed: '', status: 'Active' as 'Active' | 'Managed' | 'Resolved', notes: '', type: 'current' as 'current' | 'past' });
  const [medicationForm, setMedicationForm] = useState({ name: '', dosage: '', frequency: '', startDate: '', endDate: '', prescribingDoctor: '', notes: '', type: 'current' as 'current' | 'past' });
  const [appointmentForm, setAppointmentForm] = useState({ doctor: '', specialty: '', date: '', time: '', location: '', notes: '', status: 'upcoming' as 'upcoming' | 'past' });

  // Timeline category filter
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'report' | 'equipment' | 'medication' | 'appointment'>('all');

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'allergies', label: 'Allergies', icon: AlertOctagon, count: allergies.length },
    { id: 'conditions', label: 'Conditions', icon: Activity, count: conditions.length },
    { id: 'medications', label: 'Medications', icon: Pill, count: medications.length },
    { id: 'reports', label: 'Medical Reports', icon: FileText, count: reports.length },
    { id: 'equipment', label: 'Equipment', icon: Camera, count: equipment.length },
    { id: 'appointments', label: 'Appointments', icon: Calendar, count: appointments.length },
    { id: 'timeline', label: 'Health Timeline', icon: Clock }
  ];

  const currentConditions = conditions.filter((c) => c.type === 'current');
  const pastConditions = conditions.filter((c) => c.type === 'past');

  const currentMedications = medications.filter((m) => m.type === 'current');
  const pastMedications = medications.filter((m) => m.type === 'past');

  const upcomingAppointments = appointments.filter((a) => a.status === 'upcoming');
  const pastAppointments = appointments.filter((a) => a.status === 'past');

  const filteredTimeline = timeline.filter((item) => {
    if (timelineFilter === 'all') return true;
    return item.type === timelineFilter;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAFFF4] text-xs font-bold text-[#0F7F51] border border-emerald-500/20">
          <User className="w-3.5 h-3.5 text-[#18A66A]" />
          Health Dossier
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12201B] tracking-tight">
          My Health Profile
        </h1>
        <p className="text-base text-[#6C7C75] max-w-2xl">
          Comprehensive, user-controlled medical records, medication logs, and clinical history safely unified in one calm interface.
        </p>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex overflow-x-auto pb-2 scrollbar-none gap-2 border-b border-emerald-500/15">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-colors duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#18A66A] text-white shadow-md shadow-emerald-600/25'
                  : 'bg-white/80 text-[#6C7C75] hover:text-[#12201B] hover:bg-emerald-50/60 border border-slate-200/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full transition-colors ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Animated Tab Content Container */}
      <div key={activeTab} className="animate-page-enter">
        {/* ---------------- 1. PERSONAL INFORMATION ---------------- */}
        {activeTab === 'personal' && (
        <div className="space-y-6">
          <GlassCard className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-500/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#12201B]">Personal Baseline</h3>
                <p className="text-xs text-[#6C7C75]">Demographics & physiological foundation</p>
              </div>
              <button
                onClick={() => {
                  setUserFormData(user);
                  setIsEditUserOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0F7F51] bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-500/20"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Information
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6C7C75]">Full Name</span>
                <p className="text-sm font-bold text-[#12201B]">{user.name}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6C7C75]">Date of Birth</span>
                <p className="text-sm font-bold text-[#12201B]">{user.dateOfBirth}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6C7C75]">Gender</span>
                <p className="text-sm font-bold text-[#12201B]">{user.gender}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6C7C75]">Blood Group</span>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-red-50 text-red-600">
                    <Droplet className="w-3.5 h-3.5" />
                  </span>
                  <p className="text-sm font-bold text-[#12201B]">{user.bloodGroup}</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6C7C75]">Height</span>
                <p className="text-sm font-bold text-[#12201B]">{user.height}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6C7C75]">Weight</span>
                <p className="text-sm font-bold text-[#12201B]">{user.weight}</p>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="pt-4 border-t border-emerald-500/10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6C7C75]">
                Designated Emergency Contact
              </span>
              <div className="mt-2 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-500/15 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-[#12201B]">{user.emergencyContact.name}</h4>
                  <p className="text-xs text-[#6C7C75]">Relationship: {user.emergencyContact.relationship}</p>
                </div>
                <div className="text-xs font-mono font-bold text-[#0F7F51] bg-white px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  {user.emergencyContact.phone}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ---------------- 2. ALLERGIES ---------------- */}
      {activeTab === 'allergies' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#12201B]">Known Allergies & Sensitivities</h3>
              <p className="text-xs text-[#6C7C75]">Recorded allergic triggers and verified reaction severity</p>
            </div>
            <button
              onClick={() => setIsAddAllergyOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#18A66A] hover:bg-[#0F7F51] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Allergy
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allergies.map((alg) => (
              <GlassCard key={alg.id} className="p-5 flex items-start justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#12201B]">{alg.allergy}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        alg.severity === 'Severe'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : alg.severity === 'Moderate'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {alg.severity} Severity
                    </span>
                  </div>
                  <p className="text-xs text-[#12201B]/80 leading-relaxed">Reaction: {alg.reaction}</p>
                  {alg.diagnosedDate && (
                    <p className="text-[11px] text-[#6C7C75]">Diagnosed / Noted: {alg.diagnosedDate}</p>
                  )}
                </div>

                <button
                  onClick={() => onDeleteAllergy(alg.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  title="Remove allergy"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 3. MEDICAL CONDITIONS ---------------- */}
      {activeTab === 'conditions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#12201B]">Medical Conditions</h3>
              <p className="text-xs text-[#6C7C75]">Differentiating between active and resolved diagnoses</p>
            </div>
            <button
              onClick={() => setIsAddConditionOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#18A66A] hover:bg-[#0F7F51] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Condition
            </button>
          </div>

          {/* Current Conditions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F7F51] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#18A66A]" />
              Current Conditions ({currentConditions.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentConditions.map((cond) => (
                <GlassCard key={cond.id} className="p-5 flex items-start justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-[#12201B]">{cond.name}</h5>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#0F7F51] border border-emerald-500/20">
                        {cond.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#6C7C75]">Diagnosed: {cond.dateDiagnosed}</p>
                    {cond.notes && <p className="text-xs text-[#12201B]/80 leading-relaxed">{cond.notes}</p>}
                  </div>

                  <button
                    onClick={() => onDeleteCondition(cond.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    title="Remove condition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Past Conditions */}
          <div className="space-y-3 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6C7C75] flex items-center gap-2">
              <Check className="w-4 h-4" />
              Past Conditions & Resolved Diagnoses ({pastConditions.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastConditions.map((cond) => (
                <GlassCard key={cond.id} className="p-5 flex items-start justify-between gap-4 bg-slate-50/60">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-[#12201B]">{cond.name}</h5>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {cond.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#6C7C75]">Diagnosed: {cond.dateDiagnosed}</p>
                    {cond.notes && <p className="text-xs text-[#12201B]/80 leading-relaxed">{cond.notes}</p>}
                  </div>

                  <button
                    onClick={() => onDeleteCondition(cond.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 4. MEDICATIONS ---------------- */}
      {activeTab === 'medications' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#12201B]">Medication Records</h3>
              <p className="text-xs text-[#6C7C75]">Physician-directed prescriptions and daily dosages</p>
            </div>
            <button
              onClick={() => setIsAddMedicationOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#18A66A] hover:bg-[#0F7F51] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Medication
            </button>
          </div>

          {/* Strict Safety Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Clinical Guardrail:</strong> BioLens does not automatically adjust or alter prescription medication information based on AI output. Any adjustments must be made manually and in collaboration with your healthcare provider.
            </span>
          </div>

          {/* Current Medications */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F7F51] flex items-center gap-2">
              <Pill className="w-4 h-4 text-[#18A66A]" />
              Active Daily Medications ({currentMedications.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentMedications.map((med) => (
                <GlassCard key={med.id} className="p-5 flex items-start justify-between gap-4">
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-base font-bold text-[#12201B]">{med.name}</h5>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EAFFF4] text-[#0F7F51] border border-emerald-500/20">
                        {med.dosage}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-[#12201B]/90">
                      Frequency: <strong>{med.frequency}</strong>
                    </p>

                    <div className="text-[11px] text-[#6C7C75] space-y-0.5">
                      <p>Prescribing Clinician: {med.prescribingDoctor}</p>
                      <p>Started: {med.startDate}</p>
                      {med.notes && <p className="italic text-slate-600 mt-1">"{med.notes}"</p>}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteMedication(med.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    title="Remove medication"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Past Medications */}
          <div className="space-y-3 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6C7C75]">
              Discontinued / Past Medications ({pastMedications.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastMedications.map((med) => (
                <GlassCard key={med.id} className="p-5 flex items-start justify-between gap-4 bg-slate-50/60">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-[#12201B]">{med.name}</h5>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {med.dosage}
                      </span>
                    </div>
                    <p className="text-xs text-[#6C7C75]">
                      Active from {med.startDate} to {med.endDate || 'Completed'}
                    </p>
                    <p className="text-[11px] text-[#6C7C75]">Prescribed by: {med.prescribingDoctor}</p>
                  </div>

                  <button
                    onClick={() => onDeleteMedication(med.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 5. MEDICAL REPORTS ARCHIVE ---------------- */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#12201B]">Medical Reports Archive</h3>
              <p className="text-xs text-[#6C7C75]">Previously analyzed diagnostic laboratory reports</p>
            </div>
          </div>

          <div className="space-y-3">
            {reports.map((rep) => (
              <GlassCard
                key={rep.id}
                interactive
                onClick={() => onSelectReport(rep)}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-2xl bg-emerald-50 text-[#18A66A] border border-emerald-500/15 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#12201B] truncate">{rep.reportTitle}</h4>
                      <span className="text-[10px] font-semibold text-[#0F7F51] bg-[#EAFFF4] px-2 py-0.5 rounded-md">
                        {rep.reportType}
                      </span>
                    </div>
                    <p className="text-xs text-[#6C7C75] line-clamp-1">{rep.summary}</p>
                    <p className="text-[11px] text-slate-400">Date: {rep.reportDate} · {rep.testResults.length} test markers</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className="text-xs font-bold text-[#0F7F51] flex items-center gap-1">
                    View Full Analysis <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 6. MEDICAL EQUIPMENT ARCHIVE ---------------- */}
      {activeTab === 'equipment' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#12201B]">Scanned Medical Equipment</h3>
              <p className="text-xs text-[#6C7C75]">Diagnostic devices and verified operational guidance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {equipment.map((eq) => (
              <GlassCard
                key={eq.id}
                interactive
                onClick={() => onSelectEquipment(eq)}
                className="p-5 flex gap-4 items-start"
              >
                {eq.imageUrl && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-emerald-500/20">
                    <img src={eq.imageUrl} alt={eq.deviceName} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                    {eq.category}
                  </span>
                  <h4 className="text-sm font-bold text-[#12201B] truncate">{eq.deviceName}</h4>
                  <p className="text-xs text-[#6C7C75] line-clamp-2">{eq.whatIsThis}</p>
                  <p className="text-[11px] text-[#0F7F51] font-semibold pt-1">
                    Confidence: {eq.confidence} · View Safety Guidelines →
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 7. APPOINTMENTS ---------------- */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#12201B]">Clinical Appointments</h3>
              <p className="text-xs text-[#6C7C75]">Upcoming check-ins and clinical consultations</p>
            </div>
            <button
              onClick={() => setIsAddAppointmentOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#18A66A] hover:bg-[#0F7F51] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Schedule Check-in
            </button>
          </div>

          {/* Upcoming */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F7F51] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#18A66A]" />
              Upcoming Visits ({upcomingAppointments.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingAppointments.map((apt) => (
                <GlassCard key={apt.id} className="p-5 flex items-start justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-[#12201B]">{apt.doctor}</h5>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#0F7F51] border border-emerald-500/20">
                        {apt.specialty}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#0F7F51] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {apt.date} at {apt.time}
                    </p>

                    {apt.location && <p className="text-xs text-[#6C7C75]">{apt.location}</p>}
                    {apt.notes && <p className="text-xs text-[#12201B]/80 leading-relaxed mt-1">{apt.notes}</p>}
                  </div>

                  <button
                    onClick={() => onDeleteAppointment(apt.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Past */}
          <div className="space-y-3 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6C7C75]">
              Past Visits ({pastAppointments.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastAppointments.map((apt) => (
                <GlassCard key={apt.id} className="p-5 flex items-start justify-between gap-4 bg-slate-50/60">
                  <div className="space-y-1.5 min-w-0">
                    <h5 className="text-sm font-bold text-[#12201B]">{apt.doctor} ({apt.specialty})</h5>
                    <p className="text-xs text-[#6C7C75]">Visited on {apt.date}</p>
                    {apt.notes && <p className="text-xs text-[#12201B]/80">{apt.notes}</p>}
                  </div>

                  <button
                    onClick={() => onDeleteAppointment(apt.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 8. HEALTH TIMELINE ---------------- */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#12201B]">Unified Health Timeline</h3>
              <p className="text-xs text-[#6C7C75]">
                Integrated chronological progression across labs, diagnoses, medications, and visits
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-white/80 rounded-xl border border-emerald-500/15 text-xs font-medium">
              <button
                onClick={() => setTimelineFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  timelineFilter === 'all' ? 'bg-[#18A66A] text-white font-bold' : 'text-[#6C7C75] hover:text-[#12201B]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTimelineFilter('report')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  timelineFilter === 'report' ? 'bg-[#18A66A] text-white font-bold' : 'text-[#6C7C75] hover:text-[#12201B]'
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => setTimelineFilter('equipment')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  timelineFilter === 'equipment' ? 'bg-[#18A66A] text-white font-bold' : 'text-[#6C7C75] hover:text-[#12201B]'
                }`}
              >
                Equipment
              </button>
              <button
                onClick={() => setTimelineFilter('appointment')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  timelineFilter === 'appointment' ? 'bg-[#18A66A] text-white font-bold' : 'text-[#6C7C75] hover:text-[#12201B]'
                }`}
              >
                Visits
              </button>
            </div>
          </div>

          <GlassCard className="p-6 sm:p-8">
            <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-500/25 space-y-8">
              {filteredTimeline.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#18A66A] shadow-xs group-hover:scale-125 transition-transform" />

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-[#0F7F51] bg-[#EAFFF4] px-2.5 py-0.5 rounded-md border border-emerald-500/15">
                        {item.badge || item.type}
                      </span>
                      <span className="text-xs text-[#6C7C75]">{item.date}</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-[#12201B]">
                      {item.title}
                    </h4>

                    <p className="text-xs text-[#12201B]/80 leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
      </div>

      {/* ---------------- MODALS ---------------- */}
      {/* 1. Edit User Modal */}
      {isEditUserOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" onClick={() => setIsEditUserOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/20 z-10 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-[#12201B]">Edit Personal Information</h3>
              <button onClick={() => setIsEditUserOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={userFormData.dateOfBirth}
                    onChange={(e) => setUserFormData({ ...userFormData, dateOfBirth: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Blood Group</label>
                  <select
                    value={userFormData.bloodGroup}
                    onChange={(e) => setUserFormData({ ...userFormData, bloodGroup: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Height</label>
                  <input
                    type="text"
                    value={userFormData.height}
                    onChange={(e) => setUserFormData({ ...userFormData, height: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Weight</label>
                  <input
                    type="text"
                    value={userFormData.weight}
                    onChange={(e) => setUserFormData({ ...userFormData, weight: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-2 border-t">
                <label className="block font-bold mb-2 text-[#0F7F51]">Emergency Contact</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={userFormData.emergencyContact?.name || ''}
                    onChange={(e) =>
                      setUserFormData({
                        ...userFormData,
                        emergencyContact: { ...userFormData.emergencyContact, name: e.target.value }
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Relationship (e.g., Spouse)"
                      value={userFormData.emergencyContact?.relationship || ''}
                      onChange={(e) =>
                        setUserFormData({
                          ...userFormData,
                          emergencyContact: { ...userFormData.emergencyContact, relationship: e.target.value }
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={userFormData.emergencyContact?.phone || ''}
                      onChange={(e) =>
                        setUserFormData({
                          ...userFormData,
                          emergencyContact: { ...userFormData.emergencyContact, phone: e.target.value }
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsEditUserOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateUser(userFormData);
                  setIsEditUserOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#18A66A] hover:bg-[#0F7F51] rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Add Allergy Modal */}
      {isAddAllergyOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" onClick={() => setIsAddAllergyOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-emerald-500/20 z-10 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-[#12201B]">Add Known Allergy</h3>
              <button onClick={() => setIsAddAllergyOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Allergy Trigger</label>
                <input
                  type="text"
                  placeholder="e.g., Penicillin, Latex, Peanuts"
                  value={allergyForm.allergy}
                  onChange={(e) => setAllergyForm({ ...allergyForm, allergy: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Observed Reaction</label>
                <input
                  type="text"
                  placeholder="e.g., Rash, hives, breathing constriction"
                  value={allergyForm.reaction}
                  onChange={(e) => setAllergyForm({ ...allergyForm, reaction: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Severity Level</label>
                <select
                  value={allergyForm.severity}
                  onChange={(e) => setAllergyForm({ ...allergyForm, severity: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe (Anaphylaxis Risk)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsAddAllergyOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (allergyForm.allergy.trim()) {
                    onAddAllergy(allergyForm);
                    setAllergyForm({ allergy: '', reaction: '', severity: 'Moderate' });
                    setIsAddAllergyOpen(false);
                  }
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#18A66A] hover:bg-[#0F7F51] rounded-xl"
              >
                Add Allergy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Add Condition Modal */}
      {isAddConditionOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" onClick={() => setIsAddConditionOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-emerald-500/20 z-10 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-[#12201B]">Add Medical Condition</h3>
              <button onClick={() => setIsAddConditionOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Condition Name</label>
                <input
                  type="text"
                  placeholder="e.g., Essential Hypertension, Asthma"
                  value={conditionForm.name}
                  onChange={(e) => setConditionForm({ ...conditionForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Diagnosis Date</label>
                  <input
                    type="date"
                    value={conditionForm.dateDiagnosed}
                    onChange={(e) => setConditionForm({ ...conditionForm, dateDiagnosed: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={conditionForm.type}
                    onChange={(e) => setConditionForm({ ...conditionForm, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="current">Current Condition</option>
                    <option value="past">Past / Resolved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Status</label>
                <select
                  value={conditionForm.status}
                  onChange={(e) => setConditionForm({ ...conditionForm, status: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="Active">Active</option>
                  <option value="Managed">Managed</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Clinical notes, management routines, etc."
                  value={conditionForm.notes}
                  onChange={(e) => setConditionForm({ ...conditionForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsAddConditionOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (conditionForm.name.trim()) {
                    onAddCondition(conditionForm);
                    setConditionForm({ name: '', dateDiagnosed: '', status: 'Active', notes: '', type: 'current' });
                    setIsAddConditionOpen(false);
                  }
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#18A66A] hover:bg-[#0F7F51] rounded-xl"
              >
                Save Condition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Add Medication Modal */}
      {isAddMedicationOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" onClick={() => setIsAddMedicationOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-emerald-500/20 z-10 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-[#12201B]">Add Medication Record</h3>
              <button onClick={() => setIsAddMedicationOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Medication Name</label>
                <input
                  type="text"
                  placeholder="e.g., Lisinopril, Metformin"
                  value={medicationForm.name}
                  onChange={(e) => setMedicationForm({ ...medicationForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Dosage</label>
                  <input
                    type="text"
                    placeholder="e.g., 10 mg, 500 mg"
                    value={medicationForm.dosage}
                    onChange={(e) => setMedicationForm({ ...medicationForm, dosage: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Frequency</label>
                  <input
                    type="text"
                    placeholder="e.g., Once daily in morning"
                    value={medicationForm.frequency}
                    onChange={(e) => setMedicationForm({ ...medicationForm, frequency: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={medicationForm.startDate}
                    onChange={(e) => setMedicationForm({ ...medicationForm, startDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={medicationForm.type}
                    onChange={(e) => setMedicationForm({ ...medicationForm, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="current">Current</option>
                    <option value="past">Past / Discontinued</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Prescribing Clinician</label>
                <input
                  type="text"
                  placeholder="e.g., Dr. Sarah Jenkins, MD"
                  value={medicationForm.prescribingDoctor}
                  onChange={(e) => setMedicationForm({ ...medicationForm, prescribingDoctor: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g., Take with breakfast food"
                  value={medicationForm.notes}
                  onChange={(e) => setMedicationForm({ ...medicationForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsAddMedicationOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (medicationForm.name.trim()) {
                    onAddMedication(medicationForm);
                    setMedicationForm({ name: '', dosage: '', frequency: '', startDate: '', endDate: '', prescribingDoctor: '', notes: '', type: 'current' });
                    setIsAddMedicationOpen(false);
                  }
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#18A66A] hover:bg-[#0F7F51] rounded-xl"
              >
                Save Medication
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Add Appointment Modal */}
      {isAddAppointmentOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" onClick={() => setIsAddAppointmentOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-emerald-500/20 z-10 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-[#12201B]">Schedule Health Check-in</h3>
              <button onClick={() => setIsAddAppointmentOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Doctor Name</label>
                <input
                  type="text"
                  placeholder="e.g., Dr. Sarah Jenkins, MD"
                  value={appointmentForm.doctor}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, doctor: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Specialty</label>
                <input
                  type="text"
                  placeholder="e.g., Internal Medicine, Cardiology"
                  value={appointmentForm.specialty}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, specialty: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Time</label>
                  <input
                    type="text"
                    placeholder="e.g., 10:30 AM"
                    value={appointmentForm.time}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g., Emerald Health Pavilion, Suite 410"
                  value={appointmentForm.location}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes / Agenda</label>
                <textarea
                  rows={2}
                  placeholder="e.g., Annual checkup, review lab report"
                  value={appointmentForm.notes}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsAddAppointmentOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (appointmentForm.doctor.trim()) {
                    onAddAppointment(appointmentForm);
                    setAppointmentForm({ doctor: '', specialty: '', date: '', time: '', location: '', notes: '', status: 'upcoming' });
                    setIsAddAppointmentOpen(false);
                  }
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#18A66A] hover:bg-[#0F7F51] rounded-xl"
              >
                Save Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Medical Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
};

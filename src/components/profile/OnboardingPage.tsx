import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  User, 
  Calendar, 
  Droplet, 
  AlertOctagon, 
  Activity, 
  Pill, 
  Phone,
  ShieldCheck
} from 'lucide-react';
import { UserProfile, Allergy, MedicalCondition, Medication } from '../../types';
import { BackgroundBlobs } from '../layout/BackgroundBlobs';

interface OnboardingPageProps {
  initialUser: UserProfile;
  onComplete: (data: {
    user: Partial<UserProfile>;
    allergies: Omit<Allergy, 'id'>[];
    conditions: Omit<MedicalCondition, 'id'>[];
    medications: Omit<Medication, 'id'>[];
  }) => void;
  onSkipAll: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  initialUser,
  onComplete,
  onSkipAll
}) => {
  const [step, setStep] = useState(1);

  // Wizard state initialized with existing user values if available
  const [name, setName] = useState(initialUser.name || '');
  const [dateOfBirth, setDateOfBirth] = useState(initialUser.dateOfBirth || '');
  const [bloodGroup, setBloodGroup] = useState(initialUser.bloodGroup || 'A+');
  const [height, setHeight] = useState(initialUser.height || '');
  const [weight, setWeight] = useState(initialUser.weight || '');
  const [allergiesText, setAllergiesText] = useState('');
  const [conditionsText, setConditionsText] = useState('');
  const [medicationsText, setMedicationsText] = useState('');
  const [emergencyName, setEmergencyName] = useState(initialUser.emergencyContact?.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(initialUser.emergencyContact?.phone || '');
  const [emergencyRelation, setEmergencyRelation] = useState(initialUser.emergencyContact?.relationship || '');

  const totalSteps = 6;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      finishWizard();
    }
  };

  const handleSkip = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      finishWizard();
    }
  };

  const finishWizard = () => {
    const parsedAllergies: Omit<Allergy, 'id'>[] = allergiesText
      ? allergiesText.split(',').filter(s => s.trim().length > 0).map((a) => ({
          allergy: a.trim(),
          reaction: 'Reported during onboarding',
          severity: 'Moderate'
        }))
      : [];

    const parsedConditions: Omit<MedicalCondition, 'id'>[] = conditionsText
      ? conditionsText.split(',').filter(s => s.trim().length > 0).map((c) => ({
          name: c.trim(),
          dateDiagnosed: new Date().toISOString().split('T')[0],
          status: 'Active',
          notes: 'Reported during profile initialization',
          type: 'current'
        }))
      : [];

    const parsedMedications: Omit<Medication, 'id'>[] = medicationsText
      ? medicationsText.split(',').filter(s => s.trim().length > 0).map((m) => ({
          name: m.trim(),
          dosage: 'Standard',
          frequency: 'As directed by physician',
          startDate: new Date().toISOString().split('T')[0],
          prescribingDoctor: 'Primary Physician',
          notes: 'Added during onboarding',
          type: 'current'
        }))
      : [];

    onComplete({
      user: {
        name: name || initialUser.name || 'Patient',
        dateOfBirth: dateOfBirth || '1992-05-14',
        bloodGroup: bloodGroup || 'A+',
        height: height || '168 cm',
        weight: weight || '64 kg',
        emergencyContact: {
          name: emergencyName || 'Emergency Contact',
          phone: emergencyPhone || '+1 (555) 234-5678',
          relationship: emergencyRelation || 'Family'
        }
      },
      allergies: parsedAllergies,
      conditions: parsedConditions,
      medications: parsedMedications
    });
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-100 selection:text-[#0F7F51]">
      <BackgroundBlobs />

      <div className="relative w-full max-w-xl z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAFFF4] border border-emerald-500/20 text-xs font-bold text-[#0F7F51] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#18A66A]" />
            Personalized Clinical Intake
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#12201B] tracking-tight">
            Welcome to BioLens
          </h1>
          <p className="text-xs sm:text-sm text-[#6C7C75]">
            Let's customize your profile so BioLens can cross-reference your labs with your medical context.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/20 space-y-6">
          {/* Progress Header */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F7F51] bg-[#EAFFF4] px-3 py-1 rounded-full">
                Step {step} of {totalSteps}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-xs font-semibold text-[#6C7C75] hover:text-[#12201B]"
                >
                  Skip Step
                </button>
                <button
                  type="button"
                  onClick={onSkipAll}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
                >
                  Finish Later
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#0F7F51] to-[#18A66A] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Legal Name */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3 text-[#18A66A]">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#18A66A]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#12201B]">What is your full legal name?</h4>
                  <p className="text-xs text-[#6C7C75]">This is used to verify report headers.</p>
                </div>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Eleanor Vance"
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
                autoFocus
              />
            </div>
          )}

          {/* Step 2: Date of Birth & Blood Group */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3 text-[#18A66A]">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <Droplet className="w-5 h-5 text-[#18A66A]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#12201B]">Date of Birth & Blood Type</h4>
                  <p className="text-xs text-[#6C7C75]">Crucial for physiological reference ranges.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Birth Date</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Height</label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g., 168 cm"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Weight</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g., 64 kg"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Allergies */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3 text-[#18A66A]">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <AlertOctagon className="w-5 h-5 text-[#18A66A]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#12201B]">Do you have any known allergies?</h4>
                  <p className="text-xs text-[#6C7C75]">BioLens checks these against recommended discussions.</p>
                </div>
              </div>
              <textarea
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                placeholder="e.g. Penicillin, Amoxicillin, Peanuts, Latex (comma separated)"
                rows={3}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
              />
            </div>
          )}

          {/* Step 4: Medical Conditions */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3 text-[#18A66A]">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#18A66A]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#12201B]">Existing Medical Conditions</h4>
                  <p className="text-xs text-[#6C7C75]">Helps AI correlate ongoing treatments with test values.</p>
                </div>
              </div>
              <textarea
                value={conditionsText}
                onChange={(e) => setConditionsText(e.target.value)}
                placeholder="e.g. Hypertension, Type 2 Diabetes, Mild Asthma (comma separated)"
                rows={3}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
              />
            </div>
          )}

          {/* Step 5: Current Medications */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3 text-[#18A66A]">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <Pill className="w-5 h-5 text-[#18A66A]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#12201B]">Current Prescription Medications</h4>
                  <p className="text-xs text-[#6C7C75]">BioLens screens for known drug-lab interactions.</p>
                </div>
              </div>
              <textarea
                value={medicationsText}
                onChange={(e) => setMedicationsText(e.target.value)}
                placeholder="e.g. Lisinopril 10mg, Metformin 500mg (comma separated)"
                rows={3}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
              />
            </div>
          )}

          {/* Step 6: Emergency Contact */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3 text-[#18A66A]">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#18A66A]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#12201B]">Emergency Contact Details</h4>
                  <p className="text-xs text-[#6C7C75]">Displayed on your printable medical summary dossier.</p>
                </div>
              </div>
              <div className="space-y-2.5">
                <input
                  type="text"
                  placeholder="Contact Name (e.g. Thomas Vance)"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (e.g. +1 555-0192)"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g. Spouse / Sibling)"
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
                />
              </div>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-[#18A66A] hover:bg-[#0F7F51] text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              {step === totalSteps ? (
                <>
                  <Check className="w-4 h-4" />
                  Save & Go to Dashboard
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer confidentiality note */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#6C7C75]">
          <ShieldCheck className="w-4 h-4 text-[#18A66A]" />
          <span>Information is saved directly to your isolated user profile.</span>
        </div>
      </div>
    </div>
  );
};

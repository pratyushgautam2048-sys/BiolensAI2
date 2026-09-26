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
  Phone 
} from 'lucide-react';
import { UserProfile, Allergy, MedicalCondition, Medication } from '../../types';

interface SetupWizardModalProps {
  isOpen: boolean;
  onComplete: (data: {
    user: Partial<UserProfile>;
    allergies: Omit<Allergy, 'id'>[];
    conditions: Omit<MedicalCondition, 'id'>[];
    medications: Omit<Medication, 'id'>[];
  }) => void;
  onClose: () => void;
}

export const SetupWizardModal: React.FC<SetupWizardModalProps> = ({
  isOpen,
  onComplete,
  onClose
}) => {
  const [step, setStep] = useState(1);

  // Wizard state
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [allergiesText, setAllergiesText] = useState('');
  const [conditionsText, setConditionsText] = useState('');
  const [medicationsText, setMedicationsText] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');

  if (!isOpen) return null;

  const totalSteps = 7;

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
    // Process input text into objects
    const parsedAllergies: Omit<Allergy, 'id'>[] = allergiesText
      ? allergiesText.split(',').map((a) => ({
          allergy: a.trim(),
          reaction: 'Reported during onboarding',
          severity: 'Moderate'
        }))
      : [];

    const parsedConditions: Omit<MedicalCondition, 'id'>[] = conditionsText
      ? conditionsText.split(',').map((c) => ({
          name: c.trim(),
          dateDiagnosed: new Date().toISOString().split('T')[0],
          status: 'Active',
          notes: 'Reported during profile initialization',
          type: 'current'
        }))
      : [];

    const parsedMedications: Omit<Medication, 'id'>[] = medicationsText
      ? medicationsText.split(',').map((m) => ({
          name: m.trim(),
          dosage: 'Standard',
          frequency: 'As directed by physician',
          startDate: new Date().toISOString().split('T')[0],
          prescribingDoctor: 'Primary Physician',
          notes: 'Added in setup wizard',
          type: 'current'
        }))
      : [];

    onComplete({
      user: {
        name: name || 'Patient',
        dateOfBirth: dateOfBirth || '1990-01-01',
        bloodGroup: bloodGroup,
        emergencyContact: {
          name: emergencyName || 'Emergency Contact',
          phone: emergencyPhone || '',
          relationship: emergencyRelation || 'Family'
        }
      },
      allergies: parsedAllergies,
      conditions: parsedConditions,
      medications: parsedMedications
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/20 z-10 space-y-6">
        {/* Header & Step progress */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0F7F51] bg-[#EAFFF4] px-3 py-1 rounded-full">
              Step {step} of {totalSteps}
            </span>
            <button
              onClick={handleSkip}
              className="text-xs font-semibold text-[#6C7C75] hover:text-[#12201B]"
            >
              Skip Step
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#18A66A] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Steps */}
        <div className="min-h-[220px] flex flex-col justify-center">
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-3 w-12 h-12 rounded-2xl bg-emerald-50 text-[#18A66A] flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#12201B]">What is your full name?</h3>
                <p className="text-xs text-[#6C7C75]">This helps personalize your reports and records.</p>
              </div>
              <input
                type="text"
                placeholder="e.g., Eleanor Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3 w-12 h-12 rounded-2xl bg-emerald-50 text-[#18A66A] flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#12201B]">What is your date of birth?</h3>
                <p className="text-xs text-[#6C7C75]">Used to calibrate age-adjusted laboratory reference intervals.</p>
              </div>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
                autoFocus
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3 w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <Droplet className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#12201B]">What is your blood group?</h3>
                <p className="text-xs text-[#6C7C75]">Recorded on your emergency profile badge.</p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setBloodGroup(bg)}
                    className={`py-3 text-sm font-bold rounded-xl border transition-all ${
                      bloodGroup === bg
                        ? 'bg-[#18A66A] text-white border-[#18A66A]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="p-3 w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#12201B]">Do you have any known allergies?</h3>
                <p className="text-xs text-[#6C7C75]">Separate multiple allergies with commas (e.g. Penicillin, Latex).</p>
              </div>
              <input
                type="text"
                placeholder="e.g., Penicillin, Peanuts (or leave empty if none)"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
                autoFocus
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="p-3 w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#12201B]">Any current medical conditions?</h3>
                <p className="text-xs text-[#6C7C75]">E.g., Mild Hypertension, Asthma, Type 2 Diabetes.</p>
              </div>
              <input
                type="text"
                placeholder="e.g., Mild Hypertension (separate with commas)"
                value={conditionsText}
                onChange={(e) => setConditionsText(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
                autoFocus
              />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <div className="p-3 w-12 h-12 rounded-2xl bg-emerald-50 text-[#18A66A] flex items-center justify-center">
                <Pill className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#12201B]">Current prescription medications?</h3>
                <p className="text-xs text-[#6C7C75]">BioLens will use these to ground assistant insights.</p>
              </div>
              <input
                type="text"
                placeholder="e.g., Lisinopril, Vitamin D3 (separate with commas)"
                value={medicationsText}
                onChange={(e) => setMedicationsText(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#18A66A]"
                autoFocus
              />
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <div className="p-3 w-12 h-12 rounded-2xl bg-emerald-50 text-[#18A66A] flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#12201B]">Emergency Contact Details</h3>
                <p className="text-xs text-[#6C7C75]">Someone who can be reached in clinical emergencies.</p>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Contact Name (e.g., Marcus Vance)"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Relationship"
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-[#18A66A] hover:bg-[#0F7F51] text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              {step === totalSteps ? (
                <>
                  <Check className="w-4 h-4" /> Finish & View Dashboard
                </>
              ) : (
                <>
                  Next Step <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

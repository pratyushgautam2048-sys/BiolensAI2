export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  height: string; // e.g. "172 cm"
  weight: string; // e.g. "68 kg"
  emergencyContact: EmergencyContact;
  createdAt: string;
  updatedAt: string;
}

export interface Allergy {
  id: string;
  allergy: string;
  reaction: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  diagnosedDate?: string;
}

export interface MedicalCondition {
  id: string;
  name: string;
  dateDiagnosed: string;
  status: 'Active' | 'Managed' | 'Resolved';
  notes: string;
  type: 'current' | 'past';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribingDoctor: string;
  notes: string;
  type: 'current' | 'past';
}

export type TestResultStatus = 'Within range' | 'Above range' | 'Below range' | 'Unknown';

export interface TestResultItem {
  testName: string;
  patientValue: string | number;
  unit: string;
  referenceRange: string;
  status: TestResultStatus;
  interpretation?: string;
}

export interface ReportUrgency {
  level: 'routine' | 'discuss_promptly' | 'emergency';
  headline: string;
  details?: string;
}

export interface ReportAnalysis {
  id: string;
  userId?: string;
  reportTitle: string;
  reportDate: string;
  reportType: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: string;
  isDemo?: boolean;
  aiModel?: string;
  analysisStatus?: 'uploading' | 'uploaded' | 'processing' | 'completed' | 'failed';
  summary: string;
  keyFindings: string[];
  testResults: TestResultItem[];
  whatThisMayMean: string;
  questionsForDoctor: string[];
  generalNextSteps: string[];
  urgency: ReportUrgency;
  analyzedAt: string;
}

export type ConfidenceLevel = 'High' | 'Moderate' | 'Low' | 'Uncertain';

export interface EquipmentScan {
  id: string;
  userId?: string;
  deviceName: string;
  category: string;
  confidence: ConfidenceLevel;
  confidenceScore?: number; // 0-100
  uncertainNote?: string;
  whatIsThis: string;
  whatIsItUsedFor: string;
  howItWorks: string;
  howToUse: string[];
  requiresProfessionalTraining: boolean;
  safetyInformation: string[];
  manufacturerInfo: {
    identifiedManufacturer?: string;
    identifiedModel?: string;
    notes?: string;
    checkUserManualNote: string;
  };
  imageUrl?: string;
  scannedAt: string;
}

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location?: string;
  notes: string;
  status: 'upcoming' | 'past';
}

export interface TimelineItem {
  id: string;
  date: string;
  type: 'report' | 'equipment' | 'medication' | 'condition' | 'appointment' | 'profile';
  title: string;
  description: string;
  badge?: string;
  referenceId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: {
    type: 'record' | 'general' | 'uncertain' | 'web';
    sourceName: string;
    detail?: string;
    url?: string;
    title?: string;
  }[];
  webSearchQueries?: string[];
  groundedWithGoogleSearch?: boolean;
  quotaNotice?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'alert' | 'appointment' | 'report';
}

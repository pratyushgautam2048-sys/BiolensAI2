import {
  UserProfile,
  Allergy,
  MedicalCondition,
  Medication,
  ReportAnalysis,
  EquipmentScan,
  Appointment,
  TimelineItem,
  ChatMessage
} from '../types';

export const api = {
  async checkHealth() {
    try {
      const res = await fetch('/api/health');
      return await res.json();
    } catch (e) {
      return { status: 'offline', geminiConfigured: false };
    }
  },

  async getProfile(): Promise<{
    user: UserProfile;
    allergies: Allergy[];
    conditions: MedicalCondition[];
    medications: Medication[];
  }> {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('Failed to load profile');
    return await res.json();
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    return data.user;
  },

  async getReports(): Promise<ReportAnalysis[]> {
    const res = await fetch('/api/reports');
    if (!res.ok) throw new Error('Failed to load reports');
    return await res.json();
  },

  async saveReport(report: ReportAnalysis): Promise<ReportAnalysis> {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report)
    });
    const data = await res.json();
    return data.report;
  },

  async deleteReport(id: string): Promise<boolean> {
    const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async analyzeReport(payload: {
    fileBase64?: string;
    mimeType?: string;
    fileName?: string;
    fileSize?: string;
    sampleType?: string;
    textContent?: string;
  }): Promise<ReportAnalysis> {
    const res = await fetch('/api/reports/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error('Analysis request failed. Please check network connection.');
    }
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Unable to analyze document at this time.');
    }
    return data.analysis;
  },

  async getEquipment(): Promise<EquipmentScan[]> {
    const res = await fetch('/api/equipment');
    if (!res.ok) throw new Error('Failed to load equipment');
    return await res.json();
  },

  async saveEquipment(equipment: EquipmentScan): Promise<EquipmentScan> {
    const res = await fetch('/api/equipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(equipment)
    });
    const data = await res.json();
    return data.equipment;
  },

  async analyzeEquipment(payload: {
    imageBase64?: string;
    mimeType?: string;
    sampleId?: string;
  }): Promise<EquipmentScan> {
    const res = await fetch('/api/equipment/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error('Equipment analysis request failed.');
    }
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Unable to analyze equipment photo.');
    }
    return data.analysis;
  },

  async sendAssistantChat(payload: {
    message: string;
    history: ChatMessage[];
  }): Promise<{ reply: string; citations?: any[] }> {
    const res = await fetch('/api/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error('Assistant communication failed.');
    }
    return await res.json();
  },

  async addMedication(med: Omit<Medication, 'id'>): Promise<Medication> {
    const res = await fetch('/api/medications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(med)
    });
    const data = await res.json();
    return data.medication;
  },

  async deleteMedication(id: string): Promise<boolean> {
    const res = await fetch(`/api/medications/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async addCondition(cond: Omit<MedicalCondition, 'id'>): Promise<MedicalCondition> {
    const res = await fetch('/api/conditions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cond)
    });
    const data = await res.json();
    return data.condition;
  },

  async deleteCondition(id: string): Promise<boolean> {
    const res = await fetch(`/api/conditions/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async addAllergy(allergy: Omit<Allergy, 'id'>): Promise<Allergy> {
    const res = await fetch('/api/allergies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(allergy)
    });
    const data = await res.json();
    return data.allergy;
  },

  async deleteAllergy(id: string): Promise<boolean> {
    const res = await fetch(`/api/allergies/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async getAppointments(): Promise<Appointment[]> {
    const res = await fetch('/api/appointments');
    if (!res.ok) throw new Error('Failed to load appointments');
    return await res.json();
  },

  async addAppointment(apt: Omit<Appointment, 'id'>): Promise<Appointment> {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apt)
    });
    const data = await res.json();
    return data.appointment;
  },

  async deleteAppointment(id: string): Promise<boolean> {
    const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async getTimeline(): Promise<TimelineItem[]> {
    const res = await fetch('/api/timeline');
    if (!res.ok) throw new Error('Failed to load timeline');
    return await res.json();
  },

  async resetAllData(): Promise<void> {
    await fetch('/api/data/reset', { method: 'POST' });
  }
};

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  QuerySnapshot,
  DocumentData,
  writeBatch
} from 'firebase/firestore';
import { db } from './index';
import {
  UserProfile,
  ReportAnalysis,
  EquipmentScan,
  Medication,
  MedicalCondition,
  Allergy,
  Appointment,
  TimelineItem,
  ChatMessage
} from '../../types';

export const firestoreService = {
  // ---------------- USER PROFILE ----------------
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!db) return null;
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  },

  async setUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, {
      ...profile,
      id: userId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  },

  listenUserProfile(userId: string, callback: (profile: UserProfile | null) => void) {
    if (!db) return () => {};
    const docRef = doc(db, 'users', userId);
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        callback(snap.data() as UserProfile);
      } else {
        callback(null);
      }
    }, (error) => {
      console.warn('Profile listener notice:', error);
    });
  },

  // ---------------- MEDICAL REPORTS ----------------
  listenReports(userId: string, callback: (reports: ReportAnalysis[]) => void) {
    if (!db) return () => {};
    const colRef = collection(db, 'users', userId, 'medicalReports');
    return onSnapshot(colRef, (snap: QuerySnapshot<DocumentData>) => {
      const reports = snap.docs.map((d) => d.data() as ReportAnalysis);
      // Sort newest first
      reports.sort((a, b) => new Date(b.analyzedAt || 0).getTime() - new Date(a.analyzedAt || 0).getTime());
      callback(reports);
    }, (error) => {
      console.warn('Reports listener notice:', error);
    });
  },

  async saveReport(userId: string, report: ReportAnalysis): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, 'medicalReports', report.id);
    await setDoc(docRef, {
      ...report,
      userId,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Also synchronously add to timeline
    await this.addTimelineItem(userId, {
      id: `tl_${Date.now()}`,
      date: report.reportDate || new Date().toISOString().split('T')[0],
      type: 'report',
      title: `${report.reportTitle} Analyzed`,
      description: report.summary ? report.summary.slice(0, 110) + '...' : 'Report analyzed successfully.',
      badge: 'Lab Report',
      referenceId: report.id
    });
  },

  async updateReportStatus(userId: string, reportId: string, status: string, summary?: string): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, 'medicalReports', reportId);
    await updateDoc(docRef, {
      analysisStatus: status,
      ...(summary ? { summary } : {}),
      updatedAt: new Date().toISOString()
    });
  },

  async deleteReport(userId: string, reportId: string): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, 'medicalReports', reportId);
    await deleteDoc(docRef);
  },

  // ---------------- EQUIPMENT SCANS ----------------
  listenEquipment(userId: string, callback: (equipment: EquipmentScan[]) => void) {
    if (!db) return () => {};
    const colRef = collection(db, 'users', userId, 'equipmentScans');
    return onSnapshot(colRef, (snap) => {
      const items = snap.docs.map((d) => d.data() as EquipmentScan);
      items.sort((a, b) => new Date(b.scannedAt || 0).getTime() - new Date(a.scannedAt || 0).getTime());
      callback(items);
    }, (error) => {
      console.warn('Equipment listener notice:', error);
    });
  },

  async saveEquipment(userId: string, item: EquipmentScan): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, 'equipmentScans', item.id);
    await setDoc(docRef, {
      ...item,
      userId,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Add to timeline
    await this.addTimelineItem(userId, {
      id: `tl_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'equipment',
      title: `${item.deviceName} Scanned`,
      description: `Identified with ${item.confidence} confidence. Safe operating guidelines logged.`,
      badge: 'Equipment',
      referenceId: item.id
    });
  },

  async deleteEquipment(userId: string, scanId: string): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, 'equipmentScans', scanId);
    await deleteDoc(docRef);
  },

  // ---------------- MEDICATIONS ----------------
  listenMedications(userId: string, callback: (meds: Medication[]) => void) {
    if (!db) return () => {};
    const colRef = collection(db, 'users', userId, 'medications');
    return onSnapshot(colRef, (snap) => {
      callback(snap.docs.map((d) => d.data() as Medication));
    }, (err) => console.warn('Meds listener error:', err));
  },

  async addMedication(userId: string, med: Medication): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, 'medications', med.id);
    await setDoc(docRef, { ...med, userId });
  },

  async deleteMedication(userId: string, medId: string): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, 'medications', medId);
    await deleteDoc(docRef);
  },

  // ---------------- CONDITIONS ----------------
  listenConditions(userId: string, callback: (conds: MedicalCondition[]) => void) {
    if (!db) return () => {};
    const colRef = collection(db, 'users', userId, 'medicalConditions');
    return onSnapshot(colRef, (snap) => {
      callback(snap.docs.map((d) => d.data() as MedicalCondition));
    }, (err) => console.warn('Conditions listener error:', err));
  },

  async addCondition(userId: string, cond: MedicalCondition): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, 'medicalConditions', cond.id);
    await setDoc(docRef, { ...cond, userId });
  },

  async deleteCondition(userId: string, condId: string): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, 'medicalConditions', condId);
    await deleteDoc(docRef);
  },

  // ---------------- ALLERGIES ----------------
  listenAllergies(userId: string, callback: (allergies: Allergy[]) => void) {
    if (!db) return () => {};
    const colRef = collection(db, 'users', userId, 'allergies');
    return onSnapshot(colRef, (snap) => {
      callback(snap.docs.map((d) => d.data() as Allergy));
    }, (err) => console.warn('Allergies listener error:', err));
  },

  async addAllergy(userId: string, allergy: Allergy): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, 'allergies', allergy.id);
    await setDoc(docRef, { ...allergy, userId });
  },

  async deleteAllergy(userId: string, allergyId: string): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, 'allergies', allergyId);
    await deleteDoc(docRef);
  },

  // ---------------- APPOINTMENTS ----------------
  listenAppointments(userId: string, callback: (apts: Appointment[]) => void) {
    if (!db) return () => {};
    const colRef = collection(db, 'users', userId, 'appointments');
    return onSnapshot(colRef, (snap) => {
      callback(snap.docs.map((d) => d.data() as Appointment));
    }, (err) => console.warn('Appointments listener error:', err));
  },

  async addAppointment(userId: string, apt: Appointment): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, 'appointments', apt.id);
    await setDoc(docRef, { ...apt, userId });
  },

  async deleteAppointment(userId: string, aptId: string): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, 'appointments', aptId);
    await deleteDoc(docRef);
  },

  // ---------------- TIMELINE ----------------
  listenTimeline(userId: string, callback: (timeline: TimelineItem[]) => void) {
    if (!db) return () => {};
    const colRef = collection(db, 'users', userId, 'healthTimeline');
    return onSnapshot(colRef, (snap) => {
      const items = snap.docs.map((d) => d.data() as TimelineItem);
      items.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      callback(items);
    }, (err) => console.warn('Timeline listener error:', err));
  },

  async addTimelineItem(userId: string, item: TimelineItem): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, 'healthTimeline', item.id);
    await setDoc(docRef, { ...item, userId });
  },

  // ---------------- AI CONVERSATIONS ----------------
  async saveAiConversation(userId: string, conversationId: string, messages: ChatMessage[]): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', userId, 'aiConversations', conversationId);
    await setDoc(docRef, {
      id: conversationId,
      userId,
      messages,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  },

  async getAiConversation(userId: string, conversationId: string): Promise<ChatMessage[] | null> {
    if (!db) return null;
    const docRef = doc(db, 'users', userId, 'aiConversations', conversationId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data().messages as ChatMessage[];
    }
    return null;
  }
};

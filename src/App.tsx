import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronUp,
  Activity,
  AlertCircle,
  Volume2,
  VolumeX,
  Sliders,
  CheckCircle2,
  Play,
  RotateCcw
} from 'lucide-react';
import { 
  UserProfile, 
  Allergy, 
  MedicalCondition, 
  Medication, 
  ReportAnalysis, 
  EquipmentScan, 
  Appointment, 
  TimelineItem, 
  AppNotification 
} from './types';
import { 
  INITIAL_USER, 
  INITIAL_ALLERGIES, 
  INITIAL_CONDITIONS, 
  INITIAL_MEDICATIONS, 
  INITIAL_REPORTS, 
  INITIAL_EQUIPMENT, 
  INITIAL_APPOINTMENTS, 
  INITIAL_TIMELINE, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { api } from './services/api';
import { useAuth } from './context/AuthContext';
import { firestoreService } from './lib/firebase/firestore';
import { useSound } from './context/SoundContext';

// Components
import { BackgroundBlobs } from './components/layout/BackgroundBlobs';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { ReportAnalyzer } from './components/analyzer/ReportAnalyzer';
import { EquipmentScanner } from './components/scanner/EquipmentScanner';
import { HealthProfile } from './components/profile/HealthProfile';
import { AIAssistantModal } from './components/assistant/AIAssistantModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { SettingsModal } from './components/common/SettingsModal';
import { AuthPage } from './components/auth/AuthPage';
import { OnboardingPage } from './components/profile/OnboardingPage';
import { SoundPermissionModal } from './components/sound/SoundPermissionModal';
import { SoundConfirmationToast } from './components/sound/SoundConfirmationToast';

export default function App() {
  const { 
    currentUser, 
    userProfile, 
    isAuthenticated, 
    isLoading: isAuthLoading, 
    isDemoMode, 
    logout, 
    updateProfileData 
  } = useAuth();

  // Primary Health Data States
  const [user, setUser] = useState<UserProfile>(userProfile || INITIAL_USER);
  const [allergies, setAllergies] = useState<Allergy[]>(INITIAL_ALLERGIES);
  const [conditions, setConditions] = useState<MedicalCondition[]>(INITIAL_CONDITIONS);
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [reports, setReports] = useState<ReportAnalysis[]>(INITIAL_REPORTS);
  const [equipment, setEquipment] = useState<EquipmentScan[]>(INITIAL_EQUIPMENT);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [timeline, setTimeline] = useState<TimelineItem[]>(INITIAL_TIMELINE);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Sync user state with Auth context userProfile
  useEffect(() => {
    if (userProfile) {
      setUser(userProfile);
    }
  }, [userProfile]);

  // Route State: support URL paths and hashes (/login, /signup, /forgot-password, /onboarding, /dashboard, /reports, /equipment, /profile)
  const getInitialRoute = (): string => {
    const hash = window.location.hash.replace(/^#\/?/, '/');
    if (['/login', '/signup', '/forgot-password', '/onboarding', '/dashboard', '/reports', '/equipment', '/profile', '/appointments', '/privacy'].includes(hash)) {
      return hash;
    }
    const path = window.location.pathname;
    if (['/login', '/signup', '/forgot-password', '/onboarding', '/dashboard', '/reports', '/equipment', '/profile', '/appointments', '/privacy'].includes(path)) {
      return path;
    }
    return '/dashboard';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Modals & Drawers
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [assistantInitialPrompt, setAssistantInitialPrompt] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Preselected items for direct view
  const [preselectedReport, setPreselectedReport] = useState<ReportAnalysis | null>(null);
  const [preselectedEquipment, setPreselectedEquipment] = useState<EquipmentScan | null>(null);

  // Sound effects and permission hook
  const { 
    playNavPop, 
    soundPermission, 
    requestPermission, 
    isSoundEnabled, 
    toggleSound, 
    testSound, 
    volume, 
    setVolume 
  } = useSound();

  // Prompt sound permission gracefully if user hasn't made a choice yet
  useEffect(() => {
    if (isAuthenticated && soundPermission === 'prompt') {
      const timer = setTimeout(() => {
        requestPermission();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, soundPermission, requestPermission]);

  // Synchronize route with window hash and trigger tactile popup audio with smooth animations
  const navigate = (route: string) => {
    if (route === currentRoute) return;

    const cleanSection = route.replace('/', '');
    if (['dashboard', 'reports', 'equipment', 'profile', 'appointments', 'privacy'].includes(cleanSection)) {
      playNavPop(cleanSection);
    }

    setCurrentRoute(route);
    if (window.location.hash !== `#${route}`) {
      window.location.hash = route;
    }
    if (window.scrollY > 0) {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '/');
      if (hash && hash !== currentRoute) {
        setCurrentRoute(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentRoute]);

  // Route protection guard
  useEffect(() => {
    if (isAuthLoading) return;

    const authOnlyRoutes = ['/dashboard', '/reports', '/equipment', '/profile', '/appointments', '/privacy', '/onboarding'];
    const unauthOnlyRoutes = ['/login', '/signup', '/forgot-password'];

    if (!isAuthenticated) {
      if (authOnlyRoutes.includes(currentRoute)) {
        navigate('/login');
      }
    } else {
      if (unauthOnlyRoutes.includes(currentRoute)) {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, isAuthLoading, currentRoute]);

  // Real-time Firestore synchronization when an authenticated user is signed in
  useEffect(() => {
    if (!currentUser) {
      // In demo mode or offline, load from backend/local cache
      async function loadInitialCache() {
        try {
          const [profileRes, reportsRes, equipRes, aptsRes, timeRes] = await Promise.allSettled([
            api.getProfile(),
            api.getReports(),
            api.getEquipment(),
            api.getAppointments(),
            api.getTimeline()
          ]);

          if (profileRes.status === 'fulfilled') {
            setUser(profileRes.value.user);
            setAllergies(profileRes.value.allergies);
            setConditions(profileRes.value.conditions);
            setMedications(profileRes.value.medications);
          }
          if (reportsRes.status === 'fulfilled' && reportsRes.value.length > 0) {
            setReports(reportsRes.value);
          }
          if (equipRes.status === 'fulfilled' && equipRes.value.length > 0) {
            setEquipment(equipRes.value);
          }
          if (aptsRes.status === 'fulfilled' && aptsRes.value.length > 0) {
            setAppointments(aptsRes.value);
          }
          if (timeRes.status === 'fulfilled' && timeRes.value.length > 0) {
            setTimeline(timeRes.value);
          }
        } catch (err) {
          console.warn('Initial data synchronization used local cache:', err);
        }
      }
      loadInitialCache();
      return;
    }

    const uid = currentUser.uid;

    // Real-time Firestore listeners for all collections
    const unsubProfile = firestoreService.listenUserProfile(uid, (profile) => {
      if (profile) setUser(profile);
    });

    const unsubReports = firestoreService.listenReports(uid, (items) => {
      setReports(items.length > 0 ? items : INITIAL_REPORTS);
    });

    const unsubEquip = firestoreService.listenEquipment(uid, (items) => {
      setEquipment(items.length > 0 ? items : INITIAL_EQUIPMENT);
    });

    const unsubMeds = firestoreService.listenMedications(uid, (items) => {
      setMedications(items.length > 0 ? items : INITIAL_MEDICATIONS);
    });

    const unsubConditions = firestoreService.listenConditions(uid, (items) => {
      setConditions(items.length > 0 ? items : INITIAL_CONDITIONS);
    });

    const unsubAllergies = firestoreService.listenAllergies(uid, (items) => {
      setAllergies(items.length > 0 ? items : INITIAL_ALLERGIES);
    });

    const unsubApts = firestoreService.listenAppointments(uid, (items) => {
      setAppointments(items.length > 0 ? items : INITIAL_APPOINTMENTS);
    });

    const unsubTimeline = firestoreService.listenTimeline(uid, (items) => {
      setTimeline(items.length > 0 ? items : INITIAL_TIMELINE);
    });

    return () => {
      unsubProfile();
      unsubReports();
      unsubEquip();
      unsubMeds();
      unsubConditions();
      unsubAllergies();
      unsubApts();
      unsubTimeline();
    };
  }, [currentUser]);

  // Handlers
  const handleSaveReport = async (report: ReportAnalysis) => {
    try {
      if (currentUser) {
        await firestoreService.saveReport(currentUser.uid, report);
      } else {
        const saved = await api.saveReport(report);
        setReports((prev) => [saved, ...prev.filter((r) => r.id !== saved.id)]);
      }

      setTimeline((prev) => [
        {
          id: `tl_${Date.now()}`,
          date: report.reportDate || new Date().toISOString().split('T')[0],
          type: 'report',
          title: `${report.reportTitle} Analyzed`,
          description: report.summary.slice(0, 110) + '...',
          badge: 'Lab Report',
          referenceId: report.id
        },
        ...prev
      ]);
    } catch (err) {
      console.error('Error saving report:', err);
      setReports((prev) => [report, ...prev]);
    }
  };

  const handleSaveEquipment = async (eq: EquipmentScan) => {
    try {
      if (currentUser) {
        await firestoreService.saveEquipment(currentUser.uid, eq);
      } else {
        const saved = await api.saveEquipment(eq);
        setEquipment((prev) => [saved, ...prev.filter((e) => e.id !== saved.id)]);
      }

      setTimeline((prev) => [
        {
          id: `tl_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: 'equipment',
          title: `${eq.deviceName} Scanned`,
          description: `Device recorded with ${eq.confidence} confidence. Safe usage guidelines indexed.`,
          badge: 'Equipment',
          referenceId: eq.id
        },
        ...prev
      ]);
    } catch (err) {
      console.error('Error saving equipment:', err);
      setEquipment((prev) => [eq, ...prev]);
    }
  };

  const handleUpdateUser = async (updated: Partial<UserProfile>) => {
    try {
      await updateProfileData(updated);
      setUser((prev) => ({ ...prev, ...updated }));
    } catch (err) {
      setUser((prev) => ({ ...prev, ...updated }));
    }
  };

  const handleAddAllergy = async (allergy: Omit<Allergy, 'id'>) => {
    const newAllergy: Allergy = { ...allergy, id: `alg_${Date.now()}` };
    try {
      if (currentUser) {
        await firestoreService.addAllergy(currentUser.uid, newAllergy);
      } else {
        const saved = await api.addAllergy(allergy);
        setAllergies((prev) => [...prev, saved]);
        return;
      }
    } catch (err) {
      console.error(err);
    }
    setAllergies((prev) => [...prev, newAllergy]);
  };

  const handleDeleteAllergy = async (id: string) => {
    try {
      if (currentUser) {
        await firestoreService.deleteAllergy(currentUser.uid, id);
      } else {
        await api.deleteAllergy(id);
      }
    } catch (err) {
      console.error(err);
    }
    setAllergies((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddCondition = async (cond: Omit<MedicalCondition, 'id'>) => {
    const newCond: MedicalCondition = { ...cond, id: `cond_${Date.now()}` };
    try {
      if (currentUser) {
        await firestoreService.addCondition(currentUser.uid, newCond);
      } else {
        const saved = await api.addCondition(cond);
        setConditions((prev) => [...prev, saved]);
        return;
      }
    } catch (err) {
      console.error(err);
    }
    setConditions((prev) => [...prev, newCond]);
  };

  const handleDeleteCondition = async (id: string) => {
    try {
      if (currentUser) {
        await firestoreService.deleteCondition(currentUser.uid, id);
      } else {
        await api.deleteCondition(id);
      }
    } catch (err) {
      console.error(err);
    }
    setConditions((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddMedication = async (med: Omit<Medication, 'id'>) => {
    const newMed: Medication = { ...med, id: `med_${Date.now()}` };
    try {
      if (currentUser) {
        await firestoreService.addMedication(currentUser.uid, newMed);
      } else {
        const saved = await api.addMedication(med);
        setMedications((prev) => [...prev, saved]);
        return;
      }
    } catch (err) {
      console.error(err);
    }
    setMedications((prev) => [...prev, newMed]);
  };

  const handleDeleteMedication = async (id: string) => {
    try {
      if (currentUser) {
        await firestoreService.deleteMedication(currentUser.uid, id);
      } else {
        await api.deleteMedication(id);
      }
    } catch (err) {
      console.error(err);
    }
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddAppointment = async (apt: Omit<Appointment, 'id'>) => {
    const newApt: Appointment = { ...apt, id: `apt_${Date.now()}` };
    try {
      if (currentUser) {
        await firestoreService.addAppointment(currentUser.uid, newApt);
      } else {
        const saved = await api.addAppointment(apt);
        setAppointments((prev) => [...prev, saved]);
        return;
      }
    } catch (err) {
      console.error(err);
    }
    setAppointments((prev) => [...prev, newApt]);
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      if (currentUser) {
        await firestoreService.deleteAppointment(currentUser.uid, id);
      } else {
        await api.deleteAppointment(id);
      }
    } catch (err) {
      console.error(err);
    }
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleResetData = async () => {
    try {
      await api.resetAllData();
    } catch (err) {
      console.error(err);
    }
    setReports([]);
    setEquipment([]);
    setMedications([]);
    setConditions([]);
    setAllergies([]);
    setTimeline([]);
    setNotifications([]);
  };

  const handleOpenReportDetails = (rep: ReportAnalysis) => {
    setPreselectedReport(rep);
    navigate('/reports');
  };

  const handleOpenEquipmentDetails = (eq: EquipmentScan) => {
    setPreselectedEquipment(eq);
    navigate('/equipment');
  };

  const handleOpenAssistantWithPrompt = (prompt: string) => {
    setAssistantInitialPrompt(prompt);
    setIsAssistantOpen(true);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleOnboardingComplete = async (data: {
    user: Partial<UserProfile>;
    allergies: Omit<Allergy, 'id'>[];
    conditions: Omit<MedicalCondition, 'id'>[];
    medications: Omit<Medication, 'id'>[];
  }) => {
    await handleUpdateUser(data.user);
    for (const a of data.allergies) {
      await handleAddAllergy(a);
    }
    for (const c of data.conditions) {
      await handleAddCondition(c);
    }
    for (const m of data.medications) {
      await handleAddMedication(m);
    }
    navigate('/dashboard');
  };

  // Loading screen during initial auth verification
  if (isAuthLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-white selection:bg-emerald-100 selection:text-[#0F7F51]">
        <BackgroundBlobs />
        <div className="text-center space-y-4 z-10">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-[#0F7F51] via-[#18A66A] to-emerald-400 p-0.5 shadow-xl shadow-emerald-700/20">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
              <Activity className="w-7 h-7 text-[#18A66A] animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-black text-[#12201B]">BioLens</h2>
            <p className="text-xs text-[#6C7C75]">Connecting secure health enclave...</p>
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated dedicated pages (/login, /signup, /forgot-password)
  if (!isAuthenticated && ['/login', '/signup', '/forgot-password'].includes(currentRoute)) {
    return (
      <AuthPage
        mode={currentRoute.replace('/', '') as 'login' | 'signup' | 'forgot-password'}
        onNavigate={navigate}
      />
    );
  }

  // Onboarding intake page (/onboarding)
  if (currentRoute === '/onboarding') {
    return (
      <OnboardingPage
        initialUser={user}
        onComplete={handleOnboardingComplete}
        onSkipAll={() => navigate('/dashboard')}
      />
    );
  }

  // Map route to sidebar/header navigation active state
  const navPage = currentRoute.replace('/', '') || 'dashboard';

  return (
    <div className="min-h-screen relative flex flex-col selection:bg-emerald-100 selection:text-[#0F7F51]">
      {/* Background Liquid Glass Ambient Gradient Shapes */}
      <BackgroundBlobs />

      {/* Top Header */}
      <Header
        user={user}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNavigateToProfile={() => navigate('/profile')}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onLogout={handleLogout}
        currentPage={navPage}
      />

      {/* Main Body Layout (Sidebar + Content) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Sidebar
          currentPage={navPage}
          onNavigate={(page) => navigate(`/${page}`)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />

        {/* Content View Container */}
        <main className="flex-1 min-w-0 pt-6 sm:pt-8 lg:pl-8">
          {/* Smooth Animated Page View */}
          <div
            key={currentRoute}
            className="animate-page-enter min-h-[calc(100vh-160px)]"
          >
            {(currentRoute === '/dashboard' || currentRoute === '/') && (
              <Dashboard
                user={user}
                reports={reports}
                equipment={equipment}
                timeline={timeline}
                appointments={appointments}
                medications={medications}
                onNavigate={(page) => navigate(`/${page}`)}
                onOpenReportDetails={handleOpenReportDetails}
                onOpenEquipmentDetails={handleOpenEquipmentDetails}
              />
            )}

          {currentRoute === '/reports' && (
            <ReportAnalyzer
              onSaveReport={handleSaveReport}
              onOpenAssistantWithPrompt={handleOpenAssistantWithPrompt}
              preselectedReport={preselectedReport}
            />
          )}

          {currentRoute === '/equipment' && (
            <EquipmentScanner
              onSaveEquipment={handleSaveEquipment}
              preselectedEquipment={preselectedEquipment}
            />
          )}

          {currentRoute === '/profile' && (
            <HealthProfile
              user={user}
              allergies={allergies}
              conditions={conditions}
              medications={medications}
              reports={reports}
              equipment={equipment}
              appointments={appointments}
              timeline={timeline}
              onUpdateUser={handleUpdateUser}
              onAddAllergy={handleAddAllergy}
              onDeleteAllergy={handleDeleteAllergy}
              onAddCondition={handleAddCondition}
              onDeleteCondition={handleDeleteCondition}
              onAddMedication={handleAddMedication}
              onDeleteMedication={handleDeleteMedication}
              onAddAppointment={handleAddAppointment}
              onDeleteAppointment={handleDeleteAppointment}
              onSelectReport={handleOpenReportDetails}
              onSelectEquipment={handleOpenEquipmentDetails}
              initialTab="personal"
            />
          )}

          {currentRoute === '/appointments' && (
            <HealthProfile
              user={user}
              allergies={allergies}
              conditions={conditions}
              medications={medications}
              reports={reports}
              equipment={equipment}
              appointments={appointments}
              timeline={timeline}
              onUpdateUser={handleUpdateUser}
              onAddAllergy={handleAddAllergy}
              onDeleteAllergy={handleDeleteAllergy}
              onAddCondition={handleAddCondition}
              onDeleteCondition={handleDeleteCondition}
              onAddMedication={handleAddMedication}
              onDeleteMedication={handleDeleteMedication}
              onAddAppointment={handleAddAppointment}
              onDeleteAppointment={handleDeleteAppointment}
              onSelectReport={handleOpenReportDetails}
              onSelectEquipment={handleOpenEquipmentDetails}
              initialTab="appointments"
            />
          )}

          {currentRoute === '/privacy' && (
            <div className="space-y-6 pb-16">
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-[#12201B]">Security & Privacy</h1>
                <p className="text-sm text-[#6C7C75]">
                  Manage patient consent, Firebase security isolation, audit logging, audio feedback, and data control.
                </p>
              </div>

              {/* Navigation Audio & Sound Permission Card */}
              <div className="p-6 rounded-3xl bg-white/90 border border-emerald-500/20 shadow-md space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-[#EAFFF4] rounded-2xl text-[#18A66A]">
                      {isSoundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6 text-slate-400" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#12201B]">Navigation Audio & Popup Sounds</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          soundPermission === 'granted'
                            ? 'bg-[#EAFFF4] text-[#0F7F51] border border-emerald-500/20'
                            : soundPermission === 'denied'
                            ? 'bg-slate-100 text-slate-600 border border-slate-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {soundPermission === 'granted' ? 'Permission: Confirmed' : soundPermission === 'denied' ? 'Permission: Muted' : 'Permission: Pending'}
                        </span>
                      </div>
                      <p className="text-xs text-[#6C7C75] mt-0.5">
                        Plays a crisp, tactile bubble pop sound when clicking Dashboard, Report Analyzer, Scan Equipment, My Health Profile, Appointments, and Security & Privacy.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={toggleSound}
                      className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        isSoundEnabled ? 'bg-[#18A66A]' : 'bg-slate-300'
                      }`}
                      role="switch"
                      aria-checked={isSoundEnabled}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          isSoundEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="text-xs font-bold text-slate-700">
                      {isSoundEnabled ? 'Enabled' : 'Muted'}
                    </span>
                  </div>
                </div>

                {/* Audio controls & test sound */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-500/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 max-w-xs">
                    <Sliders className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-600 shrink-0">Volume:</span>
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
                      className="w-full h-1.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-[#18A66A]"
                      aria-label="Sound volume slider"
                    />
                    <span className="text-xs font-bold text-[#0F7F51] w-9 text-right shrink-0">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={testSound}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-emerald-100 text-[#0F7F51] border border-emerald-500/30 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-[#0F7F51]" />
                      <span>Test Pop Sound</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => requestPermission()}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      title="Re-open permission request dialog"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-prompt Dialog</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Existing Settings Vault Card */}
              <div className="p-6 rounded-3xl bg-white/90 border border-emerald-500/20 shadow-md space-y-4">
                <h3 className="text-lg font-bold text-[#12201B]">Open Settings Vault</h3>
                <p className="text-xs text-[#6C7C75] leading-relaxed">
                  Access your full export dossiers, review encryption architectures, or trigger irreversible health data clearance.
                </p>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-5 py-2.5 bg-[#18A66A] hover:bg-[#0F7F51] text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  Open Settings & Privacy Vault
                </button>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>

      {/* Floating AI Health Assistant Trigger Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="group relative flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#0F7F51] via-[#18A66A] to-emerald-400 text-white font-bold text-sm shadow-xl shadow-emerald-700/30 hover:shadow-2xl hover:shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label="Open BioLens Assistant"
        >
          {/* Animated pulsing outer halo */}
          <span className="absolute -inset-1 rounded-full bg-emerald-400/30 animate-pulse pointer-events-none" />

          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>

          <span className="relative">BioLens AI</span>

          <span className="relative w-2 h-2 rounded-full bg-white animate-ping hidden sm:inline-block" />
        </button>
      </div>

      {/* AI Health Assistant Slide-out Panel */}
      <AIAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        user={user}
        allergies={allergies}
        conditions={conditions}
        medications={medications}
        reports={reports}
        equipment={equipment}
        appointments={appointments}
        initialPrompt={assistantInitialPrompt}
        onClearInitialPrompt={() => setAssistantInitialPrompt(null)}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />

      {/* Settings & Privacy Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onResetData={handleResetData}
      />

      {/* Sound Permission Modal & Confirmation Toast */}
      <SoundPermissionModal />
      <SoundConfirmationToast />
    </div>
  );
}

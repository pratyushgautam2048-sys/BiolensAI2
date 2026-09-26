import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Camera, 
  UserCheck, 
  Calendar, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useSound } from '../../context/SoundContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenAssistant: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onOpenAssistant
}) => {
  const { playNavPop } = useSound();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & recent activity'
    },
    {
      id: 'reports',
      label: 'Report Analyzer',
      icon: FileText,
      description: 'Upload & explain lab results'
    },
    {
      id: 'equipment',
      label: 'Scan Equipment',
      icon: Camera,
      description: 'Identify devices & safety'
    },
    {
      id: 'profile',
      label: 'My Health Profile',
      icon: UserCheck,
      description: 'Conditions, meds & history'
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      description: 'Upcoming clinic check-ins'
    },
    {
      id: 'privacy',
      label: 'Security & Privacy',
      icon: ShieldCheck,
      description: 'Audit logs & data control'
    }
  ];

  const handleItemClick = (id: string) => {
    playNavPop(id);
    onNavigate(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between py-5 px-3">
      {/* Top Nav Items */}
      <div className="space-y-6">
        {/* Toggle Collapse Button for Desktop */}
        <div className="hidden lg:flex items-center justify-end px-2">
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-left transition-colors duration-150 group relative cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/15 via-[#EAFFF4] to-emerald-50/80 text-[#0F7F51] font-semibold border border-emerald-500/30 shadow-xs'
                    : 'text-[#6C7C75] hover:text-[#12201B] hover:bg-emerald-50/60'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#18A66A] text-white shadow-sm shadow-emerald-600/30'
                      : 'bg-white/80 text-slate-500 group-hover:text-[#18A66A] group-hover:bg-emerald-50 border border-slate-200/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm truncate transition-colors duration-150 ${isActive ? 'font-bold text-[#0F7F51]' : 'font-medium'}`}>
                      {item.label}
                    </p>
                    <p className="text-[11px] text-[#6C7C75] truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                )}

                {isActive && (
                  <span className="absolute right-2.5 w-1.5 h-6 bg-[#18A66A] rounded-full hidden lg:block" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Pro AI Assistant Card */}
      {!isCollapsed ? (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-[#EAFFF4] to-emerald-100/40 border border-emerald-500/20 backdrop-blur-md space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F7F51]">
            <Sparkles className="w-4 h-4 text-[#18A66A]" />
            <span>BioLens Companion</span>
          </div>
          <p className="text-xs text-[#12201B]/80 leading-relaxed">
            Need clarity on your labs or doctor questions?
          </p>
          <button
            onClick={onOpenAssistant}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-white bg-[#18A66A] hover:bg-[#0F7F51] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Ask BioLens Assistant
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            onClick={onOpenAssistant}
            className="p-3 bg-[#18A66A] text-white rounded-2xl shadow-md hover:bg-[#0F7F51] transition-colors cursor-pointer"
            title="Ask BioLens AI"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 h-[calc(100vh-4.5rem)] sticky top-18 bg-white/70 backdrop-blur-xl border-r border-emerald-500/12 transition-all duration-300 z-20 ${
          isCollapsed ? 'w-20' : 'w-68'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white/95 backdrop-blur-2xl border-r border-emerald-500/20 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-emerald-500/15 px-3 py-2 flex items-center justify-around shadow-xl"
        aria-label="Mobile Navigation"
      >
        <button
          onClick={() => handleItemClick('dashboard')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-colors duration-150 cursor-pointer ${
            currentPage === 'dashboard' ? 'text-[#0F7F51] font-bold' : 'text-[#6C7C75] hover:text-[#12201B]'
          }`}
        >
          {currentPage === 'dashboard' && (
            <span className="absolute inset-0 bg-[#EAFFF4] rounded-2xl -z-10 border border-emerald-500/25" />
          )}
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => handleItemClick('reports')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-colors duration-150 cursor-pointer ${
            currentPage === 'reports' ? 'text-[#0F7F51] font-bold' : 'text-[#6C7C75] hover:text-[#12201B]'
          }`}
        >
          {currentPage === 'reports' && (
            <span className="absolute inset-0 bg-[#EAFFF4] rounded-2xl -z-10 border border-emerald-500/25" />
          )}
          <FileText className="w-5 h-5" />
          <span className="text-[10px]">Reports</span>
        </button>

        <button
          onClick={() => handleItemClick('equipment')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-colors duration-150 cursor-pointer ${
            currentPage === 'equipment' ? 'text-[#0F7F51] font-bold' : 'text-[#6C7C75] hover:text-[#12201B]'
          }`}
        >
          {currentPage === 'equipment' && (
            <span className="absolute inset-0 bg-[#EAFFF4] rounded-2xl -z-10 border border-emerald-500/25" />
          )}
          <Camera className="w-5 h-5" />
          <span className="text-[10px]">Scan</span>
        </button>

        <button
          onClick={() => handleItemClick('profile')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-colors duration-150 cursor-pointer ${
            currentPage === 'profile' ? 'text-[#0F7F51] font-bold' : 'text-[#6C7C75] hover:text-[#12201B]'
          }`}
        >
          {currentPage === 'profile' && (
            <span className="absolute inset-0 bg-[#EAFFF4] rounded-2xl -z-10 border border-emerald-500/25" />
          )}
          <UserCheck className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>

        <button
          onClick={onOpenAssistant}
          className="relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-[#18A66A] active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0F7F51] to-[#18A66A] text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-[#0F7F51]">AI Chat</span>
        </button>
      </nav>
    </>
  );
};

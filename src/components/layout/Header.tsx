import React from 'react';
import { 
  Bell, 
  Settings, 
  User, 
  Sparkles, 
  Activity, 
  Menu, 
  LogOut,
  ChevronDown,
  Volume2,
  VolumeX
} from 'lucide-react';
import { UserProfile, AppNotification } from '../../types';
import { useSound } from '../../context/SoundContext';

interface HeaderProps {
  user: UserProfile;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onNavigateToProfile: () => void;
  onOpenMobileMenu: () => void;
  onLogout: () => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  notifications,
  onOpenNotifications,
  onOpenSettings,
  onNavigateToProfile,
  onOpenMobileMenu,
  onLogout
}) => {
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const { isSoundEnabled, toggleSound, soundPermission, requestPermission, playNavPop } = useSound();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-xl border-b border-emerald-500/12 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Mobile menu button + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* BioLens Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F7F51] via-[#18A66A] to-emerald-400 p-0.5 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#18A66A]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#12201B]">
                  Bio<span className="text-[#18A66A]">Lens</span>
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#6C7C75] font-semibold block -mt-1">
                Clinical Intelligence
              </span>
            </div>
          </div>
        </div>

        {/* Center: AI Health Assistant Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAFFF4] border border-emerald-500/20 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#18A66A] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#18A66A]"></span>
          </span>
          <span className="text-xs font-semibold text-[#0F7F51] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#18A66A]" />
            AI Health Assistant Ready
          </span>
        </div>

        {/* Right Action Icons: Sound, Notification, Settings, Profile Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Sound Control Button */}
          <button
            onClick={() => {
              if (soundPermission === 'prompt') {
                requestPermission();
              } else {
                toggleSound();
              }
            }}
            className={`p-2.5 rounded-2xl transition-all relative flex items-center justify-center cursor-pointer ${
              isSoundEnabled 
                ? 'text-[#0F7F51] bg-[#EAFFF4] hover:bg-emerald-100/80 border border-emerald-500/25 shadow-xs' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={
              soundPermission === 'prompt'
                ? 'Audio feedback: Click to configure permission'
                : isSoundEnabled 
                  ? 'Navigation audio active (Click to mute)' 
                  : 'Navigation audio muted (Click to enable)'
            }
            aria-label="Navigation sound effects"
          >
            {isSoundEnabled ? (
              <Volume2 className="w-5 h-5 text-[#18A66A]" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
            {isSoundEnabled && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#18A66A] ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 text-slate-600 hover:text-[#0F7F51] hover:bg-emerald-50 rounded-2xl transition-all cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#18A66A] text-[10px] font-bold text-white shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              playNavPop('Security & Privacy');
              onOpenSettings();
            }}
            className="p-2.5 text-slate-600 hover:text-[#0F7F51] hover:bg-emerald-50 rounded-2xl transition-all cursor-pointer"
            aria-label="Settings and Privacy"
          >
            <Settings className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-emerald-500/15 mx-0.5 hidden sm:block" />

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 pl-2 rounded-2xl hover:bg-emerald-50/80 transition-colors border border-transparent hover:border-emerald-500/20"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#18A66A] to-emerald-300 p-0.5 shadow-sm">
                <div className="w-full h-full bg-[#EAFFF4] rounded-[10px] flex items-center justify-center text-xs font-bold text-[#0F7F51]">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-[#12201B] leading-none">{user.name}</p>
                <p className="text-[11px] text-[#6C7C75] mt-0.5 leading-none">Blood {user.bloodGroup}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setUserMenuOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-emerald-500/20 shadow-xl py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-emerald-500/10">
                    <p className="text-xs font-bold text-[#12201B]">{user.name}</p>
                    <p className="text-[11px] text-[#6C7C75] truncate">{user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={() => {
                        playNavPop('My Health Profile');
                        setUserMenuOpen(false);
                        onNavigateToProfile();
                      }}
                      className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50/80 hover:text-[#0F7F51] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#18A66A]" />
                      My Health Profile
                    </button>
                    <button
                      onClick={() => {
                        playNavPop('Security & Privacy');
                        setUserMenuOpen(false);
                        onOpenSettings();
                      }}
                      className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50/80 hover:text-[#0F7F51] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-[#18A66A]" />
                      Privacy & Audit Vault
                    </button>
                  </div>

                  <div className="pt-1 border-t border-emerald-500/10">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

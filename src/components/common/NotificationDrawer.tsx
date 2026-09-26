import React from 'react';
import { X, Bell, Calendar, FileText, CheckCircle2, Clock } from 'lucide-react';
import { AppNotification } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white/95 backdrop-blur-2xl border-l border-emerald-500/20 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-emerald-500/15 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 to-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-[#0F7F51]">
                <Bell className="w-5 h-5 text-[#18A66A]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#12201B]">Notifications</h3>
                <p className="text-xs text-[#6C7C75]">Care reminders & report updates</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onMarkAllRead}
                className="text-xs font-semibold text-[#0F7F51] hover:underline px-2 py-1"
              >
                Mark all read
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-[#6C7C75]">
                <Bell className="w-10 h-10 mx-auto text-emerald-200 mb-3" />
                <p className="text-sm font-medium">No new notifications</p>
                <p className="text-xs text-[#6C7C75] mt-1">You're completely up to date with your care reminders.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.read
                      ? 'bg-white/60 border-slate-200/80 text-slate-700'
                      : 'bg-emerald-50/70 border-emerald-500/25 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white shadow-xs shrink-0 mt-0.5">
                      {item.type === 'appointment' && <Calendar className="w-4 h-4 text-[#18A66A]" />}
                      {item.type === 'report' && <FileText className="w-4 h-4 text-emerald-600" />}
                      {item.type === 'info' && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                      {item.type === 'alert' && <Bell className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-[#12201B] truncate">{item.title}</h4>
                        <span className="flex items-center gap-1 text-[11px] text-[#6C7C75] shrink-0">
                          <Clock className="w-3 h-3" />
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-[#12201B]/80 mt-1 leading-relaxed">{item.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-emerald-500/15 bg-white/80 text-center">
            <p className="text-xs text-[#6C7C75]">
              Notifications are kept private to your secure session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

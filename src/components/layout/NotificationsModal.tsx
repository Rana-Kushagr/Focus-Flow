import React from 'react';
import { Bell, CheckCheck, Flame, Calendar, Award, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearAllNotifications, unreadCount } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Flame className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'reminder':
        return <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-emerald-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-zinc-400 shrink-0" />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Notifications</h4>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 px-1.5 py-0.5 rounded-full font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400">
              No notifications yet. You're all caught up!
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                  !n.read ? 'bg-zinc-50/70 dark:bg-zinc-800/40' : 'hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20'
                }`}
              >
                <div className="mt-0.5 p-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 shadow-xs">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs ${!n.read ? 'font-semibold text-zinc-900 dark:text-zinc-100' : 'font-medium text-zinc-700 dark:text-zinc-300'}`}>
                      {n.title}
                    </p>
                    <span className="text-[10px] text-zinc-400">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {n.message}
                  </p>
                </div>
                {!n.read && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

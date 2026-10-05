import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Clock, 
  FileText, 
  Calendar, 
  BarChart3, 
  Settings, 
  Flame, 
  Sparkles,
  X 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDuration } from '../../utils/formatters';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { 
    tasks, 
    notes, 
    isRunning, 
    totalFocusMinutesToday, 
    userSettings 
  } = useApp();

  const pendingTasksCount = tasks.filter(t => !t.completed).length;
  const progressPercent = Math.min(100, Math.round((totalFocusMinutesToday / userSettings.dailyGoalMinutes) * 100));

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', path: '/dashboard/tasks', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined },
    { 
      label: 'Focus', 
      path: '/dashboard/focus', 
      icon: Clock, 
      live: isRunning 
    },
    { label: 'Notes', path: '/dashboard/notes', icon: FileText, badge: notes.length },
    { label: 'Calendar', path: '/dashboard/calendar', icon: Calendar },
    { label: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900/90 border-r border-zinc-200/80 dark:border-zinc-800/80 select-none">
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-zinc-100 dark:border-zinc-800/60">
        <NavLink to="/" title="Return to Homepage" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 shadow-xs transition-transform group-hover:scale-110">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <div>
            <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Focus<span className="text-brand-600 dark:text-brand-400">Flow</span>
            </span>
            <span className="block text-[10px] text-zinc-400 tracking-wider uppercase font-medium -mt-0.5">Workspace</span>
          </div>
        </NavLink>
        {onCloseMobile && (
          <button 
            onClick={onCloseMobile} 
            className="md:hidden p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav items */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className="w-4 h-4 shrink-0 transition-colors text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {item.live && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
                {item.badge !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono">
                    {item.badge}
                  </span>
                )}
              </div>
            </NavLink>
          );
        })}
      </div>

      {/* Study Streak & Daily Goal card */}
      <div className="p-3 border-t border-zinc-100 dark:border-zinc-800/60">
        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              7-Day Streak
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              {formatDuration(totalFocusMinutesToday)} / {formatDuration(userSettings.dailyGoalMinutes)}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-brand-600 dark:bg-brand-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-400 mt-2">
            {progressPercent >= 100 
              ? '🎉 Daily goal achieved!' 
              : `${progressPercent}% of today's study target completed`}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

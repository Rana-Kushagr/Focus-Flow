import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle2, FileText, Play, Sun, Moon, ArrowRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { getSubjectColor } from '../../utils/formatters';

export const CommandPalette: React.FC = () => {
  const { 
    searchOpen, 
    setSearchOpen, 
    tasks, 
    notes, 
    startTimer, 
    setActiveNoteId 
  } = useApp();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const items = useMemo(() => {
    const list: Array<{
      id: string;
      category: 'Pages' | 'Tasks' | 'Notes' | 'Actions';
      title: string;
      subtitle?: string;
      icon: React.ReactNode;
      onSelect: () => void;
    }> = [];

    // Quick Actions
    list.push({
      id: 'action-focus',
      category: 'Actions',
      title: 'Start 25m Focus Session',
      subtitle: 'Launches Pomodoro timer',
      icon: <Play className="w-4 h-4 text-emerald-500" />,
      onSelect: () => {
        startTimer();
        navigate('/dashboard/focus');
      },
    });

    list.push({
      id: 'action-theme',
      category: 'Actions',
      title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      subtitle: 'Change interface appearance',
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />,
      onSelect: () => {
        toggleTheme();
      },
    });

    // Navigation Pages
    const pages = [
      { name: 'Dashboard Overview', path: '/dashboard' },
      { name: 'Tasks List', path: '/dashboard/tasks' },
      { name: 'Focus Timer', path: '/dashboard/focus' },
      { name: 'Notes Workspace', path: '/dashboard/notes' },
      { name: 'Calendar Schedule', path: '/dashboard/calendar' },
      { name: 'Analytics & Insights', path: '/dashboard/analytics' },
      { name: 'Settings & Preferences', path: '/dashboard/settings' },
    ];

    pages.forEach((p) => {
      list.push({
        id: `page-${p.path}`,
        category: 'Pages',
        title: p.name,
        subtitle: `Jump to ${p.path}`,
        icon: <ArrowRight className="w-4 h-4 text-zinc-400" />,
        onSelect: () => navigate(p.path),
      });
    });

    // Tasks
    tasks.forEach((t) => {
      const subjectStyle = getSubjectColor(t.subject);
      list.push({
        id: `task-${t.id}`,
        category: 'Tasks',
        title: t.title,
        subtitle: `${t.subject} • ${t.completed ? 'Completed' : 'Pending'} • Due ${t.dueDate}`,
        icon: <CheckCircle2 className={`w-4 h-4 ${t.completed ? 'text-emerald-500' : 'text-zinc-400'}`} />,
        onSelect: () => navigate('/dashboard/tasks'),
      });
    });

    // Notes
    notes.forEach((n) => {
      list.push({
        id: `note-${n.id}`,
        category: 'Notes',
        title: n.title,
        subtitle: `${n.subject} • Note`,
        icon: <FileText className="w-4 h-4 text-blue-500" />,
        onSelect: () => {
          setActiveNoteId(n.id);
          navigate('/dashboard/notes');
        },
      });
    });

    if (!query.trim()) {
      return list.slice(0, 10);
    }

    const q = query.toLowerCase();
    return list.filter((item) => 
      item.title.toLowerCase().includes(q) || 
      item.subtitle?.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [query, tasks, notes, theme, startTimer, toggleTheme, navigate, setActiveNoteId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
    } else if (e.key === 'Enter' && items[selectedIndex]) {
      e.preventDefault();
      items[selectedIndex].onSelect();
      setSearchOpen(false);
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs" 
        onClick={() => setSearchOpen(false)} 
      />

      <div 
        className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-100"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <Search className="w-4 h-4 text-zinc-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search tasks, notes, pages..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
          <button 
            onClick={() => setSearchOpen(false)} 
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-transparent">
          {items.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400">
              No matching tasks, notes, or actions found for "{query}".
            </div>
          ) : (
            items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onSelect();
                  setSearchOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                  selectedIndex === idx 
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">{item.icon}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">{item.subtitle}</p>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium ml-2 shrink-0">
                  {item.category}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span>Use <kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px]">↓</kbd> to navigate</span>
            <span>•</span>
            <span><kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px]">Enter</kbd> to select</span>
          </div>
          <div><kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px]">ESC</kbd> to close</div>
        </div>
      </div>
    </div>
  );
};

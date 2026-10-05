import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Task, 
  Note, 
  FocusSession, 
  UserSettings, 
  AppNotification, 
  Subject, 
  FocusMode 
} from '../types';
import { 
  initialTasks, 
  initialNotes, 
  initialFocusSessions, 
  initialUserSettings, 
  initialNotifications 
} from '../data/mockData';
import { sound } from '../utils/audio';

interface AppContextType {
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed' | 'completedPomodoros'>) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Notes
  notes: Note[];
  activeNoteId: string | null;
  setActiveNoteId: (id: string | null) => void;
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Focus & Timer
  timerMode: FocusMode;
  setTimerMode: (mode: FocusMode) => void;
  timeLeft: number;
  isRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
  selectedSubject: Subject;
  setSelectedSubject: (subject: Subject) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (taskId: string | null) => void;
  isZenMode: boolean;
  setIsZenMode: (zen: boolean) => void;
  focusSessions: FocusSession[];
  totalFocusMinutesToday: number;
  sessionsCompletedToday: number;

  // User Settings
  userSettings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetToDefaults: () => void;

  // Notifications & Command Palette
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Utility
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('focusflow_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  // Load notes
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('focusflow_notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });
  const [activeNoteId, setActiveNoteId] = useState<string | null>(() => notes[0]?.id || null);

  // Load focus sessions
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('focusflow_sessions');
    return saved ? JSON.parse(saved) : initialFocusSessions;
  });

  // Load settings
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('focusflow_settings');
    return saved ? JSON.parse(saved) : initialUserSettings;
  });

  // Load notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('focusflow_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Global search modal
  const [searchOpen, setSearchOpen] = useState(false);

  // Focus timer state
  const [timerMode, setTimerModeState] = useState<FocusMode>('pomodoro');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Mathematics');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isZenMode, setIsZenMode] = useState(false);

  // Calculate default mode seconds
  const getModeSeconds = useCallback((mode: FocusMode, settings: UserSettings): number => {
    switch (mode) {
      case 'pomodoro':
        return settings.pomodoroMinutes * 60;
      case 'short_break':
        return settings.shortBreakMinutes * 60;
      case 'long_break':
        return settings.longBreakMinutes * 60;
    }
  }, []);

  const [timeLeft, setTimeLeft] = useState<number>(() => getModeSeconds('pomodoro', userSettings));

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('focusflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('focusflow_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('focusflow_sessions', JSON.stringify(focusSessions));
  }, [focusSessions]);

  useEffect(() => {
    localStorage.setItem('focusflow_settings', JSON.stringify(userSettings));
  }, [userSettings]);

  useEffect(() => {
    localStorage.setItem('focusflow_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Ambient sound management
  useEffect(() => {
    if (isRunning && userSettings.ambientSound !== 'none') {
      sound.startAmbient(userSettings.ambientSound, userSettings.ambientVolume);
    } else {
      sound.stopAmbient();
    }
    return () => {
      sound.stopAmbient();
    };
  }, [isRunning, userSettings.ambientSound, userSettings.ambientVolume]);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'],
      });
    } catch {
      // ignore
    }
  }, []);

  // Complete a focus session
  const handleSessionComplete = useCallback(() => {
    if (userSettings.soundEnabled) {
      sound.playChime();
    }
    triggerConfetti();

    const duration = 
      timerMode === 'pomodoro' 
        ? userSettings.pomodoroMinutes 
        : timerMode === 'short_break' 
        ? userSettings.shortBreakMinutes 
        : userSettings.longBreakMinutes;

    const matchedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : undefined;

    const newSession: FocusSession = {
      id: `fs-${Date.now()}`,
      subject: selectedSubject,
      taskId: selectedTaskId || undefined,
      taskTitle: matchedTask?.title,
      durationMinutes: duration,
      timestamp: new Date().toISOString(),
      mode: timerMode,
      completed: true,
    };

    setFocusSessions(prev => [newSession, ...prev]);

    // If pomodoro completed on a specific task, increment pomodoro count
    if (timerMode === 'pomodoro' && selectedTaskId) {
      setTasks(prev => prev.map(t => {
        if (t.id === selectedTaskId) {
          const newCompleted = t.completedPomodoros + 1;
          return {
            ...t,
            completedPomodoros: newCompleted,
            completed: newCompleted >= t.estimatedPomodoros ? true : t.completed,
          };
        }
        return t;
      }));
    }

    // Add notification
    const completionNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: timerMode === 'pomodoro' ? 'Focus Session Completed! 🎯' : 'Break Finished ⚡',
      message: timerMode === 'pomodoro' 
        ? `Great focus! You completed ${duration} minutes on ${selectedSubject}.`
        : 'Ready for another session? Your mind is recharged.',
      time: 'Just now',
      read: false,
      type: 'achievement',
    };
    setNotifications(prev => [completionNotif, ...prev]);

    // Transition mode
    if (timerMode === 'pomodoro') {
      setTimerModeState('short_break');
      setTimeLeft(userSettings.shortBreakMinutes * 60);
    } else {
      setTimerModeState('pomodoro');
      setTimeLeft(userSettings.pomodoroMinutes * 60);
    }

    setIsRunning(false);
  }, [
    timerMode, 
    userSettings, 
    selectedSubject, 
    selectedTaskId, 
    tasks, 
    triggerConfetti
  ]);

  // Timer tick effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, handleSessionComplete]);

  // Keyboard shortcut for Cmd/Ctrl+K global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isZenMode) {
        setIsZenMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZenMode]);

  // Actions
  const setTimerMode = (mode: FocusMode) => {
    setIsRunning(false);
    setTimerModeState(mode);
    setTimeLeft(getModeSeconds(mode, userSettings));
  };

  const startTimer = () => {
    sound.playClick();
    setIsRunning(true);
  };

  const pauseTimer = () => {
    sound.playClick();
    setIsRunning(false);
  };

  const resetTimer = () => {
    sound.playClick();
    setIsRunning(false);
    setTimeLeft(getModeSeconds(timerMode, userSettings));
  };

  const skipTimer = () => {
    sound.playClick();
    setIsRunning(false);
    if (timerMode === 'pomodoro') {
      setTimerModeState('short_break');
      setTimeLeft(userSettings.shortBreakMinutes * 60);
    } else {
      setTimerModeState('pomodoro');
      setTimeLeft(userSettings.pomodoroMinutes * 60);
    }
  };

  const addTask = (newTask: Omit<Task, 'id' | 'completed' | 'completedPomodoros'>) => {
    const created: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      completed: false,
      completedPomodoros: 0,
    };
    setTasks(prev => [created, ...prev]);
  };

  const toggleTask = (id: string) => {
    sound.playClick();
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          triggerConfetti();
        }
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined,
        };
      }
      return t;
    }));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addNote = (newNote: Omit<Note, 'id' | 'updatedAt'>): string => {
    const id = `note-${Date.now()}`;
    const created: Note = {
      ...newNote,
      id,
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [created, ...prev]);
    setActiveNoteId(id);
    return id;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        return {
          ...n,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return n;
    }));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => {
      const filtered = prev.filter(n => n.id !== id);
      if (activeNoteId === id) {
        setActiveNoteId(filtered[0]?.id || null);
      }
      return filtered;
    });
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setUserSettings(prev => {
      const next = { ...prev, ...updates };
      // If timer isn't running and current duration changed, reset timeLeft
      if (!isRunning) {
        setTimeLeft(getModeSeconds(timerMode, next));
      }
      return next;
    });
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setTasks(initialTasks);
    setNotes(initialNotes);
    setFocusSessions(initialFocusSessions);
    setUserSettings(initialUserSettings);
    setNotifications(initialNotifications);
    setActiveNoteId(initialNotes[0].id);
    setTimeLeft(initialUserSettings.pomodoroMinutes * 60);
    setIsRunning(false);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Derived stats
  const todayStr = new Date().toISOString().split('T')[0];

  const totalFocusMinutesToday = useMemo(() => {
    return focusSessions
      .filter(s => s.timestamp.startsWith(todayStr) && s.mode === 'pomodoro' && s.completed)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  }, [focusSessions, todayStr]);

  const sessionsCompletedToday = useMemo(() => {
    return focusSessions
      .filter(s => s.timestamp.startsWith(todayStr) && s.mode === 'pomodoro' && s.completed)
      .length;
  }, [focusSessions, todayStr]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  return (
    <AppContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        updateTask,
        deleteTask,
        notes,
        activeNoteId,
        setActiveNoteId,
        addNote,
        updateNote,
        deleteNote,
        timerMode,
        setTimerMode,
        timeLeft,
        isRunning,
        startTimer,
        pauseTimer,
        resetTimer,
        skipTimer,
        selectedSubject,
        setSelectedSubject,
        selectedTaskId,
        setSelectedTaskId,
        isZenMode,
        setIsZenMode,
        focusSessions,
        totalFocusMinutesToday,
        sessionsCompletedToday,
        userSettings,
        updateSettings,
        resetToDefaults,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        unreadCount,
        searchOpen,
        setSearchOpen,
        triggerConfetti,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

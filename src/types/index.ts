export type Priority = 'low' | 'medium' | 'high';

export type Subject = 
  | 'Mathematics' 
  | 'Physics' 
  | 'Computer Science' 
  | 'Biology' 
  | 'History' 
  | 'Chemistry' 
  | 'Literature';

export interface Task {
  id: string;
  title: string;
  subject: Subject;
  priority: Priority;
  dueDate: string; // ISO date YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  description?: string;
}

export interface Note {
  id: string;
  title: string;
  subject: Subject;
  content: string;
  updatedAt: string;
  isPinned?: boolean;
}

export type FocusMode = 'pomodoro' | 'short_break' | 'long_break';

export interface FocusSession {
  id: string;
  subject: Subject;
  taskId?: string;
  taskTitle?: string;
  durationMinutes: number;
  timestamp: string; // ISO string
  mode: FocusMode;
  completed: boolean;
}

export interface UserSettings {
  name: string;
  email: string;
  university: string;
  major: string;
  avatarUrl: string;
  dailyGoalMinutes: number;
  pomodoroMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  autoStartBreaks: boolean;
  soundEnabled: boolean;
  ambientSound: 'none' | 'rain' | 'whitenoise' | 'binaural';
  ambientVolume: number; // 0 to 1
  backgroundPattern: 'grid' | 'dots' | 'clean';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'reminder' | 'streak' | 'achievement' | 'system';
}

export interface SubjectStat {
  subject: Subject;
  hours: number;
  color: string;
}

export interface DailyFocusStat {
  day: string; // Mon, Tue, etc.
  fullDate: string;
  hours: number;
  targetHours: number;
}

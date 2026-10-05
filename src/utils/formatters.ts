import { Priority, Subject } from '../types';
import { SUBJECT_COLORS } from '../data/mockData';

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMins}m`;
};

export const formatDueDate = (dateStr: string): { label: string; isOverdue: boolean } => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (dateStr === today) {
    return { label: 'Today', isOverdue: false };
  }
  if (dateStr === tomorrow) {
    return { label: 'Tomorrow', isOverdue: false };
  }
  if (dateStr === yesterday) {
    return { label: 'Yesterday', isOverdue: true };
  }

  const date = new Date(dateStr);
  const isOverdue = dateStr < today;
  const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { label: formatted, isOverdue };
};

export const getPriorityBadge = (priority: Priority): { label: string; className: string } => {
  switch (priority) {
    case 'high':
      return {
        label: 'High',
        className: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/60',
      };
    case 'medium':
      return {
        label: 'Medium',
        className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60',
      };
    case 'low':
      return {
        label: 'Low',
        className: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
      };
  }
};

export const getSubjectColor = (subject: Subject | string) => {
  return SUBJECT_COLORS[subject] || {
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    text: 'text-zinc-700 dark:text-zinc-300',
    border: 'border-zinc-200 dark:border-zinc-700',
    hex: '#71717a',
  };
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  Clock, 
  CheckSquare, 
  ArrowRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  FileText, 
  Calendar as CalendarIcon, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDuration, formatTime, getPriorityBadge, getSubjectColor } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Subject, Priority } from '../../types';

export const OverviewPage: React.FC = () => {
  const { 
    userSettings, 
    tasks, 
    toggleTask, 
    addTask, 
    timerMode, 
    timeLeft, 
    isRunning, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    selectedSubject, 
    totalFocusMinutesToday, 
    notes, 
    setActiveNoteId 
  } = useApp();

  const navigate = useNavigate();

  // Quick task input state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickSubject, setQuickSubject] = useState<Subject>('Mathematics');

  // Filter tasks for today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.dueDate === todayStr || !t.completed);
  const completedTodayCount = tasks.filter(t => t.completed && t.dueDate === todayStr).length;

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addTask({
      title: quickTitle.trim(),
      subject: quickSubject,
      priority: 'medium' as Priority,
      dueDate: todayStr,
      estimatedPomodoros: 2,
    });
    setQuickTitle('');
  };

  // Get dynamic greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {greeting}, {userSettings.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Here's your productivity overview. You have {todayTasks.filter(t => !t.completed).length} pending tasks for today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            icon={<FileText className="w-3.5 h-3.5" />}
            onClick={() => navigate('/dashboard/notes')}
          >
            Open Notes
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            icon={<Play className="w-3.5 h-3.5" />}
            onClick={() => navigate('/dashboard/focus')}
          >
            Full Focus Mode
          </Button>
        </div>
      </div>

      {/* 3 Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tasks Card */}
        <div 
          onClick={() => navigate('/dashboard/tasks')}
          className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group hero-card-silver"
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span className="font-medium">Today's Tasks</span>
            <CheckSquare className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
              {tasks.length}
            </span>
            <span className="text-xs text-zinc-400">
              ({tasks.filter(t => t.completed).length} done)
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{completedTodayCount} completed today</span>
          </div>
        </div>

        {/* Focus Card */}
        <div 
          onClick={() => navigate('/dashboard/focus')}
          className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group hero-card-silver"
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span className="font-medium">Focus Time</span>
            <Clock className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
              {formatDuration(totalFocusMinutesToday)}
            </span>
            <span className="text-xs text-zinc-400">
              / {formatDuration(userSettings.dailyGoalMinutes)}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>{Math.round((totalFocusMinutesToday / userSettings.dailyGoalMinutes) * 100)}% of daily target</span>
          </div>
        </div>

        {/* Streak Card */}
        <div 
          onClick={() => navigate('/dashboard/analytics')}
          className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group hero-card-silver"
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span className="font-medium">Productivity Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
              7
            </span>
            <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">days</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consistent daily study session!</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Tasks (left) & Focus Session Quick Widget (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hero-card-silver">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-zinc-500" />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Today's Tasks</h3>
              </div>
              <button 
                onClick={() => navigate('/dashboard/tasks')}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                View all tasks <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Tasks list */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 mt-2">
              {todayTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400">
                  All tasks completed for today! 🎉
                </div>
              ) : (
                todayTasks.map((t) => {
                  const priority = getPriorityBadge(t.priority);
                  const subjectStyle = getSubjectColor(t.subject);

                  return (
                    <div
                      key={t.id}
                      className="py-3 flex items-center justify-between gap-3 group transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          onClick={() => toggleTask(t.id)}
                          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors shrink-0 cursor-pointer"
                        >
                          {t.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950/40" />
                          ) : (
                            <Circle className="w-5 h-5 text-zinc-300 dark:text-zinc-700 hover:text-zinc-500" />
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-xs font-medium truncate transition-all ${
                              t.completed
                                ? 'line-through text-zinc-400 dark:text-zinc-500'
                                : 'text-zinc-800 dark:text-zinc-200'
                            }`}
                          >
                            {t.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${subjectStyle.bg} ${subjectStyle.text} ${subjectStyle.border}`}>
                          {t.subject}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${priority.className}`}>
                          {priority.label}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick add inline task input */}
            <form onSubmit={handleQuickAdd} className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2">
              <input
                type="text"
                placeholder="Quick add a task for today..."
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/70 rounded-lg px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
              />
              <select
                value={quickSubject}
                onChange={(e) => setQuickSubject(e.target.value as Subject)}
                className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/70 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Biology">Biology</option>
                <option value="History">History</option>
                <option value="Chemistry">Chemistry</option>
              </select>
              <Button type="submit" size="sm" variant="primary" icon={<Plus className="w-3.5 h-3.5" />}>
                Add
              </Button>
            </form>
          </div>

          {/* Recent Notes Snippet */}
          <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hero-card-silver">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-500" />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Study Notes</h3>
              </div>
              <button 
                onClick={() => navigate('/dashboard/notes')}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                Open notebook <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {notes.slice(0, 2).map((n) => {
                const style = getSubjectColor(n.subject);
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      setActiveNoteId(n.id);
                      navigate('/dashboard/notes');
                    }}
                    className="p-3.5 rounded-lg border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${style.bg} ${style.text} ${style.border}`}>
                        {n.subject}
                      </span>
                      <span className="text-[10px] text-zinc-400">2h ago</span>
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-2 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {n.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {n.content.replace(/[#*`$\\]/g, '').slice(0, 90)}...
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Focus Session Quick Widget & Upcoming Deadlines */}
        <div className="space-y-6">
          {/* Quick Focus Widget */}
          <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle text-center relative overflow-hidden hero-card-silver">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                {timerMode === 'pomodoro' ? 'Focus Session' : 'Rest Break'}
              </span>
              <span className="font-medium text-brand-600 dark:text-brand-400">
                {selectedSubject}
              </span>
            </div>

            {/* Big Countdown */}
            <div className="my-6">
              <span className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center justify-center gap-3">
              {isRunning ? (
                <Button 
                  onClick={pauseTimer} 
                  variant="primary" 
                  size="md" 
                  icon={<Pause className="w-4 h-4" />}
                  className="w-28"
                >
                  Pause
                </Button>
              ) : (
                <Button 
                  onClick={startTimer} 
                  variant="primary" 
                  size="md" 
                  icon={<Play className="w-4 h-4" />}
                  className="w-28"
                >
                  Start
                </Button>
              )}
              <Button 
                onClick={resetTimer} 
                variant="outline" 
                size="md" 
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                title="Reset timer"
              />
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
              <span>Today's focus:</span>
              <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                {formatDuration(totalFocusMinutesToday)}
              </span>
            </div>
          </div>

          {/* Upcoming Schedule Card */}
          <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hero-card-silver">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-zinc-500" />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Upcoming Deadlines</h3>
              </div>
              <button 
                onClick={() => navigate('/dashboard/calendar')}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                Calendar <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">Dijkstra & A* algorithms</p>
                  <p className="text-[10px] text-zinc-400">Computer Science</p>
                </div>
                <Badge variant="warning" size="sm">Tomorrow</Badge>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">Enlightenment presentation</p>
                  <p className="text-[10px] text-zinc-400">History</p>
                </div>
                <Badge variant="subtle" size="sm">In 2 days</Badge>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">Spectroscopy workbook</p>
                  <p className="text-[10px] text-zinc-400">Chemistry</p>
                </div>
                <Badge variant="subtle" size="sm">In 3 days</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

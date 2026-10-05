import React, { useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Subject, FocusMode } from '../../types';
import { formatTime, formatDuration, getSubjectColor } from '../../utils/formatters';
import { Button } from '../../components/common/Button';

export const FocusPage: React.FC = () => {
  const {
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
    totalFocusMinutesToday,
    sessionsCompletedToday,
    userSettings,
    updateSettings,
    tasks,
  } = useApp();

  // Keyboard shortcut: Spacebar to toggle Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) {
          pauseTimer();
        } else {
          startTimer();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, startTimer, pauseTimer]);

  // Mode total seconds for calculating progress percentage
  const totalSeconds = 
    timerMode === 'pomodoro'
      ? userSettings.pomodoroMinutes * 60
      : timerMode === 'short_break'
      ? userSettings.shortBreakMinutes * 60
      : userSettings.longBreakMinutes * 60;

  const elapsedSeconds = totalSeconds - timeLeft;
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedSeconds / totalSeconds) * 100)));

  // SVG circular ring calculation
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const currentTask = tasks.find(t => t.id === selectedTaskId);
  const subjectStyle = getSubjectColor(selectedSubject);

  return (
    <div className={`relative flex flex-col items-center justify-center transition-all overflow-hidden ${
      isZenMode 
        ? 'fixed inset-0 z-50 bg-white dark:bg-zinc-950 p-6 flex flex-col justify-center' 
        : 'py-6 sm:py-10 max-w-2xl mx-auto rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-xs'
    }`}>
      {/* Dynamic ambient glow behind the timer */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
        isRunning ? 'opacity-100 scale-105' : 'opacity-40'
      } ${timerMode === 'pomodoro' ? 'ambient-spotlight' : 'ambient-focus-glow'}`} />

      {/* Top Bar for Zen Mode / Fullscreen */}
      <div className="relative z-10 w-full flex items-center justify-between mb-8 max-w-lg">
        {/* Mode selector pills */}
        <div className="flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-900 p-1 border border-zinc-200/60 dark:border-zinc-800 text-xs">
          <button
            onClick={() => setTimerMode('pomodoro')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              timerMode === 'pomodoro'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Focus (25m)
          </button>
          <button
            onClick={() => setTimerMode('short_break')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              timerMode === 'short_break'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => setTimerMode('long_break')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              timerMode === 'long_break'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Zen mode toggle button */}
        <button
          onClick={() => setIsZenMode(!isZenMode)}
          className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title={isZenMode ? 'Exit Zen Mode (ESC)' : 'Enter Zen Distraction-Free Mode'}
        >
          {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Focus Card / Center Area */}
      <div className="relative flex flex-col items-center text-center w-full max-w-md">
        {/* Subtle status label */}
        <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">
          {timerMode === 'pomodoro' ? 'Focus Session' : 'Recharge Break'}
        </span>

        {/* Circular Timer Ring with Restrained Aesthetics */}
        <div className="relative my-6 flex items-center justify-center">
          <svg className="w-72 h-72 sm:w-80 sm:h-80 -rotate-90 transform">
            {/* Background track */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              className="text-zinc-200/70 dark:text-zinc-800/80 stroke-current"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Animated progress ring */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className={`transition-all duration-500 ${
                timerMode === 'pomodoro' 
                  ? 'text-zinc-900 dark:text-zinc-100' 
                  : 'text-emerald-500 dark:text-emerald-400'
              }`}
            />
          </svg>

          {/* Central Counter Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
              {formatTime(timeLeft)}
            </span>

            {/* Subject Selector or Label */}
            <div className="mt-3 flex items-center gap-1.5">
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${subjectStyle.bg} ${subjectStyle.text} ${subjectStyle.border}`}>
                {selectedSubject}
              </span>
            </div>

            {/* Attached Task snippet if any */}
            {currentTask && (
              <span className="text-xs text-zinc-400 mt-2 max-w-[200px] truncate">
                {currentTask.title}
              </span>
            )}
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <Button
            onClick={resetTimer}
            variant="outline"
            size="md"
            icon={<RotateCcw className="w-4 h-4" />}
            title="Reset session"
          />

          {isRunning ? (
            <Button
              onClick={pauseTimer}
              variant="primary"
              size="lg"
              icon={<Pause className="w-5 h-5" />}
              className="w-36 shadow-md"
            >
              Pause
            </Button>
          ) : (
            <Button
              onClick={startTimer}
              variant="primary"
              size="lg"
              icon={<Play className="w-5 h-5" />}
              className="w-36 shadow-md"
            >
              Start
            </Button>
          )}

          <Button
            onClick={skipTimer}
            variant="outline"
            size="md"
            icon={<SkipForward className="w-4 h-4" />}
            title="Skip to next"
          />
        </div>

        <p className="text-[11px] text-zinc-400 mt-3">
          Tip: Press <kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono text-[10px]">Space</kbd> to toggle start & pause
        </p>

        {/* Subject & Task Linker controls */}
        <div className="w-full mt-8 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/80 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="w-full sm:w-1/2">
              <label className="block text-zinc-400 text-[11px] mb-1 font-medium text-left">
                Active Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as Subject)}
                className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Biology">Biology</option>
                <option value="History">History</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Literature">Literature</option>
              </select>
            </div>

            <div className="w-full sm:w-1/2">
              <label className="block text-zinc-400 text-[11px] mb-1 font-medium text-left">
                Link to Task (Optional)
              </label>
              <select
                value={selectedTaskId || ''}
                onChange={(e) => setSelectedTaskId(e.target.value || null)}
                className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
              >
                <option value="">No task selected</option>
                {tasks.filter(t => !t.completed).map(t => (
                  <option key={t.id} value={t.id}>
                    {t.title.slice(0, 30)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ambient Sound Controller */}
          <div className="pt-3 border-t border-zinc-200/50 dark:border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {userSettings.ambientSound === 'none' ? (
                <VolumeX className="w-4 h-4 text-zinc-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              )}
              <span className="text-zinc-600 dark:text-zinc-400 text-xs font-medium">
                Ambient Soundscape:
              </span>
            </div>

            <select
              value={userSettings.ambientSound}
              onChange={(e) => updateSettings({ ambientSound: e.target.value as 'none' | 'rain' | 'whitenoise' | 'binaural' })}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
            >
              <option value="none">Muted / Silence</option>
              <option value="rain">Gentle Rain (Pink Noise)</option>
              <option value="whitenoise">Pure White Noise</option>
              <option value="binaural">10Hz Alpha Waves (Binaural)</option>
            </select>
          </div>
        </div>

        {/* Daily Stats Summary */}
        <div className="mt-8 flex items-center justify-around w-full py-4 border-t border-zinc-200/80 dark:border-zinc-800 text-center">
          <div>
            <p className="text-[11px] text-zinc-400">Today's Focus</p>
            <p className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
              {formatDuration(totalFocusMinutesToday)}
            </p>
          </div>

          <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800" />

          <div>
            <p className="text-[11px] text-zinc-400">Sessions Finished</p>
            <p className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
              {sessionsCompletedToday}
            </p>
          </div>

          <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800" />

          <div>
            <p className="text-[11px] text-zinc-400">Daily Target</p>
            <p className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
              {formatDuration(userSettings.dailyGoalMinutes)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

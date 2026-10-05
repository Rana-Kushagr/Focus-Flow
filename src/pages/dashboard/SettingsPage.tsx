import React, { useState } from 'react';
import { 
  User, 
  Moon, 
  Sun, 
  Bell, 
  Sliders, 
  Download, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/common/Button';

export const SettingsPage: React.FC = () => {
  const { userSettings, updateSettings, resetToDefaults, tasks, notes, focusSessions } = useApp();
  const { theme, setTheme } = useTheme();

  const [savedBanner, setSavedBanner] = useState(false);

  // Form states
  const [name, setName] = useState(userSettings.name);
  const [email, setEmail] = useState(userSettings.email);
  const [university, setUniversity] = useState(userSettings.university);
  const [major, setMajor] = useState(userSettings.major);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(userSettings.dailyGoalMinutes);
  const [pomodoroMinutes, setPomodoroMinutes] = useState(userSettings.pomodoroMinutes);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(userSettings.shortBreakMinutes);
  const [longBreakMinutes, setLongBreakMinutes] = useState(userSettings.longBreakMinutes);
  const [soundEnabled, setSoundEnabled] = useState(userSettings.soundEnabled);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      name,
      email,
      university,
      major,
      dailyGoalMinutes: Number(dailyGoalMinutes),
      pomodoroMinutes: Number(pomodoroMinutes),
      shortBreakMinutes: Number(shortBreakMinutes),
      longBreakMinutes: Number(longBreakMinutes),
      soundEnabled,
    });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  const handleExportJSON = () => {
    const data = {
      userSettings,
      tasks,
      notes,
      focusSessions,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Settings & Preferences
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Customize your study session timings, interface appearance, and manage workspace data.
        </p>
      </div>

      {savedBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>Preferences saved successfully to local storage!</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Section */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <User className="w-4 h-4 text-zinc-500" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Student Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                University / Institution
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Major / Field of Study
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <Moon className="w-4 h-4 text-zinc-500" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Appearance & Theme</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                theme === 'light'
                  ? 'border-zinc-900 dark:border-zinc-100 ring-2 ring-zinc-900/10 dark:ring-zinc-100/10 bg-zinc-50'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-900">Light Mode</p>
                  <p className="text-[11px] text-zinc-500">Crisp, paper-like clarity</p>
                </div>
              </div>
              {theme === 'light' && <Check className="w-4 h-4 text-zinc-900" />}
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                theme === 'dark'
                  ? 'border-zinc-100 ring-2 ring-zinc-100/20 bg-zinc-800'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-800 text-zinc-200">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-100">Dark Mode</p>
                  <p className="text-[11px] text-zinc-400">Deep charcoal, easy on eyes</p>
                </div>
              </div>
              {theme === 'dark' && <Check className="w-4 h-4 text-zinc-100" />}
            </button>
          </div>

          {/* Background Pattern Customizer */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Workspace Background Pattern
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'grid', label: 'Architectural Grid', desc: 'Fine technical graph lines' },
                { id: 'dots', label: 'Dot Matrix', desc: 'Subtle spaced dot field' },
                { id: 'clean', label: 'Minimalist Solid', desc: 'Flat distraction-free' },
              ].map((pattern) => (
                <button
                  key={pattern.id}
                  type="button"
                  onClick={() => updateSettings({ backgroundPattern: pattern.id as 'grid' | 'dots' | 'clean' })}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    userSettings.backgroundPattern === pattern.id
                      ? 'border-brand-600 dark:border-brand-400 bg-brand-50/40 dark:bg-brand-950/30'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{pattern.label}</span>
                    {userSettings.backgroundPattern === pattern.id && (
                      <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{pattern.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Study Timer Preferences */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <Sliders className="w-4 h-4 text-zinc-500" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Pomodoro Timer Durations</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Focus Session (min)
              </label>
              <input
                type="number"
                min="5"
                max="90"
                value={pomodoroMinutes}
                onChange={(e) => setPomodoroMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Short Break (min)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={shortBreakMinutes}
                onChange={(e) => setShortBreakMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Long Break (min)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={longBreakMinutes}
                onChange={(e) => setLongBreakMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Daily Study Goal (min)
              </label>
              <input
                type="number"
                min="30"
                max="600"
                step="30"
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">Session Chime Sound</p>
              <p className="text-[11px] text-zinc-400">Play crystal chime when a focus session or break ends</p>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end">
          <Button type="submit" variant="primary" size="md">
            Save Changes
          </Button>
        </div>
      </form>

      {/* Data Management Section */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <ShieldCheck className="w-4 h-4 text-zinc-500" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Data & Storage Management</h3>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">Export Workspace Data</p>
            <p className="text-[11px] text-zinc-400">Download a full JSON backup of all your tasks, notes, and study sessions.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportJSON}
          >
            Export Backup (.json)
          </Button>
        </div>

        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-rose-600 dark:text-rose-400">Reset Demo Data</p>
            <p className="text-[11px] text-zinc-400">Reset tasks, notes, and analytics back to initial starter data.</p>
          </div>
          <Button
            type="button"
            variant="danger"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => {
              if (window.confirm('Reset all tasks, notes, and sessions back to initial state?')) {
                resetToDefaults();
              }
            }}
          >
            Reset to Sample Data
          </Button>
        </div>
      </div>
    </div>
  );
};

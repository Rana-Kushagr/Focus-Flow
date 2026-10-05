import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Clock, 
  FileText, 
  BarChart3, 
  Calendar, 
  Shield, 
  Sun, 
  Moon, 
  Play, 
  Pause, 
  Check, 
  BookOpen, 
  CheckSquare 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/common/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Interactive preview state directly on the landing page
  const [activePreviewTab, setActivePreviewTab] = useState<'overview' | 'focus' | 'notes'>('overview');
  const [mockChecked, setMockChecked] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: true,
  });
  const [mockTimerRunning, setMockTimerRunning] = useState(false);
  const [mockTimerSeconds, setMockTimerSeconds] = useState(1477); // 24:37

  const toggleMockCheck = (index: number) => {
    setMockChecked(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const formatMockTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-brand-500 selection:text-white transition-colors overflow-hidden">
      {/* Background Architectural Grid & Subtle Radial Spotlight */}
      <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none opacity-80" />
      <div className="absolute inset-x-0 top-0 h-[600px] ambient-spotlight pointer-events-none" />

      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 shadow-xs transition-transform group-hover:scale-105">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <span className="text-base font-bold tracking-tight">
              Focus<span className="text-brand-600 dark:text-brand-400">Flow</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Features</a>
            <a href="#preview" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Product Preview</a>
            <a href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">How It Works</a>
            <a href="#reviews" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Testimonials</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Toggle dark/light mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="hidden sm:inline-flex"
            >
              Log In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Explore Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-xs border border-zinc-200/90 dark:border-zinc-800 text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-6 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Modern Student Productivity Platform
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.12]">
          Study with intention.<br />
          <span className="text-zinc-400 dark:text-zinc-500">Get more done.</span>
        </h1>

        {/* Subtext */}
        <p className="mt-5 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          FocusFlow brings your tasks, study sessions, notes and progress into one focused workspace. Distraction-free by design, built for academic excellence.
        </p>

        {/* Hero Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/login?mode=signup')}
            icon={<Sparkles className="w-4 h-4" />}
            className="shadow-md"
          >
            Start Studying
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/dashboard')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Explore Dashboard
          </Button>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          No credit card required • Instant 1-click evaluation access
        </p>
      </section>

      {/* 3. Product Preview Mockup (Interactive Shell) */}
      <section id="preview" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden transition-all">
          {/* Mockup Titlebar with Browser Dots & Tab Controls */}
          <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200/70 dark:border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="ml-2 text-xs font-mono text-zinc-400">focusflow.app/dashboard</span>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex items-center bg-zinc-200/70 dark:bg-zinc-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setActivePreviewTab('overview')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activePreviewTab === 'overview'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActivePreviewTab('focus')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activePreviewTab === 'focus'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                Focus Mode
              </button>
              <button
                onClick={() => setActivePreviewTab('notes')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activePreviewTab === 'notes'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                Notes
              </button>
            </div>
          </div>

          {/* Mockup Body Content */}
          <div className="p-6 sm:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
            {activePreviewTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Greeting & Stat Cards */}
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Good afternoon, Alex
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Here's your productivity overview
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <p className="text-xs text-zinc-400 font-medium">Tasks</p>
                    <p className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">12</p>
                    <p className="text-[11px] text-emerald-600 mt-1">5 completed today</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <p className="text-xs text-zinc-400 font-medium">Focus</p>
                    <p className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">3h 42m</p>
                    <p className="text-[11px] text-indigo-600 mt-1">92% of daily target</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <p className="text-xs text-zinc-400 font-medium">Streak</p>
                    <p className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">7 days</p>
                    <p className="text-[11px] text-amber-500 mt-1">🔥 Top 5% discipline</p>
                  </div>
                </div>

                {/* Today's Tasks in Mockup with real clickability */}
                <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    <span>Today's Tasks</span>
                    <span className="text-[10px] text-zinc-400">Click to toggle</span>
                  </div>
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800 mt-2">
                    {[
                      { title: 'Complete mathematics assignment', priority: 'High', color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200' },
                      { title: 'Revise physics chapter 6 — Electromagnetism', priority: 'Medium', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200' },
                      { title: 'Finish biology lab report on cell respiration', priority: 'Done', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200' },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleMockCheck(idx)}
                        className="py-2.5 flex items-center justify-between text-xs cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          {mockChecked[idx] ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 shrink-0" />
                          )}
                          <span className={`${mockChecked[idx] ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-200 font-medium'}`}>
                            {item.title}
                          </span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${item.color}`}>
                          {item.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'focus' && (
              <div className="text-center py-6 animate-in fade-in duration-150 space-y-4">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                  Focus Session
                </span>
                <div className="text-6xl font-extrabold font-mono tracking-tight text-zinc-900 dark:text-zinc-100">
                  {formatMockTime(mockTimerSeconds)}
                </div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Mathematics
                </div>
                <div className="pt-2">
                  <Button
                    onClick={() => setMockTimerRunning(!mockTimerRunning)}
                    variant="primary"
                    size="md"
                    icon={mockTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    className="w-32"
                  >
                    {mockTimerRunning ? 'Pause' : 'Start'}
                  </Button>
                </div>
                <div className="max-w-xs mx-auto pt-4">
                  <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                    <span>Session progress</span>
                    <span>72%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-600 dark:bg-brand-500 h-full w-[72%]" />
                  </div>
                </div>
                <p className="text-xs text-zinc-400 pt-1">Today's focus: 2h 18m</p>
              </div>
            )}

            {activePreviewTab === 'notes' && (
              <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-in fade-in duration-150 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Physics — Electromagnetic Induction
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-mono">Last edited 2 hours ago</span>
                </div>
                <div className="text-xs text-zinc-700 dark:text-zinc-300 space-y-2">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Key concepts & laws:</p>
                  <ul className="list-disc ml-5 space-y-1 text-zinc-600 dark:text-zinc-400">
                    <li><strong className="text-zinc-800 dark:text-zinc-200">Faraday's Law:</strong> Induced EMF is proportional to time rate of change of magnetic flux.</li>
                    <li><strong className="text-zinc-800 dark:text-zinc-200">Magnetic flux:</strong> Integral of B dot dA through the closed circuit boundary.</li>
                    <li><strong className="text-zinc-800 dark:text-zinc-200">Lenz's Law:</strong> Direction of induced current opposes flux change (energy conservation).</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-20 border-t border-zinc-200/80 dark:border-zinc-800/80 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
            Engineered For Focus
          </h2>
          <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Everything you need. Nothing you don't.
          </p>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Eliminate cognitive clutter with an integrated workspace that keeps you in deep flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Academic Task Priority</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Organize study tasks by subject, deadline, and priority. Estimate Pomodoro blocks and cross items off with satisfying completion feedback.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Deep Work Study Timer</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Pomodoro and custom interval timers featuring procedural Web Audio ambient soundscapes (rain, pink noise, binaural alpha waves) without external assets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
            <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Split-Pane Markdown Notes</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Keep your formulas, derivations, and summaries right next to your active study tasks with live preview and auto-saving.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Productivity Analytics</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Interactive Recharts data graphics displaying weekly study distributions, subject time allocations, and 14-day momentum trends.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Academic Schedule</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Full monthly and weekly calendar with tasks attached to dates. Click on any date to inspect assignments and add revision milestones.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Offline & Private</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Zero telemetry leaks. Everything persists reliably in your browser's local storage with single-click JSON export for complete ownership.
            </p>
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section id="how-it-works" className="py-20 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-900/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
              The Workflow
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Three steps to intentional studying
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="space-y-3">
              <span className="font-mono text-3xl font-extrabold text-zinc-300 dark:text-zinc-700">01</span>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Map Your Academic Week</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Break major projects and readings into manageable 25-minute Pomodoro chunks. Tag them with course subjects and deadlines.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-3xl font-extrabold text-zinc-300 dark:text-zinc-700">02</span>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Enter Deep Focus Mode</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Launch Zen mode, start procedural rain audio, and work with zero UI distractions. The timer counts down with crystal precision.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-3xl font-extrabold text-zinc-300 dark:text-zinc-700">03</span>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Review & Optimize</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Check Recharts analytics to see how your hours were divided across Math, Physics, and CS. Maintain your 7-day study streak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials / Reviews */}
      <section id="reviews" className="py-20 border-t border-zinc-200/80 dark:border-zinc-800/80 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
            Loved By Serious Students
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Real discipline over gimmicks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle flex flex-col justify-between">
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
              "Most productivity apps are bloated with AI bots, crypto tokens, or flashing gradients. FocusFlow feels like someone actually sat down and built a clean tool for studying calculus."
            </p>
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center">
                M
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Marcus Vance</p>
                <p className="text-[10px] text-zinc-400">Computer Science, 3rd Year</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle flex flex-col justify-between">
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
              "The Web Audio white noise and the subtle circular timer are pure genius. I went from struggling with 30-minute focus periods to logging 4 solid hours daily."
            </p>
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center">
                S
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Sarah Lin</p>
                <p className="text-[10px] text-zinc-400">Biomedical Engineering</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle flex flex-col justify-between">
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
              "Being able to link a Pomodoro session directly to an assignment and see that reflected in the weekly charts keeps me completely accountable."
            </p>
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-semibold text-xs flex items-center justify-center">
                D
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">David Kowalski</p>
                <p className="text-[10px] text-zinc-400">Theoretical Physics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="py-20 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Build your deep work routine today.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Join students who have replaced chaos with calm, focused academic momentum.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/dashboard')}
              className="bg-white text-zinc-950 hover:bg-zinc-100 font-semibold border-none"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Launch Live Workspace
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
              className="text-white border-zinc-700 hover:bg-zinc-800"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zinc-400" />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">FocusFlow</span>
            <span>— Student Productivity & Deep Work Workspace</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Built with React, TypeScript & Tailwind</span>
            <span>•</span>
            <Link to="/dashboard" className="hover:text-zinc-700 dark:hover:text-zinc-200">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

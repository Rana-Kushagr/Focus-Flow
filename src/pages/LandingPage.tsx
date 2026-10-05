import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
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
  RotateCcw,
  CheckSquare, 
  Zap,
  Flame,
  LayoutDashboard
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/common/Button';
import { AmbientBackground } from '../components/common/AmbientBackground';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 3D Perspective Tilt on Scroll for Product Preview
  const mockupRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: mockupProgress } = useScroll({
    target: mockupRef,
    offset: ['start end', 'center center'],
  });

  const rotateX = useTransform(mockupProgress, [0, 1], [18, 0]);
  const mockupScale = useTransform(mockupProgress, [0, 1], [0.92, 1]);
  const mockupOpacity = useTransform(mockupProgress, [0, 0.4], [0.5, 1]);

  // Interactive preview state on the landing page
  const [activePreviewTab, setActivePreviewTab] = useState<'overview' | 'focus' | 'notes'>('overview');
  const [mockChecked, setMockChecked] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: true,
  });
  const [mockTimerRunning, setMockTimerRunning] = useState(false);
  const [mockTimerSeconds, setMockTimerSeconds] = useState(1477); // 24:37

  // Active countdown timer when mock focus mode is running
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (mockTimerRunning) {
      interval = setInterval(() => {
        setMockTimerSeconds((prev) => {
          if (prev <= 1) {
            setMockTimerRunning(false);
            return 1500;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mockTimerRunning]);

  const toggleMockCheck = (index: number) => {
    setMockChecked(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const formatMockTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-brand-500 selection:text-white transition-colors overflow-x-hidden">
      {/* 0. Top Reading Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-600 via-indigo-500 to-emerald-400 origin-left z-50 shadow-xs"
        style={{ scaleX }}
      />

      {/* 1. Luminous Ambient Background Canvas with Drifting Orbs & Mouse Parallax */}
      <AmbientBackground />

      {/* 2. Header / Navbar */}
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
            <a href="#preview" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Product Preview</a>
            <a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Workflow</a>
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

      {/* 3. Hero Section with Staggered Motion */}
      <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/90 dark:border-zinc-800 text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-6 shadow-xs"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Designed for Intentional Academic Flow</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-brand-600 dark:text-brand-400 font-semibold">FocusFlow 2.0</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.08]"
        >
          Study with intention.<br />
          <span className="bg-gradient-to-r from-zinc-500 via-zinc-400 to-zinc-600 dark:from-zinc-400 dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent">
            Get more done.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="mt-6 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
        >
          FocusFlow brings your tasks, study sessions, notes and progress into one focused workspace. Distraction-free by design, engineered for student clarity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/login?mode=signup')}
              icon={<Sparkles className="w-4 h-4" />}
              className="shadow-lg shadow-brand-500/10"
            >
              Start Studying
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/dashboard')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Dashboard
            </Button>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-4 text-[11px] text-zinc-400"
        >
          Zero setup required • Includes 1-click evaluator demo account
        </motion.p>
      </section>

      {/* 4. Product Preview Mockup with 3D Perspective Scroll Tilt */}
      <section id="preview" ref={mockupRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 z-10 [perspective:1200px]">
        <motion.div
          style={{
            rotateX,
            scale: mockupScale,
            opacity: mockupOpacity,
            transformStyle: 'preserve-3d',
          }}
          className="hero-card-silver rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-2xl overflow-hidden cursor-default"
        >
          {/* Mockup Titlebar with Browser Controls & Tab Switcher */}
          <div className="px-4 py-3 bg-zinc-50/90 dark:bg-zinc-950/90 border-b border-zinc-200/70 dark:border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400/80" />
              <span className="w-3 h-3 rounded-full bg-amber-400/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
              <span className="ml-2 text-xs font-mono text-zinc-400 hidden sm:inline">
                https://focusflow.app/dashboard
              </span>
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
                onClick={() => {
                  setActivePreviewTab('focus');
                  setMockTimerRunning(true);
                }}
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
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Good afternoon, Alex
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Here's your productivity overview
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="hero-card-silver p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer">
                    <p className="text-xs text-zinc-400 font-medium">Tasks</p>
                    <p className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">12</p>
                    <p className="text-[11px] text-emerald-600 mt-1">5 completed today</p>
                  </div>
                  <div 
                    onClick={() => {
                      setActivePreviewTab('focus');
                      setMockTimerRunning(true);
                    }}
                    className="hero-card-silver p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer"
                  >
                    <p className="text-xs text-zinc-400 font-medium">Focus</p>
                    <p className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">3h 42m</p>
                    <p className="text-[11px] text-indigo-600 mt-1">92% of daily target</p>
                  </div>
                  <div className="hero-card-silver p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer">
                    <p className="text-xs text-zinc-400 font-medium">Streak</p>
                    <p className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">7 days</p>
                    <p className="text-[11px] text-amber-500 mt-1">🔥 Top 5% discipline</p>
                  </div>
                </div>

                {/* Today's Tasks Interactive Checklist */}
                <div className="hero-card-silver p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    <span>Today's Tasks</span>
                    <span className="text-[10px] text-zinc-400">Click to toggle live</span>
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

            {activePreviewTab === 'focus' && (() => {
              const elapsedMock = 1500 - mockTimerSeconds;
              const mockProgressPercent = Math.min(100, Math.max(0, Math.round((elapsedMock / 1500) * 100)));

              return (
                <div className="text-center py-6 animate-in fade-in duration-150 space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${mockTimerRunning ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                      {mockTimerRunning ? 'Active Focus Session' : 'Focus Session (Paused)'}
                    </span>
                  </div>
                  <div className="text-6xl font-extrabold font-mono tracking-tight text-zinc-900 dark:text-zinc-100">
                    {formatMockTime(mockTimerSeconds)}
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Mathematics
                  </div>
                  <div className="pt-2 flex items-center justify-center gap-2">
                    <Button
                      onClick={() => setMockTimerRunning(!mockTimerRunning)}
                      variant="primary"
                      size="md"
                      icon={mockTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      className="w-32"
                    >
                      {mockTimerRunning ? 'Pause' : 'Start'}
                    </Button>
                    <Button
                      onClick={() => {
                        setMockTimerRunning(false);
                        setMockTimerSeconds(1500);
                      }}
                      variant="outline"
                      size="md"
                      icon={<RotateCcw className="w-3.5 h-3.5" />}
                      title="Reset preview timer"
                    />
                  </div>
                  <div className="max-w-xs mx-auto pt-4">
                    <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                      <span>Session progress</span>
                      <span>{mockProgressPercent}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-brand-600 dark:bg-brand-500 h-full transition-all duration-300"
                        style={{ width: `${mockProgressPercent}%` }} 
                      />
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 pt-1">
                    Today's focus: 2h 18m • <span className={mockTimerRunning ? 'text-emerald-500 font-medium' : 'text-zinc-400'}>
                      {mockTimerRunning ? 'Countdown active' : 'Click start to resume'}
                    </span>
                  </p>
                </div>
              );
            })()}

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
        </motion.div>
      </section>

      {/* 5. Scroll-Revealed Features Grid */}
      <section id="features" className="py-24 border-t border-zinc-200/80 dark:border-zinc-800/80 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Engineered For Deep Work
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            A cohesive study operating system.
          </p>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Eliminate cognitive clutter with an integrated workspace that keeps you in deep flow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: CheckSquare,
              color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50',
              title: 'Academic Task Priority',
              desc: 'Organize study tasks by subject, deadline, and priority. Estimate Pomodoro blocks and cross items off with satisfying completion feedback.',
            },
            {
              icon: Clock,
              color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50',
              title: 'Deep Work Focus Timer',
              desc: 'Pomodoro and custom interval timers featuring procedural Web Audio ambient soundscapes (rain, pink noise, binaural alpha waves) without external assets.',
            },
            {
              icon: FileText,
              color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/50',
              title: 'Split-Pane Markdown Notes',
              desc: 'Keep your formulas, derivations, and summaries right next to your active study tasks with live preview and auto-saving.',
            },
            {
              icon: BarChart3,
              color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50',
              title: 'Productivity Analytics',
              desc: 'Interactive Recharts data graphics displaying weekly study distributions, subject time allocations, and 14-day momentum trends.',
            },
            {
              icon: Calendar,
              color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50',
              title: 'Academic Schedule',
              desc: 'Full monthly and weekly calendar with tasks attached to dates. Click on any date to inspect assignments and add revision milestones.',
            },
            {
              icon: Shield,
              color: 'text-zinc-700 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300',
              title: 'Offline & Private',
              desc: 'Zero telemetry leaks. Everything persists reliably in your browser local storage with single-click JSON export for complete ownership.',
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors hero-card-silver"
              >
                <div className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center mb-4 shadow-2xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{feature.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 6. Scroll-Driven Workflow Timeline */}
      <section id="how-it-works" className="py-24 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/40 dark:bg-zinc-900/30 backdrop-blur-xs z-10 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
              The Workflow
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Three steps to intentional studying
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: '01',
                title: 'Map Your Academic Week',
                desc: 'Break major projects and readings into manageable 25-minute Pomodoro chunks. Tag them with course subjects and deadlines.',
              },
              {
                step: '02',
                title: 'Enter Deep Focus Mode',
                desc: 'Launch Zen mode, start procedural rain audio, and work with zero UI distractions. The timer counts down with crystal precision.',
              },
              {
                step: '03',
                title: 'Review & Optimize',
                desc: 'Check Recharts analytics to see how your hours were divided across Math, Physics, and CS. Maintain your 7-day study streak.',
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="space-y-3 p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800"
              >
                <span className="font-mono text-4xl font-extrabold text-zinc-300 dark:text-zinc-700">
                  {s.step}
                </span>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{s.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Testimonials Section with Motion */}
      <section id="reviews" className="py-24 border-t border-zinc-200/80 dark:border-zinc-800/80 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest flex items-center justify-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Loved By Serious Students
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Real discipline over gimmicks
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "Most productivity apps are bloated with AI bots, crypto tokens, or flashing gradients. FocusFlow feels like someone actually sat down and built a clean tool for studying calculus.",
              name: "Marcus Vance",
              role: "Computer Science, 3rd Year",
              initial: "M",
              color: "bg-indigo-500",
            },
            {
              quote: "The Web Audio white noise and the subtle circular timer are pure genius. I went from struggling with 30-minute focus periods to logging 4 solid hours daily.",
              name: "Sarah Lin",
              role: "Biomedical Engineering",
              initial: "S",
              color: "bg-emerald-500",
            },
            {
              quote: "Being able to link a Pomodoro session directly to an assignment and see that reflected in the weekly charts keeps me completely accountable.",
              name: "David Kowalski",
              role: "Theoretical Physics",
              initial: "D",
              color: "bg-amber-500",
            },
          ].map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 shadow-subtle flex flex-col justify-between hero-card-silver"
            >
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
                "{item.quote}"
              </p>
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${item.color} text-white font-semibold text-xs flex items-center justify-center shadow-xs`}>
                  {item.initial}
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</p>
                  <p className="text-[10px] text-zinc-400">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. Call To Action Banner */}
      <section className="py-24 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-900 text-white relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
          >
            Build your deep work routine today.
          </motion.h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Join thousands of university students who have replaced chaos with calm, focused academic momentum.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate('/dashboard')}
                className="bg-white text-zinc-950 hover:bg-zinc-100 font-semibold border-none shadow-xl"
                icon={<LayoutDashboard className="w-4 h-4" />}
              >
                Launch Live Workspace
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="text-white border-zinc-700 hover:bg-zinc-800"
              >
                Sign In
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-500 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zinc-400" />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">FocusFlow</span>
            <span>— Student Productivity & Deep Work Workspace</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Built with React 19, TypeScript & Tailwind</span>
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

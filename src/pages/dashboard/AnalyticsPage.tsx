import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  CartesianGrid 
} from 'recharts';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  BookOpen 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { SUBJECT_COLORS } from '../../data/mockData';
import { formatDuration } from '../../utils/formatters';

export const AnalyticsPage: React.FC = () => {
  const { tasks, focusSessions, userSettings } = useApp();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  // 1. Weekly Focus data (Mon-Sun)
  const weeklyData = useMemo(() => {
    return [
      { day: 'Mon', hours: 3.5, target: 4.0 },
      { day: 'Tue', hours: 4.2, target: 4.0 },
      { day: 'Wed', hours: 2.8, target: 4.0 },
      { day: 'Thu', hours: 5.1, target: 4.0 },
      { day: 'Fri', hours: 3.8, target: 4.0 },
      { day: 'Sat', hours: 2.0, target: 4.0 },
      { day: 'Sun', hours: 3.7, target: 4.0 },
    ];
  }, []);

  // 2. Subject Distribution for Pie Chart
  const subjectDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    focusSessions.forEach((s) => {
      counts[s.subject] = (counts[s.subject] || 0) + s.durationMinutes;
    });

    return Object.entries(counts).map(([name, minutes]) => ({
      name,
      hours: Number((minutes / 60).toFixed(1)),
      color: SUBJECT_COLORS[name]?.hex || '#8b5cf6',
    }));
  }, [focusSessions]);

  // 3. Trend data (14-day completion trend)
  const trendData = useMemo(() => {
    return [
      { date: 'Sep 22', tasks: 3, sessions: 4 },
      { date: 'Sep 24', tasks: 5, sessions: 6 },
      { date: 'Sep 26', tasks: 4, sessions: 5 },
      { date: 'Sep 28', tasks: 6, sessions: 7 },
      { date: 'Sep 30', tasks: 4, sessions: 4 },
      { date: 'Oct 02', tasks: 7, sessions: 8 },
      { date: 'Oct 04', tasks: 5, sessions: 6 },
      { date: 'Today', tasks: tasks.filter(t => t.completed).length, sessions: focusSessions.length },
    ];
  }, [tasks, focusSessions]);

  const totalWeeklyHours = weeklyData.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1);
  const completionRate = Math.round((tasks.filter(t => t.completed).length / Math.max(1, tasks.length)) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Productivity Analytics
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Data-driven insights into your focus sessions, subject workload, and study habits.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-medium border border-brand-200 dark:border-brand-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> High Productivity Period
          </span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hero-card-silver">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Weekly Study Time</span>
            <Clock className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {totalWeeklyHours}h
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14% vs last week
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hero-card-silver">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            7 Days
          </div>
          <div className="mt-2 text-[11px] text-zinc-400">
            Personal best: 14 days
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hero-card-silver">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Task Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {completionRate}%
          </div>
          <div className="mt-2 text-[11px] text-zinc-400">
            {tasks.filter(t => t.completed).length} of {tasks.length} finished
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hero-card-silver">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Focus Sessions</span>
            <BookOpen className="w-4 h-4 text-brand-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {focusSessions.length}
          </div>
          <div className="mt-2 text-[11px] text-zinc-400">
            25m average duration
          </div>
        </div>
      </div>

      {/* Two Column Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Focus Time Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hero-card-silver">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Weekly Focus Hours</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Study hours logged per day vs 4h daily target</p>
            </div>
            <span className="text-xs font-mono text-zinc-400">Target: 4.0h</span>
          </div>

          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#27272a' : '#f4f4f5'} />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 11 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  unit="h" 
                  tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 11 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: isDark ? '#27272a33' : '#f4f4f566' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-800 text-white shadow-xl text-xs">
                          <p className="font-semibold">{data.day}</p>
                          <p className="font-mono mt-1 text-emerald-400">{data.hours} hours logged</p>
                          <p className="text-[10px] text-zinc-400">Target: {data.target}h</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="hours" 
                  fill={isDark ? '#e4e4e7' : '#18181b'} 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={38}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Distribution Donut Chart (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle flex flex-col hero-card-silver">
          <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Subject Distribution</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Hours divided across academic courses</p>
          </div>

          <div className="h-48 mt-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={74}
                  paddingAngle={3}
                  dataKey="hours"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="p-2 rounded bg-zinc-900 text-white text-xs shadow-lg">
                          <p className="font-medium">{d.name}</p>
                          <p className="font-mono text-zinc-300">{d.hours} hours</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Subject Legend List */}
          <div className="mt-auto grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            {subjectDistribution.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-zinc-600 dark:text-zinc-400 truncate">{s.name}</span>
                <span className="font-mono text-zinc-400 ml-auto">{s.hours}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Completion Trend Area Chart */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle hero-card-silver">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Study Momentum Trend</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Tasks completed & focus sessions conducted over the past 2 weeks</p>
          </div>
        </div>

        <div className="h-56 mt-4 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sessionColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="taskColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#27272a' : '#f4f4f5'} />
              <XAxis dataKey="date" tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-800 text-white shadow-xl text-xs space-y-1">
                        <p className="font-semibold">{data.date}</p>
                        <p className="text-indigo-400">{data.sessions} Focus Sessions</p>
                        <p className="text-emerald-400">{data.tasks} Tasks Finished</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#sessionColor)" />
              <Area type="monotone" dataKey="tasks" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#taskColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

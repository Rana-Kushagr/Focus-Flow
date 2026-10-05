import { Task, Note, FocusSession, UserSettings, AppNotification } from '../types';

export const initialUserSettings: UserSettings = {
  name: 'Alex Chen',
  email: 'alex.chen@university.edu',
  university: 'Imperial College London',
  major: 'Computer Science & Mathematics',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  dailyGoalMinutes: 240, // 4 hours
  pomodoroMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  autoStartBreaks: false,
  soundEnabled: true,
  ambientSound: 'none',
  ambientVolume: 0.5,
  backgroundPattern: 'grid',
};

// Today's date helper
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const inTwoDays = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
const inThreeDays = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Complete mathematics problem set 4 (Linear Algebra)',
    subject: 'Mathematics',
    priority: 'high',
    dueDate: today,
    completed: false,
    estimatedPomodoros: 4,
    completedPomodoros: 2,
    description: 'Work through questions 8-15 on eigenvalues, eigenvectors, and diagonalization.',
  },
  {
    id: 'task-2',
    title: 'Revise physics chapter 6 — Electromagnetism',
    subject: 'Physics',
    priority: 'medium',
    dueDate: today,
    completed: false,
    estimatedPomodoros: 3,
    completedPomodoros: 1,
    description: "Focus on Faraday's law derivations and Lenz's rule application problems.",
  },
  {
    id: 'task-3',
    title: 'Finish biology lab report on cell respiration',
    subject: 'Biology',
    priority: 'low',
    dueDate: today,
    completed: true,
    completedAt: `${today}T11:30:00Z`,
    estimatedPomodoros: 2,
    completedPomodoros: 2,
    description: 'Graph optical density data and draft discussion section.',
  },
  {
    id: 'task-4',
    title: 'Implement Dijkstra and A* graph algorithms in Rust',
    subject: 'Computer Science',
    priority: 'high',
    dueDate: tomorrow,
    completed: false,
    estimatedPomodoros: 5,
    completedPomodoros: 0,
    description: 'Write unit tests for shortest path routing with binary heap priority queue.',
  },
  {
    id: 'task-5',
    title: 'History presentation on Enlightenment political philosophy',
    subject: 'History',
    priority: 'medium',
    dueDate: inTwoDays,
    completed: false,
    estimatedPomodoros: 3,
    completedPomodoros: 0,
    description: 'Prepare 10 slides on Locke, Rousseau, and Montesquieu separation of powers.',
  },
  {
    id: 'task-6',
    title: 'Chemistry spectroscopy workbook exercises',
    subject: 'Chemistry',
    priority: 'low',
    dueDate: inThreeDays,
    completed: false,
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    description: 'Analyze NMR and IR spectral charts for unknown organic compounds.',
  },
  {
    id: 'task-7',
    title: 'Read assigned chapters of Hamlet for essay thesis',
    subject: 'Literature',
    priority: 'low',
    dueDate: yesterday,
    completed: true,
    completedAt: `${yesterday}T16:00:00Z`,
    estimatedPomodoros: 2,
    completedPomodoros: 2,
    description: 'Annotate Act 3 soliloquies on inaction and moral doubt.',
  },
];

export const initialNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Physics — Electromagnetic Induction',
    subject: 'Physics',
    isPinned: true,
    updatedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    content: `## Key Concepts & Equations

### 1. Magnetic Flux ($\\Phi_B$)
Defined as the integral of the magnetic field over a given surface area:
$$\\Phi_B = \\iint \\mathbf{B} \\cdot d\\mathbf{A} = B A \\cos(\\theta)$$

### 2. Faraday's Law of Induction
The induced electromotive force (EMF, $\\mathcal{E}$) in any closed circuit is equal to the negative time rate of change of the magnetic flux through the circuit:
$$\\mathcal{E} = -\\frac{d\\Phi_B}{dt}$$

For a coil with $N$ tightly wound turns:
$$\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}$$

### 3. Lenz's Law
- The direction of the induced current is always such that its magnetic field **opposes** the change in original magnetic flux that produced it.
- Rooted in the conservation of energy principle: work must be done against the opposing force to induce current.

### 4. Self-Inductance & Energy
- EMF induced by changing self-current: $\\mathcal{E}_L = -L \\frac{di}{dt}$
- Magnetic energy stored in an inductor: $U_B = \\frac{1}{2} L I^2$

*Key Exam Tip: Remember the negative sign in Faraday's law represents Lenz's opposing direction!*`,
  },
  {
    id: 'note-2',
    title: 'Calculus — Integration Techniques & Series',
    subject: 'Mathematics',
    isPinned: true,
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    content: `## Integration Master Summary

### Integration by Parts
Formula:
$$\\int u \\, dv = u v - \\int v \\, du$$

Rule of thumb for choosing $u$ (**LIATE**):
1. **L**ogarithmic functions ($\\ln x$)
2. **I**nverse trigonometric functions ($\\arctan x$)
3. **A**lgebraic polynomials ($x^2, 3x$)
4. **T**rigonometric functions ($\\sin x, \\cos x$)
5. **E**xponential functions ($e^x$)

### Trigonometric Substitutions
- Form $\\sqrt{a^2 - x^2} \\implies$ use $x = a \\sin\\theta$
- Form $\\sqrt{a^2 + x^2} \\implies$ use $x = a \\tan\\theta$
- Form $\\sqrt{x^2 - a^2} \\implies$ use $x = a \\sec\\theta$

### Taylor & Maclaurin Series
$$f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(0)}{n!} x^n$$
- $e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\dots$
- $\\sin(x) = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\dots$
- $\\cos(x) = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\dots$`,
  },
  {
    id: 'note-3',
    title: 'Data Structures — Red-Black Tree Invariants',
    subject: 'Computer Science',
    isPinned: false,
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    content: `## Red-Black Tree Properties

A red-black tree is a self-balancing binary search tree with the following properties:
1. Every node is either **red** or **black**.
2. The root is always **black**.
3. Every leaf (\`NIL\` node) is **black**.
4. If a node is **red**, then both its children are **black** (no two consecutive red nodes on any path).
5. For each node, all simple paths from the node to descendant leaves contain the same number of black nodes (**Black-height invariant**).

### Complexity
- Search: $\\mathcal{O}(\\log n)$
- Insert: $\\mathcal{O}(\\log n)$ (at most 2 rotations)
- Delete: $\\mathcal{O}(\\log n)$ (at most 3 rotations)`,
  },
  {
    id: 'note-4',
    title: 'Modern European History — The Social Contract',
    subject: 'History',
    isPinned: false,
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    content: `## Enlightenment Political Thinkers

### Thomas Hobbes (1588–1679) — *Leviathan*
- State of nature is "nasty, brutish, and short".
- Absolute monarchy required to maintain social order and prevent perpetual war.

### John Locke (1632–1704) — *Two Treatises of Government*
- Natural rights: Life, Liberty, and Property.
- Government exists by the consent of the governed.
- Citizens retain right to revolt if social contract is broken.

### Jean-Jacques Rousseau (1712–1778) — *The Social Contract*
- "Man is born free, and everywhere he is in chains."
- Sovereign power resides in the General Will of the collective citizenry.`,
  }
];

export const initialFocusSessions: FocusSession[] = [
  // Today's sessions
  {
    id: 'fs-today-1',
    subject: 'Mathematics',
    taskTitle: 'Complete mathematics problem set 4',
    durationMinutes: 25,
    timestamp: `${today}T09:00:00Z`,
    mode: 'pomodoro',
    completed: true,
  },
  {
    id: 'fs-today-2',
    subject: 'Mathematics',
    taskTitle: 'Complete mathematics problem set 4',
    durationMinutes: 25,
    timestamp: `${today}T09:30:00Z`,
    mode: 'pomodoro',
    completed: true,
  },
  {
    id: 'fs-today-3',
    subject: 'Physics',
    taskTitle: 'Revise physics chapter 6 — Electromagnetism',
    durationMinutes: 25,
    timestamp: `${today}T10:30:00Z`,
    mode: 'pomodoro',
    completed: true,
  },
  {
    id: 'fs-today-4',
    subject: 'Biology',
    taskTitle: 'Finish biology lab report',
    durationMinutes: 25,
    timestamp: `${today}T11:00:00Z`,
    mode: 'pomodoro',
    completed: true,
  },
  {
    id: 'fs-today-5',
    subject: 'Computer Science',
    taskTitle: 'Rust algorithm profiling',
    durationMinutes: 25,
    timestamp: `${today}T13:30:00Z`,
    mode: 'pomodoro',
    completed: true,
  },
  // Yesterday's sessions
  {
    id: 'fs-yest-1',
    subject: 'Physics',
    durationMinutes: 25,
    timestamp: `${yesterday}T10:00:00Z`,
    mode: 'pomodoro',
    completed: true,
  },
  {
    id: 'fs-yest-2',
    subject: 'Physics',
    durationMinutes: 25,
    timestamp: `${yesterday}T10:30:00Z`,
    mode: 'pomodoro',
    completed: true,
  },
  {
    id: 'fs-yest-3',
    subject: 'Computer Science',
    durationMinutes: 25,
    timestamp: `${yesterday}T14:00:00Z`,
    mode: 'pomodoro',
    completed: true,
  },
  {
    id: 'fs-yest-4',
    subject: 'Computer Science',
    durationMinutes: 25,
    timestamp: `${yesterday}T14:30:00Z`,
    mode: 'pomodoro',
    completed: true,
  },
  {
    id: 'fs-yest-5',
    subject: 'Literature',
    durationMinutes: 25,
    timestamp: `${yesterday}T16:00:00Z`,
    mode: 'pomodoro',
    completed: true,
  },
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: '7-Day Study Streak Active 🔥',
    message: "You've studied 7 consecutive days. Keep the momentum going!",
    time: '10m ago',
    read: false,
    type: 'streak',
  },
  {
    id: 'notif-2',
    title: 'Upcoming Deadline',
    message: 'Mathematics problem set 4 is due today at 11:59 PM.',
    time: '1h ago',
    read: false,
    type: 'reminder',
  },
  {
    id: 'notif-3',
    title: 'Study Goal Progress',
    message: "You have completed 2h 05m out of your 4h daily target.",
    time: '2h ago',
    read: true,
    type: 'achievement',
  },
];

export const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; hex: string }> = {
  'Mathematics': { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800', hex: '#3b82f6' },
  'Physics': { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800', hex: '#6366f1' },
  'Computer Science': { bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-800', hex: '#8b5cf6' },
  'Biology': { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', hex: '#10b981' },
  'History': { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', hex: '#f59e0b' },
  'Chemistry': { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800', hex: '#f43f5e' },
  'Literature': { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800', hex: '#14b8a6' },
};

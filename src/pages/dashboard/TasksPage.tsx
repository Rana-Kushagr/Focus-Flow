import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Trash2, 
  CheckSquare, 
  SlidersHorizontal 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Priority, Subject, Task } from '../../types';
import { formatDueDate, getPriorityBadge, getSubjectColor } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const TasksPage: React.FC = () => {
  const { tasks, toggleTask, addTask, deleteTask, setSelectedTaskId, startTimer } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<Subject>('Mathematics');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newDueDate, setNewDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newEstimatedPomodoros, setNewEstimatedPomodoros] = useState(2);
  const [newDescription, setNewDescription] = useState('');

  // Filtering
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter === 'pending' && t.completed) return false;
      if (statusFilter === 'completed' && !t.completed) return false;
      if (selectedSubjectFilter !== 'all' && t.subject !== selectedSubjectFilter) return false;
      if (selectedPriorityFilter !== 'all' && t.priority !== selectedPriorityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q));
      }
      return true;
    });
  }, [tasks, statusFilter, selectedSubjectFilter, selectedPriorityFilter, searchQuery]);

  // Group into Today, Upcoming, and Completed
  const todayStr = new Date().toISOString().split('T')[0];

  const todayTasks = filteredTasks.filter(t => !t.completed && t.dueDate === todayStr);
  const upcomingTasks = filteredTasks.filter(t => !t.completed && t.dueDate !== todayStr);
  const completedTasks = filteredTasks.filter(t => t.completed);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle.trim(),
      subject: newSubject,
      priority: newPriority,
      dueDate: newDueDate,
      estimatedPomodoros: newEstimatedPomodoros,
      description: newDescription.trim() || undefined,
    });

    setNewTitle('');
    setNewDescription('');
    setIsAddModalOpen(false);
  };

  const renderTaskItem = (t: Task) => {
    const priority = getPriorityBadge(t.priority);
    const subjectStyle = getSubjectColor(t.subject);
    const dueDate = formatDueDate(t.dueDate);

    return (
      <div
        key={t.id}
        className={`p-3.5 rounded-lg border transition-all flex items-center justify-between gap-3 group ${
          t.completed 
            ? 'bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200/50 dark:border-zinc-800/50 opacity-70' 
            : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700'
        }`}
      >
        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
          <button
            onClick={() => toggleTask(t.id)}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors mt-0.5 sm:mt-0 shrink-0 cursor-pointer"
          >
            {t.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950/40" />
            ) : (
              <Circle className="w-5 h-5 text-zinc-300 dark:text-zinc-700 hover:text-zinc-500" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <p className={`text-xs font-medium truncate ${t.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
              {t.title}
            </p>
            {t.description && (
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                {t.description}
              </p>
            )}
          </div>
        </div>

        {/* Task Metadata & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Estimated Pomodoro count */}
          <span 
            className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400 font-mono" 
            title="Estimated vs Completed Pomodoros"
          >
            <Clock className="w-3 h-3" />
            {t.completedPomodoros}/{t.estimatedPomodoros}
          </span>

          {/* Subject tag */}
          <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${subjectStyle.bg} ${subjectStyle.text} ${subjectStyle.border}`}>
            {t.subject}
          </span>

          {/* Due date */}
          <span className={`text-[11px] font-mono ${dueDate.isOverdue ? 'text-rose-500 font-medium' : 'text-zinc-400'}`}>
            {dueDate.label}
          </span>

          {/* Priority */}
          <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${priority.className}`}>
            {priority.label}
          </span>

          {/* Quick Focus Button */}
          {!t.completed && (
            <button
              onClick={() => {
                setSelectedTaskId(t.id);
                startTimer();
              }}
              title="Start focus on this task"
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-1 transition-opacity cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={() => deleteTask(t.id)}
            title="Delete task"
            className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 transition-opacity cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Task */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            My Tasks
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Organize study assignments, prioritize exam prep, and track Pomodoro blocks.
          </p>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          New Task
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-800 p-0.5 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              Pending ({tasks.filter(t => !t.completed).length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              Done ({tasks.filter(t => t.completed).length})
            </button>
          </div>
        </div>

        {/* Dropdown filters for Subject & Priority */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
          <span className="text-zinc-400 text-[11px] flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Filters:
          </span>
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/70 rounded-md px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
          >
            <option value="all">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Biology">Biology</option>
            <option value="History">History</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Literature">Literature</option>
          </select>

          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/70 rounded-md px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Task Sections */}
      <div className="space-y-6">
        {/* Today Section */}
        {todayTasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Today</h2>
              <span className="text-[11px] text-zinc-400 font-mono">{todayTasks.length} tasks</span>
            </div>
            <div className="space-y-2">
              {todayTasks.map(renderTaskItem)}
            </div>
          </div>
        )}

        {/* Upcoming Section */}
        {upcomingTasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Upcoming</h2>
              <span className="text-[11px] text-zinc-400 font-mono">{upcomingTasks.length} tasks</span>
            </div>
            <div className="space-y-2">
              {upcomingTasks.map(renderTaskItem)}
            </div>
          </div>
        )}

        {/* Completed Section */}
        {completedTasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Completed</h2>
              <span className="text-[11px] text-zinc-400 font-mono">{completedTasks.length} tasks</span>
            </div>
            <div className="space-y-2">
              {completedTasks.map(renderTaskItem)}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredTasks.length === 0 && (
          <div className="py-16 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <CheckSquare className="w-8 h-8 text-zinc-400 mx-auto mb-2 opacity-50" />
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No tasks found</h3>
            <p className="text-xs text-zinc-400 mt-1">Try adjusting your filters or create a new task.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4" 
              onClick={() => {
                setSearchQuery('');
                setSelectedSubjectFilter('all');
                setSelectedPriorityFilter('all');
                setStatusFilter('all');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* New Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Task"
        description="Add a homework assignment, reading chapter, or project milestone."
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Complete calculus problem set 5"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Subject
              </label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value as Subject)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
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

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Estimated Pomodoros (25m)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={newEstimatedPomodoros}
                onChange={(e) => setNewEstimatedPomodoros(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Chapter pages, rubric requirements, reference links..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

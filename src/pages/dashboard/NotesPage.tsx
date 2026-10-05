import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  Trash2, 
  Pin, 
  Eye, 
  Edit3, 
  Clock, 
  Check, 
  Folder 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Subject, Note } from '../../types';
import { getSubjectColor } from '../../utils/formatters';
import { Button } from '../../components/common/Button';

export const NotesPage: React.FC = () => {
  const { notes, activeNoteId, setActiveNoteId, addNote, updateNote, deleteNote } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [lastSaved, setLastSaved] = useState(true);

  // Active note
  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  // Filtering
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (selectedSubjectFilter !== 'all' && n.subject !== selectedSubjectFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      }
      return true;
    });
  }, [notes, selectedSubjectFilter, searchQuery]);

  const handleCreateNote = () => {
    const id = addNote({
      title: 'Untitled Note',
      subject: (selectedSubjectFilter !== 'all' ? selectedSubjectFilter : 'Mathematics') as Subject,
      content: '# Untitled Note\n\nStart writing key takeaways, formulas, and lecture notes here...',
    });
    setActiveNoteId(id);
    setIsPreviewMode(false);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!activeNote) return;
    updateNote(activeNote.id, { title: newTitle });
    setLastSaved(true);
  };

  const handleSubjectChange = (newSubject: Subject) => {
    if (!activeNote) return;
    updateNote(activeNote.id, { subject: newSubject });
    setLastSaved(true);
  };

  const handleContentChange = (newContent: string) => {
    if (!activeNote) return;
    updateNote(activeNote.id, { content: newContent });
    setLastSaved(true);
  };

  const handleTogglePin = () => {
    if (!activeNote) return;
    updateNote(activeNote.id, { isPinned: !activeNote.isPinned });
  };

  // Helper to render basic markdown nicely without heavy parser
  const renderSimpleMarkdown = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-3 font-sans text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 pt-2 pb-1 border-b border-zinc-100 dark:border-zinc-800">
                {line.replace('# ', '')}
              </h1>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 pt-3">
                {line.replace('## ', '')}
              </h2>
            );
          }
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-sm font-semibold tracking-tight text-zinc-800 dark:text-zinc-200 pt-2">
                {line.replace('### ', '')}
              </h3>
            );
          }
          if (line.startsWith('- ') || line.startsWith('• ')) {
            return (
              <li key={idx} className="ml-4 list-disc text-zinc-700 dark:text-zinc-300">
                {line.replace(/^[-•]\s*/, '')}
              </li>
            );
          }
          if (line.startsWith('$$') && line.endsWith('$$')) {
            return (
              <div key={idx} className="my-2 p-2.5 rounded bg-zinc-100 dark:bg-zinc-800/80 font-mono text-xs overflow-x-auto text-center text-zinc-800 dark:text-zinc-200">
                {line.replace(/\$\$/g, '')}
              </div>
            );
          }
          if (line.trim() === '') {
            return <div key={idx} className="h-2" />;
          }
          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Study Notes
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Structured course notes, formulas, and revision materials.
          </p>
        </div>
        <Button
          onClick={handleCreateNote}
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
        >
          New Note
        </Button>
      </div>

      {/* Main Two-Pane Container */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Pane: Notes List (4 cols) */}
        <div className="md:col-span-4 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl shadow-subtle overflow-hidden">
          {/* Search & Filter Header */}
          <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
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
            </div>
          </div>

          {/* Notes scrollable list */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60 p-2 space-y-1">
            {filteredNotes.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-400">
                No notes found.
              </div>
            ) : (
              filteredNotes.map((n) => {
                const isSelected = activeNote?.id === n.id;
                const style = getSubjectColor(n.subject);

                return (
                  <button
                    key={n.id}
                    onClick={() => {
                      setActiveNoteId(n.id);
                      setIsPreviewMode(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-100 dark:bg-zinc-800/90 shadow-2xs border border-zinc-200 dark:border-zinc-700/80'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${style.bg} ${style.text} ${style.border}`}>
                        {n.subject}
                      </span>
                      {n.isPinned && (
                        <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                      )}
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {n.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
                      {n.content.replace(/[#*`$\\]/g, '').slice(0, 100)}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Editor & Preview (8 cols) */}
        <div className="md:col-span-8 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl shadow-subtle overflow-hidden">
          {activeNote ? (
            <>
              {/* Note Toolbar Header */}
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="text-base font-bold text-zinc-900 dark:text-zinc-100 bg-transparent focus:outline-none w-full border-b border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 pb-0.5"
                    placeholder="Note Title"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {/* Subject Selector */}
                  <select
                    value={activeNote.subject}
                    onChange={(e) => handleSubjectChange(e.target.value as Subject)}
                    className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Biology">Biology</option>
                    <option value="History">History</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Literature">Literature</option>
                  </select>

                  {/* Toggle Preview / Edit */}
                  <button
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                      isPreviewMode
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border-zinc-200 dark:border-zinc-800'
                    }`}
                    title={isPreviewMode ? 'Switch to Edit' : 'Switch to Preview'}
                  >
                    {isPreviewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{isPreviewMode ? 'Edit' : 'Preview'}</span>
                  </button>

                  {/* Pin button */}
                  <button
                    onClick={handleTogglePin}
                    className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                      activeNote.isPinned
                        ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900'
                        : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 border-zinc-200 dark:border-zinc-800'
                    }`}
                    title={activeNote.isPinned ? 'Unpin note' : 'Pin note to top'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => deleteNote(activeNote.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Editor content / Preview area */}
              <div className="flex-1 p-5 overflow-y-auto">
                {isPreviewMode ? (
                  renderSimpleMarkdown(activeNote.content)
                ) : (
                  <textarea
                    value={activeNote.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Write your study notes in markdown..."
                    className="w-full h-full bg-transparent text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none resize-none font-mono leading-relaxed placeholder-zinc-400"
                  />
                )}
              </div>

              {/* Footer status bar */}
              <div className="px-4 py-2 bg-zinc-50/70 dark:bg-zinc-900/70 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3 h-3" /> Auto-saved
                </span>
                <span>{activeNote.content.length} characters</span>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400">
              <FileText className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs">Select or create a note to begin editing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

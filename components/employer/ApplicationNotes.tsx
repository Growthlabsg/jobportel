'use client';

import { useState } from 'react';
import { Application } from '@/types/application';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { MessageSquare, Plus, Trash2, Edit2 } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
}

interface ApplicationNotesProps {
  application: Application;
  notes?: Note[];
  onAddNote: (content: string) => void;
  onUpdateNote: (noteId: string, content: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const ApplicationNotes = ({
  application,
  notes = [],
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: ApplicationNotesProps) => {
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddNote(newNote.trim());
      setNewNote('');
    }
  };

  const handleStartEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = (noteId: string) => {
    if (editContent.trim()) {
      onUpdateNote(noteId, editContent.trim());
      setEditingNoteId(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditContent('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Notes & Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Note Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note or feedback about this candidate..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Note
            </Button>
          </div>
        </form>

        {/* Notes List */}
        <div className="space-y-3 border-t border-gray-200 pt-4">
          {notes.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No notes yet. Add your first note above.
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                {editingNoteId === note.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(note.id)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{note.content}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">by {note.author}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(note.createdAt)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStartEdit(note)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Edit"
                        >
                          <Edit2 className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => onDeleteNote(note.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};


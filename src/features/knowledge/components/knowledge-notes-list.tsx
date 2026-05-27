"use client";

import { useKnowledgeNotesQuery } from "../queries/knowledge-queries";

export default function KnowledgeNotesList({ lotId }: { lotId: string }) {
  const { data: notes, isLoading } = useKnowledgeNotesQuery(lotId);

  if (isLoading) return <p className="text-sm text-zinc-400">Loading notes...</p>;
  if (!notes || notes.length === 0) return <p className="text-sm text-zinc-500">No knowledge notes yet.</p>;

  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <div key={note.id} className="rounded border border-zinc-700/50 bg-zinc-800/50 p-3">
          <div className="flex items-center gap-2">
            <span className="rounded bg-zinc-700 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-300">
              {note.note_type}
            </span>
            <span className="text-[10px] text-zinc-500">{new Date(note.created_at).toLocaleDateString()}</span>
          </div>
          <p className="mt-1 text-sm text-zinc-200">{note.content}</p>
        </div>
      ))}
    </div>
  );
}

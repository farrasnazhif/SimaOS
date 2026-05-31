"use client";

import { useKnowledgeNotesQuery } from "../queries/knowledge-queries";
import EmptyState from "@/components/ui/empty-state";

export default function KnowledgeNotesList({ lotId }: { lotId: string }) {
  const { data: notes, isLoading } = useKnowledgeNotesQuery(lotId);

  if (isLoading) return <p className="text-sm text-zinc-400">Loading notes...</p>;
  if (!notes || notes.length === 0) return <EmptyState message="No knowledge notes yet." className="text-zinc-400" />;

  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <div key={note.id} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700 border border-emerald-200">
              {note.note_type}
            </span>
            <span className="text-[10px] text-zinc-400">{new Date(note.created_at).toLocaleDateString()}</span>
          </div>
          <p className="mt-1 text-sm text-zinc-700">{note.content}</p>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useCreateKnowledgeNoteMutation } from "../queries/knowledge-queries";
import { toast } from "sonner";
import Button from "@/components/ui/buttons/button";

const noteTypes = ["observation", "recommendation", "historical_insight", "defect_pattern"];

export default function KnowledgeNoteForm({ lotId, materialName }: { lotId: string; materialName: string }) {
  const [content, setContent] = useState("");
  const [noteType, setNoteType] = useState("observation");
  const mutation = useCreateKnowledgeNoteMutation();

  function handleSubmit() {
    if (!content.trim()) return;
    toast.promise(
      mutation.mutateAsync({ lotId, materialName, noteType, content: content.trim() }),
      { loading: "Saving note...", success: "Note saved.", error: "Failed to save note." }
    );
    setContent("");
  }

  return (
    <div className="space-y-3 rounded border border-zinc-700/50 bg-zinc-800/50 p-4">
      <p className="text-xs font-bold uppercase text-zinc-500">Add Knowledge Note</p>
      <select
        value={noteType}
        onChange={(e) => setNoteType(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-blue-500 focus:outline-none"
      >
        {noteTypes.map((t) => (
          <option key={t} value={t}>{t.replace("_", " ")}</option>
        ))}
      </select>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your expertise..."
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
        rows={3}
      />
      <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={mutation.isPending}>
        Save Note
      </Button>
    </div>
  );
}

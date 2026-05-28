"use client";

import { useState } from "react";
import { BotMessageSquare, X } from "lucide-react";
import { useCopilotMutation } from "../queries/copilot-queries";
import Button from "@/components/ui/buttons/button";

type Message = { role: "user" | "assistant"; content: string };

export default function FloatingCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const mutation = useCopilotMutation();

  async function handleSend() {
    const question = input.trim();
    if (!question) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);

    try {
      const answer = await mutation.mutateAsync(question);
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Failed to get response." }]);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat panel */}
      {isOpen && (
        <div className="mb-3 flex h-[420px] w-[360px] flex-col overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 bg-emerald-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <BotMessageSquare className="size-5 text-emerald-600" />
              <span className="text-sm font-semibold text-zinc-800">Manufacturing Copilot</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-600">
              <X className="size-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-sm text-zinc-400">Ask about lots, suppliers, quality, or operations...</p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`text-sm ${msg.role === "user" ? "text-emerald-700" : "text-zinc-700"}`}>
                <span className="block text-[10px] font-bold uppercase text-zinc-400">
                  {msg.role === "user" ? "You" : "Copilot"}
                </span>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
            {mutation.isPending && <p className="text-sm text-zinc-400 animate-pulse">Thinking...</p>}
          </div>

          {/* Input */}
          <div className="flex gap-2 border-t border-zinc-100 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask the copilot..."
              className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none"
            />
            <Button variant="primary" size="sm" onClick={handleSend} isLoading={mutation.isPending}>
              Send
            </Button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors"
      >
        {isOpen ? <X className="size-6" /> : <BotMessageSquare className="size-6" />}
      </button>
    </div>
  );
}

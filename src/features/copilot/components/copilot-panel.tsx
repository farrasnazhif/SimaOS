"use client";

import { useState } from "react";
import { useCopilotMutation } from "../queries/copilot-queries";
import Button from "@/components/ui/buttons/button";

type Message = { role: "user" | "assistant"; content: string };

export default function CopilotPanel() {
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
    <div className="flex h-[400px] flex-col rounded-lg border border-zinc-700/50 bg-zinc-900">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-zinc-500">Ask about lots, suppliers, quality, or operations...</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`text-sm ${msg.role === "user" ? "text-blue-300" : "text-zinc-200"}`}>
            <span className="font-bold text-[10px] uppercase text-zinc-500 block">
              {msg.role === "user" ? "You" : "Copilot"}
            </span>
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
        {mutation.isPending && <p className="text-sm text-zinc-400 animate-pulse">Thinking...</p>}
      </div>

      {/* Input */}
      <div className="flex gap-2 border-t border-zinc-700/50 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Ask the copilot..."
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
        />
        <Button variant="primary" size="sm" onClick={handleSend} isLoading={mutation.isPending}>
          Send
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, X } from "lucide-react";

import { useCopilotMutation } from "../queries/copilot-queries";
import IconButton from "@/components/ui/buttons/icon-button";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function FloatingCopilot() {
  const [isOpen, setIsOpen] = useState(false);

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const mutation = useCopilotMutation();

  async function handleSend() {
    const question = input.trim();

    if (!question) return;

    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);

    try {
      const answer = await mutation.mutateAsync(question);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to get response.",
        },
      ]);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              y: 20,
            }}
            transition={{
              duration: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              transformOrigin: "bottom right",
            }}
            className="absolute bottom-20 right-0 flex h-[620px] w-[350px] flex-col overflow-hidden rounded-[32px] border border-zinc-200 bg-[#F4F7F6] shadow-[0_20px_70px_rgba(0,0,0,0.16)]"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0E8752]">
                    <Image
                      src="/assets/sima-copilot.png"
                      alt="Sima Copilot"
                      width={20}
                      height={20}
                    />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold leading-none text-zinc-900">
                      Sima Copilot
                    </h2>

                    <p className="mt-1 text-xs text-zinc-500">
                      AI operational assistant
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
              {/* messages */}
              <div className="flex-1 overflow-y-auto px-5 py-5">
                {messages.length > 0 && (
                  <div className="space-y-3">
                    {messages.map((message, index) => {
                      const isUser = message.role === "user";

                      return (
                        <motion.div
                          key={`${message.role}-${index}`}
                          initial={{
                            opacity: 0,
                            y: 6,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            duration: 0.14,
                          }}
                          className={`flex ${
                            isUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[82%] rounded-[22px] px-4 py-3 text-sm leading-relaxed ${
                              isUser
                                ? "bg-[#0E8752] text-white"
                                : "bg-white text-zinc-800 shadow-sm"
                            }`}
                          >
                            {message.content}
                          </div>
                        </motion.div>
                      );
                    })}

                    {mutation.isPending && (
                      <div className="flex justify-start">
                        <div className="rounded-[20px] bg-white px-4 py-3 shadow-sm">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-[#0E8752]" />
                            <div className="h-2 w-2 animate-bounce rounded-full bg-[#0E8752] [animation-delay:0.15s]" />
                            <div className="h-2 w-2 animate-bounce rounded-full bg-[#0E8752] [animation-delay:0.3s]" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* empty state */}
              {messages.length === 0 && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.18,
                  }}
                  className="px-5 pt-4"
                >
                  <p className="text-center text-sm text-zinc-500">
                    Search reports, batches, and more…
                  </p>
                </motion.div>
              )}

              {/* input */}
              <div className="bg-[#F4F7F6] px-5 py-4">
                <div className="rounded-[24px] border-2 border-[#E2E2E2] bg-white p-4">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();

                        handleSend();
                      }
                    }}
                    placeholder="Message..."
                    rows={1}
                    className="min-h-[24px] w-full resize-none bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                  />

                  <div className="mt-4 flex items-center justify-end">
                    <IconButton
                      onClick={handleSend}
                      disabled={mutation.isPending}
                      size="sm"
                      icon={ArrowUp}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* fab */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{
          scale: 1.04,
        }}
        whileTap={{
          scale: 0.96,
        }}
        transition={{
          duration: 0.16,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute bottom-0 right-0 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#0E8752] text-white shadow-[0_12px_40px_rgba(16,185,129,0.35)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{
                opacity: 0,
                rotate: -90,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                rotate: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                rotate: 90,
                scale: 0.8,
              }}
              transition={{
                duration: 0.14,
              }}
            >
              <X className="size-6" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{
                opacity: 0,
                rotate: 90,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                rotate: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                rotate: -90,
                scale: 0.8,
              }}
              transition={{
                duration: 0.14,
              }}
            >
              <Image
                width={24}
                height={24}
                alt="Sima Copilot"
                src="/assets/sima-copilot.png"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

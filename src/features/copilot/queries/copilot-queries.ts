"use client";

import { useMutation } from "@tanstack/react-query";
import { copilotAction } from "../actions/copilot-action";

export function useCopilotMutation() {
  return useMutation({
    mutationKey: ["copilot", "ask"],
    mutationFn: async (question: string) => {
      return copilotAction(question);
    },
  });
}

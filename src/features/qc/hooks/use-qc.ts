"use client";

import { useCreateBatchWithQcMutation } from "../queries/qc-queries";

export function useQc() {
  const createBatchWithQcMutation = useCreateBatchWithQcMutation();

  return {
    createBatchWithQc: createBatchWithQcMutation.mutateAsync,
    createBatchWithQcMutation,
    isProcessing: createBatchWithQcMutation.isPending,
  };
}

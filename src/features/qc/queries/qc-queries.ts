"use client";

import { useMutation } from "@tanstack/react-query";
import { gradeQcAction } from "../actions/grade-qc-action";

export type GradeQcInput = {
  imageDataUrl: string;
  materialType: string;
  supplier: string;
  quantityKg: number;
};

export type InspectionAnalysis = {
  qualityScore: number;
  colorAssessment: string;
  defects: string[];
  foreignMatter: boolean;
  recommendation: string;
  notes: string;
};

const qcKeys = {
  grade: ["qc", "grade"] as const,
};

export function useGradeQcMutation() {
  return useMutation({
    mutationKey: qcKeys.grade,
    mutationFn: gradeQcAction,
  });
}

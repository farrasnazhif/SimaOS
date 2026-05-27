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

export type CreateBatchWithQcResult = {
  analysis: InspectionAnalysis;
  lotId: string;
  lotNumber: string;
};

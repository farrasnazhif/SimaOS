export type GradeQcInput = {
  imageDataUrl: string;
  materialType: string;
  supplier: string;
  quantityKg: number;
};

export type Detection = {
  label: string;
  x: number; // percentage 0-100 from left
  y: number; // percentage 0-100 from top
  width: number; // percentage 0-100
  height: number; // percentage 0-100
};

export type InspectionAnalysis = {
  qualityScore: number;
  colorAssessment: string;
  defects: string[];
  foreignMatter: boolean;
  recommendation: string;
  notes: string;
  detections: Detection[];
};

export type CreateBatchWithQcResult = {
  analysis: InspectionAnalysis;
  lotId: string;
  lotNumber: string;
};

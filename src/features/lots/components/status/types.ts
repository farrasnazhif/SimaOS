export type LotRow = {
  id: string;
  lot_number: string;
  material_name: string;
  quantity_kg: number;
  arrival_date: string;
  status: string;
  supplier: { name: string } | null;
  qc_inspections: { ai_quality_score: number }[];
};

export type StatusConfig = {
  label: string;
  heading: string;
  description: string;
  badgeBg: string;
  badgeText: string;
};

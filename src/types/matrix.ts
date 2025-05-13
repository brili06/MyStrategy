export type MatrixType = "ife" | "efe" | "ie" | "strategies";
export type FactorCategory = "strength" | "weakness" | "opportunity" | "threat";

export interface Factor {
  id: string;
  description: string;
  weight: number;
  rating: number;
  category?: FactorCategory;
}

export interface CompanyProfile {
  name: string;
  industry: string;
  description: string;
  vision: string;
  mission: string;
}

export interface SwotItem {
  id: string;
  description: string;
  category: FactorCategory;
  significance?: string;
}


export interface SubItem {
  name: string;
  weight: number; // Percentage within the parent category or absolute points
  description?: string;
}

export interface GradingCategory {
  name: string;
  overallWeight: number; // Percentage of the total course (0-100)
  subItems?: SubItem[];
  maxPoints?: number;
}

export interface SyllabusData {
  courseName: string;
  gradingScale?: {
    letter: string;
    minPercent: number;
  }[];
  breakdown: GradingCategory[];
  totalWeightNote?: string;
}

export interface ParsedResponse {
  syllabus: SyllabusData;
}

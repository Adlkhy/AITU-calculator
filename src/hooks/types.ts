export interface GradeItem {
  id: string;
  category: string;
  weight: number; // 0-100
  score?: number; // 0-100, user input
}

export interface ParsingResult {
  category: string;
  weight: number;
}

export interface ParsedResponse {
  breakdown: ParsingResult[];
}

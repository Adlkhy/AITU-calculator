// ──────────────────────────────────────────────────────────────────────────────
// Subject Directory Types
// ──────────────────────────────────────────────────────────────────────────────

/** Entry type for a tool without a JSON template (e.g. Custom, GPA, Attendance) */
export type SubjectType = 'template' | 'tool';

/**
 * A single row from /public/data/subjects-index.json.
 * Drives both the directory page cards and the dynamic template loader.
 */
export interface SubjectEntry {
  /** URL-safe kebab-case identifier — used as :subjectSlug in the route */
  slug: string;
  /** Short display name shown in cards and the page heading */
  name: string;
  /** Full official course name used by react-helmet for the <title> tag */
  courseName: string;
  /** One- or two-sentence description for the card body and meta description */
  description: string;
  /**
   * Filename inside /public/templates/ to fetch.
   * null for non-template tools (Custom, GPA, Attendance, Budget).
   */
  file: string | null;
  /** Determines whether to fetch a JSON template or render a built-in tool */
  type: SubjectType;
  /** Program tags used for future filtering (e.g. "CS", "SE", "ALL") */
  tags: string[];
}

// ──────────────────────────────────────────────────────────────────────────────
// Grade Calculator Types
// ──────────────────────────────────────────────────────────────────────────────

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
  key: string; 
}

export interface ParsedResponse {
  syllabus: SyllabusData;
}

/**
 * Leaderboard utility functions for transcript-based rankings
 */

export interface TrimesterGPA {
  trimester1?: number;
  trimester2?: number;
  trimester3?: number;
}

export interface TranscriptData {
  gpa: TrimesterGPA;
  subjects?: unknown[];
}

/**
 * Extract year/course from email (first 2 digits)
 * 25 = 1st course, 24 = 2nd course, 23 = 3rd course
 */
export function extractYearFromEmail(email: string | null | undefined): string {
  if (!email) return 'Unknown course';
  
  const match = email.match(/^(\d{2})/);
  if (!match) return 'Unknown course';
  
  const year = parseInt(match[1], 10);
  const currentYear = new Date().getFullYear();
  const yearsAgo = currentYear - year;
  
  if (yearsAgo === 0) return '1st course';
  if (yearsAgo === 1) return '2nd course';
  if (yearsAgo === 2) return '3rd course';
  
  return `${yearsAgo + 1}th course`;
}

/**
 * Calculate performance tier based on GPA
 */
export function calculatePerformance(gpa: number | null | undefined): string {
  if (!gpa || gpa === undefined) return 'At Risk';
  
  if (gpa >= 3.67) return 'Nerd';
  if (gpa >= 2.33) return 'Survivor';
  if (gpa >= 1.0) return 'At Risk';
  return 'RIP';
}

/**
 * Get trimester GPA by name
 */
export function getTrimesterGPA(data: TranscriptData | null | undefined, trimesterNum: number): number | null {
  if (!data?.gpa) return null;
  
  if (trimesterNum === 1) return data.gpa.trimester1 ?? null;
  if (trimesterNum === 2) return data.gpa.trimester2 ?? null;
  if (trimesterNum === 3) return data.gpa.trimester3 ?? null;
  
  return null;
}

/**
 * Get average of available trimester GPAs
 */
export function getAverageGPA(data: TranscriptData | null | undefined): number | null {
  if (!data?.gpa) return null;
  
  const gpas = [data.gpa.trimester1, data.gpa.trimester2, data.gpa.trimester3].filter(
    (g): g is number => g !== null && g !== undefined && !isNaN(g)
  );
  
  if (gpas.length === 0) return null;
  
  const sum = gpas.reduce((a, b) => a + b, 0);
  return sum / gpas.length;
}

/**
 * Get available trimesters from data
 */
export function getAvailableTrimesters(data: TranscriptData | null | undefined): number[] {
  if (!data?.gpa) return [];
  
  const trimesters: number[] = [];
  if (data.gpa.trimester1 !== null && data.gpa.trimester1 !== undefined) trimesters.push(1);
  if (data.gpa.trimester2 !== null && data.gpa.trimester2 !== undefined) trimesters.push(2);
  if (data.gpa.trimester3 !== null && data.gpa.trimester3 !== undefined) trimesters.push(3);
  
  return trimesters;
}

/**
 * Parse JSON data from transcript_imports
 */
export function parseTranscriptData(data: unknown): TranscriptData | null {
  try {
    if (typeof data === 'string') {
      return JSON.parse(data) as TranscriptData;
    }
    return data as TranscriptData;
  } catch (error) {
    console.error('Error parsing transcript data:', error);
    return null;
  }
}

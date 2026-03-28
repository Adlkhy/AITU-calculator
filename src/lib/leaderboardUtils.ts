/**
 * Leaderboard utility functions for transcript-based rankings
 */

export interface TrimesterGPA {
  average?: number;
  trimester1?: number;
  trimester2?: number;
  trimester3?: number;
}

export interface TranscriptData {
  gpa: TrimesterGPA;
  subjects?: unknown[];
}

/*
  Extract admission cohort from email and determine current university year.
 */
export function extractYearFromEmail(email: string | null | undefined): string {
  if (!email) return 'Unknown course';
  
  const match = email.match(/^(\d{2})/);
  if (!match) return 'Unknown course';
  
  const admissionYear = parseInt(match[1], 10);
  const now = new Date();
  const currentYearTwoDigits = now.getFullYear() % 100;
  const academicYearCohort = now.getMonth() >= 8
    ? currentYearTwoDigits
    : (currentYearTwoDigits + 99) % 100;

  let yearsSinceAdmission = academicYearCohort - admissionYear;
  if (yearsSinceAdmission < 0) yearsSinceAdmission += 100;
  console.log(`Email: ${email}, Admission Year: ${admissionYear}, Academic Cohort: ${academicYearCohort}, Years Since Admission: ${yearsSinceAdmission}`);

  if (yearsSinceAdmission === 0) return 'Freshman (1st year)';
  if (yearsSinceAdmission === 1) return 'Junior (2nd year)';
  if (yearsSinceAdmission === 2) return 'Senior (3rd year)';

  // Program duration is 3 years.
  return 'Graduated';
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

  // New transcript format stores precomputed average at gpa.average.
  if (typeof data.gpa.average === 'number' && Number.isFinite(data.gpa.average)) {
    return data.gpa.average;
  }

  // Backward compatibility for older records without gpa.average.
  const trimesterGPAs = [data.gpa.trimester1, data.gpa.trimester2, data.gpa.trimester3].filter(
    (value): value is number => typeof value === 'number' && Number.isFinite(value)
  );

  if (trimesterGPAs.length === 0) return null;

  const total = trimesterGPAs.reduce((sum, value) => sum + value, 0);
  return total / trimesterGPAs.length;
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

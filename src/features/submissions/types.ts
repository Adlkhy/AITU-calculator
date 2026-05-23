export const ALLOWED_SUBMISSION_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export type AllowedSubmissionMimeType = (typeof ALLOWED_SUBMISSION_MIME_TYPES)[number];

export const MAX_SUBMISSION_SIZE_BYTES = 10 * 1024 * 1024;

export interface SubmissionValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface CreateSubmissionInput {
  userId: string;
  file: File;
  teacherName: string;
  subjectTitle: string;
  year?: string | null;
}

export interface CreatedSubmission {
  id: string;
  storagePath: string;
}

import { supabase } from '@/lib/supabaseClient';
import {
  ALLOWED_SUBMISSION_MIME_TYPES,
  MAX_SUBMISSION_SIZE_BYTES,
  type CreateSubmissionInput,
  type CreatedSubmission,
  type SubmissionValidationResult,
} from '../types';

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
}

async function sha256Hex(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((value) => value.toString(16).padStart(2, '0')).join('');
}

export function validateSubmissionFile(file: File | null): SubmissionValidationResult {
  const errors: string[] = [];

  if (!file) {
    errors.push('Please select a file to upload.');
    return { isValid: false, errors };
  }

  if (!ALLOWED_SUBMISSION_MIME_TYPES.includes(file.type as (typeof ALLOWED_SUBMISSION_MIME_TYPES)[number])) {
    errors.push('Only JPG, PNG, and WEBP image files are allowed. PDFs are not accepted.');
  }

  if (file.size > MAX_SUBMISSION_SIZE_BYTES) {
    errors.push('File is too large. Maximum size is 10 MB.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function buildStoragePath(userId: string, submissionId: string, fileName: string): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${userId}/${year}/${month}/${submissionId}/${sanitizeFilename(fileName)}`;
}

export async function createSyllabusSubmission(input: CreateSubmissionInput): Promise<CreatedSubmission> {
  const submissionId = crypto.randomUUID();
  const storagePath = buildStoragePath(input.userId, submissionId, input.file.name);
  const fileHash = await sha256Hex(input.file);

  const { error: uploadError } = await supabase.storage
    .from('syllabus-submissions')
    .upload(storagePath, input.file, {
      upsert: false,
      contentType: input.file.type,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { error: insertError } = await supabase.from('syllabus_submissions').insert([
    {
      id: submissionId,
      submitter_id: input.userId,
      status: 'pending_review',
      storage_bucket: 'syllabus-submissions',
      storage_path: storagePath,
      source_file_name: input.file.name,
      source_mime_type: input.file.type,
      source_size_bytes: input.file.size,
      source_sha256: fileHash,
      teacher: input.teacherName,
      subject_title: input.subjectTitle,
      year_label: input.year ?? null,
    },
  ]);

  if (insertError) {
    await supabase.storage.from('syllabus-submissions').remove([storagePath]);
    throw insertError;
  }

  return {
    id: submissionId,
    storagePath,
  };
}

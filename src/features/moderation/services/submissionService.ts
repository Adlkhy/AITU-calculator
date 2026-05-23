import { supabase } from '@/lib/supabaseClient';
import type {
  SyllabusSubmissionRecord,
  SyllabusSubmissionStatus,
  UpdateSubmissionPayload,
} from '../types';

const REVIEW_QUEUE_STATUSES: SyllabusSubmissionStatus[] = [
  'pending_review',
  'ocr_ready',
  'generation_ready',
  'changes_requested',
  'approved',
];

export async function listModerationQueue(): Promise<SyllabusSubmissionRecord[]> {
  const { data, error } = await supabase
    .from('syllabus_submissions')
    .select(
      [
        'id',
        'submitter_id',
        'assigned_admin_id',
        'status',
        'source_file_name',
        'source_mime_type',
        'source_size_bytes',
        'submitter_notes',
        'admin_notes',
        'review_priority',
        'created_at',
        'reviewed_at',
        'published_at',
      ].join(',')
    )
    .in('status', REVIEW_QUEUE_STATUSES)
    .order('review_priority', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as unknown as Record<string, unknown>[];

  return rows.map((row) => ({
    id: String(row.id ?? ''),
    submitter_id: String(row.submitter_id ?? ''),
    assigned_admin_id: (row.assigned_admin_id as string | null) ?? null,
    status: row.status as SyllabusSubmissionStatus,
    source_file_name: String(row.source_file_name ?? ''),
    source_mime_type: String(row.source_mime_type ?? ''),
    source_size_bytes: Number(row.source_size_bytes ?? 0),
    submitter_notes: (row.submitter_notes as string | null) ?? null,
    admin_notes: (row.admin_notes as string | null) ?? null,
    review_priority: Number(row.review_priority ?? 3),
    created_at: String(row.created_at ?? ''),
    reviewed_at: (row.reviewed_at as string | null) ?? null,
    published_at: (row.published_at as string | null) ?? null,
  }));
}

export async function updateSubmissionStatus(
  submissionId: string,
  payload: UpdateSubmissionPayload
): Promise<void> {
  const updates: {
    status: SyllabusSubmissionStatus;
    admin_notes?: string;
    reviewed_at?: string;
    published_at?: string;
  } = {
    status: payload.status,
  };

  if (payload.adminNotes && payload.adminNotes.trim().length > 0) {
    updates.admin_notes = payload.adminNotes.trim();
  }

  if (payload.status === 'published') {
    updates.published_at = new Date().toISOString();
  }

  if (payload.status === 'approved' || payload.status === 'rejected' || payload.status === 'published') {
    updates.reviewed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('syllabus_submissions')
    .update(updates)
    .eq('id', submissionId);

  if (error) {
    throw error;
  }
}

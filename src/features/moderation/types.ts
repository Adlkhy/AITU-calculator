export const SYLLABUS_SUBMISSION_STATUSES = [
  'draft_upload',
  'pending_review',
  'ocr_ready',
  'generation_in_progress',
  'generation_ready',
  'changes_requested',
  'approved',
  'published',
  'rejected',
  'archived',
] as const;

export type SyllabusSubmissionStatus = (typeof SYLLABUS_SUBMISSION_STATUSES)[number];

export interface SyllabusSubmissionRecord {
  id: string;
  submitter_id: string;
  assigned_admin_id: string | null;
  status: SyllabusSubmissionStatus;
  source_file_name: string;
  source_mime_type: string;
  source_size_bytes: number;
  submitter_notes: string | null;
  admin_notes: string | null;
  review_priority: number;
  created_at: string;
  reviewed_at: string | null;
  published_at: string | null;
}

export interface ModerationStatusOption {
  value: SyllabusSubmissionStatus;
  label: string;
}

export const MODERATION_STATUS_OPTIONS: ModerationStatusOption[] = [
  { value: 'pending_review', label: 'Pending review' },
  { value: 'generation_ready', label: 'Generation ready' },
  { value: 'approved', label: 'Approved' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
];

export interface UpdateSubmissionPayload {
  status: SyllabusSubmissionStatus;
  adminNotes?: string;
}

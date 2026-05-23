import { supabase } from '@/lib/supabaseClient';

export async function getSubmissionDetail(submissionId: string) {
  // Fetch only submission metadata for preview + manual generation flow.
  const { data, error } = await supabase
    .from('syllabus_submissions')
    .select(
      `
      id,
      submitter_id,
      assigned_admin_id,
      status,
      storage_bucket,
      storage_path,
      source_file_name,
      source_mime_type,
      source_size_bytes,
      source_sha256,
      submitter_notes,
      admin_notes,
      review_priority,
      teacher,
      subject_title,
      year_label,
      created_at,
      reviewed_at,
      published_at
    `
    )
    .eq('id', submissionId)
    .single();

  if (error) throw error;

  return data;
}

export async function getSignedPreviewUrl(bucket: string, path: string, maxAgeSeconds = 60 * 60) {
  // Supabase client supports createSignedUrl
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, maxAgeSeconds);
  if (error) throw error;
  return data.signedUrl as string;
}

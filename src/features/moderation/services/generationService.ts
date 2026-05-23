import { supabase } from '@/lib/supabaseClient';

interface TriggerGenerationPayload {
  submissionId: string;
}

export type GeneratedTemplate = Record<string, unknown>;

function toSafeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'template';
}

export type GeneratedTemplateResponse = {
  template: GeneratedTemplate;
  meta?: { subjectTitle?: string | null; teacher?: string | null; yearLabel?: string | null };
};

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

async function fetchSubjectsIndex(): Promise<Array<Record<string, unknown>>> {
  try {
    const resp = await fetch('/data/subjects-index.json');
    if (!resp.ok) return [];
    return (await resp.json()) as Array<Record<string, unknown>>;
  } catch {
    return [];
  }
}

export async function downloadGeneratedTemplate(response: GeneratedTemplateResponse | GeneratedTemplate): Promise<void> {
  const subjects = await fetchSubjectsIndex();

  const template = (response as GeneratedTemplateResponse).template ?? (response as GeneratedTemplate);
  const meta = (response as GeneratedTemplateResponse).meta ?? undefined;

  const out: Record<string, unknown> = { ...(template as Record<string, unknown>) };

  // Merge meta from submission if present
  if (meta) {
    if (!out.courseName && meta.subjectTitle) out.courseName = meta.subjectTitle;
    if (!out.subjectName && meta.subjectTitle) out.subjectName = meta.subjectTitle;
    if (!out.teacher && meta.teacher) out.teacher = meta.teacher;
    if (!out.yearLabel && meta.yearLabel) out.yearLabel = meta.yearLabel;
  }

  const matchKey = normalizeText(out.subjectName ?? out.courseName ?? meta?.subjectTitle);
  if (matchKey) {
    const found = subjects.find((s) => {
      const subjectName = normalizeText(s.name ?? s.courseName ?? s.slug);
      return subjectName === matchKey || normalizeText(s.courseName) === matchKey;
    });

    if (found) {
      if (!out.subjectName && typeof found.name === 'string' && found.name.trim()) {
        out.subjectName = found.name;
      }
      if (!out.courseName && typeof found.courseName === 'string' && found.courseName.trim()) {
        out.courseName = found.courseName;
      }
      if (!out.teacher && typeof found.teacher === 'string' && found.teacher.trim()) {
        out.teacher = found.teacher;
      }
    }
  }

  const fileBase = String(out.courseName ?? meta?.subjectTitle ?? 'template');
  const fileName = `${toSafeSlug(fileBase)}.json`;
  const json = JSON.stringify(out, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function triggerManualGeneration(payload: TriggerGenerationPayload): Promise<GeneratedTemplateResponse> {
  const { data, error } = await supabase.functions.invoke('admin-generate-template', {
    body: {
      submissionId: payload.submissionId,
    },
  });

  if (error) {
    throw error;
  }

  if (!data || typeof data !== 'object') {
    throw new Error('invalid_generation_response');
  }

  // If backend returns { template, meta } use it, otherwise assume whole object is template
  if ('template' in (data as Record<string, unknown>)) {
    return data as GeneratedTemplateResponse;
  }

  return { template: data as GeneratedTemplate };
}

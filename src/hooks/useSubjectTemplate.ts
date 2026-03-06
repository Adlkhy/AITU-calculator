import { useState, useEffect } from 'react';
import type { SubjectEntry, SyllabusData } from './types';

// ──────────────────────────────────────────────────────────────────────────────
// useSubjectsIndex
// Fetches the subjects-index.json and returns the full list of subject entries.
// ──────────────────────────────────────────────────────────────────────────────

interface UseSubjectsIndexResult {
  subjects: SubjectEntry[];
  isLoading: boolean;
  error: string | null;
}

export function useSubjectsIndex(): UseSubjectsIndexResult {
  const [subjects, setSubjects] = useState<SubjectEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/data/subjects-index.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load subject index (${res.status})`);
        return res.json() as Promise<SubjectEntry[]>;
      })
      .then((data) => {
        if (!cancelled) {
          setSubjects(data);
          setIsLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  return { subjects, isLoading, error };
}

// ──────────────────────────────────────────────────────────────────────────────
// useSubjectTemplate
// Given a URL slug, resolves the SubjectEntry from the index then fetches the
// corresponding SyllabusData JSON template from /public/templates/.
// ──────────────────────────────────────────────────────────────────────────────

type LoadingState = 'idle' | 'loading' | 'success' | 'not_found' | 'error';

interface UseSubjectTemplateResult {
  subject: SubjectEntry | null;
  template: SyllabusData | null;
  state: LoadingState;
}

export function useSubjectTemplate(slug: string | undefined): UseSubjectTemplateResult {
  const [subject, setSubject] = useState<SubjectEntry | null>(null);
  const [template, setTemplate] = useState<SyllabusData | null>(null);
  const [state, setState] = useState<LoadingState>('loading');

  useEffect(() => {
    if (!slug) {
      setState('not_found');
      return;
    }

    let cancelled = false;
    setState('loading');
    setSubject(null);
    setTemplate(null);

    // Step 1: resolve slug -> SubjectEntry from the index
    fetch('/data/subjects-index.json')
      .then((res) => {
        if (!res.ok) throw new Error('index_fetch_failed');
        return res.json() as Promise<SubjectEntry[]>;
      })
      .then((entries) => {
        const entry = entries.find((e) => e.slug === slug);

        if (!entry) {
          if (!cancelled) setState('not_found');
          return;
        }

        if (!cancelled) setSubject(entry);

        // Step 2: if it's a tool (no file), we're done — the page renders
        // the appropriate built-in component instead of GradeCalculator.
        if (!entry.file) {
          if (!cancelled) setState('success');
          return;
        }

        // Step 3: fetch the template JSON
        return fetch(`/templates/${entry.file}`)
          .then((res) => {
            if (!res.ok) throw new Error('template_fetch_failed');
            return res.json() as Promise<SyllabusData>;
          })
          .then((data) => {
            if (!cancelled) {
              setTemplate(data);
              setState('success');
            }
          });
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });

    return () => { cancelled = true; };
  }, [slug]);

  return { subject, template, state };
}

export interface GuestGrades {
  courseName: string;
  scores: Record<string, number>;
}

const storageKey = (subject: string) => `evalis:guest-grades:v1:${encodeURIComponent(subject)}`;

export function readGuestGrades(subject: string, layout: string): {
  draft: GuestGrades | null;
  unavailable: boolean;
} {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(storageKey(subject));
  } catch {
    return { draft: null, unavailable: true };
  }

  try {
    const saved = raw ? JSON.parse(raw) : null;
    // Scores use category indexes: never restore them onto a changed syllabus.
    if (saved?.version !== 1 || saved.layout !== layout ||
        typeof saved.courseName !== 'string' || !saved.scores ||
        typeof saved.scores !== 'object' || Array.isArray(saved.scores) ||
        !Object.entries(saved.scores).every(([key, score]) =>
          /^\d+-(main|\d+)$/.test(key) && typeof score === 'number' &&
          Number.isFinite(score) && score >= 0 && score <= 100)) {
      return { draft: null, unavailable: false };
    }
    return { draft: { courseName: saved.courseName, scores: saved.scores }, unavailable: false };
  } catch {
    return { draft: null, unavailable: false };
  }
}

export function writeGuestGrades(subject: string, layout: string, draft: GuestGrades): boolean {
  try {
    window.localStorage.setItem(storageKey(subject), JSON.stringify({ version: 1, layout, ...draft }));
    return true;
  } catch {
    return false;
  }
}

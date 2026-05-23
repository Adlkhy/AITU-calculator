import { useCallback, useEffect, useState } from 'react';
import { listModerationQueue, updateSubmissionStatus } from '../services/submissionService';
import type { SyllabusSubmissionRecord, UpdateSubmissionPayload } from '../types';

interface UseModerationQueueResult {
  submissions: SyllabusSubmissionRecord[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateStatus: (submissionId: string, payload: UpdateSubmissionPayload) => Promise<void>;
}

export function useModerationQueue(): UseModerationQueueResult {
  const [submissions, setSubmissions] = useState<SyllabusSubmissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const queue = await listModerationQueue();
      setSubmissions(queue);
    } catch (err) {
      console.error('Failed to load moderation queue:', err);
      setError('Failed to load moderation queue.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStatus = useCallback(
    async (submissionId: string, payload: UpdateSubmissionPayload) => {
      await updateSubmissionStatus(submissionId, payload);
      await refresh();
    },
    [refresh]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    submissions,
    isLoading,
    error,
    refresh,
    updateStatus,
  };
}

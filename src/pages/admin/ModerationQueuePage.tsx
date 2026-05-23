import { useState } from 'react';
import { Navbar08 } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useModerationQueue } from '@/features/moderation/hooks/useModerationQueue';
import type { SyllabusSubmissionStatus } from '@/features/moderation/types';
import { downloadGeneratedTemplate, triggerManualGeneration } from '@/features/moderation/services/generationService';

function bytesToLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function statusBadgeVariant(status: SyllabusSubmissionStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'published') return 'default';
  if (status === 'rejected') return 'destructive';
  if (status === 'approved' || status === 'generation_ready') return 'secondary';
  return 'outline';
}

export default function ModerationQueuePage() {
  const { submissions, isLoading, error, updateStatus, refresh } = useModerationQueue();
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  async function handleStatusChange(submissionId: string, status: SyllabusSubmissionStatus) {
    try {
      setUpdatingId(submissionId);
      await updateStatus(submissionId, {
        status,
        adminNotes: notesById[submissionId],
      });
    } catch (err) {
      console.error('Failed to update submission status:', err);
      alert('Failed to update status. Check console for details.');
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleGenerateTemplate(submissionId: string) {
    try {
      setGeneratingId(submissionId);
      const resp = await triggerManualGeneration({ submissionId });
      await downloadGeneratedTemplate(resp);
    } catch (err) {
      console.error('Failed to trigger generation:', err);
      alert('Failed to trigger generation. Ensure edge function admin-generate-template is deployed.');
    } finally {
      setGeneratingId(null);
    }
  }

  return (
    <>
      <Navbar08 />
      <main className="min-h-screen bg-background py-8 text-foreground">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Moderation Queue</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Review uploaded syllabus files, update statuses, and prepare records for manual AI generation.
              </p>
            </div>
            <Button variant="outline" onClick={() => void refresh()}>
              Refresh queue
            </Button>
          </header>

          {error && (
            <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading moderation queue...</div>
          ) : submissions.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Queue is empty</CardTitle>
                <CardDescription>No submissions are waiting for review right now.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => {
                const isUpdating = updatingId === submission.id;
                const isGenerating = generatingId === submission.id;

                return (
                  <Card key={submission.id}>
                    <CardHeader className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-lg">
                          <a href={`/admin/moderation/${submission.id}`} className="hover:underline">{submission.source_file_name}</a>
                        </CardTitle>
                        <Badge variant={statusBadgeVariant(submission.status)}>{submission.status}</Badge>
                        <Badge variant="outline">Priority {submission.review_priority}</Badge>
                      </div>
                      <CardDescription>
                        Submitted {new Date(submission.created_at).toLocaleString()} • {submission.source_mime_type} • {bytesToLabel(submission.source_size_bytes)}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="text-sm">
                        <span className="font-medium">Submitter:</span> <span className="text-muted-foreground">{submission.submitter_id}</span>
                      </div>

                      {submission.submitter_notes && (
                        <div className="text-sm">
                          <span className="font-medium">Submitter note:</span>{' '}
                          <span className="text-muted-foreground">{submission.submitter_notes}</span>
                        </div>
                      )}

                      <Input
                        value={notesById[submission.id] ?? submission.admin_notes ?? ''}
                        onChange={(event) =>
                          setNotesById((current) => ({
                            ...current,
                            [submission.id]: event.target.value,
                          }))
                        }
                        placeholder="Add moderation note"
                      />

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          disabled={isUpdating || isGenerating}
                          onClick={() => void handleGenerateTemplate(submission.id)}
                        >
                          {isGenerating ? 'Generating...' : 'Generate template'}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={isUpdating}
                          onClick={() => void handleStatusChange(submission.id, 'generation_ready')}
                        >
                          Mark ready for generate
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isUpdating}
                          onClick={() => void handleStatusChange(submission.id, 'rejected')}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          disabled={isUpdating}
                          onClick={() => void handleStatusChange(submission.id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isUpdating}
                          className="ml-auto "
                          onClick={() => void handleStatusChange(submission.id, 'published')}
                        >
                          Publish
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

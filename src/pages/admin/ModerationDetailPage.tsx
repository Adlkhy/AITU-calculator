import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar08 } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminRoute from '@/components/AdminRoute';
import { getSubmissionDetail, getSignedPreviewUrl } from '@/features/moderation/services/detailService';
import { downloadGeneratedTemplate, triggerManualGeneration } from '@/features/moderation/services/generationService';

type SubmissionDetail = {
  id: string;
  source_file_name?: string;
  submitter_id?: string;
  source_mime_type?: string;
  source_size_bytes?: number;
  storage_bucket?: string;
  storage_path?: string;
};

export default function ModerationDetailPage() {
  const { id } = useParams();
  // const { user } = useUser(); // not required here; AdminRoute handles access
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<SubmissionDetail | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!id) return;
      try {
        setLoading(true);
        const d = await getSubmissionDetail(id);
        if (cancelled) return;
        setDetail(d);

        // get signed URL for preview
        if (d?.storage_bucket && d?.storage_path) {
          try {
            const url = await getSignedPreviewUrl(d.storage_bucket, d.storage_path, 60 * 30);
            if (!cancelled) setPreviewUrl(url);
          } catch (err) {
            console.error('Failed to create signed URL', err);
          }
        }
      } catch (err: unknown) {
        console.error(err);
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [id]);

  if (!id) return <div>Invalid submission id</div>;

  return (
    <AdminRoute>
      <>
        <Navbar08 />
        <main className="min-h-screen py-8 bg-background text-foreground">
          <div className="mx-auto max-w-5xl px-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold">Moderation — Submission</h1>
              <div className="flex gap-2">
                <Link to="/admin/moderation">
                  <Button variant="ghost">Back to queue</Button>
                </Link>
              </div>
            </div>

            {error && <div className="p-3 bg-destructive/10 text-destructive rounded">{error}</div>}

            {loading ? (
              <Card>
                <CardContent>Loading...</CardContent>
              </Card>
            ) : !detail ? (
              <Card>
                <CardContent>No submission found.</CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Source</CardTitle>
                      <CardDescription>{detail.source_file_name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-3 text-sm">Uploaded by: {detail.submitter_id}</div>
                      <div className="mb-3 text-sm">MIME: {detail.source_mime_type}</div>
                      <div className="mb-3 text-sm">Size: {detail.source_size_bytes}</div>
                      {previewUrl && (
                        <div className="mt-4">
                          <a href={previewUrl} target="_blank" rel="noreferrer">
                            <Button>Open preview</Button>
                          </a>
                        </div>
                      )}
                        <div className="mt-3">
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={isGenerating}
                            onClick={async () => {
                              if (!detail?.id) return;
                              try {
                                setIsGenerating(true);
                                const resp = await triggerManualGeneration({ submissionId: detail.id });
                                await downloadGeneratedTemplate(resp);
                              } catch (err) {
                                console.error('Generation trigger failed', err);
                                alert('Failed to trigger generation.');
                              } finally {
                                setIsGenerating(false);
                              }
                            }}
                          >
                            {isGenerating ? 'Generating…' : 'Generate Template'}
                          </Button>
                        </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Local Template Workflow</CardTitle>
                      <CardDescription>Use Generate Template to download a JSON file, then add it to public/templates and deploy.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal ml-5 space-y-2 text-sm text-muted-foreground">
                        <li>Click Generate Template to download JSON generated from the uploaded syllabus.</li>
                        <li>Review and adjust the JSON structure if needed.</li>
                        <li>Save it in public/templates and deploy your frontend.</li>
                      </ol>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
      </>
    </AdminRoute>
  );
}

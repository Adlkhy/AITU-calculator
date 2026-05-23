import { useState } from 'react';
import { Navbar08 } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUser } from '@/hooks/useUser';
import { toast, Toaster } from 'sonner';
import {
  createSyllabusSubmission,
  validateSubmissionFile,
} from '@/features/submissions/services/submissionUploadService';

export default function SubmitSyllabusPage() {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [teacherName, setTeacherName] = useState('');
  const [subjectTitle, setSubjectTitle] = useState('');
  const [year, setYear] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);
    setStatusMessage(null);

    if (!user) {
      toast.error('You must be logged in to submit a syllabus.');
      return;
    }

    const validation = validateSubmissionFile(file);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Validate required fields
    const fieldErrors: string[] = [];
    if (!teacherName.trim()) fieldErrors.push('Teacher name is required.');
    if (!subjectTitle.trim()) fieldErrors.push('Subject title is required.');
    if (fieldErrors.length > 0) {
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const selectedFile = file;
      if (!selectedFile) {
        toast.error('Please select a file before submitting.');
        return;
      }

      await createSyllabusSubmission({
        userId: user.id,
        file: selectedFile,
        teacherName: teacherName.trim(),
        subjectTitle: subjectTitle.trim(),
        year: year.trim() || null,
      });

      setFile(null);
      toast.success('Syllabus submitted successfully. It is now in the moderation queue.');
    } catch (error) {
      console.error('Failed to submit syllabus:', error);
      toast.error('Upload failed. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Toaster position="top-center"/>
      <Navbar08 />
      <main className="min-h-screen bg-background py-8 text-foreground">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Submit Syllabus</CardTitle>
              <CardDescription>
                Upload a ONLY syllabus image of grading criteria for admin review template generation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <figure className="mb-4">
                <img src="/syllabus_submission_example.png" alt="Example of syllabus file" className="rounded border pointer-events-none select-none" />
                <figcaption className="text-xs sm:text-sm mt-2 text-muted-foreground">
                  Example of a syllabus file showing grading criteria. PDFs or handwritten notes are not accepted.
                </figcaption>
              </figure>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="syllabus-file">
                    File
                  </label>
                  <Input
                    id="syllabus-file"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => {
                      const nextFile = event.target.files?.[0] ?? null;
                      setFile(nextFile);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Allowed formats: JPG, PNG, WEBP. PDFs are not accepted. Maximum file size: 10 MB.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="teacher-name">
                      Teacher name
                    </label>
                    <Input id="teacher-name" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="subject-title">
                      Subject title
                    </label>
                    <Input id="subject-title" value={subjectTitle} onChange={(e) => setSubjectTitle(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="year-label">
                      Year (optional)
                    </label>
                    <Input id="year-label" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2026" />
                  </div>
                </div>

                {errors.length > 0 && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {errors.map((error) => (
                      <div key={error}>{error}</div>
                    ))}
                  </div>
                )}

                {statusMessage && (
                  <div className="rounded-md border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">
                    {statusMessage}
                  </div>
                )}

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

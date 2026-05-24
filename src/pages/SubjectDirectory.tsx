import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Search, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Navbar08 } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSubjectsIndex } from '@/hooks/useSubjectTemplate';
import type { SubjectEntry } from '@/hooks/types';
import { Button } from '@/components/ui/button';
import { SeoMeta } from '@/lib/seo';

// ─── Loading skeleton ────────────────────────────────────────────────────────

function DirectorySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xl border p-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-28 mt-auto" />
        </div>
      ))}
    </div>
  );
}

// ─── Single subject card ──────────────────────────────────────────────────────

function SubjectCard({ subject }: { subject: SubjectEntry }) {
  const isTemplate = subject.type === 'template';

  return (
    <Link
      to={`/calculator/${subject.slug}`}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      aria-label={`Open ${subject.name} calculator`}
    >
      <Card className="h-full transition-colors duration-200 hover:border-primary/60 hover:bg-accent/30 cursor-pointer">
        <CardHeader className="">
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant={isTemplate ? 'default' : 'secondary'}
              className="text-xs"
            >
              {isTemplate ? (
                <><BookOpen className="size-3" /> Template</>
              ) : (
                <><Wrench className="size-3" /> Tool</>
              )}
            </Badge>
          </div>
          <CardTitle className="text-base flex flex-col mt-2">{subject.name}
            {subject.teacher && (
              <span className="text-muted-foreground text-sm">
                by {subject.teacher}
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1">
          <CardDescription className="text-sm leading-relaxed">
            {subject.description}
          </CardDescription>
        </CardContent>

        <CardFooter>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all duration-200">
            Open calculator
            <ArrowRight className="size-4" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SubjectDirectory() {
  const { subjects, isLoading, error } = useSubjectsIndex();
  const [searchQuery, setSearchQuery] = useState('');

  const examCountdown = useMemo(() => {
    const msInDay = 1000 * 60 * 60 * 24;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const buildSchedule = (year: number) => ([
      { name: 'Midterm week', start: new Date(year, 3, 13), end: new Date(year, 3, 20) }, // Apr 13-20
      { name: 'Endterm week', start: new Date(year, 4, 18), end: new Date(year, 4, 24) }, // May 18-24
      { name: 'Finals', start: new Date(year, 4, 25), end: new Date(year, 5, 6) },        // May 25-Jun 6
    ]);

    const formatRange = (start: Date, end: Date) =>
      `${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;

    let schedule = buildSchedule(today.getFullYear());

    // If the whole season is over, show next year's schedule
    if (today > schedule[schedule.length - 1].end) {
      schedule = buildSchedule(today.getFullYear() + 1);
    }

    const current = schedule.find((item) => today >= item.start && today <= item.end);
    if (current) {
      return {
        mode: 'ongoing' as const,
        title: `${current.name} started May the Force be with you`,
        dateLabel: formatRange(current.start, current.end),
      };
    }

    const next = schedule.find((item) => today < item.start)!;
    const daysLeft = Math.round((next.start.getTime() - today.getTime()) / msInDay);

    return {
      mode: 'upcoming' as const,
      title: `Next: ${next.name}`,
      dateLabel: formatRange(next.start, next.end),
      daysLeft,
    };
  }, []);

  const filteredSubjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return subjects;

    return subjects.filter((subject) => {
      const subjectName = subject.name.toLowerCase();
      const subjectSlug = subject.slug.toLowerCase();
      const teacherName = subject.teacher?.toLowerCase() || '';
      return subjectName.includes(query) || subjectSlug.includes(query) || teacherName.includes(query);
    });
  }, [subjects, searchQuery]);

  const templateSubjects = filteredSubjects.filter((s) => s.type === 'template');
  const toolSubjects = filteredSubjects.filter((s) => s.type === 'tool');

  return (
    <>
      <SeoMeta
        title="Grade Tracking for AITU Students | Evalis"
        description="Choose from AITU subject grade calculators including Calculus, Programming, ADS, Discrete Math, and more. Track attestation scores and final grades with Evalis."
        path="/grade-tracker"
        keywords={[
          'AITU calculator',
          'AITU GPA calculator',
          'Astana IT University GPA',
          'AITU student tools',
          'Evalis',
        ]}
      />

      <Navbar08/>

      <div className="text-foreground min-h-screen font-sans">
        <div className="max-w-6xl mx-auto min-h-screen px-4 pt-10 pb-16 sm:px-8 sm:pt-14">
          {/* Countdown */}
          <div className="mb-6 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            {examCountdown.mode === 'ongoing'
              ? `${examCountdown.title} (${examCountdown.dateLabel})`
              : `${examCountdown.title}: ${examCountdown.dateLabel} • ${examCountdown.daysLeft} day${examCountdown.daysLeft === 1 ? '' : 's'} left`}
          </div>

          {/* Page header */}
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Grade Tracking for AITU Students
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl lg:max-w-3xl">
              Select a subject to calculate your grade across attestations and the final exam. Evalis keeps AITU student tools organized in one modern grade tracker. If you don't see your subject, you can create a custom calculator using the <Link to="/ai" className="text-primary hover:underline">AI builder</Link>.
              Or check out the <a href='#tools' className="text-primary hover:underline">custom calculator</a>.
            </p>

            <div className='flex flex-col w-full sm:flex-row items-end gap-6 justify-between'>
            <div className="relative mt-6 w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by subject name, slug, or teacher"
                className="pl-9"
                aria-label="Search subjects by name, slug, or teacher name"
              />
            </div>
            <div className="flex w-full justify-end">
              <Link to="/syllabus/submit" className="ml-auto">
             <Button variant="default" className=" mt-3" >
               Suggest a subject
             </Button>
              </Link>
             </div>
            </div>
            <div className='w-full justify-end mt-4'>
              <h5 className="text-sm flex justify-end font-medium text-muted-foreground mb-1">
                Looking for something else?
              </h5>
              <a href="#tools" className="flex justify-end items-center text-sm text-primary hover:underline">
                <ArrowDown className='w-4 h-4'/>
                View Tools
              </a>
            </div>
          </header>

          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-6">
              Failed to load subject list. Please refresh the page.
            </div>
          )}

          {isLoading ? (
            <DirectorySkeleton />
          ) : filteredSubjects.length === 0 ? (
            <div className="rounded-lg border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
              No subjects match your search.
            </div>
          ) : (
            <div className="space-y-10">
              {/* Subject templates */}
              <section id='templates' aria-labelledby="templates-heading">
                <h2 id="templates-heading" className="text-lg font-semibold mb-4">
                  Subject Templates
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templateSubjects.map((subject) => (
                    <SubjectCard key={subject.slug} subject={subject} />
                  ))}
                </div>
              </section>

              {/* Built-in tools */}
              <section id='tools' aria-labelledby="tools-heading">
                <h2 id="tools-heading" className="text-lg font-semibold mb-4">
                  Tools
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {toolSubjects.map((subject) => (
                    <SubjectCard key={subject.slug} subject={subject} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}

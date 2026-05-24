import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar08 } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { GradeCalculator } from '@/components/GradeCalculator';
import Dynamic from '@/components/Dynamic';
import Budget from '@/components/Budget';
import Attendance from '@/components/Attendance';
import GPA from '@/components/GPA';
import { DotLoader } from '@/components/shadcn/gsap/dot-loader';
import { useSubjectTemplate } from '@/hooks/useSubjectTemplate';
import { SeoMeta } from '@/lib/seo';

// ─── Loading state ──────────────────────────────────────────────────────────

const LOADER_FRAMES = [
  [14, 7, 0, 8, 6, 13, 20], [14, 7, 13, 20, 16, 27, 21],
  [14, 20, 27, 21, 34, 24, 28], [27, 21, 34, 28, 41, 32, 35],
  [34, 28, 41, 35, 48, 40, 42], [34, 28, 41, 35, 48, 42, 46],
  [34, 28, 41, 35, 48, 42, 38], [34, 28, 41, 35, 48, 30, 21],
  [34, 28, 41, 48, 21, 22, 14], [34, 28, 41, 21, 14, 16, 27],
  [34, 28, 21, 14, 10, 20, 27], [28, 21, 14, 4, 13, 20, 27],
  [28, 21, 14, 12, 6, 13, 20], [28, 21, 14, 6, 13, 20, 11],
  [28, 21, 14, 6, 13, 20, 10], [14, 6, 13, 20, 9, 7, 21],
];

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center flex items-center gap-5 rounded px-4 py-3">
        <DotLoader
          frames={LOADER_FRAMES}
          className="gap-0.5"
          color="primary"
          duration={150}
          isPlaying={true}
          dotClassName="bg-foreground/15 [&.active]:bg-foreground size-1.5 sm:size-2.5"
        />
        <p className="text-base sm:text-2xl font-medium text-foreground">Loading...</p>
      </div>
    </div>
  );
}

// ─── 404 state ───────────────────────────────────────────────────────────────

function NotFoundScreen({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
      <SeoMeta
        title="Subject Not Found | Evalis"
        description="The requested calculator could not be found on Evalis."
        path="/calculator"
        noindex
      />

      <AlertCircle className="size-12 text-muted-foreground" />
      <div className="text-center max-w-sm">
        <h1 className="text-xl font-semibold mb-2">Subject not found</h1>
        <p className="text-muted-foreground text-sm">
          No calculator exists for <code className="bg-muted px-1 py-0.5 rounded text-xs">{slug}</code>.
          Check the URL or return to the directory to find your subject.
        </p>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link to="/calculator">
          <ArrowLeft className="size-4 mr-1.5" />
          Back to Calculator Directory
        </Link>
      </Button>
    </div>
  );
}

// ─── Error state ─────────────────────────────────────────────────────────────

function ErrorScreen() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
      <SeoMeta
        title="Error | Evalis"
        description="Evalis could not load the requested calculator template."
        path="/calculator"
        noindex
      />

      <AlertCircle className="size-12 text-destructive" />
      <div className="text-center max-w-sm">
        <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground text-sm">
          Could not load the calculator template. Please try refreshing.
        </p>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link to="/calculator">
          <ArrowLeft className="size-4 mr-1.5" />
          Back to Calculator Directory
        </Link>
      </Button>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SubjectCalculator() {
  const { subjectSlug } = useParams<{ subjectSlug: string }>();
  const { subject, template, state } = useSubjectTemplate(subjectSlug);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (state === 'loading') return <LoadingScreen />;

  // ── 404 ──────────────────────────────────────────────────────────────────
  if (state === 'not_found') return <NotFoundScreen slug={subjectSlug ?? ''} />;

  // ── Fetch error ──────────────────────────────────────────────────────────
  if (state === 'error') return <ErrorScreen />;

  // ── Determine which calculator to render ─────────────────────────────────
  const renderCalculator = () => {
    // Template-backed subjects — GradeCalculator handles all the business logic
    if (template) {
      return <GradeCalculator data={template} />;
    }

    // Built-in tools resolved by slug
    switch (subjectSlug) {
      case 'custom':      return <Dynamic />;
      case 'attendance':  return <Attendance />;
      case 'gpa':         return <GPA />;
      case 'budget':      return <Budget />;
      default:
        return (
          <p className="text-center py-10 text-muted-foreground">
            Unknown tool. <Link to="/calculator" className="underline">Go back</Link>.
          </p>
        );
    }
  };

  const pageTitle = subject
    ? `${subject.courseName} Grade Calculator | Evalis`
    : 'Evalis — AITU GPA Calculator & Student Tools';

  const pageDescription = subject
    ? subject.description
    : 'Calculate your AITU course grade with Evalis.';

  const canonicalSlug = subjectSlug ?? '';
  const canonicalPath = subjectSlug === 'gpa'
    ? '/gpa-calculator'
    : subjectSlug === 'custom'
      ? '/final-calculator'
      : subjectSlug === 'attendance'
        ? '/calculator/attendance'
        : subjectSlug === 'budget'
          ? '/calculator/budget'
          : `/calculator/${canonicalSlug}`;

  return (
    <>
      <SeoMeta
        title={pageTitle}
        description={pageDescription}
        path={canonicalPath}
        keywords={[
          'AITU GPA calculator',
          'Astana IT University GPA',
          'Evalis',
        ]}
      />

      <Navbar08/>

      <div className="text-foreground min-h-screen font-sans">
        <div className="max-w-6xl mx-auto min-h-screen px-4 pt-4 mb-4 sm:mb-16 sm:px-8 sm:pt-16">

          {/* Breadcrumb back-link */}
          <nav aria-label="breadcrumb" className="mb-4">
            <Link
              to="/calculator"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Calculator Directory
            </Link>
          </nav>

          <main>{renderCalculator()}</main>
        </div>

        <Footer />
      </div>
    </>
  );
}

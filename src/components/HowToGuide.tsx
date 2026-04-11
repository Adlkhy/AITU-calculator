import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  FolderOpen,
  ToggleRight,
  LogIn,
  BarChart2,
  ExternalLink,
  Terminal,
} from "lucide-react";
import { useState } from "react";

async function downloadZipFile(url: string, fileName: string) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status}`);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(objectUrl);
  } catch {
    // Fallback when the file host blocks CORS fetch.
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

const steps = [
  {
    number: 1,
    icon: FolderOpen,
    title: "Download the extension files",
    description:
      "Download the Evalis extension ZIP from the link below and unzip it to a permanent folder on your computer. Chrome needs that folder to stay in place.",
    screenshot: "/screenshots/filelocation.png",
    screenshotAlt: "Downloaded ZIP file being unzipped into a local folder",
    cta: {
      label: "Download extension",
      href: "https://evaiis.vercel.app/extension.zip",
      downloadFileName: "evalis-extension.zip",
    },
  },
  {
    number: 2,
    icon: Terminal,
    title: "Open Chrome extensions & enable Developer mode",
    description: (
      <>
        In Chrome, go to{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
          chrome://extensions
        </code>
        {" "}and flip the <span className="font-medium text-primary">Developer mode</span>{" "}
        toggle in the top-right corner.
      </>
    ),
    screenshot: "/screenshots/devmode.png",
    screenshotAlt:
      "Chrome extensions page with Developer mode toggle turned on in the top-right corner",
  },
  {
    number: 3,
    icon: ToggleRight,
    title: "Load the unpacked extension",
    description:
    <>
      Click <span className="font-medium text-primary">Load unpacked</span>, then select the folder you unzipped in step 1. Evalis will appear in your extensions list immediately.
    </>,
    screenshot: "/screenshots/loadunpacked.png",
    screenshotAlt:
      "Load unpacked button clicked with a folder picker open showing the unzipped extension folder selected",
  },
  {
    number: 4,
    icon: LogIn,
    title: "Log in to your Evalis account",
    description:
      "If you haven't signed up already, create an account on the Evalis web app.",
    screenshot: "/screenshots/signup.png",
    screenshotAlt:
      "Evalis extension popup open in the browser toolbar showing the email sign-in form",
  },
  {
    number: 5,
    icon: BarChart2,
    title: "Grades sync automatically",
    description:
    <>Visit {" "}
    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
      https://du.astanait.edu.kz/transcript
    </code>
      {" "} <span className="font-medium text-primary">Reload</span> page then click Export button. Your grades will be synced to Evalis and your rank on the leaderboard will update within seconds.
    </>,
    screenshot: "/screenshots/export.png",
    screenshotAlt:
      "University GradeBook portal with the Evalis rank and GPA overlay card visible in the corner",
  },
];

type Step = (typeof steps)[number];

function StepCard({ step, isLast }: { step: Step; isLast: boolean }) {
  const Icon = step.icon;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (url: string, fileName: string) => {
    if (isDownloading) return;

    setIsDownloading(true);
    await downloadZipFile(url, fileName);
    setIsDownloading(false);
  };

  return (
    <div className="flex gap-4">
      {/* Stepper spine */}
      <div className="flex flex-col items-center">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
          {step.number}
        </div>
        {!isLast && <div className="mt-2 w-px flex-1 bg-border min-h-4" />}
      </div>

      {/* Content */}
      <div className={`min-w-0 flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
        <div className="mb-1.5 flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <p className="text-sm font-medium">{step.title}</p>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
          {step.description}
        </p>

        {/* Screenshot slot */}
        <div className="rounded-xs border bg-muted/30 overflow-hidden mb-3">
          <img
            src={step.screenshot}
            alt={step.screenshotAlt}
            className="w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const placeholder = e.currentTarget
                .nextSibling as HTMLElement | null;
              if (placeholder) placeholder.style.display = "flex";
            }}
          />
          {/* Placeholder shown until real screenshot is added */}
          <div
            className="hidden h-24 items-center justify-center text-xs text-muted-foreground italic"
            aria-hidden
          >
            {step.screenshotAlt}
          </div>
        </div>

        {step.cta &&
          (step.cta.downloadFileName ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(step.cta!.href, step.cta!.downloadFileName!)}
              disabled={isDownloading}
            >
              {isDownloading ? "Preparing download..." : step.cta.label}
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <a href={step.cta.href} target="_blank" rel="noopener noreferrer">
                {step.cta.label}
                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </a>
            </Button>
          ))}
      </div>
    </div>
  );
}

// ── Sidebar trigger button ──
export function HowToTrigger() {
  return (
    <DialogTrigger asChild >
      <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
        <HelpCircle className="h-4 w-4" />
        How it works
      </button>
    </DialogTrigger>
  );
}

// ── Main export — drop inside your sidebar ──
export function HowToGuide() {
  return (
    <Dialog>
      <HowToTrigger />

      <DialogContent className="w-[min(42rem,calc(100vw-2rem))] max-h-[85vh] flex flex-col p-0 gap-0">
        {/* Fixed header */}
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <Badge variant="secondary" className="w-fit text-xs font-normal mb-1">
            Manual install / Chrome
          </Badge>
          <DialogTitle className="text-base font-semibold leading-snug">
            Get started with Evalis
          </DialogTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Load the extension manually to sync grades and appear on the
            leaderboard automatically.
          </p>
        </DialogHeader>

        <Separator />

        {/* Scrollable step list */}
        <div className="guide-scroll-area overflow-y-auto flex-1 px-3 sm:px-4 py-5">
          {steps.map((step, i) => (
            <StepCard
              key={step.number}
              step={step}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>

        <Separator />

        {/* Fixed footer */}
        <div className="px-6 py-4 shrink-0">
          <p className="text-xs text-muted-foreground">
            Having trouble?{" "}
            <a
              href="https://t.me/Adlkhy"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Press Here, I guess?
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
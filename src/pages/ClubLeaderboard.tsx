import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Search, Trophy, Heart, Plus, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { SeoMeta } from "@/lib/seo";
import { Navbar08 } from "@/components/Navbar";
import Footer from "@/components/Footer";
// ============================================================================
// Supabase client
// ----------------------------------------------------------------------------
// If your app already has a shared client (e.g. `src/lib/supabaseClient.ts`),
// delete this block and import that instead:
//   import { supabase } from "@/lib/supabaseClient";
// ============================================================================
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// Types
// ============================================================================
interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string | null;
  likes_count: number;
  link: string | null;
  created_at: string;
}

interface SuggestFormState {
  name: string;
  category: string;
  description: string;
  image_url: string;
  link: string;
}

const FINGERPRINT_KEY = "club_leaderboard_fingerprint";
const VOTED_KEY = "club_leaderboard_voted_ids";

// ============================================================================
// Fingerprint helpers
// ============================================================================

/** A lightweight, stable-ish device signature. Not meant to defeat a
 * determined attacker — just to raise the bar above "clear localStorage". */
function getCanvasSignature(): string {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "no-canvas";
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(0, 0, 100, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("club-leaderboard-fp", 2, 2);
    return canvas.toDataURL();
  } catch {
    return "no-canvas";
  }
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Returns a persistent fingerprint string, generating and caching one
 * in localStorage on first visit. Combines a random UUID (the actual
 * source of uniqueness/persistence) with coarse device signals so two
 * fresh localStorage stores on the same machine still differ. */
async function getVoterFingerprint(): Promise<string> {
  const cached = localStorage.getItem(FINGERPRINT_KEY);
  if (cached) return cached;

  const uuid = crypto.randomUUID();
  const raw = [
    uuid,
    navigator.userAgent,
    navigator.language,
    `${screen.width}x${screen.height}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    getCanvasSignature(),
  ].join("|");

  const fingerprint = await sha256(raw);
  localStorage.setItem(FINGERPRINT_KEY, fingerprint);
  return fingerprint;
}

function getVotedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(VOTED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function persistVotedIds(ids: Set<string>) {
  localStorage.setItem(VOTED_KEY, JSON.stringify(Array.from(ids)));
}

// ============================================================================
// Small presentational helpers
// ============================================================================

function ClubAvatar({ club, className = "" }: { club: Pick<Club, "name" | "image_url">; className?: string }) {
  if (club.image_url) {
    return (
      <img
        src={club.image_url}
        alt={club.name}
        className={`rounded-full object-cover bg-muted ${className}`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }
  const initials = club.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold ${className}`}
    >
      {initials}
    </div>
  );
}

function VoteButton({
  voted,
  pending,
  onVote,
}: {
  voted: boolean;
  pending: boolean;
  onVote: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onVote}
      disabled={voted || pending}
      aria-pressed={voted}
      className={`inline-flex items-center rounded-full px-2 py-2 text-sm font-medium transition-colors
        focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed
        ${
          voted
            ? "bg-secondary text-primary"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }
      `}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={`h-4 w-4 ${voted ? "fill-current" : ""}`} />
      )}
    </button>
  );
}

// ============================================================================
// Suggest a Club modal
// ============================================================================

function SuggestClubModal({
  open,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted: (club: Club) => void;
}) {
  const [form, setForm] = useState<SuggestFormState>({
    name: "",
    category: "",
    description: "",
    image_url: "",
    link: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const update = (field: keyof SuggestFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.category.trim()) {
      setError("Name and category are required.");
      return;
    }

    setSubmitting(true);
    const { data, error: insertError } = await supabase
      .from("clubs")
      .insert({
        name: form.name.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        image_url: form.image_url.trim() || null,
        link: form.link.trim() || null,
      })
      .select()
      .single();
    setSubmitting(false);

    if (insertError || !data) {
      setError("Something went wrong submitting your club. Please try again.");
      return;
    }

    onSubmitted(data as Club);
    setForm({ name: "", category: "", description: "", image_url: "", link: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg border border-border bg-card text-card-foreground shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold">Suggest a Club</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div>
            <label htmlFor="club-name" className="mb-1 block text-sm font-medium text-foreground">
              Club name
            </label>
            <input
              id="club-name"
              value={form.name}
              onChange={update("name")}
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="e.g. Photography Club"
            />
          </div>

          <div>
            <label htmlFor="club-category" className="mb-1 block text-sm font-medium text-foreground">
              Category
            </label>
            <input
              id="club-category"
              value={form.category}
              onChange={update("category")}
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="e.g. Arts, Technology, Sports"
            />
          </div>

          <div>
            <label htmlFor="club-description" className="mb-1 block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id="club-description"
              value={form.description}
              onChange={update("description")}
              rows={3}
              className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="What does this club do?"
            />
          </div>

          <div>
            <label htmlFor="club-image" className="mb-1 block text-sm font-medium text-foreground">
              Image URL <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              id="club-image"
              value={form.image_url}
              onChange={update("image_url")}
              type="url"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="https://..."
            />
          </div>

          <div>
            <label htmlFor="club-link" className="mb-1 block text-sm font-medium text-foreground">
              Link <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              id="club-link"
              value={form.link}
              onChange={update("link")}
              type="url"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="https://..."
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// Podium (top 3)
// ============================================================================

function Podium({
  clubs,
  votedIds,
  pendingIds,
  onVote,
}: {
  clubs: Club[];
  votedIds: Set<string>;
  pendingIds: Set<string>;
  onVote: (id: string) => void;
}) {
  if (clubs.length === 0) return null;

  const order = clubs.slice(0, 3);

  return (
    <div className="mb-10 space-y-3">
      {order.map((club, rank) => {
        const background = ["bg-primary/30", "bg-primary/15", "bg-primary/8"][rank];
        const avatarSize = ["h-14 w-14", "h-12 w-12", "h-10 w-10"][rank];
        return (
          <div
            key={club.id}
            className={`flex items-start gap-2 rounded-md border border-primary/30 px-2 py-4 text-foreground shadow-sm ${background}`}
          >
            <ClubAvatar club={club} className={`shrink-0 border-2 border-foreground/30 ${avatarSize}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
              <span className="shrink-0 text-center text-base font-bold">#{rank + 1}</span>
              <a href={club.link || "#"} target="_blank" rel="noopener noreferrer" className="block truncate text-base font-bold text-foreground">
                {club.name}
              </a>
              </div>
              <p className="mt-1 truncate text-sm text-foreground/80">{club.description || club.category}</p>
              <p className="mt-1 truncate text-xs text-foreground/70">{club.category}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold">{club.likes_count}</span>
              <VoteButton
                voted={votedIds.has(club.id)}
                pending={pendingIds.has(club.id)}
                onVote={() => onVote(club.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Ranked list row
// ============================================================================

function ClubRow({
  club,
  rank,
  voted,
  pending,
  onVote,
}: {
  club: Club;
  rank: number;
  voted: boolean;
  pending: boolean;
  onVote: () => void;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-border px-2 py-3 text-foreground">
      <ClubAvatar club={club} className="h-10 w-10 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
        <span className="shrink-0 text-center text-sm font-semibold text-muted-foreground">#{rank}</span>
        <a href={club.link || "#"} target="_blank" rel="noopener noreferrer" className="truncate text-sm font-medium text-foreground">
          {club.name}
        </a>
        </div>
        <p className="truncate text-xs text-muted-foreground">{club.category}</p>
      </div>
      <div className="flex shrink-0 gap-2 items-center justify-center text-sm font-semibold text-foreground">
        {club.likes_count}
        <VoteButton voted={voted} pending={pending} onVote={onVote} />
      </div>
    </div>
  );
}

// ============================================================================
// Main page
// ============================================================================

export default function ClubLeaderboardPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [votedIds, setVotedIds] = useState<Set<string>>(() => getVotedIds());
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [modalOpen, setModalOpen] = useState(false);

  const fingerprintRef = useRef<string | null>(null);

  // Load fingerprint once
  useEffect(() => {
    getVoterFingerprint().then((fp) => {
      fingerprintRef.current = fp;
    });
  }, []);

  // Initial fetch
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .order("likes_count", { ascending: false });

      if (cancelled) return;

      if (error) {
        setLoadError("Couldn't load the leaderboard. Please refresh.");
      } else {
        setClubs((data ?? []) as Club[]);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Realtime subscription: keep likes_count (and new/edited clubs) in sync
  useEffect(() => {
    const channel = supabase
      .channel("clubs-leaderboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "clubs" },
        (payload: RealtimePostgresChangesPayload<Club>) => {
          setClubs((prev) => {
            if (payload.eventType === "INSERT") {
              const newClub = payload.new as Club;
              if (prev.some((c) => c.id === newClub.id)) return prev;
              return [...prev, newClub].sort((a, b) => b.likes_count - a.likes_count);
            }
            if (payload.eventType === "UPDATE") {
              const updated = payload.new as Club;
              return prev
                .map((c) => (c.id === updated.id ? updated : c))
                .sort((a, b) => b.likes_count - a.likes_count);
            }
            if (payload.eventType === "DELETE") {
              const removed = payload.old as Partial<Club>;
              return prev.filter((c) => c.id !== removed.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(clubs.map((c) => c.category));
    return ["All", ...Array.from(set).sort()];
  }, [clubs]);

  const filteredClubs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return clubs.filter((c) => {
      const matchesCategory = activeCategory === "All" || c.category === activeCategory;
      const matchesQuery = !query || c.name.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [clubs, search, activeCategory]);

  // filteredClubs is already sorted because `clubs` is sorted on write/realtime.
  const topThree = filteredClubs.slice(0, 3);
  const rest = filteredClubs.slice(3);

  const handleVote = useCallback(
    async (clubId: string) => {
      if (votedIds.has(clubId) || pendingIds.has(clubId)) return;
      const fingerprint = fingerprintRef.current ?? (await getVoterFingerprint());
      fingerprintRef.current = fingerprint;

      // Optimistic UI update
      setPendingIds((prev) => new Set(prev).add(clubId));
      setClubs((prev) =>
        prev
          .map((c) => (c.id === clubId ? { ...c, likes_count: c.likes_count + 1 } : c))
          .sort((a, b) => b.likes_count - a.likes_count)
      );
      const nextVoted = new Set(votedIds).add(clubId);
      setVotedIds(nextVoted);
      persistVotedIds(nextVoted);

      const { error } = await supabase
        .from("club_likes")
        .insert({ club_id: clubId, voter_fingerprint: fingerprint });

      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(clubId);
        return next;
      });

      if (error) {
        // Postgres unique_violation code
        if (error.code === "23505") {
          // Already voted from this fingerprint (e.g. across tabs/devices
          // sharing storage) — keep it marked as voted, just roll back
          // the optimistic increment since the trigger won't have fired.
          setClubs((prev) =>
            prev
              .map((c) => (c.id === clubId ? { ...c, likes_count: Math.max(c.likes_count - 1, 0) } : c))
              .sort((a, b) => b.likes_count - a.likes_count)
          );
          return;
        }

        // Any other failure: roll back both the optimistic count and the
        // local "voted" flag so the user can retry.
        setClubs((prev) =>
          prev
            .map((c) => (c.id === clubId ? { ...c, likes_count: Math.max(c.likes_count - 1, 0) } : c))
            .sort((a, b) => b.likes_count - a.likes_count)
        );
        setVotedIds((prev) => {
          const next = new Set(prev);
          next.delete(clubId);
          persistVotedIds(next);
          return next;
        });
      }
    },
    [votedIds, pendingIds]
  );

  const handleSuggested = useCallback((club: Club) => {
    setClubs((prev) => {
      if (prev.some((c) => c.id === club.id)) return prev;
      return [...prev, club].sort((a, b) => b.likes_count - a.likes_count);
    });
  }, []);

  return (
    <>
    <SeoMeta
      title="AITU Club Leaderboard"
      description="Vote for your favorite Astana IT University clubs — one vote per club."
      path="/leaderboard/club"
    />
    <Navbar08 />
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-dashed border-border">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground sm:text-3xl">
                <Trophy className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
                Club Leaderboard
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Vote for your favorite AITU clubs — one vote per club.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-2 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:px-4"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Suggest a Club</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clubs..."
              className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors
                  ${
                    activeCategory === cat
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted text-muted-foreground hover:text-foreground"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {loading && (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading leaderboard...
          </div>
        )}

        {!loading && loadError && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {loadError}
          </div>
        )}

        {!loading && !loadError && filteredClubs.length === 0 && (
          <div className="rounded-md border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
            No clubs match your search.
          </div>
        )}

        {!loading && !loadError && filteredClubs.length > 0 && (
          <>
            <Podium clubs={topThree} votedIds={votedIds} pendingIds={pendingIds} onVote={handleVote} />

            <div className="space-y-2">
              {rest.map((club, idx) => (
                <ClubRow
                  key={club.id}
                  club={club}
                  rank={idx + 4}
                  voted={votedIds.has(club.id)}
                  pending={pendingIds.has(club.id)}
                  onVote={() => handleVote(club.id)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <SuggestClubModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmitted={handleSuggested} />
    </div>
    <Footer />
    </>
  );
}
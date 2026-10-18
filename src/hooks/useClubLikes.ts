import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";

type LikeAdjustments = Record<string, number>;

export function useClubLikes() {
  const { session } = useUser();
  const [likeAdjustments, setLikeAdjustments] = useState<LikeAdjustments>({});
  const [likedClubIds, setLikedClubIds] = useState<Set<string>>(new Set());
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    const loadLikes = async () => {
      if (!session) {
        setLikedClubIds(new Set());
        return;
      }

      const likedResult = await supabase.from("club_likes").select("club_id");

      if (cancelled) return;

      if (likedResult.error) {
        console.error("Failed to load the user's club likes:", likedResult.error);
        return;
      }

      setLikedClubIds(new Set((likedResult.data ?? []).map((row) => row.club_id)));
    };

    void loadLikes();
    return () => {
      cancelled = true;
    };
  }, [session]);

  const toggleLike = useCallback(
    async (clubId: string) => {
      if (!session || pendingIds.has(clubId)) return;

      const isLiked = likedClubIds.has(clubId);
      const previousLiked = isLiked;

      setPendingIds((previous) => new Set(previous).add(clubId));
      setLikedClubIds((previous) => {
        const next = new Set(previous);
        if (isLiked) next.delete(clubId);
        else next.add(clubId);
        return next;
      });
      setLikeAdjustments((previous) => ({
        ...previous,
        [clubId]: (previous[clubId] ?? 0) + (isLiked ? -1 : 1),
      }));

      const result = isLiked
        ? await supabase
            .from("club_likes")
            .delete()
            .eq("club_id", clubId)
            .eq("user_id", session.user.id)
        : await supabase.from("club_likes").insert({ club_id: clubId });

      setPendingIds((previous) => {
        const next = new Set(previous);
        next.delete(clubId);
        return next;
      });

      if (result.error && result.error.code !== "23505") {
        setLikedClubIds((previous) => {
          const next = new Set(previous);
          if (previousLiked) next.add(clubId);
          else next.delete(clubId);
          return next;
        });
        setLikeAdjustments((previous) => {
          const next = { ...previous };
          const adjustment = next[clubId] ?? 0;
          if (adjustment === 0) delete next[clubId];
          else next[clubId] = adjustment + (isLiked ? 1 : -1);
          return next;
        });

        if (result.error.message.includes("rate_limited")) {
          toast.warning("Slow down a little");
        } else {
          toast.error("Couldn't update your like. Please try again.");
        }
      }
    },
    [likedClubIds, pendingIds, session]
  );

  return { likeAdjustments, likedClubIds, pendingIds, toggleLike };
}

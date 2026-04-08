"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Trophy, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  position: number;
  id: string;
  username: string;
  displayName: string | null;
  points: number;
  rank: string;
  completedMissions: number;
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const userId = (session?.user as Record<string, unknown>)?.id;
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data.leaderboard || []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
          LEADERBOARD
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
          // TOP MISSIONARIES RANKED BY POINTS
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="font-[family-name:var(--font-mono)] text-sm text-muted animate-pulse">
            LOADING_RANKINGS...
          </div>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="border border-border bg-surface p-12 text-center">
          <Trophy size={32} className="mx-auto text-muted mb-4" />
          <p className="font-[family-name:var(--font-mono)] text-sm text-muted">
            NO RANKINGS YET
          </p>
        </div>
      ) : (
        <div className="border border-border bg-surface">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-4">OPERATIVE</div>
            <div className="col-span-3">RANK</div>
            <div className="col-span-2 text-right">MISSIONS</div>
            <div className="col-span-2 text-right">POINTS</div>
          </div>
          {leaderboard.map((entry) => {
            const isMe = entry.id === userId;
            return (
              <div
                key={entry.id}
                className={cn(
                  "grid grid-cols-12 gap-4 px-4 py-3 border-b border-border last:border-b-0 transition-colors",
                  isMe && "bg-white/[0.03]",
                  entry.position <= 3 && "bg-white/[0.02]"
                )}
              >
                <div className="col-span-1 flex items-center">
                  <span
                    className={cn(
                      "font-[family-name:var(--font-heading)] font-bold text-lg",
                      entry.position === 1 && "text-white",
                      entry.position === 2 && "text-neutral-300",
                      entry.position === 3 && "text-neutral-500",
                      entry.position > 3 && "text-neutral-600"
                    )}
                  >
                    {entry.position}
                  </span>
                </div>
                <div className="col-span-4 flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 bg-surface-light border border-border flex items-center justify-center flex-shrink-0">
                    <span className="font-[family-name:var(--font-mono)] text-xs text-white">
                      {entry.username[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className={cn("font-[family-name:var(--font-heading)] text-sm font-bold truncate", isMe ? "text-accent" : "text-white")}>
                      {entry.displayName || entry.username}
                    </div>
                    <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted">
                      @{entry.username}
                    </div>
                  </div>
                </div>
                <div className="col-span-3 flex items-center">
                  <span className="font-[family-name:var(--font-mono)] text-xs text-muted">
                    {entry.rank}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <Crosshair size={12} className="text-muted" />
                  <span className="font-[family-name:var(--font-mono)] text-xs text-neutral-300">
                    {entry.completedMissions}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <span className="font-[family-name:var(--font-heading)] text-base font-bold text-white">
                    {entry.points}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

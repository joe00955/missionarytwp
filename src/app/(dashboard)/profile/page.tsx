"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { User, Trophy, Crosshair, Zap } from "lucide-react";
import { RANKS } from "@/lib/ranks";
import { cn } from "@/lib/utils";

interface Stats {
  points: number;
  rank: string;
  rankProgress: number;
  nextRank: string | null;
  pointsToNext: number | null;
  totalMissions: number;
  completedMissions: number;
  activeMissions: number;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user as Record<string, unknown> | undefined;
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/user/stats");
        if (res.ok) setStats(await res.json());
      } catch {
        // silent
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border border-border bg-surface p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-surface-light border border-border flex items-center justify-center flex-shrink-0">
            <User size={28} className="text-muted" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
              {(user?.displayName as string) || (user?.username as string) || "OPERATIVE"}
            </h1>
            <p className="font-[family-name:var(--font-mono)] text-xs text-muted">
              @{(user?.username as string) || "unknown"} // {(user?.role as string)?.toUpperCase() || "MISSIONARY"}
            </p>
          </div>
        </div>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="border border-border bg-surface p-4 text-center">
              <Trophy size={20} className="mx-auto text-muted mb-2" />
              <div className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
                {stats.points}
              </div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted">TOTAL PTS</div>
            </div>
            <div className="border border-border bg-surface p-4 text-center">
              <Zap size={20} className="mx-auto text-muted mb-2" />
              <div className="font-[family-name:var(--font-heading)] text-lg font-bold text-white">
                {stats.rank}
              </div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted">RANK</div>
            </div>
            <div className="border border-border bg-surface p-4 text-center">
              <Crosshair size={20} className="mx-auto text-muted mb-2" />
              <div className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
                {stats.completedMissions}
              </div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted">COMPLETED</div>
            </div>
            <div className="border border-border bg-surface p-4 text-center">
              <Crosshair size={20} className="mx-auto text-muted mb-2" />
              <div className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
                {stats.totalMissions}
              </div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted">TOTAL</div>
            </div>
          </div>

          {/* Rank Progression */}
          <div className="border border-border bg-surface p-6">
            <h2 className="font-[family-name:var(--font-mono)] text-xs text-muted tracking-wider mb-4">
              RANK_PROGRESSION
            </h2>
            <div className="space-y-3">
              {RANKS.map((rank, i) => {
                const isCurrent = stats.rank === rank.name;
                const isAchieved = stats.points >= rank.minPoints;
                return (
                  <div key={rank.name} className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-2 h-2 flex-shrink-0",
                        isCurrent ? "bg-white" : isAchieved ? "bg-neutral-500" : "bg-neutral-800"
                      )}
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <span
                        className={cn(
                          "font-[family-name:var(--font-mono)] text-sm",
                          isCurrent ? "text-white font-bold" : isAchieved ? "text-neutral-400" : "text-neutral-700"
                        )}
                      >
                        {rank.name}
                      </span>
                      <span
                        className={cn(
                          "font-[family-name:var(--font-mono)] text-xs",
                          isCurrent ? "text-white" : "text-neutral-700"
                        )}
                      >
                        {rank.minPoints} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {stats.nextRank && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-[family-name:var(--font-mono)] text-xs text-muted">
                    Progress to {stats.nextRank}
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-xs text-white">
                    {stats.rankProgress}%
                  </span>
                </div>
                <div className="h-1 bg-border">
                  <div
                    className="h-full bg-white transition-all"
                    style={{ width: `${stats.rankProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

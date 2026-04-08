"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Crosshair, Zap, Trophy, Clock, ChevronRight } from "lucide-react";
import { cn, timeUntil, getDifficultyColor } from "@/lib/utils";

interface Mission {
  id: string;
  title: string;
  points: number;
  difficulty: string;
  deadline: string;
  status: string;
}

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

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as Record<string, unknown> | undefined;
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, activeRes] = await Promise.all([
          fetch("/api/user/stats"),
          fetch("/api/missions/active"),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (activeRes.ok) {
          const data = await activeRes.json();
          setActiveMissions(data.missions || []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="font-[family-name:var(--font-mono)] text-sm text-muted animate-pulse">
          LOADING_FEED...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
          WELCOME BACK, {(user?.username as string || "OPERATIVE").toUpperCase()}
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
          // MISSION_CONTROL_DASHBOARD
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="TOTAL POINTS"
          value={stats?.points || 0}
          icon={<Trophy size={16} />}
        />
        <StatCard
          label="RANK"
          value={stats?.rank || "Initiate"}
          icon={<Zap size={16} />}
          isText
        />
        <StatCard
          label="COMPLETED"
          value={stats?.completedMissions || 0}
          icon={<Crosshair size={16} />}
        />
        <StatCard
          label="ACTIVE OPS"
          value={stats?.activeMissions || 0}
          icon={<Clock size={16} />}
        />
      </div>

      {/* Rank Progress */}
      {stats?.nextRank && (
        <div className="border border-border bg-surface p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-[family-name:var(--font-mono)] text-xs text-muted">
              RANK_PROGRESS
            </span>
            <span className="font-[family-name:var(--font-mono)] text-xs text-white">
              {stats.pointsToNext} pts to {stats.nextRank}
            </span>
          </div>
          <div className="h-1 bg-border">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${stats.rankProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Active Missions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-white">
            ACTIVE OPERATIONS
          </h2>
          <Link
            href="/missions/active"
            className="font-[family-name:var(--font-mono)] text-xs text-muted hover:text-white transition-colors flex items-center gap-1"
          >
            VIEW ALL <ChevronRight size={12} />
          </Link>
        </div>

        {activeMissions.length === 0 ? (
          <div className="border border-border bg-surface p-8 text-center">
            <Crosshair size={24} className="mx-auto text-muted mb-3" />
            <p className="font-[family-name:var(--font-mono)] text-sm text-muted">
              NO ACTIVE OPERATIONS
            </p>
            <Link
              href="/missions"
              className="inline-block mt-3 font-[family-name:var(--font-mono)] text-xs text-white border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors"
            >
              BROWSE MISSIONS
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {activeMissions.slice(0, 4).map((mission) => (
              <Link
                key={mission.id}
                href={`/missions/${mission.id}`}
                className="block border border-border bg-surface p-4 hover:border-white/20 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-white truncate group-hover:text-accent transition-colors">
                      {mission.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={cn(
                          "font-[family-name:var(--font-mono)] text-[10px] border px-1.5 py-0.5",
                          getDifficultyColor(mission.difficulty)
                        )}
                      >
                        {mission.difficulty}
                      </span>
                      <span className="font-[family-name:var(--font-mono)] text-xs text-muted">
                        {mission.points} PTS
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-[family-name:var(--font-mono)] text-xs text-muted">
                      {timeUntil(mission.deadline)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/missions"
          className="border border-border bg-surface p-4 hover:border-white/20 transition-colors flex items-center gap-3 group"
        >
          <Crosshair size={20} className="text-muted group-hover:text-white transition-colors" />
          <div>
            <div className="font-[family-name:var(--font-heading)] text-sm font-bold text-white">
              BROWSE MISSIONS
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted">
              Find new operations to accept
            </div>
          </div>
        </Link>
        <Link
          href="/leaderboard"
          className="border border-border bg-surface p-4 hover:border-white/20 transition-colors flex items-center gap-3 group"
        >
          <Trophy size={20} className="text-muted group-hover:text-white transition-colors" />
          <div>
            <div className="font-[family-name:var(--font-heading)] text-sm font-bold text-white">
              LEADERBOARD
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted">
              Check your ranking
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  isText,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  isText?: boolean;
}) {
  return (
    <div className="border border-border bg-surface p-4">
      <div className="flex items-center gap-2 mb-2 text-muted">{icon}
        <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider">
          {label}
        </span>
      </div>
      <div
        className={cn(
          "font-[family-name:var(--font-heading)] font-bold text-white",
          isText ? "text-lg" : "text-2xl"
        )}
      >
        {value}
      </div>
    </div>
  );
}

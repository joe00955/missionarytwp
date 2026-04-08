"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, Clock } from "lucide-react";
import { cn, timeUntil, getDifficultyColor, getStatusLabel, getStatusColor } from "@/lib/utils";

interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: string;
  category: string;
  deadline: string;
  status: string;
  acceptedAt: string | null;
}

export default function ActiveMissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMissions() {
      try {
        const res = await fetch("/api/missions/active");
        if (res.ok) {
          const data = await res.json();
          setMissions(data.missions || []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchMissions();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
          ACTIVE OPERATIONS
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
          // MISSIONS IN PROGRESS
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="font-[family-name:var(--font-mono)] text-sm text-muted animate-pulse">
            LOADING_OPERATIONS...
          </div>
        </div>
      ) : missions.length === 0 ? (
        <div className="border border-border bg-surface p-12 text-center">
          <Zap size={32} className="mx-auto text-muted mb-4" />
          <p className="font-[family-name:var(--font-mono)] text-sm text-muted">
            NO ACTIVE OPERATIONS
          </p>
          <Link
            href="/missions"
            className="inline-block mt-3 font-[family-name:var(--font-mono)] text-xs text-white border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors"
          >
            BROWSE AVAILABLE MISSIONS
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {missions.map((mission) => (
            <Link
              key={mission.id}
              href={`/missions/${mission.id}`}
              className="block border border-border bg-surface p-5 hover:border-white/20 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={cn(
                        "font-[family-name:var(--font-mono)] text-[10px] border px-1.5 py-0.5",
                        getDifficultyColor(mission.difficulty)
                      )}
                    >
                      {mission.difficulty}
                    </span>
                    <span
                      className={cn(
                        "font-[family-name:var(--font-mono)] text-[10px] border px-1.5 py-0.5",
                        getStatusColor(mission.status)
                      )}
                    >
                      {getStatusLabel(mission.status)}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] text-base font-bold text-white group-hover:text-accent transition-colors">
                    {mission.title}
                  </h3>
                  <p className="text-sm text-muted mt-1 line-clamp-1">
                    {mission.description}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-[family-name:var(--font-heading)] text-xl font-bold text-white">
                    {mission.points}
                  </div>
                  <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted">
                    POINTS
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-muted">
                    <Clock size={12} />
                    <span className="font-[family-name:var(--font-mono)] text-[10px]">
                      {timeUntil(mission.deadline)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

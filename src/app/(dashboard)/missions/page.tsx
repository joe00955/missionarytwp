"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crosshair, Clock, ChevronRight } from "lucide-react";
import { cn, timeUntil, getDifficultyColor } from "@/lib/utils";

interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: string;
  category: string;
  deadline: string;
  status: string;
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchMissions() {
      try {
        const res = await fetch("/api/missions");
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

  const filtered =
    filter === "all"
      ? missions
      : missions.filter((m) => m.difficulty === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
          AVAILABLE MISSIONS
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
          // SELECT A MISSION TO VIEW BRIEFING
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "RECON", "STANDARD", "COVERT", "BLACK_OPS"].map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={cn(
              "font-[family-name:var(--font-mono)] text-xs px-3 py-1.5 border transition-colors",
              filter === d
                ? "bg-white text-black border-white"
                : "text-muted border-border hover:border-white/30 hover:text-white"
            )}
          >
            {d === "all" ? "ALL" : d}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="font-[family-name:var(--font-mono)] text-sm text-muted animate-pulse">
            SCANNING_MISSIONS...
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-border bg-surface p-12 text-center">
          <Crosshair size={32} className="mx-auto text-muted mb-4" />
          <p className="font-[family-name:var(--font-mono)] text-sm text-muted">
            NO MISSIONS AVAILABLE
          </p>
          <p className="font-[family-name:var(--font-mono)] text-xs text-neutral-600 mt-1">
            Check back later for new assignments.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((mission) => (
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
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-muted border border-border px-1.5 py-0.5">
                      {mission.category}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] text-base font-bold text-white group-hover:text-accent transition-colors">
                    {mission.title}
                  </h3>
                  <p className="text-sm text-muted mt-1 line-clamp-2">
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
                  <ChevronRight
                    size={16}
                    className="ml-auto mt-2 text-muted group-hover:text-white transition-colors"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

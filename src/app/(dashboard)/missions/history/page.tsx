"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn, formatDate, getDifficultyColor } from "@/lib/utils";

interface Mission {
  id: string;
  title: string;
  points: number;
  pointsAwarded: number;
  difficulty: string;
  category: string;
  status: string;
  reviewedAt: string | null;
}

export default function MissionHistoryPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMissions() {
      try {
        const res = await fetch("/api/missions/history");
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
          MISSION HISTORY
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
          // COMPLETED AND PAST OPERATIONS
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="font-[family-name:var(--font-mono)] text-sm text-muted animate-pulse">
            LOADING_ARCHIVES...
          </div>
        </div>
      ) : missions.length === 0 ? (
        <div className="border border-border bg-surface p-12 text-center">
          <History size={32} className="mx-auto text-muted mb-4" />
          <p className="font-[family-name:var(--font-mono)] text-sm text-muted">
            NO MISSION HISTORY
          </p>
          <p className="font-[family-name:var(--font-mono)] text-xs text-neutral-600 mt-1">
            Complete missions to build your record.
          </p>
        </div>
      ) : (
        <div className="grid gap-2">
          {missions.map((mission) => (
            <Link
              key={mission.id}
              href={`/missions/${mission.id}`}
              className="block border border-border bg-surface p-4 hover:border-white/20 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {mission.status === "approved" ? (
                    <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                  ) : mission.status === "rejected" ? (
                    <XCircle size={18} className="text-red-400 flex-shrink-0" />
                  ) : (
                    <Clock size={18} className="text-neutral-600 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-white truncate group-hover:text-accent transition-colors">
                      {mission.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={cn(
                          "font-[family-name:var(--font-mono)] text-[10px] border px-1 py-0.5",
                          getDifficultyColor(mission.difficulty)
                        )}
                      >
                        {mission.difficulty}
                      </span>
                      {mission.reviewedAt && (
                        <span className="font-[family-name:var(--font-mono)] text-[10px] text-neutral-600">
                          {formatDate(mission.reviewedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  {mission.status === "approved" ? (
                    <span className="font-[family-name:var(--font-mono)] text-sm text-green-400">
                      +{mission.pointsAwarded}
                    </span>
                  ) : (
                    <span className="font-[family-name:var(--font-mono)] text-sm text-neutral-600">
                      {mission.status === "rejected" ? "REJECTED" : "EXPIRED"}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

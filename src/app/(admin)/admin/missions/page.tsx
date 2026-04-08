"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Crosshair, Clock, Trash2 } from "lucide-react";
import { cn, timeUntil, getDifficultyColor, formatDate } from "@/lib/utils";

interface Mission {
  id: string;
  title: string;
  points: number;
  difficulty: string;
  category: string;
  deadline: string;
  isGlobal: boolean;
  assignedCount: number;
  createdAt: string;
}

export default function AdminMissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissions();
  }, []);

  async function fetchMissions() {
    try {
      const res = await fetch("/api/admin/missions");
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

  async function deleteMission(id: string) {
    if (!confirm("Delete this mission? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/missions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMissions((prev) => prev.filter((m) => m.id !== id));
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
            MISSION CONTROL
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
            // MANAGE ALL OPERATIONS
          </p>
        </div>
        <Link
          href="/admin/missions/new"
          className="flex items-center gap-2 bg-white text-black font-[family-name:var(--font-mono)] text-xs px-4 py-2 hover:bg-neutral-200 transition-colors"
        >
          <Plus size={14} />
          NEW MISSION
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="font-[family-name:var(--font-mono)] text-sm text-muted animate-pulse">
            LOADING_MISSIONS...
          </div>
        </div>
      ) : missions.length === 0 ? (
        <div className="border border-border bg-surface p-12 text-center">
          <Crosshair size={32} className="mx-auto text-muted mb-4" />
          <p className="font-[family-name:var(--font-mono)] text-sm text-muted">
            NO MISSIONS CREATED
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {missions.map((mission) => {
            const isExpired = new Date(mission.deadline) < new Date();
            return (
              <div
                key={mission.id}
                className={cn(
                  "border border-border bg-surface p-4 transition-colors",
                  isExpired && "opacity-50"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/admin/missions/${mission.id}`} className="flex-1 min-w-0 group">
                    <div className="flex items-center gap-2 mb-1">
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
                      {mission.isGlobal && (
                        <span className="font-[family-name:var(--font-mono)] text-[10px] text-accent border border-accent/30 px-1.5 py-0.5">
                          GLOBAL
                        </span>
                      )}
                    </div>
                    <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-white group-hover:text-accent transition-colors">
                      {mission.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 font-[family-name:var(--font-mono)] text-[10px] text-muted">
                      <span>{mission.points} PTS</span>
                      <span>{mission.assignedCount} assigned</span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {isExpired ? "EXPIRED" : timeUntil(mission.deadline)}
                      </span>
                      <span>Created {formatDate(mission.createdAt)}</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => deleteMission(mission.id)}
                    className="text-neutral-700 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { cn, getDifficultyColor, getStatusLabel, getStatusColor } from "@/lib/utils";

interface MissionDetail {
  id: string;
  title: string;
  description: string;
  briefing: string;
  points: number;
  difficulty: string;
  category: string;
  deadline: string;
  isGlobal: boolean;
  userMissions: Array<{
    id: string;
    status: string;
    user: { id: string; username: string; displayName: string | null };
  }>;
}

export default function EditMissionPage() {
  const params = useParams();
  const router = useRouter();
  const [mission, setMission] = useState<MissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    briefing: "",
    points: 0,
    difficulty: "",
    category: "",
    deadline: "",
  });

  useEffect(() => {
    async function fetchMission() {
      const res = await fetch(`/api/admin/missions/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        const m = data.mission;
        setMission(m);
        setForm({
          title: m.title,
          description: m.description,
          briefing: m.briefing,
          points: m.points,
          difficulty: m.difficulty,
          category: m.category,
          deadline: new Date(m.deadline).toISOString().slice(0, 16),
        });
      }
      setLoading(false);
    }
    fetchMission();
  }, [params.id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/admin/missions/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/admin/missions");
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="font-[family-name:var(--font-mono)] text-sm text-muted animate-pulse">
          LOADING_MISSION_DATA...
        </div>
      </div>
    );
  }

  if (!mission) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted hover:text-white transition-colors font-[family-name:var(--font-mono)] text-xs"
      >
        <ArrowLeft size={14} /> BACK
      </button>

      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
          EDIT MISSION
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">TITLE</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors" required />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">DESCRIPTION</label>
          <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors" required />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">BRIEFING</label>
          <textarea value={form.briefing} onChange={(e) => setForm({ ...form, briefing: e.target.value })} rows={5} className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors resize-none" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">POINTS</label>
            <input type="number" value={form.points} onChange={(e) => setForm({ ...form, points: Number(e.target.value) })} className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors" min={1} required />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">DEADLINE</label>
            <input type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">DIFFICULTY</label>
            <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors">
              <option value="RECON">RECON</option>
              <option value="STANDARD">STANDARD</option>
              <option value="COVERT">COVERT</option>
              <option value="BLACK_OPS">BLACK_OPS</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">CATEGORY</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors">
              <option value="STREAM">STREAM</option>
              <option value="VIDEO">VIDEO</option>
              <option value="SOCIAL">SOCIAL</option>
              <option value="CREATIVE">CREATIVE</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
        </div>
        <button type="submit" disabled={saving} className="w-full bg-white text-black font-[family-name:var(--font-heading)] font-bold py-3 text-sm tracking-wider hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          <Save size={16} />
          {saving ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </form>

      {/* Assigned Users */}
      <div className="border border-border bg-surface p-6">
        <h2 className="font-[family-name:var(--font-mono)] text-xs text-muted tracking-wider mb-4">
          ASSIGNED_OPERATIVES ({mission.userMissions.length})
        </h2>
        {mission.userMissions.length === 0 ? (
          <p className="font-[family-name:var(--font-mono)] text-xs text-neutral-600">No operatives assigned.</p>
        ) : (
          <div className="space-y-2">
            {mission.userMissions.map((um) => (
              <div key={um.id} className="flex items-center justify-between border-b border-border pb-2 last:border-b-0 last:pb-0">
                <div>
                  <span className="font-[family-name:var(--font-mono)] text-sm text-white">
                    {um.user.displayName || um.user.username}
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-muted ml-2">
                    @{um.user.username}
                  </span>
                </div>
                <span className={cn("font-[family-name:var(--font-mono)] text-[10px] border px-1.5 py-0.5", getStatusColor(um.status))}>
                  {getStatusLabel(um.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

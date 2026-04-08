"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface UserOption {
  id: string;
  username: string;
  displayName: string | null;
}

export default function NewMissionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    briefing: "",
    points: 100,
    difficulty: "STANDARD",
    category: "STREAM",
    deadline: "",
    isGlobal: true,
    userIds: [] as string[],
  });

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(
          (data.users || [])
            .filter((u: { role: string }) => u.role === "missionary")
            .map((u: UserOption) => ({
              id: u.id,
              username: u.username,
              displayName: u.displayName,
            }))
        );
      }
    }
    fetchUsers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/missions");
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  function toggleUser(userId: string) {
    setForm((prev) => ({
      ...prev,
      userIds: prev.userIds.includes(userId)
        ? prev.userIds.filter((id) => id !== userId)
        : [...prev.userIds, userId],
    }));
  }

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
          DEPLOY NEW MISSION
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
          // CREATE AND ASSIGN OPERATION
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">
            MISSION_TITLE
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors"
            placeholder="SIGNAL BROADCAST // Operation Name"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">
            SHORT_DESCRIPTION
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors"
            placeholder="One-line summary of the mission"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">
            DETAILED_BRIEFING
          </label>
          <textarea
            value={form.briefing}
            onChange={(e) => setForm({ ...form, briefing: e.target.value })}
            rows={5}
            className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors resize-none"
            placeholder="Full mission briefing with objectives and requirements..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">
              POINTS
            </label>
            <input
              type="number"
              value={form.points}
              onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
              className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors"
              min={1}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">
              DEADLINE
            </label>
            <input
              type="datetime-local"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">
              DIFFICULTY
            </label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors"
            >
              <option value="RECON">RECON</option>
              <option value="STANDARD">STANDARD</option>
              <option value="COVERT">COVERT</option>
              <option value="BLACK_OPS">BLACK_OPS</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">
              CATEGORY
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors"
            >
              <option value="STREAM">STREAM</option>
              <option value="VIDEO">VIDEO</option>
              <option value="SOCIAL">SOCIAL</option>
              <option value="CREATIVE">CREATIVE</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted mb-2 font-[family-name:var(--font-mono)] tracking-wider">
            ASSIGNMENT
          </label>
          <div className="flex gap-3 mb-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, isGlobal: true, userIds: [] })}
              className={`font-[family-name:var(--font-mono)] text-xs px-4 py-2 border transition-colors ${
                form.isGlobal
                  ? "bg-white text-black border-white"
                  : "text-muted border-border hover:border-white/30"
              }`}
            >
              ALL MISSIONARIES
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, isGlobal: false })}
              className={`font-[family-name:var(--font-mono)] text-xs px-4 py-2 border transition-colors ${
                !form.isGlobal
                  ? "bg-white text-black border-white"
                  : "text-muted border-border hover:border-white/30"
              }`}
            >
              SPECIFIC USERS
            </button>
          </div>

          {!form.isGlobal && (
            <div className="border border-border bg-surface max-h-48 overflow-y-auto">
              {users.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] cursor-pointer border-b border-border last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={form.userIds.includes(user.id)}
                    onChange={() => toggleUser(user.id)}
                    className="accent-white"
                  />
                  <span className="font-[family-name:var(--font-mono)] text-sm text-white">
                    {user.displayName || user.username}
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-muted">
                    @{user.username}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-[family-name:var(--font-heading)] font-bold py-3 text-sm tracking-wider hover:bg-neutral-200 transition-colors disabled:opacity-50"
        >
          {loading ? "DEPLOYING..." : "DEPLOY MISSION"}
        </button>
      </form>
    </div>
  );
}

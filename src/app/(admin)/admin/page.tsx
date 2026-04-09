"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Crosshair, ClipboardCheck, Gift, Activity } from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalMissions: number;
  pendingReviews: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalMissions: 0, pendingReviews: 0 });

  useEffect(() => {
    async function fetchStats() {
      const [usersRes, missionsRes, submissionsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/missions"),
        fetch("/api/admin/submissions"),
      ]);
      const users = usersRes.ok ? await usersRes.json() : { users: [] };
      const missions = missionsRes.ok ? await missionsRes.json() : { missions: [] };
      const submissions = submissionsRes.ok ? await submissionsRes.json() : { submissions: [] };
      setStats({
        totalUsers: users.users?.length || 0,
        totalMissions: missions.missions?.length || 0,
        pendingReviews: submissions.submissions?.length || 0,
      });
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
          COMMAND CENTER
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
          // ADMIN OVERVIEW
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/admin/users"
          className="border border-border bg-surface p-6 hover:border-white/20 transition-colors group"
        >
          <Users size={24} className="text-muted group-hover:text-white mb-3 transition-colors" />
          <div className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white">
            {stats.totalUsers}
          </div>
          <div className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
            TOTAL OPERATIVES
          </div>
        </Link>
        <Link
          href="/admin/missions"
          className="border border-border bg-surface p-6 hover:border-white/20 transition-colors group"
        >
          <Crosshair size={24} className="text-muted group-hover:text-white mb-3 transition-colors" />
          <div className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white">
            {stats.totalMissions}
          </div>
          <div className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
            TOTAL MISSIONS
          </div>
        </Link>
        <Link
          href="/admin/reviews"
          className="border border-border bg-surface p-6 hover:border-white/20 transition-colors group"
        >
          <ClipboardCheck size={24} className="text-muted group-hover:text-white mb-3 transition-colors" />
          <div className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white">
            {stats.pendingReviews}
          </div>
          <div className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
            PENDING REVIEWS
          </div>
        </Link>
      </div>

      <div className="border border-border bg-surface p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} className="text-muted" />
          <h2 className="font-[family-name:var(--font-mono)] text-xs text-muted tracking-wider">
            QUICK_ACTIONS
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/admin/missions/new"
            className="border border-border p-4 hover:border-white/30 transition-colors"
          >
            <div className="font-[family-name:var(--font-heading)] text-sm font-bold text-white">
              CREATE NEW MISSION
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted mt-1">
              Deploy a new operation
            </div>
          </Link>
          <Link
            href="/admin/reviews"
            className="border border-border p-4 hover:border-white/30 transition-colors"
          >
            <div className="font-[family-name:var(--font-heading)] text-sm font-bold text-white">
              REVIEW SUBMISSIONS
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted mt-1">
              {stats.pendingReviews} pending review{stats.pendingReviews !== 1 ? "s" : ""}
            </div>
          </Link>
          <Link
            href="/admin/rewards/new"
            className="border border-border p-4 hover:border-white/30 transition-colors"
          >
            <div className="font-[family-name:var(--font-heading)] text-sm font-bold text-white">
              CREATE REWARD
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted mt-1">
              Add a new shop item
            </div>
          </Link>
          <Link
            href="/admin/rewards"
            className="border border-border p-4 hover:border-white/30 transition-colors"
          >
            <div className="font-[family-name:var(--font-heading)] text-sm font-bold text-white">
              MANAGE REWARDS
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted mt-1">
              Shop items & pending claims
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

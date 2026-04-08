"use client";

import { useEffect, useState } from "react";
import { Users, Shield, UserX, ChevronDown, ChevronUp } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface UserData {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  role: string;
  points: number;
  rank: string;
  createdAt: string;
  _count: {
    userMissions: number;
    notifications: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  async function toggleRole(userId: string, currentRole: string) {
    setActionLoading(true);
    const newRole = currentRole === "admin" ? "missionary" : "admin";
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch {
      // silent
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
          USER MANAGEMENT
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
          // {users.length} REGISTERED OPERATIVE{users.length !== 1 ? "S" : ""}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="font-[family-name:var(--font-mono)] text-sm text-muted animate-pulse">
            LOADING_OPERATIVES...
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="border border-border bg-surface p-12 text-center">
          <Users size={32} className="mx-auto text-muted mb-4" />
          <p className="font-[family-name:var(--font-mono)] text-sm text-muted">
            NO USERS FOUND
          </p>
        </div>
      ) : (
        <div className="border border-border bg-surface">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-wider">
            <div className="col-span-3">OPERATIVE</div>
            <div className="col-span-2">ROLE</div>
            <div className="col-span-2">RANK</div>
            <div className="col-span-1 text-right">PTS</div>
            <div className="col-span-2 text-right">MISSIONS</div>
            <div className="col-span-2 text-right">JOINED</div>
          </div>

          {users.map((user) => (
            <div key={user.id} className="border-b border-border last:border-b-0">
              <div
                className="grid grid-cols-12 gap-4 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
              >
                <div className="col-span-3 flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 bg-surface-light border border-border flex items-center justify-center flex-shrink-0">
                    <span className="font-[family-name:var(--font-mono)] text-xs text-white">
                      {user.username[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-[family-name:var(--font-heading)] text-sm font-bold text-white truncate">
                      {user.displayName || user.username}
                    </div>
                    <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted">
                      @{user.username}
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center">
                  <span
                    className={cn(
                      "font-[family-name:var(--font-mono)] text-[10px] border px-1.5 py-0.5",
                      user.role === "admin"
                        ? "text-accent border-accent/30"
                        : "text-muted border-border"
                    )}
                  >
                    {user.role.toUpperCase()}
                  </span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="font-[family-name:var(--font-mono)] text-xs text-muted">
                    {user.rank}
                  </span>
                </div>
                <div className="col-span-1 flex items-center justify-end">
                  <span className="font-[family-name:var(--font-heading)] text-sm font-bold text-white">
                    {user.points}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <span className="font-[family-name:var(--font-mono)] text-xs text-muted">
                    {user._count.userMissions}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-muted">
                    {formatDate(user.createdAt)}
                  </span>
                  {expandedId === user.id ? (
                    <ChevronUp size={14} className="text-muted" />
                  ) : (
                    <ChevronDown size={14} className="text-muted" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === user.id && (
                <div className="px-4 py-4 bg-black/20 border-t border-border">
                  <div className="grid grid-cols-2 gap-4 mb-4 font-[family-name:var(--font-mono)] text-xs">
                    <div>
                      <span className="text-muted">EMAIL: </span>
                      <span className="text-white">{user.email}</span>
                    </div>
                    <div>
                      <span className="text-muted">NOTIFICATIONS: </span>
                      <span className="text-white">{user._count.notifications}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRole(user.id, user.role);
                      }}
                      disabled={actionLoading}
                      className={cn(
                        "flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs px-3 py-1.5 border transition-colors disabled:opacity-50",
                        user.role === "admin"
                          ? "border-danger text-danger hover:bg-danger/10"
                          : "border-accent text-accent hover:bg-accent/10"
                      )}
                    >
                      {user.role === "admin" ? (
                        <>
                          <UserX size={12} />
                          DEMOTE TO MISSIONARY
                        </>
                      ) : (
                        <>
                          <Shield size={12} />
                          PROMOTE TO ADMIN
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

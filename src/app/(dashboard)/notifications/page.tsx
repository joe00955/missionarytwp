"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck, Crosshair, Trophy, Zap, AlertCircle } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "mission_assigned":
      return <Crosshair size={16} />;
    case "mission_approved":
      return <Trophy size={16} className="text-green-400" />;
    case "mission_rejected":
      return <AlertCircle size={16} className="text-red-400" />;
    case "rank_up":
      return <Zap size={16} className="text-white" />;
    default:
      return <Bell size={16} />;
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  async function markAllRead() {
    await fetch("/api/notifications/read-all", { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
            NOTIFICATIONS
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
            // {unreadCount} UNREAD TRANSMISSION{unreadCount !== 1 ? "S" : ""}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs text-muted hover:text-white border border-border px-3 py-1.5 hover:border-white/30 transition-colors"
          >
            <CheckCheck size={14} />
            MARK ALL READ
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="font-[family-name:var(--font-mono)] text-sm text-muted animate-pulse">
            RECEIVING_TRANSMISSIONS...
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="border border-border bg-surface p-12 text-center">
          <Bell size={32} className="mx-auto text-muted mb-4" />
          <p className="font-[family-name:var(--font-mono)] text-sm text-muted">
            NO TRANSMISSIONS
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && markRead(n.id)}
              className={cn(
                "border border-border bg-surface p-4 transition-colors cursor-pointer",
                !n.read && "border-l-2 border-l-white bg-white/[0.02]"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-muted flex-shrink-0">
                  {getNotificationIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      "font-[family-name:var(--font-heading)] text-sm font-bold",
                      n.read ? "text-neutral-500" : "text-white"
                    )}
                  >
                    {n.title}
                  </h3>
                  <p
                    className={cn(
                      "text-sm mt-0.5",
                      n.read ? "text-neutral-600" : "text-neutral-400"
                    )}
                  >
                    {n.message}
                  </p>
                  <p className="font-[family-name:var(--font-mono)] text-[10px] text-neutral-700 mt-1">
                    {formatDateTime(n.createdAt)}
                  </p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 bg-white flex-shrink-0 mt-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

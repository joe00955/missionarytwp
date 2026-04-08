"use client";

import { useSession, signOut } from "next-auth/react";
import { Menu, Bell, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: session } = useSession();
  const user = session?.user as Record<string, unknown> | undefined;
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch {
        // silent
      }
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 border-b border-border bg-surface/80 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-muted hover:text-white transition-colors p-1"
      >
        <Menu size={20} />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs">
          <span className="text-muted">PTS:</span>
          <span className="text-white font-bold">{user?.points as number || 0}</span>
          <span className="text-neutral-600">|</span>
          <span className="text-muted">{user?.rank as string || "Initiate"}</span>
        </div>

        <Link
          href="/notifications"
          className="relative text-muted hover:text-white transition-colors p-1"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-black text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="font-[family-name:var(--font-mono)] text-xs text-white hover:text-accent transition-colors"
          >
            {user?.username as string || "unknown"}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-muted hover:text-white transition-colors p-1"
            title="Disconnect"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

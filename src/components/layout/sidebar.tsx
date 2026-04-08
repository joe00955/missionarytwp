"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Crosshair,
  Zap,
  Trophy,
  User,
  Shield,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "DASHBOARD", icon: LayoutDashboard },
  { href: "/missions", label: "MISSIONS", icon: Crosshair },
  { href: "/missions/active", label: "ACTIVE OPS", icon: Zap },
  { href: "/leaderboard", label: "LEADERBOARD", icon: Trophy },
  { href: "/profile", label: "PROFILE", icon: User },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as Record<string, unknown>)?.role === "admin";

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-surface border-r border-border flex flex-col transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" onClick={onClose}>
            <h1 className="font-[family-name:var(--font-heading)] text-lg font-bold text-white tracking-tight">
              TWP
            </h1>
            <p className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-widest mt-0.5">
              MISSIONARY PROGRAM
            </p>
          </Link>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-[family-name:var(--font-mono)] transition-colors group",
                  active
                    ? "text-white bg-white/5 border-l-2 border-white"
                    : "text-muted hover:text-white hover:bg-white/[0.02] border-l-2 border-transparent"
                )}
              >
                <item.icon size={16} />
                <span className="tracking-wider text-xs">{item.label}</span>
                {active && (
                  <ChevronRight size={12} className="ml-auto opacity-50" />
                )}
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div className="pt-4 pb-2 px-3">
                <div className="text-[10px] font-[family-name:var(--font-mono)] text-neutral-600 tracking-widest">
                  ADMIN_ACCESS
                </div>
              </div>
              <Link
                href="/admin"
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-[family-name:var(--font-mono)] transition-colors",
                  pathname.startsWith("/admin")
                    ? "text-white bg-white/5 border-l-2 border-white"
                    : "text-muted hover:text-white hover:bg-white/[0.02] border-l-2 border-transparent"
                )}
              >
                <Shield size={16} />
                <span className="tracking-wider text-xs">ADMIN PANEL</span>
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="font-[family-name:var(--font-mono)] text-[10px] text-neutral-700 tracking-wider">
            SYS_STATUS: ONLINE
          </div>
        </div>
      </aside>
    </>
  );
}

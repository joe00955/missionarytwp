"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Crosshair,
  ClipboardCheck,
  Users,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin", label: "OVERVIEW", icon: LayoutDashboard, exact: true },
  { href: "/admin/missions", label: "MISSIONS", icon: Crosshair },
  { href: "/admin/reviews", label: "REVIEWS", icon: ClipboardCheck },
  { href: "/admin/users", label: "USERS", icon: Users },
];

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

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
          <h1 className="font-[family-name:var(--font-heading)] text-lg font-bold text-white tracking-tight">
            TWP // ADMIN
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-widest mt-0.5">
            COMMAND CENTER
          </p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {adminNavItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-[family-name:var(--font-mono)] transition-colors",
                  active
                    ? "text-white bg-white/5 border-l-2 border-white"
                    : "text-muted hover:text-white hover:bg-white/[0.02] border-l-2 border-transparent"
                )}
              >
                <item.icon size={16} />
                <span className="tracking-wider text-xs">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-muted hover:text-white text-xs font-[family-name:var(--font-mono)] transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="tracking-wider">BACK TO BASE</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

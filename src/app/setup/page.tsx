"use client";

import { useState } from "react";
import Link from "next/link";

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  async function handleSetup() {
    setStatus("loading");
    try {
      const res = await fetch("/api/setup", { method: "POST" });
      const data = await res.json();
      setResult(data);
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
      setResult({ error: "Network error. Try again." });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="max-w-lg w-full">
        <div className="mb-8">
          <div className="font-[family-name:var(--font-mono)] text-xs text-[#737373] mb-2 tracking-widest">
            FIRST_RUN://TWP.SETUP
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white">
            THE WORLD PROJECT
          </h1>
          <p className="text-[#737373] text-sm mt-1 font-[family-name:var(--font-mono)]">
            // DATABASE INITIALIZATION
          </p>
        </div>

        {status === "idle" && (
          <div className="space-y-4">
            <div className="border border-[#262626] bg-[#0a0a0a] p-4 font-[family-name:var(--font-mono)] text-xs text-[#737373] space-y-1">
              <div>&gt; This will create the initial database tables</div>
              <div>&gt; Create an admin account and a demo user</div>
              <div>&gt; Add 4 sample missions</div>
              <div>&gt; Safe to run multiple times (skips if already done)</div>
            </div>
            <button
              onClick={handleSetup}
              className="w-full bg-white text-black font-[family-name:var(--font-heading)] font-bold py-3 px-4 text-sm tracking-wider hover:bg-neutral-200 transition-colors"
            >
              INITIALIZE DATABASE
            </button>
          </div>
        )}

        {status === "loading" && (
          <div className="border border-[#262626] bg-[#0a0a0a] p-6 text-center">
            <div className="font-[family-name:var(--font-mono)] text-sm text-white animate-pulse">
              INITIALIZING_DATABASE...
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="border border-[#262626] bg-[#0a0a0a] p-4 font-[family-name:var(--font-mono)] text-xs space-y-2">
              <div className="text-[#00ff41]">&gt; {String((result as Record<string, unknown>)?.message || "Setup complete!")}</div>
              <div className="border-t border-[#262626] pt-2 mt-2">
                <div className="text-[#737373] mb-1">LOGIN CREDENTIALS:</div>
                <div className="text-white">Admin: admin@twp.io / admin123</div>
                <div className="text-white">Demo:  missionary@twp.io / demo123</div>
              </div>
            </div>
            <Link
              href="/login"
              className="block w-full bg-white text-black font-[family-name:var(--font-heading)] font-bold py-3 px-4 text-sm tracking-wider hover:bg-neutral-200 transition-colors text-center"
            >
              GO TO LOGIN
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="border border-[#ef4444]/50 bg-[#ef4444]/5 p-4 font-[family-name:var(--font-mono)] text-xs text-[#ef4444]">
              &gt; {String((result as Record<string, unknown>)?.error || "Setup failed")}
            </div>
            <button
              onClick={() => { setStatus("idle"); setResult(null); }}
              className="w-full border border-[#262626] text-white font-[family-name:var(--font-mono)] py-3 px-4 text-xs tracking-wider hover:bg-white/5 transition-colors"
            >
              TRY AGAIN
            </button>
          </div>
        )}

        <div className="mt-8 border-t border-[#262626] pt-4">
          <p className="text-[#333] text-xs font-[family-name:var(--font-mono)] text-center">
            v2.1.0 // SETUP_UTILITY // TWP_NETWORK
          </p>
        </div>
      </div>
    </div>
  );
}

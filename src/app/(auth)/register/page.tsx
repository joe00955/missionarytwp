"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Access keys do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Network error. Try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="font-[family-name:var(--font-mono)] text-xs text-muted mb-2 tracking-widest">
          NEW_OPERATIVE://TWP.RECRUITMENT
        </div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white">
          REQUEST CLEARANCE
        </h1>
        <p className="text-muted text-sm mt-1 font-[family-name:var(--font-mono)]">
          // JOIN THE MISSIONARY PROGRAM
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="border border-danger/50 bg-danger/5 px-4 py-3 text-danger text-sm font-[family-name:var(--font-mono)]">
            &gt; {error}
          </div>
        )}

        <div>
          <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">
            CALLSIGN
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600"
            placeholder="ghost_protocol"
            required
            minLength={3}
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">
            EMAIL_ADDRESS
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600"
            placeholder="operative@twp.io"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">
            ACCESS_KEY
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">
            CONFIRM_ACCESS_KEY
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-surface border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-[family-name:var(--font-heading)] font-bold py-3 px-4 text-sm tracking-wider hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "PROCESSING..." : "REQUEST_CLEARANCE"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-muted text-sm">Already cleared? </span>
        <Link
          href="/login"
          className="text-white text-sm hover:text-accent transition-colors font-[family-name:var(--font-mono)]"
        >
          AUTHENTICATE
        </Link>
      </div>

      <div className="mt-8 border-t border-border pt-4">
        <p className="text-neutral-700 text-xs font-[family-name:var(--font-mono)] text-center">
          v2.1.0 // CLASSIFIED // TWP_NETWORK_SECURE
        </p>
      </div>
    </div>
  );
}

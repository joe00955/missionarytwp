"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const TIERS = ["BRONZE", "SILVER", "GOLD", "EPIC", "LEGENDARY", "MYTHIC"];
const CATEGORIES = ["CASH", "GAMING", "TRAVEL", "PRODUCT", "EXPERIENCE", "BUNDLE"];
const EMOJI_SUGGESTIONS = ["💰", "🎮", "✈️", "🏆", "🎵", "👟", "🎟️", "🏝️", "💎", "🔥", "👑", "⚡", "🌍", "🎁", "🃏"];

export default function NewRewardPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tier, setTier] = useState("BRONZE");
  const [cost, setCost] = useState("");
  const [category, setCategory] = useState("PRODUCT");
  const [imageEmoji, setImageEmoji] = useState("🎁");
  const [stock, setStock] = useState("-1");
  const [challenge, setChallenge] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [featured, setFeatured] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/rewards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        tier,
        cost: Number(cost),
        category,
        imageEmoji,
        stock: Number(stock),
        challenge: tier === "MYTHIC" ? challenge : null,
        expiresAt,
        featured,
      }),
    });

    if (res.ok) {
      router.push("/admin/rewards");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create reward");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/rewards"
          className="inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-xs text-muted hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={12} />
          BACK TO REWARDS
        </Link>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
          CREATE REWARD
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
          // ADD A NEW ITEM TO THE REWARDS SHOP
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-wider block mb-1">
            TITLE *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. $50 Amazon Gift Card"
            className="w-full bg-surface border border-border text-white text-sm p-2.5 font-[family-name:var(--font-body)] placeholder:text-neutral-700 focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-wider block mb-1">
            DESCRIPTION *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            placeholder="Describe what the missionary receives"
            className="w-full bg-surface border border-border text-white text-sm p-2.5 font-[family-name:var(--font-body)] placeholder:text-neutral-700 focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Tier + Cost row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-wider block mb-1">
              TIER *
            </label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full bg-surface border border-border text-white text-sm p-2.5 font-[family-name:var(--font-mono)] focus:outline-none focus:border-white/30"
            >
              {TIERS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-wider block mb-1">
              COST (POINTS) *
            </label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              min={1}
              placeholder="500"
              className="w-full bg-surface border border-border text-white text-sm p-2.5 font-[family-name:var(--font-mono)] placeholder:text-neutral-700 focus:outline-none focus:border-white/30"
            />
          </div>
        </div>

        {/* Category + Stock row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-wider block mb-1">
              CATEGORY *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-surface border border-border text-white text-sm p-2.5 font-[family-name:var(--font-mono)] focus:outline-none focus:border-white/30"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-wider block mb-1">
              STOCK (-1 = UNLIMITED)
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min={-1}
              className="w-full bg-surface border border-border text-white text-sm p-2.5 font-[family-name:var(--font-mono)] focus:outline-none focus:border-white/30"
            />
          </div>
        </div>

        {/* Emoji + Expiry row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-wider block mb-1">
              EMOJI ICON
            </label>
            <input
              type="text"
              value={imageEmoji}
              onChange={(e) => setImageEmoji(e.target.value)}
              className="w-full bg-surface border border-border text-white text-2xl p-2 text-center focus:outline-none focus:border-white/30"
            />
            <div className="flex flex-wrap gap-1 mt-1">
              {EMOJI_SUGGESTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setImageEmoji(e)}
                  className={cn("text-lg p-0.5 hover:bg-white/10 transition-colors", imageEmoji === e && "bg-white/10")}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-wider block mb-1">
              EXPIRES AT *
            </label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              required
              className="w-full bg-surface border border-border text-white text-sm p-2.5 font-[family-name:var(--font-mono)] focus:outline-none focus:border-white/30"
            />
          </div>
        </div>

        {/* Mythic challenge */}
        {tier === "MYTHIC" && (
          <div>
            <label className="font-[family-name:var(--font-mono)] text-[10px] text-fuchsia-400 tracking-wider block mb-1">
              MYTHIC CHALLENGE *
            </label>
            <textarea
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              rows={2}
              placeholder="Describe the challenge the missionary must complete alongside the point cost"
              className="w-full bg-surface border border-fuchsia-500/30 text-white text-sm p-2.5 font-[family-name:var(--font-body)] placeholder:text-neutral-700 focus:outline-none focus:border-fuchsia-500/50"
            />
            <p className="font-[family-name:var(--font-mono)] text-[9px] text-fuchsia-400/50 mt-0.5">
              Mythic rewards require both points AND a challenge completion
            </p>
          </div>
        )}

        {/* Featured toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 bg-surface border-border accent-white"
          />
          <span className="font-[family-name:var(--font-mono)] text-xs text-muted">
            MARK AS FEATURED (pinned to top of shop)
          </span>
        </label>

        {error && (
          <div className="border border-danger/50 bg-danger/5 p-3 font-[family-name:var(--font-mono)] text-xs text-danger">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-white text-black font-[family-name:var(--font-heading)] font-bold py-3 text-sm tracking-wider hover:bg-neutral-200 transition-colors disabled:opacity-50"
        >
          {saving ? "CREATING..." : "CREATE REWARD"}
        </button>
      </form>
    </div>
  );
}

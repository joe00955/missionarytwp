"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gift, Plus, Trash2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Reward {
  id: string;
  title: string;
  tier: string;
  cost: number;
  category: string;
  stock: number;
  expiresAt: string;
  featured: boolean;
  claimCount: number;
}

interface Claim {
  id: string;
  status: string;
  pointsSpent: number;
  note: string | null;
  createdAt: string;
  user: { id: string; username: string; displayName: string | null; points: number; rank: string };
  reward: { id: string; title: string; tier: string; cost: number; category: string; challenge: string | null };
}

const TIER_COLORS: Record<string, string> = {
  MYTHIC: "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/5",
  LEGENDARY: "text-amber-400 border-amber-500/30 bg-amber-500/5",
  EPIC: "text-purple-400 border-purple-500/30 bg-purple-500/5",
  GOLD: "text-yellow-400 border-yellow-500/30 bg-yellow-500/5",
  SILVER: "text-neutral-300 border-neutral-400/30 bg-neutral-400/5",
  BRONZE: "text-orange-300 border-orange-400/30 bg-orange-400/5",
};

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [tab, setTab] = useState<"rewards" | "claims">("rewards");
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState("");

  useEffect(() => {
    async function fetchData() {
      const [rRes, cRes] = await Promise.all([
        fetch("/api/admin/rewards"),
        fetch("/api/admin/reward-claims"),
      ]);
      if (rRes.ok) {
        const data = await rRes.json();
        setRewards(data.rewards || []);
      }
      if (cRes.ok) {
        const data = await cRes.json();
        setClaims(data.claims || []);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  async function deleteReward(id: string) {
    if (!confirm("Delete this reward? Existing claims will also be removed.")) return;
    const res = await fetch(`/api/admin/rewards/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRewards((prev) => prev.filter((r) => r.id !== id));
    }
  }

  async function handleClaimReview(claimId: string, action: "approve" | "reject") {
    const res = await fetch(`/api/admin/reward-claims/${claimId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, adminNote: reviewNote }),
    });
    if (res.ok) {
      setClaims((prev) => prev.filter((c) => c.id !== claimId));
      setReviewingId(null);
      setReviewNote("");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="font-[family-name:var(--font-mono)] text-sm text-muted animate-pulse">
          LOADING_REWARDS_DATA...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
            REWARDS MANAGEMENT
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
            // MANAGE SHOP ITEMS & REVIEW CLAIMS
          </p>
        </div>
        <Link
          href="/admin/rewards/new"
          className="bg-white text-black font-[family-name:var(--font-heading)] font-bold px-4 py-2 text-sm tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          NEW REWARD
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setTab("rewards")}
          className={cn(
            "font-[family-name:var(--font-mono)] text-xs tracking-wider px-4 py-2.5 border-b-2 transition-colors",
            tab === "rewards" ? "border-white text-white" : "border-transparent text-muted hover:text-white"
          )}
        >
          SHOP ITEMS ({rewards.length})
        </button>
        <button
          onClick={() => setTab("claims")}
          className={cn(
            "font-[family-name:var(--font-mono)] text-xs tracking-wider px-4 py-2.5 border-b-2 transition-colors",
            tab === "claims" ? "border-white text-white" : "border-transparent text-muted hover:text-white"
          )}
        >
          PENDING CLAIMS ({claims.length})
          {claims.length > 0 && (
            <span className="ml-2 w-2 h-2 bg-accent rounded-full inline-block" />
          )}
        </button>
      </div>

      {/* Rewards tab */}
      {tab === "rewards" && (
        <div className="space-y-2">
          {rewards.length === 0 ? (
            <div className="border border-border bg-surface p-12 text-center">
              <Gift size={32} className="mx-auto text-muted mb-4" />
              <p className="font-[family-name:var(--font-mono)] text-sm text-muted">
                NO REWARDS CREATED YET
              </p>
            </div>
          ) : (
            rewards.map((reward) => {
              const expired = new Date(reward.expiresAt) < new Date();
              return (
                <div
                  key={reward.id}
                  className={cn("border border-border bg-surface p-4 flex items-center gap-4", expired && "opacity-50")}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-white truncate">
                        {reward.title}
                      </h3>
                      <span className={cn("font-[family-name:var(--font-mono)] text-[9px] tracking-wider px-1.5 py-0.5 border flex-shrink-0", TIER_COLORS[reward.tier])}>
                        {reward.tier}
                      </span>
                      {reward.featured && (
                        <span className="font-[family-name:var(--font-mono)] text-[9px] bg-white text-black px-1.5 py-0.5 flex-shrink-0">
                          FEATURED
                        </span>
                      )}
                      {expired && (
                        <span className="font-[family-name:var(--font-mono)] text-[9px] text-danger flex-shrink-0">
                          EXPIRED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 font-[family-name:var(--font-mono)] text-[10px] text-muted">
                      <span>{reward.cost} PTS</span>
                      <span>|</span>
                      <span>{reward.category}</span>
                      <span>|</span>
                      <span>{reward.claimCount} claims</span>
                      {reward.stock !== -1 && (
                        <>
                          <span>|</span>
                          <span>{Math.max(0, reward.stock - reward.claimCount)}/{reward.stock} stock</span>
                        </>
                      )}
                      <span>|</span>
                      <span className="flex items-center gap-1">
                        <Clock size={9} />
                        {new Date(reward.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteReward(reward.id)}
                    className="text-muted hover:text-danger transition-colors p-2 flex-shrink-0"
                    title="Delete reward"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Claims tab */}
      {tab === "claims" && (
        <div className="space-y-3">
          {claims.length === 0 ? (
            <div className="border border-border bg-surface p-12 text-center">
              <AlertCircle size={32} className="mx-auto text-muted mb-4" />
              <p className="font-[family-name:var(--font-mono)] text-sm text-muted">
                NO PENDING CLAIMS
              </p>
            </div>
          ) : (
            claims.map((claim) => (
              <div key={claim.id} className="border border-border bg-surface p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("font-[family-name:var(--font-mono)] text-[9px] tracking-wider px-1.5 py-0.5 border", TIER_COLORS[claim.reward.tier])}>
                        {claim.reward.tier}
                      </span>
                      <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-white">
                        {claim.reward.title}
                      </h3>
                    </div>
                    <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted">
                      Claimed by <span className="text-white">{claim.user.displayName || claim.user.username}</span> (@{claim.user.username}) — {claim.user.rank} — {claim.user.points} pts remaining
                    </div>
                    <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted mt-1">
                      {claim.pointsSpent} PTS spent — {new Date(claim.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* User note */}
                {claim.note && (
                  <div className="border border-border bg-black/30 p-2">
                    <span className="font-[family-name:var(--font-mono)] text-[9px] text-muted tracking-wider">USER NOTE:</span>
                    <p className="font-[family-name:var(--font-mono)] text-xs text-white mt-0.5">{claim.note}</p>
                  </div>
                )}

                {/* Mythic challenge */}
                {claim.reward.challenge && (
                  <div className="border border-fuchsia-500/20 bg-fuchsia-500/5 p-2">
                    <span className="font-[family-name:var(--font-mono)] text-[9px] text-fuchsia-400 tracking-wider">MYTHIC CHALLENGE:</span>
                    <p className="font-[family-name:var(--font-mono)] text-xs text-fuchsia-300/70 mt-0.5">{claim.reward.challenge}</p>
                  </div>
                )}

                {/* Review area */}
                {reviewingId === claim.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      rows={2}
                      placeholder="Note to user (fulfillment details, rejection reason, etc.)"
                      className="w-full bg-black border border-border text-white text-xs p-2 font-[family-name:var(--font-mono)] placeholder:text-neutral-700 focus:outline-none focus:border-white/30"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleClaimReview(claim.id, "approve")}
                        className="bg-white text-black font-[family-name:var(--font-mono)] text-xs font-bold px-4 py-2 hover:bg-neutral-200 transition-colors"
                      >
                        APPROVE
                      </button>
                      <button
                        onClick={() => handleClaimReview(claim.id, "reject")}
                        className="border border-danger/50 text-danger font-[family-name:var(--font-mono)] text-xs px-4 py-2 hover:bg-danger/10 transition-colors"
                      >
                        REJECT (REFUND)
                      </button>
                      <button
                        onClick={() => { setReviewingId(null); setReviewNote(""); }}
                        className="text-muted font-[family-name:var(--font-mono)] text-xs px-4 py-2 hover:text-white transition-colors"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setReviewingId(claim.id); setReviewNote(""); }}
                    className="font-[family-name:var(--font-mono)] text-xs text-white border border-border px-4 py-2 hover:border-white/30 transition-colors"
                  >
                    REVIEW CLAIM
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Clock,
  Flame,
  Crown,
  Star,
  Gem,
  Sparkles,
  ShieldCheck,
  X,
  Loader2,
  Package,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Reward {
  id: string;
  title: string;
  description: string;
  tier: string;
  cost: number;
  category: string;
  imageEmoji: string;
  stock: number;
  claimed: number;
  challenge: string | null;
  expiresAt: string;
  featured: boolean;
  userClaimStatus: string | null;
}

const TIER_ORDER = ["MYTHIC", "LEGENDARY", "EPIC", "GOLD", "SILVER", "BRONZE"];

const TIER_CONFIG: Record<
  string,
  {
    label: string;
    icon: React.ReactNode;
    color: string;
    bgGlow: string;
    borderClass: string;
    badgeClass: string;
    sectionBorder: string;
  }
> = {
  MYTHIC: {
    label: "MYTHIC",
    icon: <Crown size={16} />,
    color: "text-fuchsia-300",
    bgGlow: "shadow-[0_0_40px_rgba(217,70,239,0.15)]",
    borderClass: "mythic-border",
    badgeClass: "bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 text-white",
    sectionBorder: "border-fuchsia-500/30",
  },
  LEGENDARY: {
    label: "LEGENDARY",
    icon: <Flame size={16} />,
    color: "text-amber-300",
    bgGlow: "shadow-[0_0_30px_rgba(245,158,11,0.12)]",
    borderClass: "border-amber-500/40 hover:border-amber-400/70",
    badgeClass: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    sectionBorder: "border-amber-500/30",
  },
  EPIC: {
    label: "EPIC",
    icon: <Gem size={16} />,
    color: "text-purple-400",
    bgGlow: "",
    borderClass: "border-purple-500/30 hover:border-purple-400/50",
    badgeClass: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
    sectionBorder: "border-purple-500/20",
  },
  GOLD: {
    label: "GOLD",
    icon: <Star size={16} />,
    color: "text-yellow-400",
    bgGlow: "",
    borderClass: "border-yellow-500/20 hover:border-yellow-400/40",
    badgeClass: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    sectionBorder: "border-yellow-500/15",
  },
  SILVER: {
    label: "SILVER",
    icon: <ShieldCheck size={16} />,
    color: "text-neutral-300",
    bgGlow: "",
    borderClass: "border-neutral-400/20 hover:border-neutral-300/40",
    badgeClass: "bg-neutral-400/10 text-neutral-300 border border-neutral-400/20",
    sectionBorder: "border-neutral-400/15",
  },
  BRONZE: {
    label: "BRONZE",
    icon: <Package size={16} />,
    color: "text-orange-300",
    bgGlow: "",
    borderClass: "border-orange-400/20 hover:border-orange-300/40",
    badgeClass: "bg-orange-400/10 text-orange-300 border border-orange-400/20",
    sectionBorder: "border-orange-500/15",
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  CASH: "CASH",
  GAMING: "GAMING",
  TRAVEL: "TRAVEL",
  PRODUCT: "PRODUCT",
  EXPERIENCE: "EXPERIENCE",
  BUNDLE: "BUNDLE",
};

function timeRemaining(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "EXPIRED";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m`;
}

export default function RewardsPage() {
  const { data: session } = useSession();
  const user = session?.user as Record<string, unknown> | undefined;
  const userPoints = (user?.points as number) || 0;

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [claimNote, setClaimNote] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claimResult, setClaimResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  const fetchRewards = useCallback(async () => {
    try {
      const res = await fetch("/api/rewards");
      if (res.ok) {
        const data = await res.json();
        setRewards(data.rewards || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  async function handleClaim(reward: Reward) {
    setClaiming(true);
    setClaimResult(null);
    try {
      const res = await fetch(`/api/rewards/${reward.id}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: claimNote }),
      });
      const data = await res.json();
      if (res.ok) {
        setClaimResult({ ok: true, message: "Claim submitted! Awaiting admin approval." });
        fetchRewards();
      } else {
        setClaimResult({ ok: false, message: data.error || "Failed to claim" });
      }
    } catch {
      setClaimResult({ ok: false, message: "Network error" });
    } finally {
      setClaiming(false);
    }
  }

  const grouped: Record<string, Reward[]> = {};
  for (const tier of TIER_ORDER) {
    const items = rewards.filter((r) => r.tier === tier && (filter === "ALL" || r.category === filter));
    if (items.length > 0) grouped[tier] = items;
  }

  const categories = ["ALL", ...new Set(rewards.map((r) => r.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="font-[family-name:var(--font-mono)] text-sm text-muted animate-pulse">
          LOADING_REWARDS_SHOP...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
            REWARDS SHOP
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
            // EXCHANGE POINTS FOR REAL-WORLD REWARDS
          </p>
        </div>
        <div className="flex items-center gap-2 border border-border bg-surface px-4 py-2">
          <Sparkles size={14} className="text-accent" />
          <span className="font-[family-name:var(--font-mono)] text-xs text-muted">YOUR BALANCE:</span>
          <span className="font-[family-name:var(--font-heading)] text-lg font-bold text-white">
            {userPoints}
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[10px] text-muted">PTS</span>
        </div>
      </div>

      {/* Rotation timer banner */}
      <div className="border border-border bg-surface/50 p-3 flex items-center justify-center gap-2">
        <Clock size={12} className="text-muted" />
        <span className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-wider">
          SHOP ITEMS ARE TIME-LIMITED — CLAIM BEFORE THEY ROTATE OUT
        </span>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "font-[family-name:var(--font-mono)] text-[10px] tracking-wider px-3 py-1.5 border transition-colors",
              filter === cat
                ? "border-white bg-white text-black"
                : "border-border text-muted hover:text-white hover:border-white/30"
            )}
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {/* Rewards sections */}
      {rewards.length === 0 ? (
        <div className="border border-border bg-surface p-12 text-center">
          <Gift size={32} className="mx-auto text-muted mb-4" />
          <p className="font-[family-name:var(--font-mono)] text-sm text-muted">
            NO REWARDS AVAILABLE RIGHT NOW
          </p>
          <p className="font-[family-name:var(--font-mono)] text-[10px] text-neutral-600 mt-1">
            Check back later — new items rotate in regularly
          </p>
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="border border-border bg-surface p-12 text-center">
          <p className="font-[family-name:var(--font-mono)] text-sm text-muted">
            NO REWARDS IN THIS CATEGORY
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([tier, items]) => {
          const config = TIER_CONFIG[tier];
          return (
            <div key={tier} className="space-y-3">
              {/* Section header */}
              <div className={cn("flex items-center gap-3 border-b pb-2", config.sectionBorder)}>
                <span className={config.color}>{config.icon}</span>
                <h2 className={cn("font-[family-name:var(--font-heading)] text-lg font-bold", config.color)}>
                  {config.label} REWARDS
                </h2>
                <span className="font-[family-name:var(--font-mono)] text-[10px] text-muted">
                  ({items.length})
                </span>
              </div>

              {/* Cards grid */}
              <div
                className={cn(
                  "grid gap-3",
                  tier === "MYTHIC" || tier === "LEGENDARY"
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                )}
              >
                {items.map((reward, i) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    config={config}
                    userPoints={userPoints}
                    index={i}
                    onSelect={() => {
                      setSelectedReward(reward);
                      setClaimNote("");
                      setClaimResult(null);
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* Claim Modal */}
      <AnimatePresence>
        {selectedReward && (
          <ClaimModal
            reward={selectedReward}
            userPoints={userPoints}
            claimNote={claimNote}
            setClaimNote={setClaimNote}
            claiming={claiming}
            claimResult={claimResult}
            onClaim={() => handleClaim(selectedReward)}
            onClose={() => {
              setSelectedReward(null);
              setClaimNote("");
              setClaimResult(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function RewardCard({
  reward,
  config,
  userPoints,
  index,
  onSelect,
}: {
  reward: Reward;
  config: (typeof TIER_CONFIG)[string];
  userPoints: number;
  index: number;
  onSelect: () => void;
}) {
  const canAfford = userPoints >= reward.cost;
  const alreadyClaimed = reward.userClaimStatus !== null;
  const outOfStock = reward.stock !== -1 && reward.claimed >= reward.stock;
  const isMythic = reward.tier === "MYTHIC";
  const isLegendary = reward.tier === "LEGENDARY";
  const isBigTier = isMythic || isLegendary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <button
        onClick={onSelect}
        disabled={alreadyClaimed || outOfStock}
        className={cn(
          "w-full text-left border bg-surface transition-all duration-300 group relative overflow-hidden",
          config.borderClass,
          config.bgGlow,
          isMythic && "mythic-glow",
          alreadyClaimed && "opacity-60 cursor-not-allowed",
          outOfStock && "opacity-40 cursor-not-allowed",
          isBigTier ? "p-5 sm:p-6" : "p-4"
        )}
      >
        {/* Featured badge */}
        {reward.featured && (
          <div className="absolute top-0 right-0 bg-white text-black font-[family-name:var(--font-mono)] text-[8px] tracking-widest px-2 py-0.5 font-bold">
            FEATURED
          </div>
        )}

        {/* Emoji + tier badge row */}
        <div className="flex items-start justify-between mb-3">
          <div className={cn("text-3xl", isBigTier && "text-4xl")}>{reward.imageEmoji}</div>
          <span className={cn("font-[family-name:var(--font-mono)] text-[9px] tracking-wider px-2 py-0.5", config.badgeClass)}>
            {config.label}
          </span>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "font-[family-name:var(--font-heading)] font-bold text-white mb-1 transition-colors",
            isBigTier ? "text-lg" : "text-sm",
            isMythic && "group-hover:text-fuchsia-300",
            isLegendary && "group-hover:text-amber-300"
          )}
        >
          {reward.title}
        </h3>

        {/* Description */}
        <p
          className={cn(
            "font-[family-name:var(--font-body)] text-muted mb-3 line-clamp-2",
            isBigTier ? "text-sm" : "text-xs"
          )}
        >
          {reward.description}
        </p>

        {/* Mythic challenge tag */}
        {isMythic && reward.challenge && (
          <div className="mb-3 border border-fuchsia-500/20 bg-fuchsia-500/5 p-2">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle size={10} className="text-fuchsia-400" />
              <span className="font-[family-name:var(--font-mono)] text-[9px] text-fuchsia-400 tracking-wider">
                MYTHIC CHALLENGE REQUIRED
              </span>
            </div>
            <p className="font-[family-name:var(--font-mono)] text-[10px] text-fuchsia-300/70 line-clamp-2">
              {reward.challenge}
            </p>
          </div>
        )}

        {/* Category + time + stock */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="font-[family-name:var(--font-mono)] text-[9px] text-muted border border-border px-1.5 py-0.5">
            {CATEGORY_LABELS[reward.category] || reward.category}
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[9px] text-muted flex items-center gap-1">
            <Clock size={9} />
            {timeRemaining(reward.expiresAt)}
          </span>
          {reward.stock !== -1 && (
            <span className="font-[family-name:var(--font-mono)] text-[9px] text-muted">
              {Math.max(0, reward.stock - reward.claimed)}/{reward.stock} LEFT
            </span>
          )}
        </div>

        {/* Price + status */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} className={config.color} />
            <span className={cn("font-[family-name:var(--font-heading)] font-bold text-lg", config.color)}>
              {reward.cost.toLocaleString()}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[9px] text-muted">PTS</span>
          </div>
          {alreadyClaimed ? (
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-accent">
              {reward.userClaimStatus === "pending" ? "PENDING" : reward.userClaimStatus === "approved" ? "APPROVED" : "CLAIMED"}
            </span>
          ) : outOfStock ? (
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-danger">SOLD OUT</span>
          ) : !canAfford ? (
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-neutral-600">INSUFFICIENT PTS</span>
          ) : (
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-white group-hover:text-accent transition-colors">
              CLAIM →
            </span>
          )}
        </div>
      </button>
    </motion.div>
  );
}

function ClaimModal({
  reward,
  userPoints,
  claimNote,
  setClaimNote,
  claiming,
  claimResult,
  onClaim,
  onClose,
}: {
  reward: Reward;
  userPoints: number;
  claimNote: string;
  setClaimNote: (v: string) => void;
  claiming: boolean;
  claimResult: { ok: boolean; message: string } | null;
  onClaim: () => void;
  onClose: () => void;
}) {
  const config = TIER_CONFIG[reward.tier];
  const canAfford = userPoints >= reward.cost;
  const isMythic = reward.tier === "MYTHIC";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full max-w-lg border bg-surface-light relative",
          isMythic ? "mythic-border" : config.borderClass,
          config.bgGlow
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted hover:text-white transition-colors z-10"
        >
          <X size={18} />
        </button>

        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="text-5xl">{reward.imageEmoji}</div>
            <div className="flex-1">
              <span className={cn("font-[family-name:var(--font-mono)] text-[9px] tracking-wider px-2 py-0.5 inline-block mb-2", config.badgeClass)}>
                {config.label}
              </span>
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white">
                {reward.title}
              </h2>
            </div>
          </div>

          {/* Description */}
          <p className="font-[family-name:var(--font-body)] text-sm text-neutral-300 leading-relaxed">
            {reward.description}
          </p>

          {/* Mythic challenge */}
          {isMythic && reward.challenge && (
            <div className="border border-fuchsia-500/30 bg-fuchsia-500/5 p-3 space-y-1">
              <div className="flex items-center gap-1.5">
                <AlertTriangle size={12} className="text-fuchsia-400" />
                <span className="font-[family-name:var(--font-mono)] text-[10px] text-fuchsia-400 tracking-wider font-bold">
                  MYTHIC CHALLENGE
                </span>
              </div>
              <p className="font-[family-name:var(--font-mono)] text-xs text-fuchsia-300/80">
                {reward.challenge}
              </p>
            </div>
          )}

          {/* Cost breakdown */}
          <div className="border border-border bg-surface p-3">
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-mono)] text-xs text-muted">COST</span>
              <span className={cn("font-[family-name:var(--font-heading)] text-xl font-bold", config.color)}>
                {reward.cost.toLocaleString()} PTS
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-[family-name:var(--font-mono)] text-xs text-muted">YOUR BALANCE</span>
              <span className={cn("font-[family-name:var(--font-mono)] text-xs", canAfford ? "text-white" : "text-danger")}>
                {userPoints.toLocaleString()} PTS
              </span>
            </div>
            {canAfford && (
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-border">
                <span className="font-[family-name:var(--font-mono)] text-xs text-muted">AFTER CLAIM</span>
                <span className="font-[family-name:var(--font-mono)] text-xs text-muted">
                  {(userPoints - reward.cost).toLocaleString()} PTS
                </span>
              </div>
            )}
          </div>

          {/* Note to admin */}
          {!claimResult && canAfford && (
            <div>
              <label className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-wider block mb-1">
                MESSAGE TO ADMIN (OPTIONAL)
              </label>
              <textarea
                value={claimNote}
                onChange={(e) => setClaimNote(e.target.value)}
                rows={2}
                placeholder="Shipping address, preferred contact method, etc."
                className="w-full bg-surface border border-border text-white text-sm p-2 font-[family-name:var(--font-mono)] placeholder:text-neutral-700 focus:outline-none focus:border-white/30"
              />
            </div>
          )}

          {/* Result message */}
          {claimResult && (
            <div
              className={cn(
                "border p-3 font-[family-name:var(--font-mono)] text-xs",
                claimResult.ok
                  ? "border-accent/30 bg-accent/5 text-accent"
                  : "border-danger/30 bg-danger/5 text-danger"
              )}
            >
              {claimResult.message}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {claimResult?.ok ? (
              <button
                onClick={onClose}
                className="flex-1 bg-white text-black font-[family-name:var(--font-heading)] font-bold py-3 text-sm tracking-wider hover:bg-neutral-200 transition-colors"
              >
                DONE
              </button>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 border border-border text-muted font-[family-name:var(--font-mono)] py-3 text-xs tracking-wider hover:text-white hover:border-white/30 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={onClaim}
                  disabled={!canAfford || claiming}
                  className={cn(
                    "flex-1 font-[family-name:var(--font-heading)] font-bold py-3 text-sm tracking-wider transition-colors flex items-center justify-center gap-2",
                    canAfford
                      ? "bg-white text-black hover:bg-neutral-200"
                      : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                  )}
                >
                  {claiming ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      PROCESSING...
                    </>
                  ) : canAfford ? (
                    "CLAIM REWARD"
                  ) : (
                    "NOT ENOUGH POINTS"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

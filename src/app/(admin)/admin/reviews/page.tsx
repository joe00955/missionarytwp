"use client";

import { useEffect, useState } from "react";
import { ClipboardCheck, Check, X, User, ExternalLink } from "lucide-react";
import { cn, formatDateTime, getDifficultyColor } from "@/lib/utils";

interface Submission {
  id: string;
  userId: string;
  missionId: string;
  status: string;
  submission: string;
  submittedAt: string | null;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    points: number;
    rank: string;
  };
  mission: {
    title: string;
    description: string;
    points: number;
    difficulty: string;
    category: string;
  };
}

export default function AdminReviewsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    try {
      const res = await fetch("/api/admin/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(id: string, action: "approve" | "reject") {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reviewNote }),
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        setReviewingId(null);
        setReviewNote("");
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
          SUBMISSION REVIEW
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
          // {submissions.length} PENDING REVIEW{submissions.length !== 1 ? "S" : ""}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="font-[family-name:var(--font-mono)] text-sm text-muted animate-pulse">
            LOADING_SUBMISSIONS...
          </div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="border border-border bg-surface p-12 text-center">
          <ClipboardCheck size={32} className="mx-auto text-muted mb-4" />
          <p className="font-[family-name:var(--font-mono)] text-sm text-muted">
            NO PENDING REVIEWS
          </p>
          <p className="font-[family-name:var(--font-mono)] text-xs text-neutral-600 mt-1">
            All submissions have been processed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div key={sub.id} className="border border-border bg-surface">
              {/* Header */}
              <div className="p-4 border-b border-border flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("font-[family-name:var(--font-mono)] text-[10px] border px-1.5 py-0.5", getDifficultyColor(sub.mission.difficulty))}>
                      {sub.mission.difficulty}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-muted border border-border px-1.5 py-0.5">
                      {sub.mission.category}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-white">
                      {sub.mission.points} PTS
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] text-base font-bold text-white">
                    {sub.mission.title}
                  </h3>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-muted" />
                    <span className="font-[family-name:var(--font-mono)] text-sm text-white">
                      {sub.user.displayName || sub.user.username}
                    </span>
                  </div>
                  <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted mt-0.5">
                    @{sub.user.username} // {sub.user.rank} // {sub.user.points} pts
                  </div>
                  {sub.submittedAt && (
                    <div className="font-[family-name:var(--font-mono)] text-[10px] text-neutral-600 mt-0.5">
                      Submitted: {formatDateTime(sub.submittedAt)}
                    </div>
                  )}
                </div>
              </div>

              {/* Fake wrldAI Analysis */}
              <div className="px-4 py-3 border-b border-border bg-white/[0.01]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-accent animate-pulse" />
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-accent tracking-widest">
                    wrldAI ANALYSIS
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-neutral-700">
                    powered by Google
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 font-[family-name:var(--font-mono)] text-[10px]">
                  <div>
                    <span className="text-muted">CONTENT_SCORE:</span>
                    <span className="text-white ml-1">{Math.floor(Math.random() * 20 + 75)}%</span>
                  </div>
                  <div>
                    <span className="text-muted">PROOF_VERIFIED:</span>
                    <span className="text-white ml-1">{sub.submission.length > 50 ? "YES" : "PARTIAL"}</span>
                  </div>
                  <div>
                    <span className="text-muted">RECOMMENDATION:</span>
                    <span className="text-white ml-1">MANUAL_REVIEW</span>
                  </div>
                </div>
              </div>

              {/* Submission Content */}
              <div className="p-4 border-b border-border">
                <h4 className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-wider mb-2">
                  SUBMISSION_CONTENT
                </h4>
                <div className="text-sm text-neutral-300 whitespace-pre-wrap bg-black/30 p-3 border border-border font-[family-name:var(--font-body)]">
                  {sub.submission}
                </div>
              </div>

              {/* Review Actions */}
              <div className="p-4">
                {reviewingId === sub.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-muted mb-1 font-[family-name:var(--font-mono)] tracking-wider">
                        REVIEW_NOTE (optional for approval, recommended for rejection)
                      </label>
                      <textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        rows={3}
                        className="w-full bg-black border border-border px-3 py-2 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors resize-none"
                        placeholder="Feedback for the missionary..."
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReview(sub.id, "approve")}
                        disabled={actionLoading}
                        className="flex items-center gap-2 bg-white text-black font-[family-name:var(--font-mono)] text-xs px-4 py-2 hover:bg-neutral-200 transition-colors disabled:opacity-50"
                      >
                        <Check size={14} />
                        {actionLoading ? "PROCESSING..." : "APPROVE"}
                      </button>
                      <button
                        onClick={() => handleReview(sub.id, "reject")}
                        disabled={actionLoading}
                        className="flex items-center gap-2 border border-danger text-danger font-[family-name:var(--font-mono)] text-xs px-4 py-2 hover:bg-danger/10 transition-colors disabled:opacity-50"
                      >
                        <X size={14} />
                        REJECT
                      </button>
                      <button
                        onClick={() => { setReviewingId(null); setReviewNote(""); }}
                        className="font-[family-name:var(--font-mono)] text-xs text-muted px-3 py-2 hover:text-white transition-colors ml-auto"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReviewingId(sub.id)}
                    className="flex items-center gap-2 border border-white text-white font-[family-name:var(--font-mono)] text-xs px-4 py-2 hover:bg-white hover:text-black transition-colors"
                  >
                    <ExternalLink size={14} />
                    REVIEW SUBMISSION
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

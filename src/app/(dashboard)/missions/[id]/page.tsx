"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, Crosshair, ArrowLeft, Send, CheckCircle, XCircle } from "lucide-react";
import { cn, timeUntil, formatDateTime, getDifficultyColor, getStatusLabel, getStatusColor } from "@/lib/utils";

interface MissionData {
  mission: {
    id: string;
    title: string;
    description: string;
    briefing: string;
    points: number;
    difficulty: string;
    category: string;
    deadline: string;
    createdAt: string;
  };
  userMission: {
    id: string;
    status: string;
    acceptedAt: string | null;
    submittedAt: string | null;
    reviewedAt: string | null;
    submission: string | null;
    reviewNote: string | null;
    pointsAwarded: number;
  } | null;
}

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<MissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [submission, setSubmission] = useState("");
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  useEffect(() => {
    async function fetchMission() {
      try {
        const res = await fetch(`/api/missions/${params.id}`);
        if (res.ok) {
          setData(await res.json());
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchMission();
  }, [params.id]);

  async function handleAccept() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/missions/${params.id}/accept`, {
        method: "POST",
      });
      if (res.ok) {
        const res2 = await fetch(`/api/missions/${params.id}`);
        if (res2.ok) setData(await res2.json());
      }
    } catch {
      // silent
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSubmit() {
    if (submission.trim().length < 10) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/missions/${params.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission }),
      });
      if (res.ok) {
        const res2 = await fetch(`/api/missions/${params.id}`);
        if (res2.ok) setData(await res2.json());
        setShowSubmitForm(false);
      }
    } catch {
      // silent
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="font-[family-name:var(--font-mono)] text-sm text-muted animate-pulse">
          DECRYPTING_BRIEFING...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="font-[family-name:var(--font-mono)] text-muted">MISSION NOT FOUND</p>
      </div>
    );
  }

  const { mission, userMission } = data;
  const status = userMission?.status || "unavailable";
  const isExpired = new Date(mission.deadline) < new Date();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted hover:text-white transition-colors font-[family-name:var(--font-mono)] text-xs"
      >
        <ArrowLeft size={14} /> BACK
      </button>

      <div className="border border-border bg-surface">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={cn(
                "font-[family-name:var(--font-mono)] text-[10px] border px-1.5 py-0.5",
                getDifficultyColor(mission.difficulty)
              )}
            >
              {mission.difficulty}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-muted border border-border px-1.5 py-0.5">
              {mission.category}
            </span>
            {userMission && (
              <span
                className={cn(
                  "font-[family-name:var(--font-mono)] text-[10px] border px-1.5 py-0.5 ml-auto",
                  getStatusColor(status)
                )}
              >
                {getStatusLabel(status)}
              </span>
            )}
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white">
            {mission.title}
          </h1>
          <p className="text-muted mt-2">{mission.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
          <div className="p-4 text-center">
            <div className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
              {mission.points}
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted">
              POINTS
            </div>
          </div>
          <div className="p-4 text-center">
            <div className="font-[family-name:var(--font-heading)] text-lg font-bold text-white flex items-center justify-center gap-1">
              <Clock size={16} />
              {isExpired ? "EXPIRED" : timeUntil(mission.deadline)}
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted">
              TIME LEFT
            </div>
          </div>
          <div className="p-4 text-center">
            <div className="font-[family-name:var(--font-heading)] text-lg font-bold text-white">
              {mission.difficulty}
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted">
              CLEARANCE
            </div>
          </div>
        </div>

        {/* Briefing */}
        <div className="p-6 border-b border-border">
          <h2 className="font-[family-name:var(--font-mono)] text-xs text-muted tracking-wider mb-3">
            MISSION_BRIEFING
          </h2>
          <div className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap font-[family-name:var(--font-body)]">
            {mission.briefing}
          </div>
        </div>

        {/* Review Info */}
        {userMission?.reviewNote && (
          <div className="p-6 border-b border-border">
            <h2 className="font-[family-name:var(--font-mono)] text-xs text-muted tracking-wider mb-3">
              {status === "approved" ? "VERIFICATION_REPORT" : "REVIEW_FEEDBACK"}
            </h2>
            <div className="flex items-start gap-3">
              {status === "approved" ? (
                <CheckCircle size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="text-sm text-neutral-300">{userMission.reviewNote}</p>
                {userMission.pointsAwarded > 0 && (
                  <p className="font-[family-name:var(--font-mono)] text-xs text-accent mt-2">
                    +{userMission.pointsAwarded} POINTS AWARDED
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Existing Submission */}
        {userMission?.submission && (
          <div className="p-6 border-b border-border">
            <h2 className="font-[family-name:var(--font-mono)] text-xs text-muted tracking-wider mb-3">
              YOUR_SUBMISSION
            </h2>
            <div className="text-sm text-neutral-300 whitespace-pre-wrap bg-black/30 p-4 border border-border">
              {userMission.submission}
            </div>
            {userMission.submittedAt && (
              <p className="font-[family-name:var(--font-mono)] text-[10px] text-neutral-600 mt-2">
                Submitted: {formatDateTime(userMission.submittedAt)}
              </p>
            )}
          </div>
        )}

        {/* Under Review Status */}
        {status === "under_review" && (
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white animate-pulse" />
              <div>
                <p className="font-[family-name:var(--font-mono)] text-sm text-white">
                  ANALYZING SUBMISSION...
                </p>
                <p className="font-[family-name:var(--font-mono)] text-[10px] text-muted mt-0.5">
                  wrldAI powered by Google is reviewing your submission
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Form */}
        {showSubmitForm && status === "active" && (
          <div className="p-6 border-b border-border">
            <h2 className="font-[family-name:var(--font-mono)] text-xs text-muted tracking-wider mb-3">
              MISSION_REPORT
            </h2>
            <textarea
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              rows={6}
              className="w-full bg-black border border-border px-4 py-3 text-white font-[family-name:var(--font-mono)] text-sm focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600 resize-none"
              placeholder="Describe what you did, where you did it, how you did it, and provide any relevant links or proof..."
            />
            <div className="flex items-center justify-between mt-3">
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-muted">
                {submission.length} characters (min 10)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSubmitForm(false)}
                  className="font-[family-name:var(--font-mono)] text-xs text-muted px-3 py-1.5 border border-border hover:text-white hover:border-white/30 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submission.trim().length < 10 || actionLoading}
                  className="font-[family-name:var(--font-mono)] text-xs bg-white text-black px-4 py-1.5 hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={12} />
                  {actionLoading ? "SUBMITTING..." : "SUBMIT FOR REVIEW"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6">
          {status === "available" && !isExpired && (
            <button
              onClick={handleAccept}
              disabled={actionLoading}
              className="w-full bg-white text-black font-[family-name:var(--font-heading)] font-bold py-3 text-sm tracking-wider hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Crosshair size={16} />
              {actionLoading ? "PROCESSING..." : "ACCEPT MISSION"}
            </button>
          )}
          {status === "active" && !showSubmitForm && (
            <button
              onClick={() => setShowSubmitForm(true)}
              className="w-full bg-white text-black font-[family-name:var(--font-heading)] font-bold py-3 text-sm tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
            >
              <Send size={16} />
              SUBMIT COMPLETION REPORT
            </button>
          )}
          {(status === "approved" || status === "rejected" || status === "expired") && (
            <div className="text-center">
              <span
                className={cn(
                  "font-[family-name:var(--font-mono)] text-sm",
                  status === "approved" ? "text-green-400" : status === "rejected" ? "text-red-400" : "text-neutral-600"
                )}
              >
                MISSION {getStatusLabel(status)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

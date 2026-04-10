"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  Music,
  Swords,
  Joystick,
  MapPin,
  ChevronRight,
  Clock,
  Signal,
  Layers,
  CheckCircle2,
  Loader2,
  FlaskConical,
  CircleDashed,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DevLogStatus = "done" | "in-progress" | "testing" | "up-next";

interface DevLogItem {
  label: string;
  status: DevLogStatus;
  note?: string;
}

interface Project {
  id: string;
  codename: string;
  title: string;
  tagline: string;
  description: string;
  status: string;
  statusColor: string;
  eta: string;
  icon: React.ReactNode;
  accentColor: string;
  accentBg: string;
  borderAccent: string;
  features: string[];
  phase: number;
  totalPhases: number;
  overallProgress?: number;
  playableStatus?: string;
  devLog?: DevLogItem[];
}

const DEVLOG_STATUS_CONFIG: Record<
  DevLogStatus,
  { icon: React.ReactNode; color: string; label: string }
> = {
  done: {
    icon: <CheckCircle2 size={12} />,
    color: "text-accent",
    label: "DONE",
  },
  "in-progress": {
    icon: <Loader2 size={12} className="animate-spin" />,
    color: "text-cyan-400",
    label: "IN PROGRESS",
  },
  testing: {
    icon: <FlaskConical size={12} />,
    color: "text-amber-400",
    label: "TESTING",
  },
  "up-next": {
    icon: <CircleDashed size={12} />,
    color: "text-muted",
    label: "UP NEXT",
  },
};

const projects: Project[] = [
  {
    id: "trade-iii",
    codename: "PROJECT_TRADE_III",
    title: "TRADE III",
    tagline: "The next evolution of competitive trading simulation",
    description:
      "The third installment in the TRADE franchise pushes boundaries with an entirely rebuilt engine, real-time market dynamics, and a deeper strategic layer. Now in ALPHA — the game is playable end-to-end with core systems live and active testing underway across multiple fronts.",
    status: "ALPHA",
    statusColor: "text-amber-400 border-amber-400/30 bg-amber-400/5",
    eta: "BETA TESTING — LATE Q2 2026",
    icon: <Gamepad2 size={24} />,
    accentColor: "text-amber-400",
    accentBg: "bg-amber-400",
    borderAccent: "border-amber-400/20 hover:border-amber-400/40",
    features: [
      "Rebuilt core engine",
      "Real-time market simulation",
      "Competitive multiplayer",
      "Advanced AI opponents",
    ],
    phase: 4,
    totalPhases: 6,
    overallProgress: 75,
    playableStatus: "Playable but needs more testing",
    devLog: [
      { label: "UI", status: "done" },
      { label: "Backend", status: "done", note: "Fully set up" },
      { label: "Basic Market Algorithm", status: "done" },
      { label: "Advanced Market Algorithm", status: "up-next", note: "ETA: 11 April" },
      { label: "1v1 Online", status: "testing" },
      { label: "Anti-Cheat System", status: "testing", note: "Brute testing phase" },
      { label: "Global Servers", status: "in-progress", note: "Live: London, New York — Next: Brazil, Nigeria, China, Germany" },
      { label: "Alpha Testing Roster", status: "done", note: "Testing begins 10–11 April" },
      { label: "Sabotage Mechanics", status: "testing", note: "Early stages" },
      { label: "Ranked Functionality", status: "testing" },
      { label: "Sound Design", status: "in-progress", note: "Early stages — full pack ETA: 18 April" },
    ],
  },
  {
    id: "music-vi",
    codename: "PROJECT_MUSIC_VI",
    title: "Music VI",
    tagline: "Where production meets performance",
    description:
      "The sixth volume in our flagship music series is entering its first production phase. We're actively scouting vocalists and instrumentalists to bring a fresh, genre-bending sound to the project. Early demos are in progress.",
    status: "FIRST PRODUCTION & VOCALIST SCOUTING",
    statusColor: "text-violet-400 border-violet-400/30 bg-violet-400/5",
    eta: "PREVIEW RELEASE — Q2 2026",
    icon: <Music size={24} />,
    accentColor: "text-violet-400",
    accentBg: "bg-violet-400",
    borderAccent: "border-violet-400/20 hover:border-violet-400/40",
    features: [
      "Original compositions",
      "Vocalist collaborations",
      "Genre-bending production",
      "Preview tracks dropping soon",
    ],
    phase: 2,
    totalPhases: 5,
  },
  {
    id: "trade-tournament",
    codename: "PROJECT_TRADE_TE",
    title: "TRADE: Tournament Edition",
    tagline: "Competitive trading, amplified",
    description:
      "A standalone competitive spinoff of the TRADE franchise designed for organized tournaments and esports-style play. Currently in the funding acquisition phase — seeking partners and sponsors to bring this vision to life.",
    status: "ACQUIRING FUNDING",
    statusColor: "text-cyan-400 border-cyan-400/30 bg-cyan-400/5",
    eta: "BETA TESTING — TBD",
    icon: <Swords size={24} />,
    accentColor: "text-cyan-400",
    accentBg: "bg-cyan-400",
    borderAccent: "border-cyan-400/20 hover:border-cyan-400/40",
    features: [
      "Tournament bracket system",
      "Spectator mode",
      "Ranked matchmaking",
      "Prize pool integration",
    ],
    phase: 1,
    totalPhases: 7,
  },
  {
    id: "trade-og",
    codename: "PROJECT_TRADE_OG",
    title: "TRADE: OG Edition",
    tagline: "Back to where it all began",
    description:
      "A faithful reimagining of the original TRADE experience that started the franchise. Currently in the planning phase — revisiting what made the original special while exploring modern enhancements that respect the legacy.",
    status: "PLANNING",
    statusColor: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
    eta: "BETA TESTING — TBD",
    icon: <Joystick size={24} />,
    accentColor: "text-emerald-400",
    accentBg: "bg-emerald-400",
    borderAccent: "border-emerald-400/20 hover:border-emerald-400/40",
    features: [
      "Classic gameplay reimagined",
      "Original mechanics preserved",
      "Modern quality-of-life updates",
      "Community-driven design",
    ],
    phase: 1,
    totalPhases: 7,
  },
  {
    id: "london",
    codename: "PROJECT_LONDON",
    title: "LONDON",
    tagline: "A live experience like no other",
    description:
      "An ambitious real-world event that brings The World Project community together in London. Currently in the planning phase — scoping venues, programming, and logistics for an unforgettable experience.",
    status: "PLANNING",
    statusColor: "text-rose-400 border-rose-400/30 bg-rose-400/5",
    eta: "EVENT START — Q4 2026 / Q1 2027",
    icon: <MapPin size={24} />,
    accentColor: "text-rose-400",
    accentBg: "bg-rose-400",
    borderAccent: "border-rose-400/20 hover:border-rose-400/40",
    features: [
      "Live community event",
      "Creator showcases",
      "Exclusive premieres",
      "Networking & panels",
    ],
    phase: 1,
    totalPhases: 5,
  },
];

export default function ProjectsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
          ACTIVE PROJECTS
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs text-muted mt-1">
          // CURRENT OPERATIONS ACROSS THE WORLD PROJECT
        </p>
      </div>

      {/* Project count bar */}
      <div className="flex items-center gap-4 border border-border bg-surface p-3">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-muted" />
          <span className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-wider">
            TRACKING {projects.length} PROJECTS
          </span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Signal size={12} className="text-accent" />
          <span className="font-[family-name:var(--font-mono)] text-[10px] text-accent tracking-wider">
            LIVE
          </span>
        </div>
      </div>

      {/* Project cards */}
      <div className="space-y-3">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
          >
            <div
              className={cn(
                "border bg-surface transition-all duration-300 cursor-pointer group",
                project.borderAccent,
                expandedId === project.id && "bg-surface-light"
              )}
              onClick={() =>
                setExpandedId(expandedId === project.id ? null : project.id)
              }
            >
              {/* Header */}
              <div className="p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 border flex items-center justify-center flex-shrink-0 transition-colors",
                      expandedId === project.id
                        ? `${project.accentColor} border-current`
                        : "text-muted border-border group-hover:text-white group-hover:border-white/20"
                    )}
                  >
                    {project.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-widest">
                        {project.codename}
                      </span>
                    </div>
                    <h2 className="font-[family-name:var(--font-heading)] text-lg sm:text-xl font-bold text-white">
                      {project.title}
                    </h2>
                    <p className="font-[family-name:var(--font-body)] text-sm text-neutral-400 mt-0.5">
                      {project.tagline}
                    </p>

                    {/* Status + ETA row */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span
                        className={cn(
                          "font-[family-name:var(--font-mono)] text-[10px] tracking-wider border px-2 py-0.5",
                          project.statusColor
                        )}
                      >
                        {project.status}
                      </span>
                      <span className="font-[family-name:var(--font-mono)] text-[10px] text-muted flex items-center gap-1">
                        <Clock size={10} />
                        {project.eta}
                      </span>
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <div className="flex-shrink-0 mt-1">
                    <motion.div
                      animate={{
                        rotate: expandedId === project.id ? 90 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight
                        size={16}
                        className="text-muted group-hover:text-white transition-colors"
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-muted flex-shrink-0">
                    {project.overallProgress != null
                      ? `${project.overallProgress}% COMPLETE`
                      : `PHASE ${project.phase}/${project.totalPhases}`}
                  </span>
                  <div className="flex-1 h-1 bg-border overflow-hidden">
                    <motion.div
                      className={cn("h-full", project.accentBg)}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          project.overallProgress != null
                            ? project.overallProgress
                            : (project.phase / project.totalPhases) * 100
                        }%`,
                      }}
                      transition={{ delay: index * 0.08 + 0.3, duration: 0.8 }}
                    />
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {expandedId === project.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-5 pb-5 border-t border-border">
                      <div className="pt-4 grid sm:grid-cols-2 gap-4">
                        {/* Description */}
                        <div>
                          <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-widest mb-2">
                            BRIEFING
                          </div>
                          <p className="font-[family-name:var(--font-body)] text-sm text-neutral-300 leading-relaxed">
                            {project.description}
                          </p>
                        </div>

                        {/* Features */}
                        <div>
                          <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-widest mb-2">
                            KEY_FEATURES
                          </div>
                          <ul className="space-y-2">
                            {project.features.map((feature, i) => (
                              <motion.li
                                key={feature}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-2"
                              >
                                <div
                                  className={cn(
                                    "w-1 h-1 flex-shrink-0",
                                    project.accentBg
                                  )}
                                />
                                <span className="font-[family-name:var(--font-mono)] text-xs text-neutral-300">
                                  {feature}
                                </span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Dev Log */}
                      {project.devLog && project.devLog.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-border">
                          <div className="flex items-center justify-between mb-3">
                            <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-widest">
                              DEV_LOG // LIVE STATUS
                            </div>
                            {project.playableStatus && (
                              <span className={cn("font-[family-name:var(--font-mono)] text-[10px]", project.accentColor)}>
                                {project.playableStatus}
                              </span>
                            )}
                          </div>
                          <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
                            {project.devLog.map((item, i) => {
                              const config = DEVLOG_STATUS_CONFIG[item.status];
                              return (
                                <motion.div
                                  key={item.label}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.04 }}
                                  className="flex items-start gap-2 border border-border bg-black/30 px-2.5 py-1.5"
                                >
                                  <span className={cn("flex-shrink-0 mt-0.5", config.color)}>
                                    {config.icon}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-[family-name:var(--font-mono)] text-xs text-white">
                                        {item.label}
                                      </span>
                                      <span
                                        className={cn(
                                          "font-[family-name:var(--font-mono)] text-[8px] tracking-wider",
                                          config.color
                                        )}
                                      >
                                        {config.label}
                                      </span>
                                    </div>
                                    {item.note && (
                                      <div className="font-[family-name:var(--font-mono)] text-[10px] text-muted mt-0.5">
                                        {item.note}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer note */}
      <div className="border border-border bg-surface p-4 text-center">
        <p className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-wider">
          ALL PROJECTS ARE SUBJECT TO CHANGE // STATUS UPDATES PROVIDED IN REAL-TIME
        </p>
      </div>
    </div>
  );
}

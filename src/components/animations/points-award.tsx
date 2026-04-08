"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PointsAwardProps {
  points: number;
  rankUp?: string | null;
  onComplete: () => void;
}

function Particle({ index }: { index: number }) {
  const angle = (index / 40) * Math.PI * 2 + Math.random() * 0.5;
  const distance = 150 + Math.random() * 200;
  const size = 2 + Math.random() * 4;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  return (
    <motion.div
      className="absolute"
      style={{
        width: size,
        height: size,
        backgroundColor: index % 5 === 0 ? "#00ff41" : "#ffffff",
        left: "50%",
        top: "50%",
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{
        x,
        y,
        opacity: 0,
        scale: 0,
        rotate: Math.random() * 360,
      }}
      transition={{
        duration: 1.2 + Math.random() * 0.8,
        delay: 0.3 + Math.random() * 0.2,
        ease: "easeOut",
      }}
    />
  );
}

export function PointsAward({ points, rankUp, onComplete }: PointsAwardProps) {
  const [stage, setStage] = useState(0);
  const [displayPoints, setDisplayPoints] = useState(0);

  const animateCounter = useCallback(() => {
    const duration = 1000;
    const start = performance.now();
    function update(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPoints(Math.round(eased * points));
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }, [points]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setStage(1), 100));
    timers.push(setTimeout(() => { setStage(2); animateCounter(); }, 600));
    timers.push(setTimeout(() => setStage(3), 1800));
    if (rankUp) {
      timers.push(setTimeout(() => setStage(4), 2500));
      timers.push(setTimeout(() => onComplete(), 4500));
    } else {
      timers.push(setTimeout(() => onComplete(), 3500));
    }
    return () => timers.forEach(clearTimeout);
  }, [animateCounter, rankUp, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          exit={{ opacity: 0 }}
        />

        {/* Glitch Lines */}
        {stage >= 1 && (
          <>
            <motion.div
              className="absolute left-0 right-0 h-px bg-white/20"
              style={{ top: "30%" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: [0, 1, 1, 0], x: ["-100%", "0%", "0%", "100%"] }}
              transition={{ duration: 0.4, times: [0, 0.3, 0.7, 1] }}
            />
            <motion.div
              className="absolute left-0 right-0 h-px bg-white/10"
              style={{ top: "70%" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: [0, 1, 1, 0], x: ["100%", "0%", "0%", "-100%"] }}
              transition={{ duration: 0.4, delay: 0.1, times: [0, 0.3, 0.7, 1] }}
            />
          </>
        )}

        {/* Particles */}
        {stage >= 2 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <Particle key={i} index={i} />
            ))}
          </div>
        )}

        {/* Shockwave Ring */}
        {stage >= 2 && (
          <motion.div
            className="absolute border border-white/30"
            style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: 600, height: 600, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* MISSION VERIFIED */}
          {stage >= 1 && (
            <motion.div
              className="font-[family-name:var(--font-mono)] text-xs tracking-[0.3em] text-white/60 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              MISSION_VERIFIED
            </motion.div>
          )}

          {/* Points Number */}
          {stage >= 2 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="font-[family-name:var(--font-heading)] text-7xl sm:text-8xl font-bold text-white relative">
                <span className="relative">
                  +{displayPoints}
                  <motion.span
                    className="absolute inset-0 text-accent/30 blur-sm"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: 2 }}
                  >
                    +{displayPoints}
                  </motion.span>
                </span>
              </div>
              <motion.div
                className="font-[family-name:var(--font-mono)] text-lg text-white/50 mt-1 tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                POINTS
              </motion.div>
            </motion.div>
          )}

          {/* Rank Up */}
          {stage >= 4 && rankUp && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="font-[family-name:var(--font-mono)] text-xs text-accent tracking-widest mb-1">
                RANK_PROMOTION
              </div>
              <div className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
                {rankUp}
              </div>
            </motion.div>
          )}

          {/* Fade instruction */}
          {stage >= 3 && (
            <motion.div
              className="mt-8 font-[family-name:var(--font-mono)] text-[10px] text-neutral-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              PROCESSING COMPLETE
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

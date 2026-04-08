"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { MatrixRain } from "./matrix-rain";

export function EasterEggs() {
  const [showMatrix, setShowMatrix] = useState(false);
  const [showClassified, setShowClassified] = useState(false);

  // Konami Code
  useEffect(() => {
    const sequence = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a",
    ];
    let index = 0;

    function handleKey(e: KeyboardEvent) {
      if (e.key === sequence[index] || e.key.toLowerCase() === sequence[index]) {
        index++;
        if (index === sequence.length) {
          setShowMatrix(true);
          index = 0;
        }
      } else {
        index = 0;
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Console Easter Egg
  useEffect(() => {
    const style = "color: #00ff41; font-size: 14px; font-family: monospace; background: #000; padding: 8px 12px;";
    console.log("%c///SYSTEM_INTERCEPT///", style);
    console.log("%cYou found a hidden channel. Welcome to the inner circle.", style);
    console.log("%c- TWP NETWORK", "color: #666; font-size: 11px; font-family: monospace;");
  }, []);

  // Logo click easter egg
  const handleLogoClick = useCallback(() => {
    const now = Date.now();
    const key = "twp_logo_clicks";
    const stored = sessionStorage.getItem(key);
    const clicks = stored ? JSON.parse(stored) : [];

    clicks.push(now);
    const recent = clicks.filter((t: number) => now - t < 2000);
    sessionStorage.setItem(key, JSON.stringify(recent));

    if (recent.length >= 7) {
      setShowClassified(true);
      sessionStorage.setItem(key, "[]");
      setTimeout(() => setShowClassified(false), 3000);
    }
  }, []);

  // Attach logo click handler
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        target.closest("h1")?.textContent?.includes("TWP") ||
        target.textContent?.includes("TWP")
      ) {
        handleLogoClick();
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [handleLogoClick]);

  return (
    <>
      <AnimatePresence>
        {showMatrix && (
          <MatrixRain onComplete={() => setShowMatrix(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showClassified && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none">
            <div className="bg-black/90 border border-accent/30 px-8 py-6 text-center animate-pulse">
              <div className="font-[family-name:var(--font-mono)] text-accent text-xs tracking-[0.5em] mb-2">
                ///CLASSIFIED///
              </div>
              <div className="font-[family-name:var(--font-heading)] text-white text-lg font-bold">
                SYSTEM_ACCESS_LEVEL: CLASSIFIED
              </div>
              <div className="font-[family-name:var(--font-mono)] text-neutral-600 text-[10px] mt-2">
                CLEARANCE_GRANTED // SESSION_ACTIVE
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

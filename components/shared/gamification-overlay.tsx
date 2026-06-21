"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Star, Award } from "lucide-react";

type FloatingXp = {
  id: number;
  amount: number;
  reason: string;
};

export function GamificationOverlay() {
  const [floatingXp, setFloatingXp] = useState<FloatingXp[]>([]);
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleXpGained = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { amount, reason, leveledUp, newLevel } = customEvent.detail;

      // Add to floating list
      const id = Date.now() + Math.random();
      setFloatingXp((prev) => [...prev, { id, amount, reason }]);

      // Remove floating XP after 2.5s
      setTimeout(() => {
        setFloatingXp((prev) => prev.filter((item) => item.id !== id));
      }, 2500);

      // Trigger Level Up
      if (leveledUp) {
        setShowLevelUp(newLevel);
      }
    };

    window.addEventListener("careerverse-xp-gained", handleXpGained);
    return () => {
      window.removeEventListener("careerverse-xp-gained", handleXpGained);
    };
  }, []);

  return (
    <>
      {/* Floating XP list in the top right or center */}
      <div className="fixed top-20 right-6 z-[9999] pointer-events-none flex flex-col items-end gap-2">
        <AnimatePresence>
          {floatingXp.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.9 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 px-4 py-2 text-white shadow-lg border border-amber-300/30 backdrop-blur-sm pointer-events-auto"
            >
              <Sparkles className="h-4 w-4 animate-spin-slow" />
              <div className="flex flex-col">
                <span className="text-sm font-extrabold">+{item.amount} XP</span>
                <span className="text-[10px] text-amber-50 opacity-90 font-medium truncate max-w-[150px]">
                  {item.reason}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Level Up Celebration Dialog */}
      <AnimatePresence>
        {showLevelUp !== null && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-primary/20 bg-card p-8 text-center shadow-2xl bg-gradient-to-br from-violet-500/10 via-background to-primary/5"
            >
              {/* Confetti simulation (CSS keyframes) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      top: `-20px`,
                      left: `${Math.random() * 100}%`,
                      width: `${Math.random() * 8 + 6}px`,
                      height: `${Math.random() * 8 + 6}px`,
                      backgroundColor: ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"][
                        Math.floor(Math.random() * 5)
                      ],
                      opacity: Math.random() * 0.7 + 0.3,
                      animation: `fall ${Math.random() * 3 + 2}s linear infinite`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 space-y-6">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-primary text-white shadow-lg shadow-violet-500/20">
                  <Trophy className="h-10 w-10 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 fill-primary text-primary" /> LEVEL UP! <Star className="h-3 w-3 fill-primary text-primary" />
                  </span>
                  <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl font-extrabold text-foreground">
                    Level {showLevelUp} Reached
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    Incredible work! You are expanding your horizons and building real competencies. Your Career Explorer Rank has grown!
                  </p>
                </div>

                {/* Rank badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-bold text-primary">
                  <Award className="h-4 w-4" />
                  {showLevelUp === 2 ? "Pathfinder Rank Unlocked" : "Explorer Tier Advanced"}
                </div>

                <button
                  onClick={() => setShowLevelUp(null)}
                  className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 transition-all"
                >
                  Continue Journey
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(600px) rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}

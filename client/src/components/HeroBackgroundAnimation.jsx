import React, { useState, useEffect, useRef } from 'react';
import { Zap, CheckCircle2, ShieldCheck, QrCode, Sparkles, Store } from 'lucide-react';

export default function HeroBackgroundAnimation() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  // Smooth mouse tracking for interactive glow spotlight
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {/* 1. Interactive Mouse Follower Spotlight */}
      <div
        className="absolute -inset-10 transition-opacity duration-700 opacity-60 sm:opacity-85"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}% ${mousePos.y}%, rgba(34, 197, 94, 0.16), rgba(16, 185, 129, 0.07) 40%, transparent 70%)`,
        }}
      />

      {/* 2. Floating Animated Gradient Blobs (Fluid Mesh Aura) */}
      <div className="absolute top-[-10%] left-[-5%] w-[380px] sm:w-[520px] h-[380px] sm:h-[520px] rounded-full bg-gradient-to-br from-[#22C55E]/20 via-[#10B981]/15 to-transparent dark:from-[#22C55E]/25 dark:via-[#10B981]/20 blur-3xl animate-blob-1" />
      <div className="absolute top-[-5%] right-[-8%] w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] rounded-full bg-gradient-to-bl from-[#10B981]/20 via-[#34D399]/15 to-transparent dark:from-[#10B981]/25 dark:via-[#34D399]/20 blur-3xl animate-blob-2" />
      <div className="absolute bottom-[-15%] left-[25%] sm:left-[35%] w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] rounded-full bg-gradient-to-tr from-[#84CC16]/15 via-[#22C55E]/10 to-transparent dark:from-[#84CC16]/20 dark:via-[#22C55E]/15 blur-3xl animate-blob-3" />

      {/* 3. Subtle Cyber Dot Matrix / Grid with Radial Vignette */}
      <div className="absolute inset-0 bg-hero-grid opacity-[0.45] dark:opacity-[0.22] mix-blend-multiply dark:mix-blend-screen [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      {/* 4. Animated Scanning Light Sweep across the grid */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#22C55E]/[0.05] dark:via-[#22C55E]/[0.10] to-transparent animate-scan-sweep opacity-75" />

      {/* 5. Floating Payment Badges (Fintech / Campus Glassmorphism) */}
      {/* Top Left: Instant UPI Badge */}
      <div className="hidden lg:flex items-center gap-3 absolute top-12 left-6 xl:left-14 px-3.5 py-2.5 rounded-2xl bg-white/85 dark:bg-[#16221B]/90 backdrop-blur-md border border-emerald-500/20 dark:border-emerald-500/40 shadow-[0_8px_30px_rgb(34,197,94,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] animate-float-slow">
        <div className="w-8 h-8 rounded-xl bg-[#22C55E]/15 dark:bg-[#22C55E]/25 flex items-center justify-center text-[#22C55E] shrink-0">
          <Zap className="w-4 h-4 fill-[#22C55E]" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
            <span className="text-xs font-bold text-[#17211B] dark:text-gray-100">Instant UPI</span>
          </div>
          <span className="text-[11px] text-[#647067] dark:text-gray-400">0% Glitch & Fast Pay</span>
        </div>
      </div>

      {/* Top Right: Payment Success Confirmation */}
      <div className="hidden lg:flex items-center gap-3 absolute top-16 right-6 xl:right-14 px-3.5 py-2.5 rounded-2xl bg-white/85 dark:bg-[#16221B]/90 backdrop-blur-md border border-emerald-500/20 dark:border-emerald-500/40 shadow-[0_8px_30px_rgb(34,197,94,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] animate-float-reverse">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/25 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="text-left">
          <span className="text-xs font-bold text-[#17211B] dark:text-gray-100 flex items-center gap-1">
            ₹35.00 Paid <span className="text-[#22C55E] text-[10px]">✓</span>
          </span>
          <span className="text-[11px] text-[#647067] dark:text-gray-400">Juice & Snacks Bar</span>
        </div>
      </div>

      {/* Bottom Left: Authorized QR Badge */}
      <div className="hidden xl:flex items-center gap-2.5 absolute bottom-12 left-12 px-3 py-2 rounded-xl bg-white/80 dark:bg-[#16221B]/85 backdrop-blur-md border border-gray-200/70 dark:border-emerald-500/30 shadow-sm animate-float-delayed">
        <div className="w-7 h-7 rounded-lg bg-[#17211B] dark:bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <QrCode className="w-3.5 h-3.5" />
        </div>
        <div className="text-left">
          <span className="text-[11px] font-semibold text-[#17211B] dark:text-gray-100 block">Official Stall QR</span>
          <span className="text-[10px] text-[#22C55E] font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Verified Secure
          </span>
        </div>
      </div>

      {/* Bottom Right: Campus Stall Status */}
      <div className="hidden xl:flex items-center gap-2.5 absolute bottom-14 right-12 px-3 py-2 rounded-xl bg-white/80 dark:bg-[#16221B]/85 backdrop-blur-md border border-gray-200/70 dark:border-emerald-500/30 shadow-sm animate-float-slow-alt">
        <div className="w-7 h-7 rounded-lg bg-[#22C55E]/15 dark:bg-[#22C55E]/25 text-[#22C55E] flex items-center justify-center shrink-0">
          <Store className="w-3.5 h-3.5" />
        </div>
        <div className="text-left">
          <span className="text-[11px] font-semibold text-[#17211B] dark:text-gray-100 block">Central Canteen</span>
          <span className="text-[10px] text-[#647067] dark:text-gray-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> UPI & Cash Active
          </span>
        </div>
      </div>

      {/* 6. Floating Digital Tokens / Sparkles */}
      <div className="absolute top-[22%] left-[18%] text-[#22C55E]/40 dark:text-[#22C55E]/60 font-bold text-lg select-none animate-particle-float-1">
        ₹
      </div>
      <div className="absolute top-[35%] right-[20%] text-[#10B981]/35 dark:text-[#10B981]/50 font-bold text-xl select-none animate-particle-float-2">
        ₹
      </div>
      <div className="absolute top-[65%] left-[22%] text-[#22C55E]/30 dark:text-[#22C55E]/50 animate-particle-float-3">
        <Sparkles className="w-4 h-4 text-[#22C55E]" />
      </div>
      <div className="absolute top-[18%] right-[32%] text-[#84CC16]/30 dark:text-[#84CC16]/45 animate-particle-float-4">
        <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
      </div>
      <div className="absolute bottom-[28%] right-[24%] text-[#22C55E]/35 dark:text-[#22C55E]/55 font-semibold text-sm select-none animate-particle-float-1">
        UPI⚡
      </div>

      {/* 7. Subtle Glowing Concentric Rings behind the main title */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-emerald-500/[0.06] dark:border-emerald-400/[0.12] animate-pulse-ring-slow" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-emerald-500/[0.03] dark:border-emerald-400/[0.07] animate-pulse-ring-slow [animation-delay:2s]" />
    </div>
  );
}

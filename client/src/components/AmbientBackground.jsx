import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AmbientBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* 1. Fluid Ambient Gradient Mesh (Adapts between Light and Dark mode) */}
      <div className="absolute top-[5%] left-[5%] w-[480px] sm:w-[600px] h-[480px] sm:h-[600px] rounded-full bg-[#22C55E]/[0.06] dark:bg-[#22C55E]/[0.12] blur-[100px] sm:blur-[130px] animate-blob-1" />
      <div className="absolute top-[40%] right-[3%] w-[450px] sm:w-[580px] h-[450px] sm:h-[580px] rounded-full bg-[#10B981]/[0.05] dark:bg-[#10B981]/[0.09] blur-[110px] sm:blur-[140px] animate-blob-2" />
      <div className="absolute bottom-[8%] left-[20%] w-[400px] sm:w-[520px] h-[400px] sm:h-[520px] rounded-full bg-[#84CC16]/[0.04] dark:bg-[#84CC16]/[0.08] blur-[100px] sm:blur-[120px] animate-blob-3" />

      {/* 2. Delicate Animated Background Grid */}
      <div className="absolute inset-0 bg-hero-grid opacity-[0.25] dark:opacity-[0.16] mix-blend-multiply dark:mix-blend-screen" />

      {/* 3. Subtle floating ambient currency & sparkle tokens */}
      <div className="absolute top-[18%] left-[12%] text-[#22C55E]/20 dark:text-[#22C55E]/30 font-bold text-base select-none animate-particle-float-1">
        ₹
      </div>
      <div className="absolute top-[55%] right-[10%] text-[#10B981]/20 dark:text-[#10B981]/30 font-bold text-lg select-none animate-particle-float-2">
        ₹
      </div>
      <div className="absolute top-[75%] left-[15%] text-[#22C55E]/20 dark:text-[#22C55E]/30 animate-particle-float-3">
        <Sparkles className="w-3.5 h-3.5" />
      </div>
      <div className="absolute top-[30%] right-[18%] text-[#84CC16]/20 dark:text-[#84CC16]/25 animate-particle-float-4">
        <Sparkles className="w-3 h-3" />
      </div>
    </div>
  );
}

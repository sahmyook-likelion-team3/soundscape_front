/*
 * app/analyzing/AnalyzingScreen.tsx 화면
 * Description : /analyzing — AI 분석중 로딩
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-06
 */

"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/PageShell";

const DURATION_MS = 2500;

export default function AnalyzingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      const next = Math.min(100, (elapsed / DURATION_MS) * 100);
      setProgress(next);
      if (next < 100) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <PageShell className="items-center justify-center gap-4 overflow-hidden px-4.25">
      <div className="absolute top-29.25 -left-46.75 h-93.25 w-93.25 rounded-full bg-[#67469A] opacity-75 blur-[70px]" />
      <div className="absolute top-112.5 left-26.25 h-73.25 w-73.25 rounded-full bg-[#cad0e9] opacity-75 blur-[70px]" />

      <p className="relative z-10 text-lg font-semibold text-black">
        AI가 사진을 분석 중이에요
      </p>
      <div className="relative z-10 h-1.75 w-full overflow-hidden rounded-full bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
        <div
          className="h-full rounded-full bg-[#f73d88] transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </PageShell>
  );
}

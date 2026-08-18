/*
 * app/analyzing/AnalyzingScreen.tsx 화면
 * Description : /analyzing — 추천 API 호출 로딩 (사진 기반 / 장르 기반 공용)
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-19
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/PageShell";
import { recommendByPhoto } from "@/lib/api";
import { getPending, setResult } from "@/lib/recommendation";

const DURATION_MS = 8000;

export default function AnalyzingScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    // 응답 전까지 90% 까지만 채운다.
    const start = Date.now();
    const timer = setInterval(() => {
      setProgress(Math.min(90, ((Date.now() - start) / DURATION_MS) * 100));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const { photo } = getPending();
    if (!photo) {
      router.replace("/camera");
      return;
    }

    recommendByPhoto(photo)
      .then((result) => {
        setResult(result);
        setProgress(100);
        router.replace("/result");
      })
      .catch((e: Error) => setError(e.message));
  }, [router]);

  return (
    <PageShell className="items-center justify-center gap-4 overflow-hidden px-4.25">
      <div className="absolute top-29.25 -left-46.75 h-93.25 w-93.25 rounded-full bg-[#67469A] opacity-75 blur-[70px]" />
      <div className="absolute top-112.5 left-26.25 h-73.25 w-73.25 rounded-full bg-[#cad0e9] opacity-75 blur-[70px]" />

      {error ? (
        <>
          <p className="relative z-10 text-center text-base font-semibold text-black">
            {error}
          </p>
          <button
            type="button"
            onClick={() => router.replace("/camera")}
            className="relative z-10 rounded-full bg-[#67469A] px-6 py-2 text-sm font-medium text-white"
          >
            다시 시도하기
          </button>
        </>
      ) : (
        <>
          <p className="relative z-10 text-lg font-semibold text-black">
            AI가 사진을 분석 중이에요
          </p>
          <div className="relative z-10 h-1.75 w-full overflow-hidden rounded-full bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]">
            <div
              className="h-full rounded-full bg-[#f73d88] transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}
    </PageShell>
  );
}

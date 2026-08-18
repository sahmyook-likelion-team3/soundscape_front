"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 70);

    const redirectTimer = setTimeout(() => {
      // router.push("/result");
    }, 4000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#2d123d] px-6 text-white">
      <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-purple-600/40 blur-3xl" />
      <div className="absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-pink-500/30 blur-3xl" />

      <div className="z-10 flex w-full max-w-xs flex-col items-center space-y-8 text-center">
        <p className="text-lg font-medium tracking-wide text-white/90">
          AI가 사진을 분석 중이에요
        </p>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-pink-500 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </main>
  );
}

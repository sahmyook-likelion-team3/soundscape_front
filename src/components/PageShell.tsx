/*
 * components/PageShell.tsx 컴포넌트
 * Description : 모든 화면이 공유하는 공통 레이아웃 래퍼 (모바일 프레임 뼈대)
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-06
 */

"use client";

import { type ReactNode, useEffect } from "react";

export default function PageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty("--app-dvh", `${window.innerHeight}px`);
    };
    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    window.addEventListener("orientationchange", setAppHeight);
    return () => {
      window.removeEventListener("resize", setAppHeight);
      window.removeEventListener("orientationchange", setAppHeight);
    };
  }, []);

  return (
    <main
      className={`relative mx-auto flex w-full max-w-100.5 flex-col overflow-hidden bg-white ${className}`}
      style={{ height: "var(--app-dvh, 100dvh)" }}
    >
      {children}
    </main>
  );
}

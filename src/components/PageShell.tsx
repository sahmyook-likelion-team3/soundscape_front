/*
 * components/PageShell.tsx 컴포넌트
 * Description : 모든 화면이 공유하는 공통 레이아웃 래퍼 (모바일 프레임 뼈대)
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-06
 */

import { type ReactNode } from "react";

export default function PageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={`relative mx-auto flex h-dvh w-full max-w-100.5 flex-col overflow-hidden bg-white ${className}`}
    >
      {children}
    </main>
  );
}

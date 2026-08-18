/*
 * app/camera/CameraScreen.tsx 화면
 * Description : /camera — 사진 촬영·선택 후 사진 기반 추천 시작
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-19
 */

"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import { startPhotoRecommendation } from "@/lib/recommendation";

export default function CameraScreen() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    startPhotoRecommendation(file);
    router.push("/analyzing");
  };

  return (
    <PageShell>
      <div className="h-14.5 shrink-0 bg-white" />

      <div className="relative flex flex-1 items-center justify-center bg-[#d9d9d9]">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => router.back()}
          className="absolute top-5.75 left-4"
        >
          <Image src="/icons/chevron-left-black.svg" alt="" width={11} height={20} />
        </button>

        <p className="px-8 text-center text-sm font-medium text-[#7a7a7a]">
          지금 있는 공간을 찍어주세요.
          <br />
          AI가 분위기를 분석해 5곡을 추천해요.
        </p>
      </div>

      <div className="relative flex h-25.75 items-center justify-center bg-white">
        {/* 브라우저 기본 카메라(capture)를 쓰면 별도 권한 처리 코드가 필요 없다. */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={handlePick}
          className="hidden"
        />
        <button
          type="button"
          aria-label="촬영하기"
          onClick={() => inputRef.current?.click()}
          className="flex h-14.75 w-14.75 items-center justify-center"
        >
          <Image src="/icons/shutter-button.svg" alt="" width={59} height={59} />
        </button>
      </div>
    </PageShell>
  );
}

/*
 * app/camera/CameraScreen.tsx 화면
 * Description : /camera — 카메라 촬영
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-06
 */

"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import PageShell from "@/components/PageShell";

export default function CameraScreen() {
  const router = useRouter();

  return (
    <PageShell>
      <div className="h-14.5 shrink-0 bg-white" />

      <div className="relative flex-1 bg-[#d9d9d9]">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => router.back()}
          className="absolute top-5.75 left-4"
        >
          <Image src="/icons/chevron-left-black.svg" alt="" width={11} height={20} />
        </button>
      </div>

      <div className="relative flex h-25.75 items-center justify-center bg-white">
        <button
          type="button"
          aria-label="촬영하기"
          className="flex h-14.75 w-14.75 items-center justify-center"
        >
          <Image src="/icons/shutter-button.svg" alt="" width={59} height={59} />
        </button>

        <button
          type="button"
          aria-label="카메라 전환"
          className="absolute right-8 flex h-8.75 w-8.75 items-center justify-center rounded-full bg-[#1b1b1b]"
        >
          <Image src="/icons/flip-camera-icon.svg" alt="" width={16} height={16} />
        </button>
      </div>
    </PageShell>
  );
}

/*
 * app/player/PlayerScreen.tsx 화면
 * Description : /player — 현재 음악 재생
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-06
 */

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import PageShell from "@/components/PageShell";

export default function PlayerScreen() {
  const router = useRouter();

  return (
    <PageShell className="px-4 pt-18 pb-15.5">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={() => router.back()}
        className="mb-12"
      >
        <Image src="/icons/chevron-left-black.svg" alt="" width={11} height={20} />
      </button>

      <div className="relative aspect-square w-full overflow-hidden rounded-[10px]">
        <Image
          src="/images/Home/player-thumbnail.jpg"
          alt="Deja Vu 앨범 아트"
          fill
          className="object-cover"
        />
      </div>

      <div className="mt-8.75 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-bold text-[#1b1b1b]">Deja Vu</p>
          <p className="text-xl font-semibold text-[#7a7a7a]">리센느</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="좋아요">
            <Image src="/icons/thumb.svg" alt="" width={24} height={24} />
          </button>
          <button type="button" aria-label="싫어요">
            <Image
              src="/icons/thumb.svg"
              alt=""
              width={24}
              height={24}
              className="scale-y-[-1]"
            />
          </button>
        </div>
      </div>

      <div className="mt-3.75 flex flex-col gap-2">
        <div className="h-1.75 w-full overflow-hidden rounded-full bg-[#7a7a7a]">
          <div className="h-full w-[55%] rounded-full bg-[#c7c7c7]" />
        </div>
        <div className="flex justify-between text-sm font-semibold text-[#7a7a7a]">
          <span>0:00</span>
          <span>-3:00</span>
        </div>
      </div>

      <div className="mt-2.25 flex items-center justify-center gap-8">
        <button type="button" aria-label="이전 곡">
          <Image src="/icons/prev.svg" alt="" width={53} height={35} />
        </button>
        <button type="button" aria-label="재생" className="flex h-9 w-11 items-center justify-center">
          <Image
            src="/icons/play-triangle-gray.svg"
            alt=""
            width={36}
            height={41}
            className="rotate-90"
          />
        </button>
        <button type="button" aria-label="다음 곡">
          <Image src="/icons/next.svg" alt="" width={53} height={35} />
        </button>
      </div>

      <div className="mt-19.25 flex items-center gap-3">
        <Image src="/icons/volume-low.svg" alt="" width={13} height={18} />
        <div className="h-1.75 flex-1 overflow-hidden rounded-full bg-[#7a7a7a]">
          <div className="h-full w-[30%] rounded-full bg-[#c7c7c7]" />
        </div>
        <Image src="/icons/volume-high.svg" alt="" width={24} height={24} />
      </div>
    </PageShell>
  );
}

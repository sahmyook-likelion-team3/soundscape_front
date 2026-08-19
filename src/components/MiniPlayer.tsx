/*
 * components/MiniPlayer.tsx 컴포넌트
 * Description : 화면 하단에 공통으로 쓰이는 미니 플레이어 (현재 재생곡 + 이전/재생/다음)
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-19
 */

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { currentTrack, next, prev, toggle, usePlayer } from "@/lib/player";

export default function MiniPlayer() {
  const router = useRouter();
  const player = usePlayer();
  const track = currentTrack(player);

  return (
    <div className="shrink-0 px-4.25 pb-6.5">
      <div className="flex h-13.5 items-center gap-3.5 rounded-full bg-[rgba(255,255,255,0.1)] px-4.75 shadow-[0px_1px_10px_2px_rgba(156,156,156,0.25)]">
        <button
          type="button"
          onClick={() => track && router.push("/player")}
          className="flex flex-1 items-center gap-3.5 text-left"
        >
          <div className="h-10.25 w-10.25 shrink-0 rounded bg-linear-to-br from-[#67469A] to-[#F73D88]" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate text-xs font-semibold text-[#1b1b1b]">
              {track?.title ?? "재생 중인 곡이 없어요"}
            </p>
            <p className="truncate text-xs text-[#1b1b1b]">
              {track?.artist ?? "플레이리스트를 재생해보세요"}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-3.5">
          <button type="button" aria-label="이전 곡" onClick={prev} disabled={!track}>
            <Image src="/icons/prev.svg" alt="" width={28} height={18} />
          </button>
          <button
            type="button"
            aria-label={player.playing ? "일시정지" : "재생"}
            onClick={toggle}
            disabled={!track}
          >
            <Image
              src={player.playing ? "/icons/pause.svg" : "/icons/play.svg"}
              alt=""
              width={21}
              height={21}
            />
          </button>
          <button type="button" aria-label="다음 곡" onClick={next} disabled={!track}>
            <Image src="/icons/next.svg" alt="" width={28} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

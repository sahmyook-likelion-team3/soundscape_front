/*
 * app/player/PlayerScreen.tsx 화면
 * Description : /player — 현재 재생 중인 곡
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-19
 */

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import PageShell from "@/components/PageShell";
import { formatDuration } from "@/lib/api";
import {
  currentTrack,
  next,
  prev,
  seek,
  setVolume,
  toggle,
  usePlayer,
} from "@/lib/player";

export default function PlayerScreen() {
  const router = useRouter();
  const player = usePlayer();
  const track = currentTrack(player);
  const duration = player.duration || track?.durationSeconds || 0;
  const remaining = Math.max(0, duration - player.position);

  return (
    <PageShell className="px-4 pt-18 pb-15.5">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={() => router.back()}
        className="mb-12 self-start"
      >
        <Image src="/icons/chevron-left-black.svg" alt="" width={11} height={20} />
      </button>

      <div className="relative aspect-square w-full overflow-hidden rounded-[10px] bg-linear-to-br from-[#67469A] to-[#F73D88]" />

      <div className="mt-8.75 flex items-center justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate text-2xl font-bold text-[#1b1b1b]">
            {track?.title ?? "재생 중인 곡이 없어요"}
          </p>
          <p className="truncate text-xl font-semibold text-[#7a7a7a]">
            {track?.artist ?? ""}
          </p>
        </div>
      </div>

      <div className="mt-3.75 flex flex-col gap-2">
        <input
          type="range"
          aria-label="재생 위치"
          min={0}
          max={duration || 1}
          step={1}
          value={Math.min(player.position, duration)}
          onChange={(e) => seek(Number(e.target.value))}
          disabled={!track}
          className="h-1.75 w-full appearance-none rounded-full bg-[#7a7a7a] accent-[#c7c7c7]"
        />
        <div className="flex justify-between text-sm font-semibold text-[#7a7a7a]">
          <span>{formatDuration(player.position)}</span>
          <span>-{formatDuration(remaining)}</span>
        </div>
      </div>

      <div className="mt-2.25 flex items-center justify-center gap-8">
        <button type="button" aria-label="이전 곡" onClick={prev} disabled={!track}>
          <Image src="/icons/prev-purple.svg" alt="" width={53} height={35} />
        </button>
        <button
          type="button"
          aria-label={player.playing ? "일시정지" : "재생"}
          onClick={toggle}
          disabled={!track}
          className="flex h-9 w-11 items-center justify-center"
        >
          <Image
            src={player.playing ? "/icons/pause-purple.svg" : "/icons/play-purple.svg"}
            alt=""
            width={36}
            height={36}
          />
        </button>
        <button type="button" aria-label="다음 곡" onClick={next} disabled={!track}>
          <Image src="/icons/next-purple.svg" alt="" width={53} height={35} />
        </button>
      </div>

      <div className="mt-19.25 flex items-center gap-3">
        <Image src="/icons/volume-low.svg" alt="" width={13} height={18} />
        <input
          type="range"
          aria-label="음량"
          min={0}
          max={1}
          step={0.01}
          value={player.volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="h-1.75 flex-1 appearance-none rounded-full bg-[#7a7a7a] accent-[#c7c7c7]"
        />
        <Image src="/icons/volume-high.svg" alt="" width={24} height={24} />
      </div>
    </PageShell>
  );
}

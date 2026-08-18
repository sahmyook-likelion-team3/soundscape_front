/*
 * components/MiniPlayer.tsx 컴포넌트
 * Description : 화면 하단에 공통으로 쓰이는 미니 플레이어 (현재 재생곡 + 이전/재생/다음)
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-06
 */

import Image from "next/image";

export default function MiniPlayer() {
  return (
    <div className="shrink-0 px-4.25 pb-6.5">
      <div className="flex h-13.5 items-center gap-3.5 rounded-full bg-[rgba(255,255,255,0.1)] px-4.75 shadow-[0px_1px_10px_2px_rgba(156,156,156,0.25)]">
        <Image
          src="/images/Home/player-thumbnail.jpg"
          alt="Deja Vu 앨범 아트"
          width={41}
          height={41}
          className="rounded"
        />
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-xs font-semibold text-[#1b1b1b]">Deja Vu</p>
          <p className="text-xs text-[#1b1b1b]">리센느</p>
        </div>
        <div className="flex items-center gap-3.5">
          <button type="button" aria-label="이전 곡">
            <Image src="/icons/prev.svg" alt="" width={28} height={18} />
          </button>
          <button type="button" aria-label="재생">
            <Image src="/icons/play.svg" alt="" width={21} height={21} />
          </button>
          <button type="button" aria-label="다음 곡">
            <Image src="/icons/next.svg" alt="" width={28} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

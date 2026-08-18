/*
 * app/page.tsx 화면
 * Description : / — 홈
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-06
 */

import Image from "next/image";
import PageShell from "@/components/PageShell";
import MiniPlayer from "@/components/MiniPlayer";
import BottomNav from "@/components/BottomNav";

const playlists = [
  { title: "고즈넉한 분위기", src: "/images/Home/playlist-1.jpg" },
  { title: "흐린 날 듣는 노래", src: "/images/Home/playlist-2.jpg" },
  { title: "오후 8시 한강에서", src: "/images/Home/playlist-3.jpg" },
  { title: "밤에 듣는 시티팝", src: "/images/Home/playlist-4.jpg" },
  { title: "봄이 올 때 듣는 노래", src: "/images/Home/playlist-5.jpg" },
  { title: "카페에서 공부할 때", src: "/images/Home/playlist-6.jpg" },
];

export default function HomePage() {
  return (
    <PageShell>
      <div className="relative flex h-96.25 shrink-0 flex-col justify-start gap-5.25 bg-linear-to-br from-[#67469A] to-[#F73D88] px-6 pt-19 text-white">
        <div className="flex items-center gap-3.5">
          <Image src="/icons/logo-mark.svg" alt="" width={22} height={47} />
          <p className="text-lg font-semibold">SoundScape</p>
        </div>
        <p className="text-2xl leading-snug font-bold">
          안녕하세요,
          <br />
          OO님.
        </p>
        <Image
          src="/images/Home/note.png"
          alt="음표 이미지"
          width={221.91}
          height={221.91}
          className="absolute top-16.25 right-4"
        />

        <button className="absolute top-71.75 right-4 left-4 rounded-full bg-white/10 py-2.75 text-sm font-medium text-white shadow-[0px_1px_10px_0px_rgba(156,156,156,0.25)]">
          + 플레이리스트 생성하기
        </button>
      </div>

      <div className="flex flex-1 flex-col rounded-t-[10px] bg-white shadow-[0px_-4px_8px_0px_rgba(39,17,72,0.25)]">
        <div className="flex-1 px-4 pt-8 pb-5">
          <div className="mb-8.5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1b1b1b]">
              저장한 플레이리스트
            </h2>
            <button
              type="button"
              className="flex items-center gap-2 text-xs font-medium text-[#7a7a7a]"
            >
              전체보기
              <Image src="/icons/chevron-right.svg" alt="" width={5} height={8} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-x-4.75 gap-y-4.5">
            {playlists.map((playlist) => (
              <div
                key={playlist.title}
                className="relative aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={playlist.src}
                  alt={playlist.title}
                  fill
                  sizes="33vw"
                  className="object-cover"
                />
                <p className="absolute bottom-2 left-2 text-xs font-medium text-white drop-shadow">
                  {playlist.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <MiniPlayer />
        <BottomNav active="home" />
      </div>
    </PageShell>
  );
}

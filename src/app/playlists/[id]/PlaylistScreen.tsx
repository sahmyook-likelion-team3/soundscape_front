/*
 * app/playlists/[id]/PlaylistScreen.tsx 화면
 * Description : /playlists/1 ~ /playlists/6 — 플레이리스트 상세 ([id] 동적 경로)
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-06
 */

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import PageShell from "@/components/PageShell";
import MiniPlayer from "@/components/MiniPlayer";
import BottomNav from "@/components/BottomNav";

const playlists = [
  {
    id: "1",
    title: "고즈넉한 분위기",
    date: "2026.08.05",
    meta: "6곡 23분",
    count: 6,
    src: "/images/Home/playlist-1.jpg",
  },
  {
    id: "2",
    title: "흐린 날 듣는 노래",
    date: "2026.08.08",
    meta: "5곡 15분",
    count: 5,
    src: "/images/Home/playlist-2.jpg",
  },
  {
    id: "3",
    title: "오후 8시 한강에서",
    date: "2026.08.11",
    meta: "5곡 17분",
    count: 5,
    src: "/images/Home/playlist-3.jpg",
  },
  {
    id: "4",
    title: "밤에 듣는 시티팝",
    date: "2026.08.18",
    meta: "6곡 22분",
    count: 6,
    src: "/images/Home/playlist-4.jpg",
  },
  {
    id: "5",
    title: "봄이 올 때 듣는 노래",
    date: "2026.08.21",
    meta: "6곡 20분",
    count: 6,
    src: "/images/Home/playlist-5.jpg",
  },
  {
    id: "6",
    title: "카페에서 공부할 때",
    date: "2026.08.25",
    meta: "5곡 16분",
    count: 5,
    src: "/images/Home/playlist-6.jpg",
  },
];

export default function PlaylistScreen({ id }: { id: string }) {
  const router = useRouter();
  const playlist = playlists.find((p) => p.id === id) ?? playlists[0];

  return (
    <PageShell>
      <div className="relative flex h-83.5 shrink-0 flex-col bg-linear-to-br from-[#67469A] to-[#F73D88] px-4 pb-4 text-white">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => router.back()}
          className="absolute top-18 left-4"
        >
          <Image src="/icons/chevron-left.svg" alt="" width={11} height={20} />
        </button>

        <div className="flex flex-1 items-end gap-6 pb-2">
          <div className="relative h-50.75 w-28.5 shrink-0 overflow-hidden rounded-[10px]">
            <Image
              src={playlist.src}
              alt={playlist.title}
              fill
              sizes="114px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <p className="text-xl font-semibold">{playlist.title}</p>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">{playlist.date}</p>
              <p className="text-xs font-medium">{playlist.meta}</p>
            </div>

            <div className="mt-2 flex items-center gap-2.5">
              <button
                type="button"
                className="flex items-center gap-2.75 rounded-full bg-white/10 px-3.25 py-2.5 shadow-[0px_1px_10px_2px_rgba(156,156,156,0.25)]"
              >
                <Image src="/icons/play-fill.svg" alt="" width={18} height={17} />
                <span className="text-sm font-medium">재생</span>
              </button>

              <button
                type="button"
                aria-label="다운로드"
                className="relative flex h-10 w-10 items-center justify-center"
              >
                <Image
                  src="/icons/pill-circle-bg.svg"
                  alt=""
                  fill
                  className="absolute rounded-full"
                />
                <Image
                  src="/icons/download.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="relative rotate-90"
                />
              </button>

              <button
                type="button"
                aria-label="셔플"
                className="relative flex h-10 w-10 items-center justify-center"
              >
                <Image
                  src="/icons/pill-circle-bg.svg"
                  alt=""
                  fill
                  className="absolute rounded-full"
                />
                <Image
                  src="/icons/shuffle.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="relative"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        {Array.from({ length: playlist.count }).map((_, index) => (
          <div
            key={index}
            className="flex h-15 items-center gap-4 border-b border-gray-100 px-4"
          >
            <div className="h-12.25 w-12.25 shrink-0 rounded-[10px] bg-[#d9d9d9]" />
          </div>
        ))}
      </div>

      <MiniPlayer />
      <BottomNav active="profile" homeIcon="outline" profileIcon="small" />
    </PageShell>
  );
}

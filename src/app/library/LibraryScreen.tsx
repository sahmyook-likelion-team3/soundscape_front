/*
 * app/library/LibraryScreen.tsx 화면
 * Description : /library — 보관함(저장한 플레이리스트 목록)
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-06
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import MiniPlayer from "@/components/MiniPlayer";
import BottomNav from "@/components/BottomNav";

type Playlist = {
  title: string;
  date: string;
  meta: string;
  src: string;
};

const defaultPlaylists: Playlist[] = [
  {
    title: "고즈넉한 분위기",
    date: "2026.08.05",
    meta: "6곡 23분",
    src: "/images/Home/playlist-1.jpg",
  },
  {
    title: "흐린 날 듣는 노래",
    date: "2026.08.08",
    meta: "5곡 15분",
    src: "/images/Home/playlist-2.jpg",
  },
  {
    title: "오후 8시 한강에서",
    date: "2026.08.11",
    meta: "5곡 17분",
    src: "/images/Home/playlist-3.jpg",
  },
  {
    title: "밤에 듣는 시티팝",
    date: "2026.08.18",
    meta: "6곡 22분",
    src: "/images/Home/playlist-4.jpg",
  },
  {
    title: "봄이 올 때 듣는 노래",
    date: "2026.08.21",
    meta: "6곡 20분",
    src: "/images/Home/playlist-5.jpg",
  },
  {
    title: "카페에서 공부할 때",
    date: "2026.08.25",
    meta: "5곡 16분",
    src: "/images/Home/playlist-6.jpg",
  },
];

export default function LibraryScreen({
  playlists = defaultPlaylists,
}: {
  playlists?: Playlist[];
}) {
  const [items, setItems] = useState<Playlist[]>(playlists);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const handleDelete = (title: string) => {
    setItems((prev) => prev.filter((p) => p.title !== title));
    setOpenMenu(null);
  };

  return (
    <PageShell>
      <div className="relative flex h-37.25 shrink-0 flex-col justify-end gap-4 bg-linear-to-br from-[#67469A] to-[#F73D88] px-4 pb-5 text-white">
        <button type="button" aria-label="뒤로가기" className="absolute top-18 left-4">
          <Image src="/icons/chevron-left.svg" alt="" width={11} height={20} />
        </button>
        <h1 className="text-xl font-bold">플레이리스트</h1>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-6">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="text-sm font-medium text-[#7a7a7a]">
              보관함이 비어있어요
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {items.map((playlist, index) => (
              <div
                key={playlist.title}
                className="relative flex h-35 items-center gap-5 rounded-[10px] border border-[#d9d9d9] bg-white px-4.75"
              >
                <div className="relative h-26.75 w-15 shrink-0 overflow-hidden rounded-[10px]">
                  <Image
                    src={playlist.src}
                    alt={playlist.title}
                    fill
                    sizes="60px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-12">
                  <p className="text-base font-semibold text-[#1b1b1b]">
                    {playlist.title}
                  </p>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-[#696969]">
                      {playlist.date}
                    </p>
                    <p className="text-xs font-medium text-[#696969]">
                      {playlist.meta}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="더보기"
                  onClick={() => setOpenMenu(openMenu === index ? null : index)}
                  className="absolute top-4 right-4.75 flex h-3 w-3.25 items-center justify-center"
                >
                  <Image
                    src="/icons/more.svg"
                    alt=""
                    width={3}
                    height={13}
                    className="rotate-90"
                  />
                </button>

                {openMenu === index && (
                  <div className="absolute top-8.5 right-4.75 z-10 flex flex-col items-end">
                    <Image
                      src="/icons/popover-arrow.svg"
                      alt=""
                      width={9}
                      height={10}
                      className="mr-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleDelete(playlist.title)}
                      className="rounded-[10px] bg-white px-6 py-1.5 text-xs font-semibold text-[#7a7a7a] shadow-[0px_1px_10px_2px_rgba(156,156,156,0.15)]"
                    >
                      삭제하기
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <MiniPlayer />
      <BottomNav active="home" />
    </PageShell>
  );
}

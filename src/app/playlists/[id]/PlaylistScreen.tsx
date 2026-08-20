/*
 * app/playlists/[id]/PlaylistScreen.tsx 화면
 * Description : /playlists/[id] — 저장한 플레이리스트 상세
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-19
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageShell from "@/components/PageShell";
import MiniPlayer from "@/components/MiniPlayer";
import BottomNav from "@/components/BottomNav";
import Cover from "@/components/Cover";
import TrackList from "@/components/TrackList";
import {
  coverOf,
  formatDate,
  formatMeta,
  getPlaylist,
  type PlaylistDetail,
} from "@/lib/api";
import { playQueue } from "@/lib/player";

export default function PlaylistScreen({ id }: { id: string }) {
  const router = useRouter();
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPlaylist(id)
      .then(setPlaylist)
      .catch((e: Error) => setError(e.message));
  }, [id]);

  const music = playlist?.musicList ?? [];

  const shuffle = () => {
    const shuffled = [...music];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    playQueue(shuffled);
  };

  return (
    <PageShell>
      <div className="relative flex h-83.5 shrink-0 flex-col bg-linear-to-br from-[#67469A] to-[#F73D88] px-4 pb-4 text-white">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => router.back()}
          className="absolute top-7 left-4"
        >
          <Image src="/icons/chevron-left.svg" alt="" width={11} height={20} />
        </button>

        <div className="flex flex-1 items-end gap-6">
          <div className="relative h-50.75 w-28.5 shrink-0 overflow-hidden rounded-[10px] bg-white/20">
            {playlist && (
              <Cover src={coverOf(playlist)} alt={playlist.title} sizes="114px" />
            )}
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <p className="text-xl font-semibold">{playlist?.title ?? " "}</p>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">
                {playlist ? formatDate(playlist.createdAt) : " "}
              </p>
              <p className="text-xs font-medium">
                {playlist ? formatMeta(music) : " "}
              </p>
            </div>

            <div className="mt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => playQueue(music)}
                disabled={music.length === 0}
                className="flex items-center gap-2.75 rounded-full bg-white/10 px-3.25 py-2.5 shadow-[0px_1px_10px_2px_rgba(156,156,156,0.25)]"
              >
                <Image src="/icons/play-fill.svg" alt="" width={18} height={17} />
                <span className="text-sm font-medium">재생</span>
              </button>

              <button
                type="button"
                aria-label="셔플 재생"
                onClick={shuffle}
                disabled={music.length === 0}
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

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto pt-6">
        {error ? (
          <p className="px-4 text-sm font-medium text-[#f73d88]">{error}</p>
        ) : (
          <TrackList
            music={music}
            onSelect={(index) => {
              // 디자인: 곡을 누르면 현재 음악 화면으로 이동한다.
              playQueue(music, index);
              router.push("/player");
            }}
          />
        )}
      </div>

      <MiniPlayer />
      <BottomNav active="home" activeColor="#c1b7de" />
    </PageShell>
  );
}

/*
 * app/page.tsx 화면
 * Description : / — 홈 (저장한 플레이리스트 미리보기)
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-19
 */

"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import MiniPlayer from "@/components/MiniPlayer";
import BottomNav from "@/components/BottomNav";
import Cover from "@/components/Cover";
import { coverOf, getNickname, getPlaylists, type PlaylistSummary } from "@/lib/api";

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getNicknameSnapshot() {
  return getNickname() ?? "사용자";
}

function getNicknameServerSnapshot() {
  return "사용자";
}

export default function HomePage() {
  const [playlists, setPlaylists] = useState<PlaylistSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const nickname = useSyncExternalStore(
    subscribeToStorage,
    getNicknameSnapshot,
    getNicknameServerSnapshot,
  );

  useEffect(() => {
    getPlaylists()
      .then((list) => setPlaylists(list.slice(0, 6)))
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <PageShell>
      <div className="relative flex h-85.25 shrink-0 flex-col justify-start gap-5.25 bg-linear-to-br from-[#67469A] to-[#F73D88] px-6 pt-8 text-white">
        <div className="flex items-center gap-3.5">
          <Image src="/icons/logo-mark.svg" alt="" width={22} height={47} />
          <p className="text-lg font-semibold">SoundScape</p>
        </div>
        <p className="text-2xl leading-snug font-bold">
          안녕하세요,
          <br />
          {nickname}님.
        </p>
        <Image
          src="/images/Home/note.png"
          alt="음표 이미지"
          width={221.91}
          height={221.91}
          className="absolute top-5.25 right-4"
        />

        <Link
          href="/camera"
          className="absolute top-60.75 right-4 left-4 rounded-full bg-white/10 py-2.75 text-center text-sm font-medium text-white shadow-[0px_1px_10px_0px_rgba(156,156,156,0.25)]"
        >
          + 플레이리스트 생성하기
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-t-[10px] bg-white shadow-[0px_-4px_8px_0px_rgba(39,17,72,0.25)]">
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pt-8 pb-5">
          <div className="mb-8.5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1b1b1b]">
              저장한 플레이리스트
            </h2>
            <Link
              href="/library"
              className="flex items-center gap-2 text-xs font-medium text-[#7a7a7a]"
            >
              전체보기
              <Image src="/icons/chevron-right.svg" alt="" width={5} height={8} />
            </Link>
          </div>

          {error && <p className="text-xs font-medium text-[#f73d88]">{error}</p>}

          {!error && playlists?.length === 0 && (
            <p className="text-sm font-medium text-[#7a7a7a]">
              아직 저장한 플레이리스트가 없어요.
            </p>
          )}

          <div className="grid grid-cols-3 gap-x-4.75 gap-y-4.5">
            {playlists?.map((playlist) => (
              <Link
                key={playlist.playlistId}
                href={`/playlists/${playlist.playlistId}`}
                className="relative aspect-square overflow-hidden rounded-xl"
              >
                <Cover src={coverOf(playlist)} alt={playlist.title} sizes="33vw" />
                <p className="absolute bottom-2 left-2 text-xs font-medium text-white drop-shadow">
                  {playlist.title}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <MiniPlayer />
        <BottomNav active="home" />
      </div>
    </PageShell>
  );
}

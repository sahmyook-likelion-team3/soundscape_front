/*
 * app/library/LibraryScreen.tsx 화면
 * Description : /library — 보관함(저장한 플레이리스트 목록)
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-19
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import MiniPlayer from "@/components/MiniPlayer";
import BottomNav from "@/components/BottomNav";
import Cover from "@/components/Cover";
import {
  coverOf,
  deletePlaylist,
  formatDate,
  getPlaylists,
  type PlaylistSummary,
} from "@/lib/api";

export default function LibraryScreen() {
  const [items, setItems] = useState<PlaylistSummary[] | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPlaylists()
      .then(setItems)
      .catch((e: Error) => setError(e.message));
  }, []);

  const remove = async (playlistId: number) => {
    setDeleting(playlistId);
    setError(null);
    try {
      await deletePlaylist(playlistId);
      setItems((prev) => prev?.filter((p) => p.playlistId !== playlistId) ?? null);
      setOpenMenu(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <PageShell>
      <div className="relative flex h-37.25 shrink-0 flex-col justify-end gap-4 bg-linear-to-br from-[#67469A] to-[#F73D88] px-4 pb-5 text-white">
        {/* 디자인: 보관함 뒤로가기는 홈으로 간다. */}
        <Link href="/" aria-label="뒤로가기" className="absolute top-18 left-4">
          <Image src="/icons/chevron-left.svg" alt="" width={11} height={20} />
        </Link>
        <h1 className="text-xl font-bold">플레이리스트</h1>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-6">
        {error && (
          <p className="text-sm font-medium text-[#f73d88]">{error}</p>
        )}

        {!error && items?.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="text-sm font-medium text-[#7a7a7a]">보관함이 비어있어요</p>
          </div>
        )}

        <div className="space-y-5">
          {items?.map((playlist) => (
            <div
              key={playlist.playlistId}
              className="relative flex h-35 items-center rounded-[10px] border border-[#d9d9d9] bg-white"
            >
              <Link
                href={`/playlists/${playlist.playlistId}`}
                className="flex h-full flex-1 items-center gap-5 px-4.75"
              >
                <div className="relative h-26.75 w-15 shrink-0 overflow-hidden rounded-[10px]">
                  <Cover src={coverOf(playlist)} alt={playlist.title} sizes="60px" />
                </div>

                <div className="flex flex-1 flex-col gap-12">
                  <p className="text-base font-semibold text-[#1b1b1b]">
                    {playlist.title}
                  </p>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-[#696969]">
                      {formatDate(playlist.createdAt)}
                    </p>
                    {/* ponytail: 목록 API 가 곡 수·재생시간을 안 주고 명세상 항상 5곡이라 고정.
                        총 재생시간까지 보여주려면 목록 응답에 필드 추가 요청 필요. */}
                    <p className="text-xs font-medium text-[#696969]">5곡</p>
                  </div>
                </div>
              </Link>

              <button
                type="button"
                aria-label="더보기"
                onClick={() =>
                  setOpenMenu(
                    openMenu === playlist.playlistId ? null : playlist.playlistId,
                  )
                }
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

              {openMenu === playlist.playlistId && (
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
                    onClick={() => remove(playlist.playlistId)}
                    disabled={deleting === playlist.playlistId}
                    className="rounded-[10px] bg-white px-6 py-1.5 text-xs font-semibold text-[#7a7a7a] shadow-[0px_1px_10px_2px_rgba(156,156,156,0.15)] disabled:opacity-60"
                  >
                    {deleting === playlist.playlistId ? "삭제 중…" : "삭제하기"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <MiniPlayer />
      <BottomNav active="home" />
    </PageShell>
  );
}

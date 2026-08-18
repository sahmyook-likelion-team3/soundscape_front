/*
 * components/TrackList.tsx 컴포넌트
 * Description : 추천 결과·플레이리스트 상세에서 공통으로 쓰는 5곡 목록
 */

"use client";

import { formatDuration, type MusicItem } from "@/lib/api";
import { currentTrack, usePlayer } from "@/lib/player";

export default function TrackList({
  music,
  onSelect,
}: {
  music: MusicItem[];
  onSelect: (index: number) => void;
}) {
  const player = usePlayer();
  const playing = currentTrack(player);

  return (
    <ul>
      {music.map((track, index) => (
        <li key={track.musicId}>
          <button
            type="button"
            onClick={() => onSelect(index)}
            className="flex h-15 w-full items-center gap-4 border-b border-gray-100 px-4 text-left"
          >
            <div className="flex h-12.25 w-12.25 shrink-0 items-center justify-center rounded-[10px] bg-linear-to-br from-[#67469A] to-[#F73D88] text-sm font-semibold text-white">
              {track.position}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p
                className={`truncate text-sm font-semibold ${
                  playing?.musicId === track.musicId
                    ? "text-[#f73d88]"
                    : "text-[#1b1b1b]"
                }`}
              >
                {track.title}
              </p>
              <p className="truncate text-xs font-medium text-[#7a7a7a]">
                {track.artist}
              </p>
            </div>
            <span className="text-xs font-medium text-[#7a7a7a]">
              {formatDuration(track.durationSeconds)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

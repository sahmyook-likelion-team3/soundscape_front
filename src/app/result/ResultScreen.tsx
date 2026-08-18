/*
 * app/result/ResultScreen.tsx 화면
 * Description : /result — 저장 전 추천 결과 (분석 요약 + 5곡 + 저장)
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-19
 * Last Update  : 2026-08-19
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageShell from "@/components/PageShell";
import MiniPlayer from "@/components/MiniPlayer";
import BottomNav from "@/components/BottomNav";
import TrackList from "@/components/TrackList";
import Cover from "@/components/Cover";
import {
  formatMeta,
  savePlaylist,
  type PhotoAnalysis,
  type PlaylistTheme,
} from "@/lib/api";
import { playQueue } from "@/lib/player";
import { useRecommendation } from "@/lib/recommendation";

const PLACE: Record<PhotoAnalysis["place"], string> = {
  CAFE_LIBRARY: "카페·도서관",
  ROOM_HOME: "집·방",
  STREET_CITY: "거리·도시",
  TRANSPORT: "이동 중",
  NATURE_TRAVEL: "자연·여행",
  SOCIAL_SPACE: "모임 공간",
  OTHER: "기타",
};

const ACTIVITY: Record<PhotoAnalysis["activity"], string> = {
  STUDY_WORK: "공부·작업",
  REST_HEALING: "휴식",
  WALK_DRIVE_TRAVEL: "산책·드라이브",
  EATING_CAFE: "식사·카페",
  SOCIAL_PARTY: "모임·파티",
  UNKNOWN: "알 수 없음",
};

const WEATHER: Record<PhotoAnalysis["weather"], string> = {
  SUNNY: "맑음",
  CLOUDY: "흐림",
  RAINY: "비",
  SNOWY: "눈",
  UNKNOWN: "알 수 없음",
};

const TIME: Record<PhotoAnalysis["time"], string> = {
  DAY: "낮",
  SUNSET: "노을",
  NIGHT: "밤",
  UNKNOWN: "알 수 없음",
};

const THEME: Record<PlaylistTheme, string> = {
  STUDY_FOCUS: "집중",
  REST_HEALING: "휴식",
  WALK_DRIVE_TRAVEL: "산책·여행",
  RAINY_DAY: "비 오는 날",
  NIGHT_DREAMY: "몽환적인 밤",
  BRIGHT_DAY: "밝은 낮",
  PARTY_ENERGY: "파티",
};

const MOOD_LABELS: Record<keyof PhotoAnalysis["mood"], string> = {
  brightness: "밝기",
  energy: "에너지",
  calmness: "차분함",
  warmth: "따뜻함",
  positivity: "긍정",
  dreaminess: "몽환",
};

export default function ResultScreen() {
  const router = useRouter();
  const { photo, result } = useRecommendation();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 사진 기반이면 방금 촬영한 원본 사진을 커버로 미리 보여준다.
  const photoUrl = useMemo(
    () => (photo ? URL.createObjectURL(photo) : null),
    [photo],
  );
  useEffect(
    () => () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    },
    [photoUrl],
  );

  useEffect(() => {
    if (!result) router.replace("/camera");
  }, [result, router]);

  if (!result) return null;

  const analysis = result.analysis;
  const cover = photoUrl ?? "/images/Home/playlist-1.jpg";

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const saved = await savePlaylist(result, photo);
      // 여기서 추천 결과를 비우면 아래 리다이렉트 이펙트가 먼저 돌아 /create 로 튄다.
      // 다음 추천을 시작할 때 자동으로 교체되므로 그대로 두고 이동만 한다.
      router.replace(`/playlists/${saved.playlistId}`);
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  };

  return (
    <PageShell>
      <div className="relative flex h-83.5 shrink-0 flex-col bg-linear-to-br from-[#67469A] to-[#F73D88] px-4 pb-4 text-white">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => router.replace("/camera")}
          className="absolute top-18 left-4"
        >
          <Image src="/icons/chevron-left.svg" alt="" width={11} height={20} />
        </button>

        <div className="flex flex-1 items-end gap-6">
          <div className="relative h-50.75 w-28.5 shrink-0 overflow-hidden rounded-[10px] bg-white/20">
            <Cover src={cover} alt={result.title} sizes="114px" />
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <p className="text-xl font-semibold">{result.title}</p>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium">{formatMeta(result.musicList)}</p>
            </div>

            <div className="mt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => playQueue(result.musicList)}
                className="flex items-center gap-2.75 rounded-full bg-white/10 px-3.25 py-2.5 shadow-[0px_1px_10px_2px_rgba(156,156,156,0.25)]"
              >
                <Image src="/icons/play-fill.svg" alt="" width={18} height={17} />
                <span className="text-sm font-medium">재생</span>
              </button>

              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#67469a] disabled:opacity-60"
              >
                {saving ? "저장 중…" : "저장하기"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto pt-5">
        {error && <p className="px-4 pb-3 text-xs font-medium text-[#f73d88]">{error}</p>}

        {analysis && (
          <div className="px-4 pb-5">
            <div className="flex flex-wrap gap-2">
              {[
                PLACE[analysis.place],
                ACTIVITY[analysis.activity],
                WEATHER[analysis.weather],
                TIME[analysis.time],
                ...result.convertedThemes.map((t) => THEME[t]),
              ].map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-[#f2eefb] px-3 py-1 text-xs font-medium text-[#67469a]"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {(
                Object.keys(MOOD_LABELS) as (keyof PhotoAnalysis["mood"])[]
              ).map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-10 shrink-0 text-xs font-medium text-[#7a7a7a]">
                    {MOOD_LABELS[key]}
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#ededed]">
                    <span
                      className="block h-full rounded-full bg-[#f73d88]"
                      style={{ width: `${Math.round(analysis.mood[key] * 100)}%` }}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <TrackList
          music={result.musicList}
          onSelect={(index) => playQueue(result.musicList, index)}
        />
      </div>

      <MiniPlayer />
      <BottomNav active="home" />
    </PageShell>
  );
}

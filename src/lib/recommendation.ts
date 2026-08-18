/*
 * lib/recommendation.ts
 * Description : 저장 전 추천 결과 임시 보관 (사진 File 은 직렬화 불가라 메모리에만 둔다)
 */

import { useSyncExternalStore } from "react";
import type { RecommendationPlaylist } from "./api";

type Pending = {
  photo: File | null;
  result: RecommendationPlaylist | null;
};

let pending: Pending = { photo: null, result: null };
const listeners = new Set<() => void>();

function set(patch: Partial<Pending>) {
  pending = { ...pending, ...patch };
  listeners.forEach((l) => l());
}

/** 새 추천 시작. 이전 추천 결과는 저장하지 않았으면 버린다. */
export function startPhotoRecommendation(photo: File) {
  set({ photo, result: null });
}

export function setResult(result: RecommendationPlaylist) {
  set({ result });
}

export function clearRecommendation() {
  set({ photo: null, result: null });
}

export function getPending() {
  return pending;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const snapshot = () => pending;

export function useRecommendation() {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

/*
 * lib/player.ts
 * Description : 화면 간 공유되는 오디오 재생 스토어 (단일 <audio> 엘리먼트)
 */

import { useSyncExternalStore } from "react";
import type { MusicItem } from "./api";

type PlayerState = {
  queue: MusicItem[];
  index: number;
  playing: boolean;
  position: number;
  duration: number;
  volume: number;
};

let state: PlayerState = {
  queue: [],
  index: 0,
  playing: false,
  position: 0,
  duration: 0,
  volume: 1,
};

const listeners = new Set<() => void>();
let audio: HTMLAudioElement | null = null;
let gainNode: GainNode | null = null;
let audioCtx: AudioContext | null = null;

function set(patch: Partial<PlayerState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function el() {
  if (!audio) {
    audio = new Audio();
    audio.addEventListener("timeupdate", () =>
      set({
        position: audio!.currentTime,
        duration: Number.isFinite(audio!.duration) ? audio!.duration : 0,
      }),
    );
    audio.addEventListener("loadedmetadata", () =>
      set({ duration: Number.isFinite(audio!.duration) ? audio!.duration : 0 }),
    );
    audio.addEventListener("play", () => set({ playing: true }));
    audio.addEventListener("pause", () => set({ playing: false }));
    audio.addEventListener("ended", () => next());

    // iOS Safari는 audio.volume을 무시하고 항상 시스템 볼륨을 따르므로,
    // Web Audio API의 GainNode를 거쳐 볼륨을 조절한다.
    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    audioCtx = new AudioContextCtor();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = state.volume;
    audioCtx.createMediaElementSource(audio).connect(gainNode);
    gainNode.connect(audioCtx.destination);
  }
  return audio;
}

function load() {
  const track = state.queue[state.index];
  if (!track) return;
  const a = el();
  audioCtx?.resume();
  a.src = track.audioUrl;
  set({ position: 0, duration: 0 });
  // 자동재생 차단 등은 무시하고 정지 상태로 둔다.
  a.play().catch(() => set({ playing: false }));
}

export function playQueue(queue: MusicItem[], index = 0) {
  set({ queue, index });
  load();
}

export function toggle() {
  const a = el();
  if (!a.src) {
    load();
    return;
  }
  audioCtx?.resume();
  if (state.playing) a.pause();
  else a.play().catch(() => set({ playing: false }));
}

export function next() {
  if (state.index < state.queue.length - 1) {
    set({ index: state.index + 1 });
    load();
  } else {
    el().pause();
  }
}

export function prev() {
  const a = el();
  // 3초 이상 재생했으면 처음으로, 아니면 이전 곡.
  if (a.currentTime > 3 || state.index === 0) {
    a.currentTime = 0;
    return;
  }
  set({ index: state.index - 1 });
  load();
}

export function seek(seconds: number) {
  el().currentTime = seconds;
  set({ position: seconds });
}

export function setVolume(volume: number) {
  el();
  if (gainNode) gainNode.gain.value = volume;
  set({ volume });
}

export function currentTrack(s: PlayerState = state) {
  return s.queue[s.index] ?? null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const snapshot = () => state;

export function usePlayer() {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

/*
 * lib/api.ts
 * Description : SoundScape 백엔드 API 클라이언트 (타입 + 호출 + 표시 헬퍼)
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const V1 = `${API_BASE}/api/v1`;

export type PlaylistSourceType = "PHOTO_RECOMMENDATION" | "GENRE_RECOMMENDATION";

export type Genre =
  | "KPOP"
  | "POP"
  | "JPOP_ANIME_OST"
  | "HIPHOP_RAP"
  | "RNB_SOUL"
  | "LOFI_INSTRUMENTAL"
  | "JAZZ_CLASSICAL_NEWAGE";

export type PlaylistTheme =
  | "STUDY_FOCUS"
  | "REST_HEALING"
  | "WALK_DRIVE_TRAVEL"
  | "RAINY_DAY"
  | "NIGHT_DREAMY"
  | "BRIGHT_DAY"
  | "PARTY_ENERGY";

export type PhotoAnalysis = {
  place:
    | "CAFE_LIBRARY"
    | "ROOM_HOME"
    | "STREET_CITY"
    | "TRANSPORT"
    | "NATURE_TRAVEL"
    | "SOCIAL_SPACE"
    | "OTHER";
  activity:
    | "STUDY_WORK"
    | "REST_HEALING"
    | "WALK_DRIVE_TRAVEL"
    | "EATING_CAFE"
    | "SOCIAL_PARTY"
    | "UNKNOWN";
  weather: "SUNNY" | "CLOUDY" | "RAINY" | "SNOWY" | "UNKNOWN";
  time: "DAY" | "SUNSET" | "NIGHT" | "UNKNOWN";
  mood: {
    brightness: number;
    energy: number;
    calmness: number;
    warmth: number;
    positivity: number;
    dreaminess: number;
  };
};

export type MusicItem = {
  musicId: number;
  title: string;
  artist: string;
  genre: Genre;
  durationSeconds: number;
  position: number;
  audioUrl: string;
};

export type RecommendationPlaylist = {
  title: string;
  sourceType: PlaylistSourceType;
  sourceGenre: Genre | null;
  analysis: PhotoAnalysis | null;
  convertedThemes: PlaylistTheme[];
  musicList: MusicItem[];
};

export type PlaylistSummary = {
  playlistId: number;
  title: string;
  sourceType: PlaylistSourceType;
  sourceGenre: Genre | null;
  coverImageUrl: string | null;
  createdAt: string;
};

export type PlaylistDetail = PlaylistSummary & { musicList: MusicItem[] };

export type SavedPlaylist = Omit<PlaylistSummary, "coverImageUrl">;

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** MVP 임시 사용자 구분. localStorage.userId 없으면 기본값 "1". */
export function getUserId(): string {
  if (typeof window === "undefined") return "1";
  return localStorage.getItem("userId") ?? "1";
}

/** 회원가입/로그인 성공 시 서버가 내려준 userId 를 저장한다. */
export function setUserId(userId: number | string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("userId", String(userId));
}

/** 홈 화면 인사말("OO님.")에 쓸 닉네임. 없으면 null. */
export function getNickname(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("nickname");
}

export function setNickname(nickname: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("nickname", nickname);
}

/** 마이페이지에 표시할 로그인 아이디. 로그인 전이면 null. */
export function getUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("username");
}

export function setUsername(username: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("username", username);
}

/** 로그아웃: 저장해둔 userId/nickname/username 을 지운다. */
export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("userId");
  localStorage.removeItem("nickname");
  localStorage.removeItem("username");
}

export type AuthResponse = { userId: number };

export function signup(input: { username: string; password: string; nickname: string }) {
  return request<AuthResponse>("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function login(input: { username: string; password: string }) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

async function request<T>(path: string, init: RequestInit = {}, auth = false) {
  const headers = new Headers(init.headers);
  if (auth) headers.set("X-User-Id", getUserId());

  const res = await fetch(`${V1}${path}`, { ...init, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(
      res.status,
      body?.code ?? "UNKNOWN",
      body?.message ?? `요청에 실패했습니다. (${res.status})`,
    );
  }
  // 204 No Content 는 본문이 없다. (삭제)
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function recommendByPhoto(image: File) {
  const form = new FormData();
  form.append("image", image);
  return request<RecommendationPlaylist>("/playlists/recommendations/photo", {
    method: "POST",
    body: form,
  });
}

export function savePlaylist(
  recommendation: RecommendationPlaylist,
  image: File | null,
) {
  const body = {
    title: recommendation.title,
    sourceType: recommendation.sourceType,
    sourceGenre: recommendation.sourceGenre,
    musicIds: recommendation.musicList.map((m) => m.musicId),
  };

  const form = new FormData();
  // Spring @RequestPart 가 JSON 파트로 인식하도록 Content-Type 을 붙인다.
  form.append(
    "request",
    new Blob([JSON.stringify(body)], { type: "application/json" }),
    "request.json",
  );
  if (image) form.append("image", image);

  return request<SavedPlaylist>("/playlists", { method: "POST", body: form }, true);
}

export async function getPlaylists() {
  const data = await request<{ playlists: PlaylistSummary[] }>(
    "/playlists",
    { cache: "no-store" },
    true,
  );
  return data.playlists;
}

/** 성공 시 204. 없거나 다른 사용자의 플레이리스트면 404. */
export function deletePlaylist(playlistId: number) {
  return request<void>(`/playlists/${playlistId}`, { method: "DELETE" }, true);
}

export function getPlaylist(playlistId: number | string) {
  return request<PlaylistDetail>(
    `/playlists/${playlistId}`,
    { cache: "no-store" },
    true,
  );
}

/* ---------- 표시 헬퍼 ---------- */

/** Presigned 커버가 없으면(만료·장르 기반) 기본 이미지를 쓴다. */
export function coverOf(playlist: { coverImageUrl?: string | null }) {
  return playlist.coverImageUrl ?? "/images/Home/playlist-1.jpg";
}

/** 초 → "3:05" */
export function formatDuration(seconds: number) {
  const s = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** "2026-08-03T16:40:00" → "2026.08.03" */
export function formatDate(iso: string) {
  return iso.slice(0, 10).replaceAll("-", ".");
}

/** 곡 수 + 총 재생시간 → "5곡 15분" */
export function formatMeta(musicList: MusicItem[]) {
  const total = musicList.reduce((sum, m) => sum + (m.durationSeconds || 0), 0);
  return `${musicList.length}곡 ${Math.round(total / 60)}분`;
}

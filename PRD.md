AI 기반 공간·분위기 인식 음악 추천 서비스

사진 한장으로, 검색하지 않아도, 지금 내 공간,분위기 어울리는 음악이 재생된다.

초기 MVP : AI 추천 알고리즘을 검증하기 위해 라이선스가 확보된 음원만을 최종적으로 사용

프론트엔드 부분 개밯 위주

**수작업 <기술적, 법적 허용 가능 범위 서비스 구현>**

이후 정식 서비스에서는 Spotify, Apple Music, YouTube Music 등 공식 플랫폼과 연동하여 실제 음원 향후 확장 가능성 둠

음악을 라이선스 확보된 음원 간추려 장르 나눔 후 이미지 분석과 음원 매치 방향

(다소 음악퀄은 떨어질 것 예상됨…)

## 기능 요약

→ 사진 촬영

→ AI 공간,분위기 분석  
→ 미리 준비한 라이선스 음원 곡 중 (30~최대50 이상)
→ 일회성 플레이리스트 생성
→ 새 사진 촬영 시 기존 재생 목록 교체

→ 원하는 곡 또는 전체 플레이리스트 저장

(한 이미지 당 플리는 일회성으로 저장 안하고 넘어갈 시 폐기)

새로운 사진을 촬영하면 새로운 플레이리스트가 생성된다.

기존 추천 결과는 저장하지 않으면 사라지고, 사용자가 선택한 곡이나 플레이리스트만 보관함에 남는다.

>

<!--
 * SOUNDSCAPE FRONT
 * Description : SoundScape MVP PRD
 * Author       : 배서현
 * Contributors : 배서현
 * Created     : 2026-04-26
 * Last Update : 2026-05-29
 * Revision History
-->

# SoundScape MVP PRD

## 1. 서비스 소개

SoundScape는 사진 또는 장르를 기반으로 음악 5곡을 추천하고, 사용자별로 플레이리스트를 저장·조회하는 모바일 웹 서비스다.

실제 로그인 기능은 구현하지 않으며, MVP에서는 `localStorage.userId` 값을 읽어 API 요청의 `X-User-Id` 헤더로 사용한다.

## 2. 핵심 문제

사용자는 공부, 휴식, 카페, 여행, 매장 운영, SNS 콘텐츠 제작처럼 상황에 맞는 음악을 원하지만 매번 직접 검색해야 한다. 기존 음악 서비스는 사용자의 현재 공간과 분위기를 즉시 이해하지 못하고, 사용자는 익숙한 음악만 반복해서 듣게 된다.

SoundScape는 사진 분석 또는 장르 선택을 통해 즉시 저장 가능한 5곡 플레이리스트를 만든다.

## 3. 핵심 사용자

- 항상 같은 노래만 반복해서 듣는 사람
- 음악을 고르는 것이 귀찮은 사람
- 공간에 맞는 BGM이 필요한 사람
- 새로운 음악을 자연스럽게 발견하고 싶은 사람
- 영상, 카페, 매장, 유튜브, 인스타그램, SNS용 BGM을 고민하는 사람

## 4. MVP 범위

### 포함

- 사진 기반 플레이리스트 추천 UI
- 장르 기반 플레이리스트 추천 UI
- 추천 결과 5곡 표시
- 플레이리스트 저장 UI
- 사용자별 플레이리스트 목록/상세 UI
- 최종 API 응답 구조와 같은 Mock Data
- `localStorage.userId` 기반 임시 사용자 구분

### 제외

- 실제 로그인/회원가입
- 실제 브라우저 카메라 권한 요청
- 실제 이미지 업로드와 OpenAI 분석
- 실제 Spring Boot API 연동
- 실제 S3 Presigned URL 재발급
- 실제 음악 다운로드
- 관리자용 음악·테마 데이터 등록 화면

## 5. 공통 API 규칙

- Base URL: `{BACKEND_URL}/api/v1`
- 백엔드: Spring Boot
- 프론트엔드: Next.js
- 데이터베이스: MySQL
- 파일 저장소: AWS S3
- 이미지 분석: OpenAI API
- 플레이리스트는 항상 음악 5곡으로 구성한다.
- 사진은 플레이리스트 저장 시점에만 S3에 저장한다.
- AI 사진 분석 결과는 DB에 저장하지 않는다.
- 날짜와 시간은 ISO 8601 형식을 사용한다.
- 음악과 사진 URL은 S3 Presigned URL로 반환한다.

사용자별 API 요청에는 다음 헤더를 전송한다.

```http
X-User-Id: 1
```

`X-User-Id`가 필요한 API:

- 플레이리스트 저장
- 플레이리스트 목록 조회
- 플레이리스트 상세 조회

`X-User-Id`가 없거나 DB에 존재하지 않으면 `401 Unauthorized`를 반환한다.

## 6. API 목록

| 기능                   | Method | Endpoint                           | X-User-Id |
| ---------------------- | ------ | ---------------------------------- | --------- |
| 사진 기반 추천         | POST   | `/playlists/recommendations/photo` | 불필요    |
| 장르 기반 추천         | POST   | `/playlists/recommendations/genre` | 불필요    |
| 플레이리스트 저장      | POST   | `/playlists`                       | 필요      |
| 플레이리스트 목록 조회 | GET    | `/playlists`                       | 필요      |
| 플레이리스트 상세 조회 | GET    | `/playlists/{playlistId}`          | 필요      |

## 7. 주요 화면 흐름

### 사진 기반 추천

1. 사용자가 사진 추천을 시작한다.
2. 촬영 화면에서 사진을 촬영한다.
3. AI 분석 로딩 화면을 보여준다.
4. 장소, 활동, 날씨, 시간대, 분위기 수치, 변환 테마를 표시한다.
5. 추천 음악 5곡을 표시한다.
6. 사용자가 플레이리스트를 저장한다.
7. 사진 기반 저장이면 저장 API에 원본 사진을 함께 전송한다.

### 장르 기반 추천

1. 사용자가 장르를 선택한다.
2. 장르 기반 추천 로딩 화면을 보여준다.
3. 추천 음악 5곡을 표시한다.
4. 사용자가 플레이리스트를 저장한다.
5. 장르 기반 저장이면 이미지를 전송하지 않는다.

### 보관함

1. `X-User-Id`에 해당하는 저장 플레이리스트 목록을 조회한다.
2. `coverImageUrl`이 있으면 사진 기반 커버를 표시한다.
3. `coverImageUrl`이 `null`이면 `sourceGenre`에 맞는 기본 이미지를 표시한다.
4. 상세 화면에서는 음악 5곡을 순서대로 표시한다.

## 8. 데이터 타입

```ts
type PlaylistSourceType = "PHOTO_RECOMMENDATION" | "GENRE_RECOMMENDATION";

type Genre =
  | "KPOP"
  | "POP"
  | "JPOP_ANIME_OST"
  | "HIPHOP_RAP"
  | "RNB_SOUL"
  | "LOFI_INSTRUMENTAL"
  | "JAZZ_CLASSICAL_NEWAGE";

type PlaylistTheme =
  | "STUDY_FOCUS"
  | "REST_HEALING"
  | "WALK_DRIVE_TRAVEL"
  | "RAINY_DAY"
  | "NIGHT_DREAMY"
  | "BRIGHT_DAY"
  | "PARTY_ENERGY";

type PhotoAnalysis = {
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

type MusicItem = {
  musicId: number;
  title: string;
  artist: string;
  genre: Genre;
  durationSeconds: number;
  position: number;
  audioUrl: string;
};

type RecommendationPlaylist = {
  title: string;
  sourceType: PlaylistSourceType;
  sourceGenre: Genre | null;
  analysis: PhotoAnalysis | null;
  convertedThemes: PlaylistTheme[];
  musicList: MusicItem[];
};
```

## 9. API 상세

### 사진 기반 추천

`POST /playlists/recommendations/photo`

Content-Type: `multipart/form-data`

| 필드    | 타입 | 필수 | 설명             |
| ------- | ---- | ---- | ---------------- |
| `image` | File | 예   | 분석할 장소 사진 |

지원 형식:

- JPEG
- PNG
- WEBP

응답:

```json
{
  "title": "비 오는 밤의 카페",
  "sourceType": "PHOTO_RECOMMENDATION",
  "sourceGenre": null,
  "analysis": {
    "place": "CAFE_LIBRARY",
    "activity": "STUDY_WORK",
    "weather": "RAINY",
    "time": "NIGHT",
    "mood": {
      "brightness": 0.25,
      "energy": 0.3,
      "calmness": 0.85,
      "warmth": 0.75,
      "positivity": 0.45,
      "dreaminess": 0.8
    }
  },
  "convertedThemes": ["STUDY_FOCUS", "RAINY_DAY", "NIGHT_DREAMY"],
  "musicList": [
    {
      "musicId": 8,
      "title": "Rainy Night Study",
      "artist": "Pixabay Creator",
      "genre": "LOFI_INSTRUMENTAL",
      "durationSeconds": 183,
      "position": 1,
      "audioUrl": "https://s3-presigned-url..."
    }
  ]
}
```

실제 `musicList`에는 음악 5곡이 포함된다. 추천 단계에서는 사진, AI 분석 결과, 플레이리스트를 저장하지 않는다.

### 장르 기반 추천

`POST /playlists/recommendations/genre`

Content-Type: `application/json`

```json
{
  "genre": "JPOP_ANIME_OST"
}
```

응답:

```json
{
  "title": "오늘의 JPOP 플레이리스트",
  "sourceType": "GENRE_RECOMMENDATION",
  "sourceGenre": "JPOP_ANIME_OST",
  "analysis": null,
  "convertedThemes": [],
  "musicList": [
    {
      "musicId": 3,
      "title": "Anime Dream",
      "artist": "Pixabay Creator",
      "genre": "JPOP_ANIME_OST",
      "durationSeconds": 191,
      "position": 1,
      "audioUrl": "https://s3-presigned-url..."
    }
  ]
}
```

추천 가능한 음악이 5곡보다 적으면 `422 Unprocessable Entity`를 반환한다.

```json
{
  "code": "INSUFFICIENT_MUSIC",
  "message": "해당 장르의 추천 가능한 음악이 부족합니다."
}
```

### 플레이리스트 저장

`POST /playlists`

```http
X-User-Id: 1
Content-Type: multipart/form-data
```

| 필드      | 타입 | 필수   | 설명                |
| --------- | ---- | ------ | ------------------- |
| `request` | JSON | 예     | 플레이리스트 정보   |
| `image`   | File | 조건부 | 사진 기반일 때 필수 |

사진 기반 저장:

```json
{
  "title": "비 오는 밤의 카페",
  "sourceType": "PHOTO_RECOMMENDATION",
  "sourceGenre": null,
  "musicIds": [8, 21, 4, 13, 9]
}
```

장르 기반 저장:

```json
{
  "title": "오늘의 JPOP 플레이리스트",
  "sourceType": "GENRE_RECOMMENDATION",
  "sourceGenre": "JPOP_ANIME_OST",
  "musicIds": [3, 7, 11, 18, 24]
}
```

응답:

```json
{
  "playlistId": 10,
  "title": "비 오는 밤의 카페",
  "sourceType": "PHOTO_RECOMMENDATION",
  "sourceGenre": null,
  "createdAt": "2026-08-03T16:40:00"
}
```

저장 검증 규칙:

- `title`은 필수다.
- `musicIds`는 정확히 5개여야 한다.
- 음악 ID는 중복될 수 없다.
- 모든 음악이 DB에 존재해야 한다.
- 사진 기반이면 `image`가 필요하다.
- 사진 기반이면 `sourceGenre`는 `null`이다.
- 장르 기반이면 `sourceGenre`가 필요하다.
- 장르 기반 음악은 모두 `sourceGenre`와 일치해야 한다.
- 요청 본문에는 `userId`를 넣지 않는다.
- 음악 배열 순서대로 `position` 1~5를 저장한다.

### 플레이리스트 목록 조회

`GET /playlists`

```http
X-User-Id: 1
```

응답:

```json
{
  "playlists": [
    {
      "playlistId": 10,
      "title": "비 오는 밤의 카페",
      "sourceType": "PHOTO_RECOMMENDATION",
      "sourceGenre": null,
      "coverImageUrl": "https://s3-cover-presigned-url...",
      "createdAt": "2026-08-03T16:40:00"
    },
    {
      "playlistId": 11,
      "title": "오늘의 JPOP 플레이리스트",
      "sourceType": "GENRE_RECOMMENDATION",
      "sourceGenre": "JPOP_ANIME_OST",
      "coverImageUrl": null,
      "createdAt": "2026-08-03T16:30:00"
    }
  ]
}
```

저장된 플레이리스트가 없으면 빈 배열을 반환한다.

### 플레이리스트 상세 조회

`GET /playlists/{playlistId}`

```http
X-User-Id: 1
```

응답:

```json
{
  "playlistId": 10,
  "title": "비 오는 밤의 카페",
  "sourceType": "PHOTO_RECOMMENDATION",
  "sourceGenre": null,
  "coverImageUrl": "https://s3-cover-presigned-url...",
  "createdAt": "2026-08-03T16:40:00",
  "musicList": [
    {
      "musicId": 8,
      "title": "Rainy Night Study",
      "artist": "Pixabay Creator",
      "genre": "LOFI_INSTRUMENTAL",
      "durationSeconds": 183,
      "position": 1,
      "audioUrl": "https://s3-audio-presigned-url..."
    }
  ]
}
```

실제 `musicList`에는 음악 5곡이 포함된다. 플레이리스트가 없거나 다른 사용자의 플레이리스트이면 동일하게 `404 Not Found`를 반환한다.

## 10. 주요 오류

| 오류 코드               | 상태 코드 | 설명                         |
| ----------------------- | --------- | ---------------------------- |
| `USER_ID_REQUIRED`      | 401       | `X-User-Id` 헤더가 없음      |
| `INVALID_USER`          | 401       | 존재하지 않는 사용자         |
| `INVALID_REQUEST`       | 400       | 요청값이 올바르지 않음       |
| `INVALID_MUSIC_COUNT`   | 400       | 음악이 정확히 5곡이 아님     |
| `DUPLICATE_MUSIC`       | 400       | 음악 ID가 중복됨             |
| `IMAGE_REQUIRED`        | 400       | 사진 기반인데 이미지가 없음  |
| `SOURCE_GENRE_REQUIRED` | 400       | 장르 기반인데 장르가 없음    |
| `GENRE_MISMATCH`        | 400       | 음악 장르가 요청 장르와 다름 |
| `MUSIC_NOT_FOUND`       | 404       | 음악이 존재하지 않음         |
| `PLAYLIST_NOT_FOUND`    | 404       | 플레이리스트를 찾을 수 없음  |
| `INSUFFICIENT_MUSIC`    | 422       | 추천 가능한 음악이 부족함    |

공통 오류 형식:

```json
{
  "timestamp": "2026-08-03T16:40:00",
  "status": 400,
  "code": "INVALID_REQUEST",
  "message": "요청값이 올바르지 않습니다."
}
```

## 11. 프론트 구현 규칙

사용자 ID:

```ts
const userId = localStorage.getItem("userId");
```

사용자별 API 요청:

```ts
fetch(url, {
  headers: {
    "X-User-Id": userId,
  },
});
```

사진 추천 후 원본 `File` 객체를 React 상태에 보관한다. 저장 버튼을 누르면 같은 사진을 저장 API에 다시 전송한다. 페이지 새로고침으로 파일이 사라지면 사진 추천을 다시 진행한다.

`audioUrl`과 `coverImageUrl`은 영구 저장하지 않는다. 만료되면 상세 조회 API를 다시 호출한다.

세션 쿠키를 사용하지 않으므로 `credentials: "include"`와 `allowCredentials = true`는 필요하지 않다.

## 12. 현재 프론트 Mock 구현

- `/` 한 페이지에서 추천, 촬영, 분석, 결과, 보관함 상태를 전환한다.
- 사진 기반 추천은 실제 카메라 권한 없이 Mock 촬영 화면으로 표현한다.
- 장르 기반 추천은 7개 장르 중 선택한다.
- 추천 결과는 항상 `musicList` 5곡이다.
- 저장 단위는 곡이 아니라 플레이리스트다.
- 저장된 플레이리스트는 `localStorage`에 보관한다.
- `localStorage.userId`가 없으면 MVP 기본값 `1`을 사용한다.
- 장르 기반 플레이리스트는 `coverImageUrl: null`로 두고 프론트 기본 이미지를 표시한다.

## 13. 검증 기준

- `npm run lint` 통과
- `npm run build` 통과
- 모바일 폭 390px에서 사진 추천 → 분석 → 5곡 결과 → 저장 → 보관함 확인 가능
- 모바일 폭 390px에서 장르 추천 → 5곡 결과 → 저장 → 보관함 확인 가능
- 새 추천 생성 시 저장하지 않은 추천 결과는 교체됨
- 실제 카메라 권한 요청, 외부 API 호출, 다운로드 동작 없음

# SoundScape API 명세서 최종본

SoundScape MVP는 사진 또는 장르를 기반으로 음악 5곡을 추천하고, 사용자별로 플레이리스트를 저장·조회하는 서비스다.

실제 로그인 기능은 구현하지 않으며, 임시로 `X-User-Id` 헤더를 사용해 사용자를 구분한다.

---

# 1. 공통 규칙

- Base URL: `{BACKEND_URL}/api/v1`
- 백엔드: Spring Boot
- 프론트엔드: next.js
- 데이터베이스: MySQL
- 파일 저장소: AWS S3
- 이미지 분석: OpenAI API
- 플레이리스트는 항상 음악 5곡으로 구성한다.
- 사진은 플레이리스트 저장 시점에만 S3에 저장한다.
- AI 사진 분석 결과는 DB에 저장하지 않는다.
- 날짜와 시간은 ISO 8601 형식을 사용한다.
- 음악과 사진 URL은 S3 Presigned URL로 반환한다.

## 사용자 구분

사용자별 데이터가 필요한 API에는 다음 헤더를 전송한다.

```
X-User-Id: 1
```

`X-User-Id`가 필요한 API:

- 플레이리스트 저장
- 플레이리스트 목록 조회
- 플레이리스트 상세 조회

`X-User-Id`가 없거나 DB에 존재하지 않으면 `401 Unauthorized`를 반환한다.

이 방식은 실제 인증이 아니라 MVP용 임시 사용자 구분 방식이다.

---

# 2. API 목록

| 기능                   | Method | Endpoint                           | X-User-Id |
| ---------------------- | ------ | ---------------------------------- | --------- |
| 사진 기반 추천         | POST   | `/playlists/recommendations/photo` | 불필요    |
| 장르 기반 추천         | POST   | `/playlists/recommendations/genre` | 불필요    |
| 플레이리스트 저장      | POST   | `/playlists`                       | 필요      |
| 플레이리스트 목록 조회 | GET    | `/playlists`                       | 필요      |
| 플레이리스트 상세 조회 | GET    | `/playlists/{playlistId}`          | 필요      |

---

# 3. 사진 기반 플레이리스트 추천

## 요청

`POST /playlists/recommendations/photo`

Content-Type: `multipart/form-data`

| 필드    | 타입 | 필수 | 설명             |
| ------- | ---- | ---- | ---------------- |
| `image` | File | 예   | 분석할 장소 사진 |

지원 형식:

- JPEG
- PNG
- WEBP

## 처리 흐름

사용자 사진 업로드

→ AI가 장소·활동·날씨·시간대·분위기 분석

→ 분석 결과를 음악 테마로 변환

→ DB 음악과 비교하여 추천 점수 계산

→ 상위 음악 5곡 선택

→ Presigned URL 생성

→ 제목과 추천 결과 반환

## 응답

```
{
  "title":"비 오는 밤의 카페",
  "sourceType":"PHOTO_RECOMMENDATION",
  "sourceGenre":null,
  "analysis": {
    "place":"CAFE_LIBRARY",
    "activity":"STUDY_WORK",
    "weather":"RAINY",
    "time":"NIGHT",
    "mood": {
      "brightness":0.25,
      "energy":0.30,
      "calmness":0.85,
      "warmth":0.75,
      "positivity":0.45,
      "dreaminess":0.80
    }
  },
  "convertedThemes": ["STUDY_FOCUS","RAINY_DAY","NIGHT_DREAMY"
  ],
  "musicList": [
    {
      "musicId":8,
      "title":"Rainy Night Study",
      "artist":"Pixabay Creator",
      "genre":"LOFI_INSTRUMENTAL",
      "durationSeconds":183,
      "position":1,
      "audioUrl":"https://s3-presigned-url..."
    }
  ]
}
```

실제 `musicList`에는 음악 5곡이 포함된다.

추천 단계에서는 사진, AI 분석 결과, 플레이리스트를 저장하지 않는다.

---

# 4. 장르 기반 플레이리스트 추천

## 요청

`POST /playlists/recommendations/genre`

Content-Type: `application/json`

```
{
  "genre":"JPOP_ANIME_OST"
}
```

## 처리 흐름

장르 검증

→ 해당 장르 음악 조회

→ 음악 5곡 선택

→ Presigned URL 생성

→ 플레이리스트 제목 생성

→ 추천 결과 반환

## 응답

```
{
  "title":"오늘의 JPOP 플레이리스트",
  "sourceType":"GENRE_RECOMMENDATION",
  "sourceGenre":"JPOP_ANIME_OST",
  "analysis":null,
  "convertedThemes": [],
  "musicList": [
    {
      "musicId":3,
      "title":"Anime Dream",
      "artist":"Pixabay Creator",
      "genre":"JPOP_ANIME_OST",
      "durationSeconds":191,
      "position":1,
      "audioUrl":"https://s3-presigned-url..."
    }
  ]
}
```

장르 기반 플레이리스트는 백엔드가 커버 이미지를 반환하지 않는다. 프론트가 `sourceGenre`에 맞는 기본 이미지를 표시한다.

추천 가능한 음악이 5곡보다 적으면:

```
422 Unprocessable Entity
```

```
{
  "code":"INSUFFICIENT_MUSIC",
  "message":"해당 장르의 추천 가능한 음악이 부족합니다."
}
```

---

# 5. 플레이리스트 저장

## 요청

`POST /playlists`

```
X-User-Id: 1
Content-Type: multipart/form-data
```

| 필드      | 타입 | 필수   | 설명                |
| --------- | ---- | ------ | ------------------- |
| `request` | JSON | 예     | 플레이리스트 정보   |
| `image`   | File | 조건부 | 사진 기반일 때 필수 |

## 사진 기반 저장

```
{
  "title":"비 오는 밤의 카페",
  "sourceType":"PHOTO_RECOMMENDATION",
  "sourceGenre":null,
  "musicIds": [8,21,4,13,9]
}
```

추천에 사용했던 원본 사진을 `image`로 함께 전송한다.

## 장르 기반 저장

```
{
  "title":"오늘의 JPOP 플레이리스트",
  "sourceType":"GENRE_RECOMMENDATION",
  "sourceGenre":"JPOP_ANIME_OST",
  "musicIds": [3,7,11,18,24]
}
```

장르 기반은 이미지를 전송하지 않는다.

## 처리 흐름

`X-User-Id` 확인

→ 사용자 존재 여부 확인

→ 저장 요청 검증

→ 사진 기반이면 사진을 S3에 업로드

→ `playlist` 저장

→ 음악 5곡과 순서를 `playlist_music`에 저장

## 검증 규칙

- `title`은 필수다.
- `musicIds`는 정확히 5개여야 한다.
- 음악 ID는 중복될 수 없다.
- 모든 음악이 DB에 존재해야 한다.
- 사진 기반이면 `image`가 필요하다.
- 사진 기반이면 `sourceGenre`는 `null`이다.
- 장르 기반이면 `sourceGenre`가 필요하다.
- 장르 기반 음악은 모두 `sourceGenre`와 일치해야 한다.
- 요청 본문에는 `userId`를 넣지 않는다.
- 음악 배열 순서대로 `position` 1~5를 저장한다.

## 응답

```
201 Created
```

```
{
  "playlistId":10,
  "title":"비 오는 밤의 카페",
  "sourceType":"PHOTO_RECOMMENDATION",
  "sourceGenre":null,
  "createdAt":"2026-08-03T16:40:00"
}
```

---

# 6. 플레이리스트 목록 조회

## 요청

```
GET /playlists
X-User-Id: 1
```

`X-User-Id`에 해당하는 사용자가 저장한 플레이리스트만 조회한다.

## 응답

```
{
  "playlists": [
    {
      "playlistId":10,
      "title":"비 오는 밤의 카페",
      "sourceType":"PHOTO_RECOMMENDATION",
      "sourceGenre":null,
      "coverImageUrl":"https://s3-cover-presigned-url...",
      "createdAt":"2026-08-03T16:40:00"
    },
    {
      "playlistId":11,
      "title":"오늘의 JPOP 플레이리스트",
      "sourceType":"GENRE_RECOMMENDATION",
      "sourceGenre":"JPOP_ANIME_OST",
      "coverImageUrl":null,
      "createdAt":"2026-08-03T16:30:00"
    }
  ]
}
```

저장된 플레이리스트가 없으면 빈 배열을 반환한다.

```
{
  "playlists": []
}
```

`coverImageUrl`이 `null`이면 프론트가 `sourceGenre`에 맞는 기본 이미지를 표시한다.

---

# 7. 플레이리스트 상세 조회

## 요청

```
GET /playlists/{playlistId}
X-User-Id: 1
```

백엔드는 다음 두 조건을 함께 확인한다.

```
playlist.id = playlistId
playlist.user_id = X-User-Id
```

## 응답

```
{
  "playlistId":10,
  "title":"비 오는 밤의 카페",
  "sourceType":"PHOTO_RECOMMENDATION",
  "sourceGenre":null,
  "coverImageUrl":"https://s3-cover-presigned-url...",
  "createdAt":"2026-08-03T16:40:00",
  "musicList": [
    {
      "musicId":8,
      "title":"Rainy Night Study",
      "artist":"Pixabay Creator",
      "genre":"LOFI_INSTRUMENTAL",
      "durationSeconds":183,
      "position":1,
      "audioUrl":"https://s3-audio-presigned-url..."
    }
  ]
}
```

실제 `musicList`에는 음악 5곡이 포함된다.

플레이리스트가 없거나 다른 사용자의 플레이리스트이면 동일하게 `404 Not Found`를 반환한다.

---

# 8. 주요 오류

| 오류 코드               | 상태 코드 | 설명                         |
| ----------------------- | --------- | ---------------------------- |
| `USER_ID_REQUIRED`      | 401       | `X-User-Id` 헤더가 없음      |
| `INVALID_USER`          | 401       | 존재하지 않는 사용자         |
| `INVALID_REQUEST`       | 400       | 요청값이 올바르지 않음       |
| `INVALID_MUSIC_COUNT`   | 400       | 음악이 정확히 5곡이 아님     |
| `DUPLICATE_MUSIC`       | 400       | 음악 ID가 중복됨             |
| `IMAGE_REQUIRED`        | 400       | 사진 기반인데 이미지가 없음  |
| `SOURCE_GENRE_REQUIRED` | 400       | 장르 기반인데 장르가 없음    |
| `GENRE_MISMATCH`        | 400       | 음악 장르가 요청 장르와 다름 |
| `MUSIC_NOT_FOUND`       | 404       | 음악이 존재하지 않음         |
| `PLAYLIST_NOT_FOUND`    | 404       | 플레이리스트를 찾을 수 없음  |
| `INSUFFICIENT_MUSIC`    | 422       | 추천 가능한 음악이 부족함    |

공통 오류 형식:

```
{
  "timestamp":"2026-08-03T16:40:00",
  "status":400,
  "code":"INVALID_REQUEST",
  "message":"요청값이 올바르지 않습니다."
}
```

---

# 9. Enum

## PlaylistSourceType

```
PHOTO_RECOMMENDATION
GENRE_RECOMMENDATION
```

## Genre

```
KPOP
POP
JPOP_ANIME_OST
HIPHOP_RAP
RNB_SOUL
LOFI_INSTRUMENTAL
JAZZ_CLASSICAL_NEWAGE
```

## PlaylistTheme

```
STUDY_FOCUS
REST_HEALING
WALK_DRIVE_TRAVEL
RAINY_DAY
NIGHT_DREAMY
BRIGHT_DAY
PARTY_ENERGY
```

## ActivityType

```
STUDY_WORK
REST_HEALING
WALK_DRIVE_TRAVEL
EATING_CAFE
SOCIAL_PARTY
UNKNOWN
```

## PlaceType

```
CAFE_LIBRARY
ROOM_HOME
STREET_CITY
TRANSPORT
NATURE_TRAVEL
SOCIAL_SPACE
OTHER
```

## WeatherType

```
SUNNY
CLOUDY
RAINY
SNOWY
UNKNOWN
```

## TimeType

```
DAY
SUNSET
NIGHT
UNKNOWN
```

---

# 10. 분위기 수치

모든 값은 `0.0~1.0` 범위다.

```
brightness
energy
calmness
warmth
positivity
dreaminess
```

---

# 11. 프론트 구현 규칙

## 사용자 ID

```
constuserId=localStorage.getItem("userId");
```

사용자별 API 요청:

```
fetch(url, {
  headers: {"X-User-Id":userId
  }
});
```

## 사진 파일

사진 추천 후 원본 `File` 객체를 React 상태에 보관한다.

저장 버튼을 누르면 같은 사진을 저장 API에 다시 전송한다. 페이지를 새로고침해 파일이 사라지면 사진 추천을 다시 진행한다.

## Presigned URL

`audioUrl`과 `coverImageUrl`은 영구 저장하지 않는다. 만료되면 상세 조회 API를 다시 호출한다.

## CORS

```
allowedOrigins = {FRONTEND_URL}
allowedHeaders = Content-Type, X-User-Id
allowedMethods = GET, POST, OPTIONS
```

세션 쿠키를 사용하지 않으므로 `credentials: "include"`와 `allowCredentials = true`는 필요하지 않다.

---

# 12. ERD 관계

```
users 1 : N playlist
playlist 1 : N playlist_music
music 1 : N playlist_music
music 1 : N music_theme
```

`X-User-Id`는 `users.id`를 확인한 뒤 `playlist.user_id`에 저장한다.

---

# 13. MVP 구현 순서

1. 음악·음악 테마 데이터 등록
2. 테스트 사용자 등록
3. 장르 기반 추천
4. 사진 AI 분석
5. 사진 기반 추천 점수 계산
6. 플레이리스트 저장
7. 사용자별 목록 조회
8. 플레이리스트 상세 조회
9. S3 음악 및 커버 Presigned URL 처리

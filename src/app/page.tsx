import Image from "next/image";

const playlists = [
  { title: "고즈넉한 분위기", src: "/images/Home/playlist-1.jpg" },
  { title: "흐린 날 듣는 노래", src: "/images/Home/playlist-2.jpg" },
  { title: "오후 8시 한강에서", src: "/images/Home/playlist-3.jpg" },
  { title: "밤에 듣는 시티팝", src: "/images/Home/playlist-4.jpg" },
  { title: "봄이 올 때 듣는 노래", src: "/images/Home/playlist-5.jpg" },
  { title: "카페에서 공부할 때", src: "/images/Home/playlist-6.jpg" },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-100.5 flex-col bg-white">
      <div className="relative flex h-96.25 flex-col justify-start gap-6 bg-linear-to-br from-[#67469A] to-[#F73D88] px-6 pt-8 text-white">
        <div className="flex items-center gap-2">
          <Image src="/icons/logo-mark.svg" alt="" width={22} height={47} />
          <p className="text-lg font-semibold">SoundScape</p>
        </div>
        <p className="text-2xl leading-snug font-bold">
          안녕하세요,
          <br />
          OO님.
        </p>
        <Image
          src="/images/Home/note.png"
          alt="음표 이미지"
          width={221.91}
          height={221.91}
          className="absolute top-0 right-0 mt-4 mr-4"
        />

        <button className="absolute top-72.25 right-6 left-6 rounded-full bg-[#67469A] py-3 text-xs font-semibold text-white shadow-md">
          + 플레이리스트 생성하기
        </button>
      </div>

      <div className="flex-1 bg-white px-4 pt-8 pb-4">
        <div className="mb-9 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1b1b1b]">
            저장한 플레이리스트
          </h2>
          <button
            type="button"
            className="flex items-center gap-2 text-xs font-medium text-[#7a7a7a]"
          >
            전체보기
            <Image src="/icons/chevron-right.svg" alt="" width={5} height={8} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-x-4.75 gap-y-4.5">
          {playlists.map((playlist) => (
            <div
              key={playlist.title}
              className="relative aspect-square overflow-hidden rounded-xl"
            >
              <Image
                src={playlist.src}
                alt={playlist.title}
                fill
                sizes="33vw"
                className="object-cover"
              />
              <p className="absolute bottom-2 left-2 text-xs font-medium text-white drop-shadow">
                {playlist.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex h-22 items-center gap-3.5 border-t border-gray-200 bg-white px-4">
        <Image
          src="/images/Home/player-thumbnail.jpg"
          alt="Deja Vu 앨범 아트"
          width={41}
          height={41}
          className="rounded"
        />
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-xs font-semibold text-[#1b1b1b]">Deja Vu</p>
          <p className="text-xs text-[#1b1b1b]">리센느</p>
        </div>
        <div className="flex items-center gap-3.5">
          <button type="button" aria-label="이전 곡">
            <Image src="/icons/prev.svg" alt="" width={28} height={18} />
          </button>
          <button type="button" aria-label="재생">
            <Image src="/icons/play.svg" alt="" width={21} height={21} />
          </button>
          <button type="button" aria-label="다음 곡">
            <Image src="/icons/next.svg" alt="" width={28} height={18} />
          </button>
        </div>
      </div>

      <nav className="flex h-18.5 items-center justify-around border-t border-gray-200 bg-white">
        <button
          type="button"
          aria-label="홈"
          className="flex h-12.75 w-19.5 items-center justify-center rounded-full bg-[#ececec]"
        >
          <Image src="/icons/home.svg" alt="" width={36} height={36} />
        </button>
        <button type="button" aria-label="추가">
          <Image src="/icons/plus.svg" alt="" width={37} height={37} />
        </button>
        <button type="button" aria-label="프로필">
          <Image src="/icons/profile.svg" alt="" width={34} height={34} />
        </button>
      </nav>
    </main>
  );
}

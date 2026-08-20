/*
 * components/BottomNav.tsx 컴포넌트
 * Description : 화면 하단 공통 네비게이션 바 (홈/추가/프로필)
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-19
 */

import Image from "next/image";
import Link from "next/link";

export default function BottomNav({
  active,
  activeColor = "#c1b7de",
  homeIcon = "filled",
  profileIcon = "default",
}: {
  active?: "home" | "profile";
  activeColor?: string;
  homeIcon?: "filled" | "outline";
  profileIcon?: "default" | "small";
}) {
  const pillClass =
    "absolute top-1/2 left-1/2 h-12.75 w-19.5 -translate-x-1/2 -translate-y-1/2 rounded-full";
  const homeSize = homeIcon === "outline" ? 32 : 36;
  const profileSize = profileIcon === "small" ? 25 : 34;

  return (
    <nav className="flex h-18.5 shrink-0 items-center justify-between bg-white pl-11.25 pr-10.75 shadow-[0px_-2px_6px_0px_rgba(0,0,0,0.25)]">
      <Link
        href="/"
        aria-label="홈"
        className="relative flex items-center justify-center"
        style={{ width: homeSize, height: homeSize }}
      >
        {active === "home" && (
          <span aria-hidden className={pillClass} style={{ backgroundColor: activeColor }} />
        )}
        <Image
          src={homeIcon === "outline" ? "/icons/home-outline.svg" : "/icons/home.svg"}
          alt=""
          width={homeSize}
          height={homeSize}
          className="relative"
        />
      </Link>
      <Link href="/camera" aria-label="플레이리스트 만들기">
        <Image src="/icons/plus.svg" alt="" width={37} height={37} />
      </Link>
      <Link
        href="/profile"
        aria-label="프로필"
        className="relative flex items-center justify-center"
        style={{ width: profileSize, height: profileSize }}
      >
        {active === "profile" && (
          <span aria-hidden className={pillClass} style={{ backgroundColor: activeColor }} />
        )}
        <Image
          src={profileIcon === "small" ? "/icons/profile-small.svg" : "/icons/profile.svg"}
          alt=""
          width={profileSize}
          height={profileSize}
          className="relative"
        />
      </Link>
    </nav>
  );
}

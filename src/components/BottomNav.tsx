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
  const activeClass = "flex h-12.75 w-19.5 items-center justify-center rounded-full";

  return (
    <nav className="flex h-18.5 shrink-0 items-center justify-around bg-white shadow-[0px_-2px_6px_0px_rgba(0,0,0,0.25)]">
      <Link
        href="/"
        aria-label="홈"
        className={active === "home" ? activeClass : undefined}
        style={active === "home" ? { backgroundColor: activeColor } : undefined}
      >
        <Image
          src={homeIcon === "outline" ? "/icons/home-outline.svg" : "/icons/home.svg"}
          alt=""
          width={homeIcon === "outline" ? 32 : 36}
          height={homeIcon === "outline" ? 32 : 36}
        />
      </Link>
      <Link href="/camera" aria-label="플레이리스트 만들기">
        <Image src="/icons/plus.svg" alt="" width={37} height={37} />
      </Link>
      <Link
        href="/profile"
        aria-label="프로필"
        className={active === "profile" ? activeClass : undefined}
        style={active === "profile" ? { backgroundColor: activeColor } : undefined}
      >
        <Image
          src={profileIcon === "small" ? "/icons/profile-small.svg" : "/icons/profile.svg"}
          alt=""
          width={profileIcon === "small" ? 25 : 34}
          height={profileIcon === "small" ? 25 : 34}
        />
      </Link>
    </nav>
  );
}

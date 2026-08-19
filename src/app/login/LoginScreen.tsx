
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageShell from "@/components/PageShell";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <PageShell className="bg-linear-to-br from-[#67469A] to-[#F73D88] px-3.5">
      {/* 디자인 좌표: 로고 y208 109x237, 입력 y515/y584, 버튼 y674, 링크 y759 */}
      <div className="mt-52 flex shrink-0 justify-center">
        <Image src="/icons/logo-mark.svg" alt="SoundScape" width={109} height={237} />
      </div>

      <div className="mt-17.5 flex flex-col gap-3">
        <input
          type="text"
          name="username"
          autoComplete="username"
          placeholder="아이디"
          className="h-14.25 rounded-[10px] bg-white px-5 text-center text-base text-[#1b1b1b] placeholder:text-[#7a7a7a]"
        />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="비밀번호"
          className="h-14.25 rounded-[10px] bg-white px-5 text-center text-base text-[#1b1b1b] placeholder:text-[#7a7a7a]"
        />

        {/* MVP 는 실제 인증이 없다. 명세대로 localStorage.userId 를 X-User-Id 로만 쓴다. */}
        <button
          type="button"
          onClick={() => router.replace("/")}
          className="mt-8.25 h-14.25 rounded-[10px] bg-[#67469a] text-base font-semibold text-white"
        >
          로그인
        </button>
      </div>

      <div className="mt-7 flex justify-center gap-16 text-sm font-medium text-white">
        {/* 디자인에 비밀번호 찾기 화면이 없어 이동 대상이 없다. */}
        <span>비밀번호 찾기</span>
        <Link href="/signup">회원가입</Link>
      </div>
    </PageShell>
  );
}

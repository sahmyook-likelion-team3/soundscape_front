
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageShell from "@/components/PageShell";
import {
  ApiError,
  login,
  setNickname,
  setUserId,
  setUsername as saveUsername,
} from "@/lib/api";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin() {
    if (!username || !password || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await login({ username, password });
      setUserId(res.userId);
      saveUsername(username);
      if (res.nickname) setNickname(res.nickname);
      router.replace("/");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "로그인에 실패했습니다.");
      setSubmitting(false);
    }
  }

  return (
    <PageShell className="bg-linear-to-br from-[#67469A] to-[#F73D88] px-3.5">
      {/* 디자인 좌표(Figma node 66:332, 403x877 프레임 기준): 로고 top208 109x237,
          입력그룹 top515(내부 gap12) + 버튼까지 outer gap33, 링크 top759.
          화면이 이 기준(877px)보다 작으면 스크롤로 나머지를 볼 수 있게 감쌈. */}
      <div className="no-scrollbar relative min-h-0 flex-1 overflow-y-auto">
        <div className="mt-52 flex shrink-0 justify-center">
          <Image src="/icons/logo-mark.svg" alt="SoundScape" width={109} height={237} />
        </div>

        <div className="mt-17.5 flex flex-col gap-8.25">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              name="username"
              autoComplete="username"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-14.25 rounded-[10px] bg-white px-5 text-center text-base text-[#1b1b1b] placeholder:text-[#7a7a7a]"
            />
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14.25 rounded-[10px] bg-white px-5 text-center text-base text-[#1b1b1b] placeholder:text-[#7a7a7a]"
            />
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={handleLogin}
            className="h-14.25 rounded-[10px] bg-[#67469a] text-base font-semibold text-white disabled:opacity-60"
          >
            {submitting ? "로그인 중..." : "로그인"}
          </button>
        </div>

        {error && (
          <p className="absolute top-184.75 right-3.5 left-3.5 text-center text-xs font-semibold text-white">
            {error}
          </p>
        )}

        <div className="mt-7 mb-6 flex justify-center gap-16 text-sm font-medium text-white">
          {/* 디자인에 비밀번호 찾기 화면이 없어 이동 대상이 없다. */}
          <span>비밀번호 찾기</span>
          <Link href="/signup">회원가입</Link>
        </div>
      </div>
    </PageShell>
  );
}

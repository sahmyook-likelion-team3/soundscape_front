/*
 * app/signup/SignupScreen.tsx 화면
 * Description : /signup — 회원가입 (1단계: 화면만 구현, API 연동은 다음 단계에서 진행)
 * Author       : 배서현
 * Created      : 2026-08-20
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PageShell from "@/components/PageShell";

const INPUT_CLASS =
  "h-13.5 w-full rounded-[10px] bg-[#eaeaea] px-4 text-center text-base font-semibold text-[#1b1b1b] placeholder:text-[#7a7a7a] focus:outline-none";

function LabeledField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-3.5">
      <p className="w-full text-sm font-semibold text-[#7a7a7a]">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={INPUT_CLASS}
      />
    </div>
  );
}

export default function SignupScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");

  const passwordsMatch =
    password.length > 0 && passwordConfirm.length > 0 && password === passwordConfirm;
  const isValid =
    username.trim().length > 0 && passwordsMatch && nickname.trim().length > 0;

  return (
    <PageShell>
      {/* Figma(node 53:290 / 53:349, 468:1180 / 469:1215와 동일) 원본 좌표 간격을 그대로 유지하되,
          기준점(닫기 버튼 top)은 PlayerScreen.tsx 등 흰 배경 화면의 상단 여백 관례(pt-18 = 72px)에 맞춤 */}
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        <div className="relative min-h-215.75 w-full">
          <button
            type="button"
            aria-label="닫기"
            onClick={() => router.back()}
            className="absolute top-18 left-4.75"
          >
            <Image src="/icons/close.svg" alt="" width={16} height={15.5} />
          </button>

          <h1 className="absolute inset-x-0 top-28.5 text-center text-xl font-semibold text-[#1b1b1b]">
            회원가입
          </h1>

          <div className="absolute top-54.75 left-4 w-92.5">
            <LabeledField
              label="아이디"
              value={username}
              onChange={setUsername}
              placeholder="아이디"
            />
          </div>

          <div className="absolute top-87.25 left-4 flex w-92.5 flex-col items-start gap-3.5">
            <p className="w-full text-sm font-semibold text-[#7a7a7a]">비밀번호</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className={INPUT_CLASS}
            />
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="비밀번호 확인"
              className={INPUT_CLASS}
            />
          </div>
          <p className="absolute top-128.5 left-4.75 text-xs font-semibold text-[#f73d88]">
            {passwordsMatch ? "확인되었습니다." : ""}
          </p>

          <div className="absolute top-144 left-4 w-92.5">
            <LabeledField
              label="닉네임"
              value={nickname}
              onChange={setNickname}
              placeholder="닉네임을 입력해주세요."
            />
          </div>

          <button
            type="button"
            disabled={!isValid}
            className={`absolute top-184.25 left-4 h-14.25 w-92.5 rounded-[10px] text-base font-semibold text-white transition-colors ${
              isValid ? "bg-[#f73d88]" : "bg-[#7a7a7a]"
            }`}
          >
            가입하기
          </button>
        </div>
      </div>
    </PageShell>
  );
}

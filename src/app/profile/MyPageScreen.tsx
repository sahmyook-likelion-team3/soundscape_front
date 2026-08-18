/*
 * app/profile/MyPageScreen.tsx 화면
 * Description : /profile — 마이페이지 (로그인, Premium, 계정/고객지원 메뉴)
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-06
 * Last Update  : 2026-08-06
 */

import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BottomNav from "@/components/BottomNav";

const menuSections = [
  ["로그아웃", "회원 탈퇴", "비밀번호 변경"],
  ["premium 관리"],
  ["고객센터", "개인정보 처리방침", "약관 및 정책"],
];

export default function MyPageScreen() {
  return (
    <PageShell>
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto bg-[#fafafa] px-4 pt-24.25">
        <h1 className="mb-7 text-2xl font-bold text-black">마이페이지</h1>

        <div className="flex h-32.25 items-center justify-between rounded-[10px] border-2 border-[#c7c7c7] bg-white px-4">
          <div className="flex items-center gap-4">
            <div className="flex h-20.25 w-20.25 items-center justify-center rounded-full bg-[#c6c6c6]">
              <Image src="/icons/profile-login-arrow.svg" alt="" width={30} height={35} />
            </div>
            <p className="text-lg font-semibold text-[#757575]">로그인 해주세요</p>
          </div>
          <Link
            href="/login"
            className="rounded-full bg-[#c6c6c6] px-4.5 py-1.5 text-xs font-medium text-[#474747]"
          >
            로그인
          </Link>
        </div>

        <button
          type="button"
          className="mt-5 flex h-8.25 w-full items-center justify-center rounded-full bg-linear-to-r from-[#F73D88] to-[#67469A] text-xs font-semibold text-white"
        >
          Premium 가입하기
        </button>

        <div className="mt-7 -mx-4">
          {menuSections.map((section, index) => (
            <div
              key={index}
              className={index > 0 ? "border-t border-[#e5e5e5]" : undefined}
            >
              {section.map((label) => (
                <button
                  key={label}
                  type="button"
                  className={`flex h-12 w-full items-center px-4 text-left text-base ${
                    label === "premium 관리"
                      ? "font-semibold text-[#67469a]"
                      : "font-medium text-[#696969]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="profile" homeIcon="outline" profileIcon="small" />
    </PageShell>
  );
}

/*
 * app/camera/CameraScreen.tsx 화면
 * Description : /camera — 카메라 촬영 후 사진 기반 추천 시작 (디자인 프레임 289:685)
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-19
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import { startPhotoRecommendation } from "@/lib/recommendation";

type Facing = "environment" | "user";

export default function CameraScreen() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [facing, setFacing] = useState<Facing>("environment");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    // getUserMedia 는 https 또는 localhost 에서만 동작한다.
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: facing } })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = s;
        setReady(true);
        setError(null);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => {
        if (cancelled) return;
        setReady(false);
        setError("카메라를 열 수 없어요. 사진을 직접 선택해주세요.");
      });

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [facing]);

  const start = (file: File) => {
    startPhotoRecommendation(file);
    router.push("/analyzing");
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video || !ready) {
      inputRef.current?.click();
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("촬영에 실패했어요. 다시 시도해주세요.");
          return;
        }
        start(new File([blob], "photo.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.9,
    );
  };

  return (
    <PageShell>
      <div className="h-14.5 shrink-0 bg-white" />

      <div className="relative flex-1 overflow-hidden bg-[#d9d9d9]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full object-cover ${
            facing === "user" ? "-scale-x-100" : ""
          } ${ready ? "" : "invisible"}`}
        />

        {error && (
          <p className="absolute inset-x-8 top-1/2 -translate-y-1/2 text-center text-sm font-medium text-[#7a7a7a]">
            {error}
          </p>
        )}

        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => router.back()}
          className="absolute top-5.75 left-4"
        >
          <Image src="/icons/chevron-left-black.svg" alt="" width={11} height={20} />
        </button>
      </div>

      <div className="relative flex h-25.75 items-center justify-center bg-white">
        {/* 카메라를 못 쓰는 환경(데스크톱·권한 거부)에서는 파일 선택으로 대체한다. */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) start(file);
          }}
          className="hidden"
        />

        <button
          type="button"
          aria-label="촬영하기"
          onClick={capture}
          className="flex h-14.75 w-14.75 items-center justify-center"
        >
          <Image src="/icons/shutter-button.svg" alt="" width={59} height={59} />
        </button>

        <button
          type="button"
          aria-label="카메라 전환"
          onClick={() => setFacing((f) => (f === "user" ? "environment" : "user"))}
          disabled={!ready}
          className="absolute right-8 flex h-8.75 w-8.75 items-center justify-center rounded-full bg-[#1b1b1b] disabled:opacity-40"
        >
          <Image src="/icons/flip-camera-icon.svg" alt="" width={16} height={16} />
        </button>
      </div>
    </PageShell>
  );
}

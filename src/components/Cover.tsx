/*
 * components/Cover.tsx 컴포넌트
 * Description : 플레이리스트 커버 이미지. S3 Presigned URL 은 만료·쿼리스트링 때문에
 *               next/image 최적화를 거치지 않고 <img> 로 그대로 띄운다.
 */

import Image from "next/image";

export default function Cover({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes?: string;
}) {
  if (src.startsWith("http")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className="h-full w-full object-cover" />;
  }
  return <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />;
}

/*
 * app/playlists/[id]/page.tsx 라우트
 * Description : 플레이리스트 상세 화면(/playlists/[id]) 라우트 진입점
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-05
 * Last Update  : 2026-08-06
 */

import PlaylistScreen from "./PlaylistScreen";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PlaylistScreen id={id} />;
}

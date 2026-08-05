/*
 * app/library/empty/page.tsx 라우트
 * Description : /library/empty — 보관함 빈 상태 미리보기 (임시 데모용, playlists=[])
 * Author       : 배서현
 * Contributors :
 * Created      : 2026-08-06
 * Last Update  : 2026-08-06
 */

import LibraryScreen from "../LibraryScreen";

export default function Page() {
  return <LibraryScreen playlists={[]} />;
}

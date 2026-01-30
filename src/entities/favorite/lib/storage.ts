import { readJson, writeJson } from "../../../shard/lib/storage";
import type { FavoritePlace } from "../model/type";

const KEY = "rt_favorites_v1";
const MAX = 6;
const EVENT = "rt:favorites_changed";

export function getFavorites(): FavoritePlace[] {
  return readJson<FavoritePlace[]>(KEY, []);
}

function emitChanged() {
  window.dispatchEvent(new Event(EVENT));
}

export function setFavorites(items: FavoritePlace[]) {
  writeJson(KEY, items);
  emitChanged(); // 같은 탭에서도 알림
}

export function addFavorite(next: FavoritePlace) {
  const list = getFavorites();

  const exists = list.some(
    (x) => (x.lat === next.lat && x.lon === next.lon) || x.label === next.label
  );
  if (exists) return { ok: false as const, reason: "exists" as const };

  if (list.length >= MAX)
    return { ok: false as const, reason: "limit" as const };

  setFavorites([next, ...list]); // 내부에서 emitChanged
  return { ok: true as const };
}

export const favoritesChangedEventName = EVENT;

export function updateFavoriteAlias(id: string, alias: string) {
  const list = getFavorites();
  const next = list.map((f) => (f.id === id ? { ...f, alias } : f));
  setFavorites(next); // 이벤트 자동 발행
}

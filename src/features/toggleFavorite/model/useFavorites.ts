import { useCallback, useEffect, useMemo, useState } from "react";
import {
  favoritesChangedEventName,
  getFavorites,
  setFavorites,
  updateFavoriteAlias,
  type FavoritePlace,
} from "../../../entities/favorite";

const MAX = 6;

export function useFavorites() {
  const [favorites, setLocal] = useState<FavoritePlace[]>(() => {
    // 초기 1회만 localStorage 읽기
    if (typeof window === "undefined") return [];
    return getFavorites();
  });

  const isFavorited = useCallback(
    (lat: number, lon: number) =>
      favorites.some((f) => f.lat === lat && f.lon === lon),
    [favorites]
  );

  const add = useCallback((item: FavoritePlace) => {
    setLocal((prev) => {
      const exists = prev.some(
        (x) =>
          (x.lat === item.lat && x.lon === item.lon) || x.label === item.label
      );
      if (exists) return prev;
      if (prev.length >= MAX) return prev;

      const next = [item, ...prev];
      setFavorites(next); // localStorage 저장
      return next;
    });
    return { ok: true as const };
  }, []);

  const remove = useCallback((lat: number, lon: number) => {
    setLocal((prev) => {
      const next = prev.filter((f) => !(f.lat === lat && f.lon === lon));
      setFavorites(next);
      return next;
    });
    return { ok: true as const };
  }, []);

  /**
   * 별칭 업데이트
   */
  const updateAlias = useCallback((id: string, alias: string) => {
    updateFavoriteAlias(id, alias);
  }, []);

  // 다른 탭에서 변경됐을 때 동기화 (같은 탭에서는 onClick에서 바로 setLocal 함)
  useEffect(() => {
    const sync = () => setLocal(getFavorites());

    // ✅ 다른 탭 변경 감지
    window.addEventListener("storage", sync);

    // ✅ 같은 탭 변경 감지(우리가 발행하는 커스텀 이벤트)
    window.addEventListener(favoritesChangedEventName, sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(favoritesChangedEventName, sync);
    };
  }, []);

  return useMemo(
    () => ({ favorites, isFavorited, add, remove, updateAlias }),
    [favorites, isFavorited, add, remove, updateAlias]
  );
}

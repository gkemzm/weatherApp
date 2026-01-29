import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../../features/toggleFavorite";
import type { FavoritePlace } from "../../../entities/favorite";
import type { WeatherSummary } from "../../../entities/weather";
import { useState } from "react";

interface Props {
  summary: WeatherSummary;
}

export function HomeFavoriteListPanel({ summary }: Props) {
  const navigate = useNavigate();
  const { favorites, remove, updateAlias } = useFavorites();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [value, setValue] = useState("");

  const startEdit = (fav: FavoritePlace) => {
    setEditingId(fav.id);
    setValue(fav.alias ?? fav.label);
  };

  const save = (id: string) => {
    const next = value.trim();
    if (!next) return;
    updateAlias(id, next);
    setEditingId(null);
  };

  if (favorites.length === 0) {
    return (
      <section className="w-full rounded-2xl border bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold">즐겨찾기</div>
        <div className="mt-2 text-sm text-gray-500">
          아직 즐겨찾기가 없어요. 지역을 검색한 뒤 “즐겨찾기 추가”를 눌러보세요.
        </div>
      </section>
    );
  }
  return (
    <section className="w-full rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">즐겨찾기</div>
          <div className="mt-1 text-xs text-gray-500">
            최대 6개까지 저장됩니다.
          </div>{" "}
          <div className="mt-1 text-xs text-gray-500">
            별칭 추가/수정시 엔터를 눌러주세요.
          </div>
        </div>

        <div className="text-xs text-gray-500">{favorites.length} / 6</div>
      </div>

      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {favorites.map((fav, idx: number) => {
          const isEditing = editingId === fav.id;
          const displayName = fav.alias
            ? `${fav.label} (${fav.alias})`
            : fav.label;

          return (
            <li key={fav.id} className="rounded-2xl border p-3">
              {/* 이름 영역 */}
              {isEditing ? (
                <input
                  autoFocus
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") save(fav.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="w-full rounded-lg border px-2 py-1 text-sm"
                />
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() =>
                      navigate(`/weather?q=${encodeURIComponent(fav.q)}`)
                    }
                    className="truncate text-left text-sm font-semibold"
                  >
                    {displayName}
                  </button>

                  <button
                    onClick={() => startEdit(fav)}
                    className="text-xs text-gray-500 hover:underline"
                  >
                    별칭 추가/수정
                  </button>
                </div>
              )}

              <div className="mt-1 text-xs text-gray-500">
                최고: {Math.round(summary.todayMax)}°, 최저:{" "}
                {Math.round(summary.todayMin)}°
              </div>

              {/* 액션 */}
              <div className="mt-3 flex justify-between">
                <button
                  onClick={() => navigate(`/weather?fIdx=${idx}`)}
                  className="rounded-xl border px-3 py-2 text-sm"
                >
                  상세보기
                </button>

                <button
                  onClick={() => remove(fav.lat, fav.lon)}
                  className="rounded-xl px-3 py-2 text-sm font-semibold"
                  style={{ backgroundColor: "red", color: "#ffffff" }}
                >
                  삭제
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

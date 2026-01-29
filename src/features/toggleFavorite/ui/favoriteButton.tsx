import { useFavorites } from "../model/useFavorites";

interface Props {
  label: string; // 한글 표시
  q: string;
  lat: number;
  lon: number;
}

export function FavoriteButton({ label, q, lat, lon }: Props) {
  const { isFavorited, add, remove } = useFavorites();
  const active = isFavorited(lat, lon);

  const onClick = () => {
    if (active) {
      remove(lat, lon);
      return;
    }

    add({
      id: `${lat},${lon}`,
      label,
      q,
      lat,
      lon,
      createdAt: Date.now(),
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl px-3 py-2 text-sm font-semibold hover:opacity-90"
      style={{
        backgroundColor: active ? "#111827" : "#10b259",
        color: "#ffffff",
      }}
    >
      {active ? "즐겨찾기 해제" : "즐겨찾기 추가"}
    </button>
  );
}

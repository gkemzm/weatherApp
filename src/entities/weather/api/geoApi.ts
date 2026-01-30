import type { GeoLocation } from "../model/type";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
const BASE = "https://api.openweathermap.org/geo/1.0/direct";

async function requestDirect(q: string, limit = 5): Promise<GeoLocation[]> {
  const url = new URL(BASE);
  url.searchParams.set("q", q);
  url.searchParams.set("limit", String(limit)); // 여러 후보 받기
  url.searchParams.set("appid", API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Geocoding 호출 실패");

  const arr = await res.json();
  return (arr ?? []).map((x: any) => ({
    name: x.name,
    lat: x.lat,
    lon: x.lon,
    country: x.country,
    state: x.state,
  }));
}

function buildFallbackQueries(input: string) {
  const base = input.trim().replace(/\s+/g, " ");
  // "서울특별시 은평구 갈현동" 같은 입력을 단계적으로 줄이기
  const parts = base.split(" ");
  const candidates: string[] = [];

  // 1) 원문 + KR
  candidates.push(`${base},KR`);

  // 2) 뒤에서부터 하나씩 제거 + KR
  for (let i = parts.length - 1; i >= 2; i--) {
    candidates.push(`${parts.slice(0, i).join(" ")},KR`);
  }

  // 3) 최종적으로 첫 토큰만(예: "서울특별시") + KR
  candidates.push(`${parts[0]},KR`);

  // 중복 제거
  return Array.from(new Set(candidates));
}

// 가장 먼저 매칭되는 결과 리스트
export async function fetchGeoCandidates(q: string): Promise<GeoLocation[]> {
  const fallbacks = buildFallbackQueries(q);

  for (const fq of fallbacks) {
    const list = await requestDirect(fq, 5);
    if (list.length > 0) return list;
  }

  return [];
}

export async function fetchGeoLocation(q: string): Promise<GeoLocation | null> {
  const list = await fetchGeoCandidates(q);
  return list[0] ?? null;
}

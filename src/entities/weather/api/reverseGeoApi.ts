import type { GeoLocation } from "../model/type";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
const BASE = "https://api.openweathermap.org/geo/1.0/reverse";

export async function fetchReverseGeo(params: {
  lat: number;
  lon: number;
  limit?: number;
}): Promise<GeoLocation | null> {
  const url = new URL(BASE);
  url.searchParams.set("lat", String(params.lat));
  url.searchParams.set("lon", String(params.lon));
  url.searchParams.set("limit", String(params.limit ?? 1));
  url.searchParams.set("appid", API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Reverse geocoding 호출 실패");

  const arr = await res.json();
  if (!arr?.length) return null;

  const first = arr[0];
  return {
    name: first.name,
    lat: first.lat,
    lon: first.lon,
    country: first.country,
    state: first.state,
  };
}

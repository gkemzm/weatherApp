import type { Weather } from "../model/type";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
const BASE = "https://api.openweathermap.org/data/2.5/weather"; // :contentReference[oaicite:4]{index=4}

export async function fetchCurrentWeather(params: {
  lat: number;
  lon: number;
}): Promise<Weather> {
  const url = new URL(BASE);
  url.searchParams.set("lat", String(params.lat));
  url.searchParams.set("lon", String(params.lon));
  url.searchParams.set("appid", API_KEY);
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "kr");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("날씨 호출 실패");

  const data = await res.json();

  return {
    cityName: data.name,
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    description: data.weather?.[0]?.description ?? "",
    icon: data.weather?.[0]?.icon ?? "01d",
    etc: data,
  };
}

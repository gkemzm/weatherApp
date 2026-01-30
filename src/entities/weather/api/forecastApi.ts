const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
const BASE = "https://api.openweathermap.org/data/2.5/forecast"; // 5 day / 3 hour forecast :contentReference[oaicite:3]{index=3}

type ForecastItem = {
  dt: number;
  dt_txt: string;
  main: { temp: number };
  weather: { description: string; icon: string }[];
};

type ForecastResponse = {
  list: ForecastItem[];
};

/**
 * openweathermap 기반 api호출
 * @param params 위도/경도
 * @returns
 */
export async function fetchForecast(params: {
  lat: number;
  lon: number;
}): Promise<ForecastResponse> {
  const url = new URL(BASE);
  url.searchParams.set("lat", String(params.lat));
  url.searchParams.set("lon", String(params.lon));
  url.searchParams.set("appid", API_KEY);
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "kr");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Forecast 호출 실패");
  return res.json();
}

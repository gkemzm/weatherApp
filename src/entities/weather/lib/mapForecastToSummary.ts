import type { WeatherSummary } from "../model/type";

function ymdKST(d: Date) {
  const kst = new Date(d.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const y = kst.getFullYear();
  const m = String(kst.getMonth() + 1).padStart(2, "0");
  const day = String(kst.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function mapForecastToSummary(forecast: any): WeatherSummary {
  const list = forecast.list as any[];

  // 오늘(KST) 기준으로 필터
  const today = ymdKST(new Date());
  const todayItems = list.filter((it) => String(it.dt_txt).startsWith(today));

  // fallback: 오늘 데이터가 없으면 그냥 첫날 기준
  const baseItems = todayItems.length ? todayItems : list;

  // 시간대별(오늘 기준, 예: 최대 8개만)
  const hourly = baseItems.slice(0, 8).map((it) => ({
    dt: it.dt,
    timeText: it.dt_txt,
    temp: it.main.temp,
  }));

  // 당일 최저/최고
  const temps = baseItems.map((it) => it.main.temp);
  const todayMin = Math.min(...temps);
  const todayMax = Math.max(...temps);

  // “현재”는 가장 가까운 예보(첫 항목)로 사용
  const first = list[0];
  const currentTemp = first.main.temp;
  const description = first.weather?.[0]?.description ?? "";
  const icon = first.weather?.[0]?.icon ?? "01d";

  return {
    currentTemp,
    todayMin,
    todayMax,
    description,
    icon,
    hourly,
  };
}

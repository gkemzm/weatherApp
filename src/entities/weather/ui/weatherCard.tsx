import type { GeoLocation, WeatherSummary } from "../model/type";

interface Props {
  query: string;
  geo: GeoLocation;
  summary: WeatherSummary;
}

export function WeatherCard({ query, geo, summary }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-sm font-medium">{query}</div>
      <div className="text-xs text-gray-500">
        ({geo.lat.toFixed(4)}, {geo.lon.toFixed(4)})
      </div>

      <div className="mt-4 flex items-center gap-3">
        <img
          className="h-14 w-14"
          src={`https://openweathermap.org/img/wn/${summary.icon}@2x.png`}
          alt={summary.description}
        />
        <div>
          <div className="text-3xl font-bold">
            {Math.round(summary.currentTemp)}°C
          </div>
          <div className="text-sm text-gray-500">
            최저 {Math.round(summary.todayMin)}° / 최고{" "}
            {Math.round(summary.todayMax)}°
          </div>
          <div className="text-sm text-gray-700">{summary.description}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold text-gray-700 mb-2">
          시간대별 기온
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {summary.hourly.map((h) => {
            // "YYYY-MM-DD HH:MM:SS"에서 HH만 뽑기
            const hh = h.timeText.slice(11, 13);
            return (
              <div
                key={h.dt}
                className="min-w-[64px] rounded-xl border px-2 py-2 text-center"
              >
                <div className="text-xs text-gray-500">{hh}시</div>
                <div className="text-sm font-semibold">
                  {Math.round(h.temp)}°
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

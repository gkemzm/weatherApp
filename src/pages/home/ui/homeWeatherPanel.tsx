import type { GeoLocation, WeatherSummary } from "../../../entities/weather";
import { FavoriteButton } from "../../../features/toggleFavorite";

interface Props {
  queryLabel: string; // 한글 표시용
  geo?: GeoLocation; // 좌표 표시용(옵션)
  summary: WeatherSummary;

  onClear?: () => void; // (옵션) 검색 초기화/홈 초기화
}

export function HomeWeatherPanel({ queryLabel, geo, summary, onClear }: Props) {
  return (
    <section className="w-full rounded-2xl border bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-gray-500">선택한 지역</div>
          <div className="mt-1 truncate text-base font-semibold">
            {queryLabel}
          </div>
          {geo && (
            <div className="mt-1 text-xs text-gray-500">
              {geo.lat.toFixed(4)}, {geo.lon.toFixed(4)}
            </div>
          )}
        </div>
        {geo && (
          <div className="flex gap-2">
            <FavoriteButton
              label={queryLabel}
              q={queryLabel}
              lat={geo.lat}
              lon={geo.lon}
            />
            {onClear ? (
              <button
                type="button"
                onClick={onClear}
                className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
              >
                초기화
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Main temperature + min/max */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            className="h-14 w-14"
            src={`https://openweathermap.org/img/wn/${summary.icon}@2x.png`}
            alt={summary.description}
          />

          <div>
            <div className="text-xs text-gray-500">현재</div>
            <div className="mt-1 text-3xl font-bold leading-none">
              {Math.round(summary.currentTemp)}°C
            </div>
            <div className="mt-1 text-sm text-gray-700">
              {summary.description}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gray-50 px-4 py-3 text-right">
          <div className="text-xs text-gray-500">오늘</div>
          <div className="mt-1 text-sm">
            <span className="text-gray-500">최저</span>{" "}
            <span className="font-semibold">
              {Math.round(summary.todayMin)}°
            </span>
          </div>
          <div className="mt-1 text-sm">
            <span className="text-gray-500">최고</span>{" "}
            <span className="font-semibold">
              {Math.round(summary.todayMax)}°
            </span>
          </div>
        </div>
      </div>

      {/* Hourly temperatures */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-800">
            시간대별 기온
          </div>
          <div className="text-xs text-gray-500">3시간 간격</div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {summary.hourly.map((h) => {
            const hh = h.timeText.slice(11, 13);
            return (
              <div
                key={h.dt}
                className="min-w-[72px] rounded-2xl border bg-white px-3 py-3 text-center"
              >
                <div className="text-xs text-gray-500">{hh}시</div>
                <div className="mt-1 text-base font-semibold">
                  {Math.round(h.temp)}°
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

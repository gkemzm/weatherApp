import { useNavigate, useSearchParams } from "react-router-dom";
import { useGeoQuery, useWeatherQuery } from "../../../entities/weather";
import { useFavorites } from "../../../features/toggleFavorite";
import { HomeFavoriteListPanel } from "../../home/ui/homeFavoriteListPanel";

export function WeatherDetailPage() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const q = sp.get("fIdx") ?? "";

  const { favorites } = useFavorites();
  const targetItem = favorites[Number(q)];
  // 1) q -> 좌표
  const geo = useGeoQuery(targetItem.label, q.length > 0);
  // 2) 좌표 -> 날씨
  const lat = targetItem?.lat;
  const lon = targetItem?.lon;
  const weather = useWeatherQuery(lat, lon, !!geo.data);

  const onClickHome = () => {
    navigate(`/home`);
  };
  return (
    <div className="flex flex-col gap-2 p-4">
      {targetItem && (
        <>
          <div className="flex justify-between pr-4 bg-white items-center">
            <div className="text-sm text-gray-500  p-4">
              {targetItem.label} ({targetItem.lat.toFixed(4)},{" "}
              {targetItem.lon.toFixed(4)})
            </div>
            <button
              onClick={onClickHome}
              className="text-sm p-1.5 bg-[#10b259] text-white rounded-[8px] font-medium h-fit hover:opacity-90"
            >
              홈으로
            </button>
          </div>
          {weather.data && (
            <div className="rounded-xl border p-4 shadow-sm bg-white">
              <div className="text-lg font-semibold">{targetItem.label}</div>
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.data.icon}@2x.png`}
                  alt={weather.data.description}
                />
                <div>
                  <div className="text-2xl font-bold">
                    {weather.data.currentTemp}°C
                  </div>
                  <div className="text-sm text-gray-500">
                    최고온도 {weather.data.todayMax}°C · 최저온도{" "}
                    {weather.data.todayMin}°C
                  </div>
                </div>
              </div>
              <div className="mt-2 text-[20px] text-[#2c2727bd] font-semibold">
                {weather.data.description}{" "}
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-800">
                    시간대별 기온
                  </div>
                  <div className="text-xs text-gray-500">3시간 간격</div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {weather.data.hourly.map((h) => {
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
            </div>
          )}
        </>
      )}
      <div>
        {weather.data && <HomeFavoriteListPanel summary={weather.data} />}
      </div>
    </div>
  );
}

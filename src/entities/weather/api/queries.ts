import { useQuery } from "@tanstack/react-query";
import { fetchGeoLocation } from "./geoApi";
// import { fetchCurrentWeather } from "./weatherApi";
import { queryToast } from "../../../shard/lib/queryToast";
import { fetchReverseGeo } from "./reverseGeoApi";
import type { WeatherSummary } from "../model/type";
import { fetchForecast } from "./forecastApi";
import { mapForecastToSummary } from "../lib/mapForecastToSummary";
/**
 * geoApi활용 지역검색
 * @param q 검색된 지역 queryString
 * @param enabled
 * @returns
 */
export function useGeoQuery(q: string, enabled: boolean) {
  return useQuery({
    queryKey: ["geo", q],
    enabled,
    queryFn: async () => {
      queryToast.loading("geo", "위치를 찾는 중입니다...");
      const data = await fetchGeoLocation(q);
      if (!data) {
        queryToast.error("geo", "해당 장소의 정보가 제공되지 않습니다.");
        return null;
      }
      queryToast.success("geo");
      return data;
    },
    staleTime: 1000 * 60 * 60,
  });
}

/**
 * 날씨정보 조회
 * @param lat 위도
 * @param lon 경도
 * @param enabled
 * @returns
 */
export function useWeatherQuery(lat?: number, lon?: number, enabled?: boolean) {
  const canRun = enabled && typeof lat === "number" && typeof lon === "number";

  return useQuery<WeatherSummary>({
    queryKey: ["forecast-summary", lat, lon],
    enabled: Boolean(canRun),
    queryFn: async () => {
      const forecast = await fetchForecast({ lat: lat!, lon: lon! });
      return mapForecastToSummary(forecast);
    },
    staleTime: 1000 * 60 * 5,
  });
}

// export function useWeatherQuery(lat?: number, lon?: number, enabled?: boolean) {
//   return useQuery({
//     queryKey: ["weather", lat, lon],
//     enabled: Boolean(enabled && lat && lon),
//     queryFn: async () => {
//       queryToast.loading("weather", "날씨 정보를 불러오는 중...");
//       const data = await fetchCurrentWeather({ lat: lat!, lon: lon! });
//       queryToast.success("weather");
//       return data;
//     },
//     staleTime: 1000 * 60 * 5,
//   });
// }

/**
 * 현위치 정보 가져오기
 * @param lat 위도
 * @param lon 경도
 * @param enabled 동작여부
 * @returns
 */
export function useReverseGeoQuery(
  lat?: number,
  lon?: number,
  enabled?: boolean
) {
  const canRun = enabled && typeof lat === "number" && typeof lon === "number";

  return useQuery({
    queryKey: ["reverse-geo", lat, lon],
    queryFn: () => fetchReverseGeo({ lat: lat!, lon: lon!, limit: 1 }),
    enabled: Boolean(canRun),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });
}

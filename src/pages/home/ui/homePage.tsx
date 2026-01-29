import type { Place } from "../../../entities/place";
import { SearchPlaceInput } from "../../../features/searchPlace";
import {
  useGeoQuery,
  useReverseGeoQuery,
  useWeatherQuery,
  // WeatherCard,
} from "../../../entities/weather";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useCurrentPosition } from "../../../features/detectLocation/useCurrentPosition";
import { HomeFavoriteListPanel } from "./homeFavoriteListPanel";
import { HomeWeatherPanel } from "./homeWeatherPanel";

export function HomePage() {
  // 최초1회 탐지용 ref
  const initializedRef = useRef(false);
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  // 현위치
  const { coords, request } = useCurrentPosition();

  // 좌표 -> 장소명(Reverse Geo)
  const reverse = useReverseGeoQuery(coords?.lat, coords?.lon, !!coords);

  // 지역명 받아오기(queryString) + 평탄화
  const q = (sp.get("q") ?? "").trim().endsWith("군")
    ? (sp.get("q") ?? "").trim().replace(/군$/, "")
    : (sp.get("q") ?? "").trim();
  // 1) q -> 좌표
  const geo = useGeoQuery(q, q.length > 0);

  // 2) 좌표 -> 날씨
  const lat = geo.data?.lat;
  const lon = geo.data?.lon;
  const weather = useWeatherQuery(lat, lon, !!geo.data);

  const onSelect = (place: Place) => {
    const nextQ = place.label;
    navigate(`/home?q=${encodeURIComponent(nextQ)}`);
  };

  const onSearch = (query: string) => {
    navigate(`/home?q=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    if (initializedRef.current) return;

    // q가 이미 있으면(검색으로 들어온 경우) 자동 초기화 불필요
    if (q) {
      initializedRef.current = true;
      return;
    }

    // 아직 coords 없으면 요청
    if (!coords && !reverse.isFetching && !reverse.data) {
      request();
      return;
    }

    // reverse 결과가 오면 q 세팅(홈에 결과 표시)
    if (reverse.data?.name) {
      initializedRef.current = true;

      // name만 넣으면 약할 때가 있어 state/country도 같이
      const label = `${reverse.data.name}${
        reverse.data.state ? " " + reverse.data.state : ""
      },KR`;
      navigate(`/home?q=${encodeURIComponent(label)}`, { replace: true });
    }
  }, [q, coords, reverse.data, reverse.isFetching, request, navigate]);

  return (
    <div className="w-full p-4 flex-col gap-4">
      <SearchPlaceInput onSelect={onSelect} onSearch={onSearch} />
      <div className="py-2">
        {geo.data && weather.data && (
          <HomeWeatherPanel
            queryLabel={q}
            geo={geo.data}
            summary={weather.data}
            onClear={() => navigate("/home", { replace: true })}
          />
        )}
      </div>
      {weather.data && <HomeFavoriteListPanel summary={weather.data} />}

      {/* {geo.data && weather.data && (
        <div className="bg-[#bebebe] w-96 h-96 my-4">
          <WeatherCard query={q} geo={geo.data} summary={weather.data} />
        </div>
      )} */}
    </div>
  );
}

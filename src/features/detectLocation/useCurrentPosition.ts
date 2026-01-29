import { useCallback, useState } from "react";

type Coords = { lat: number; lon: number };

export function useCurrentPosition() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setError("이 브라우저는 위치 기능을 지원하지 않습니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setIsLoading(false);
      },
      (err) => {
        // 권한 거부/타임아웃/기타
        setError(err.message || "위치 정보를 가져오지 못했습니다.");
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 60_000,
      }
    );
  }, []);

  return { coords, error, isLoading, request };
}

export interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
}

export interface Weather {
  cityName: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  etc?: any;
}

export interface HourlyTemp {
  dt: number; // unix
  timeText: string; // "2026-01-28 12:00:00"
  temp: number;
}

export interface WeatherSummary {
  // 화면에 필요한 형태로 가공된 결과
  currentTemp: number;
  todayMin: number;
  todayMax: number;
  description: string;
  icon: string;
  hourly: HourlyTemp[]; // 시간대별(예: 오늘 0~23시 중 일부)
}

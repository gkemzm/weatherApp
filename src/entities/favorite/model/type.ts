export interface FavoritePlace {
  id: string; // 고유키
  label: string; // 지역명
  alias?: string; // 별칭
  q: string; // 검색어(geo용) - label과 동일하게 써도 됨
  lat: number;
  lon: number;
  createdAt: number;
}

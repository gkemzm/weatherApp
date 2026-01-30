export type PlaceLevel = "SIDO" | "SIGUNGU" | "DONG";

export interface Place {
  /** 원본 문자열 (예: "서울특별시-종로구-청운동") */
  raw: string;
  /** "-" 를 " "로 바꾼 표시용 텍스트 */
  label: string;

  sido: string;
  sigungu?: string;
  dong?: string;

  level: PlaceLevel;
}

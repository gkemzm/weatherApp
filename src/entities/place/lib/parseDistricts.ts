import rawDistricts from "../assets/korea_districts.json";
import type { Place, PlaceLevel } from "../model/types";

function detectLevel(parts: string[]): PlaceLevel {
  if (parts.length >= 3) return "DONG";
  if (parts.length === 2) return "SIGUNGU";
  return "SIDO";
}

export function parseDistricts(): Place[] {
  // rawDistricts: string[]
  return (rawDistricts as string[]).map((raw) => {
    const parts = raw.split("-");
    const [sido, sigungu, dong] = parts;
    const level = detectLevel(parts);

    return {
      raw,
      label: parts.join(" "),
      sido,
      sigungu,
      dong,
      level,
    };
  });
}

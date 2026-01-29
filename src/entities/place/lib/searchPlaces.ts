import type { Place } from "../model/types";
import { normalizeText } from "./normalizeText";

export interface SearchPlacesOptions {
  limit?: number; // 기본 20
  minQueryLength?: number; // 기본 1
}

export function searchPlaces(
  places: Place[],
  query: string,
  opts: SearchPlacesOptions = {}
): Place[] {
  const limit = opts.limit ?? 20;
  const minQueryLength = opts.minQueryLength ?? 1;

  const q = normalizeText(query);
  if (q.length < minQueryLength) return [];

  const out: Place[] = [];
  for (const p of places) {
    // label 기준 검색 (공백/대소문자/하이픈 정규화)
    if (normalizeText(p.label).includes(q)) {
      out.push(p);
      if (out.length >= limit) break;
    }
  }
  return out;
}

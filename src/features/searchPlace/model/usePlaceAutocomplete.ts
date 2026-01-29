import { useMemo, useState } from "react";
import { useDebouncedValue } from "../../../entities/place/lib/useDebouncedValue";
import {
  parseDistricts,
  searchPlaces,
  type Place,
} from "../../../entities/place";

interface UsePlaceAutocompleteOptions {
  debounceMs?: number;
  limit?: number;
  minQueryLength?: number;
}

export function usePlaceAutocomplete(
  options: UsePlaceAutocompleteOptions = {}
) {
  const debounceMs = options.debounceMs ?? 150;
  const limit = options.limit ?? 20;
  const minQueryLength = options.minQueryLength ?? 1;

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, debounceMs);

  // 데이터 파싱은 1회
  const places = useMemo(() => parseDistricts(), []);

  // 검색도 debouncedQuery 기준으로만
  const results: Place[] = useMemo(() => {
    return searchPlaces(places, debouncedQuery, { limit, minQueryLength });
  }, [places, debouncedQuery, limit, minQueryLength]);

  return {
    query,
    setQuery,
    debouncedQuery,
    results,
  };
}

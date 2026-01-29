import { useEffect, useRef, useState } from "react";

import { usePlaceAutocomplete } from "../model/usePlaceAutocomplete";
import type { Place } from "../../../entities/place";
import { PlaceAutocompleteList } from "./placeAutocompleteList";

interface Props {
  onSelect: (place: Place) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchPlaceInput({ onSelect, onSearch, placeholder }: Props) {
  const { query, setQuery, results } = usePlaceAutocomplete({
    debounceMs: 150,
    limit: 20,
    minQueryLength: 1,
  });

  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  /* 바깥 클릭 닫기 */
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  /* ESC 닫기 */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    setIsOpen(false);
    onSearch(q);
  };

  return (
    <div ref={rootRef} className="w-full">
      <label className="block text-sm font-medium text-gray-700">
        지역 검색
      </label>

      {/* input + button */}
      <div className="relative mt-2 flex gap-2">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          placeholder={placeholder ?? "예) 서울특별시 은평구 갈현동"}
          className="
            flex-1 rounded-xl border px-3 py-2 outline-none
            focus:ring
          "
        />

        {/* 🔍 검색 버튼 */}
        <button
          type="button"
          onClick={handleSearch}
          className="
            rounded-xl px-4 py-2 text-sm font-semibold
            transition
            hover:opacity-90
          "
          style={{
            backgroundColor: "#10b259",
            color: "#ffffff",
          }}
        >
          검색
        </button>

        {/* 자동완성 리스트 */}
        <PlaceAutocompleteList
          items={results}
          isOpen={isOpen && results.length > 0}
          onSelect={(place) => {
            setQuery(place.label);
            setIsOpen(false);
            onSelect(place);
          }}
        />
      </div>
    </div>
  );
}

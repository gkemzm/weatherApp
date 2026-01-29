import type { Place } from "../../../entities/place";

interface Props {
  items: Place[];
  isOpen: boolean;
  onSelect: (place: Place) => void;
}

export function PlaceAutocompleteList({ items, isOpen, onSelect }: Props) {
  if (!isOpen || items.length === 0) return null;

  return (
    <div
      className="
        absolute left-0 right-0 top-[calc(100%+8px)]
        z-50 overflow-hidden rounded-xl border bg-white shadow-lg
      "
      role="listbox"
    >
      <ul className="max-h-72 overflow-auto">
        {items.map((p) => (
          <li key={p.raw} role="option" aria-label={p.label}>
            <button
              type="button"
              onClick={() => onSelect(p)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 rounded-xl"
            >
              <div className="text-sm font-medium">{p.label}</div>
              <div className="text-xs text-gray-500">{p.level}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

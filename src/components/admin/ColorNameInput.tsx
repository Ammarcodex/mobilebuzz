"use client";

import { useState } from "react";
import { searchColorNames, type NamedColor } from "@/lib/colorNames";

export default function ColorNameInput({
  value,
  onChange,
  onSelectSuggestion,
}: {
  value: string;
  onChange: (name: string) => void;
  onSelectSuggestion: (suggestion: NamedColor) => void;
}) {
  const [open, setOpen] = useState(false);
  const suggestions = searchColorNames(value);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        placeholder="Search a color name, e.g. Rose Gold"
        autoComplete="off"
        className="input"
      />
      {open && suggestions.length > 0 ? (
        <ul className="glass absolute top-full left-0 z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-2xl p-1.5">
          {suggestions.map((s) => (
            <li key={s.name}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelectSuggestion(s);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm text-ink hover:bg-[var(--subtle-surface-strong)]"
              >
                <span
                  className="h-5 w-5 shrink-0 rounded-full border border-black/10"
                  style={{ background: s.hex }}
                />
                {s.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

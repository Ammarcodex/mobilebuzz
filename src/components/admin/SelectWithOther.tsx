"use client";

import { useState } from "react";

const OTHER = "__other__";

/** A <select> of preset options with an "Other…" escape hatch to free text. */
export default function SelectWithOther({
  name,
  value,
  onChange,
  options,
  placeholder,
  emptyLabel = "Select…",
}: {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  emptyLabel?: string;
}) {
  const [customMode, setCustomMode] = useState(
    () => value !== "" && !options.includes(value)
  );

  if (customMode) {
    return (
      <div className="flex gap-2">
        <input
          name={name}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input"
        />
        <button
          type="button"
          onClick={() => {
            setCustomMode(false);
            onChange("");
          }}
          className="shrink-0 rounded-xl border border-black/10 bg-white/70 dark:border-white/10 dark:bg-white/10 px-3 text-xs font-semibold text-muted"
        >
          List
        </button>
      </div>
    );
  }

  return (
    <select
      name={name}
      value={value}
      onChange={(e) => {
        if (e.target.value === OTHER) {
          setCustomMode(true);
        } else {
          onChange(e.target.value);
        }
      }}
      className="input"
    >
      <option value="">{emptyLabel}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
      <option value={OTHER}>Other…</option>
    </select>
  );
}

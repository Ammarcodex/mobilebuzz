"use client";

import { useState } from "react";
import InstallmentCalculator from "./InstallmentCalculator";

export default function InstallmentProcedureCalculator() {
  const [price, setPrice] = useState(100000);

  return (
    <div className="flex flex-col gap-4">
      <label className="block max-w-xs">
        <span className="mb-1.5 block text-sm font-semibold text-ink">
          Product Price (₨)
        </span>
        <input
          type="number"
          min={0}
          value={price || ""}
          onChange={(e) => setPrice(Number(e.target.value) || 0)}
          className="input"
        />
      </label>
      <InstallmentCalculator price={price} />
    </div>
  );
}

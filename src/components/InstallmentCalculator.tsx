"use client";

import { useMemo, useState } from "react";
import {
  INSTALLMENT_PLANS,
  calculateInstallment,
  getMinDownPayment,
  type InstallmentMonths,
} from "@/lib/installment";
import { formatPrice } from "@/lib/format";

export default function InstallmentCalculator({ price }: { price: number }) {
  const [months, setMonths] = useState<InstallmentMonths>(6);
  // null = user hasn't typed a custom amount yet, so it defaults to the 30%
  // minimum and tracks it if price changes (e.g. a different storage
  // option) — but once they type their own value, it's used as-is, even if
  // that's below the minimum (flagged via isBelowMinimum instead of blocked).
  const [downPaymentOverride, setDownPaymentOverride] = useState<number | null>(
    null
  );
  const minDownPayment = getMinDownPayment(price);
  const downPayment = downPaymentOverride ?? minDownPayment;
  const isBelowMinimum = downPayment < minDownPayment;

  const breakdown = useMemo(
    () => calculateInstallment(price, months, downPayment),
    [price, months, downPayment]
  );

  if (!price || price <= 0) {
    return (
      <div className="glass rounded-3xl p-5 text-sm text-muted">
        This product is priced on request. Contact us for the current price
        to calculate an installment plan.
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <h3 className="mb-1 text-base font-bold text-ink">
        Installment Calculator
      </h3>
      <p className="mb-4 text-[13px] text-muted">
        Real rates used in-store — pick a plan and enter a down payment.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {INSTALLMENT_PLANS.map((plan) => (
          <button
            key={plan.months}
            type="button"
            onClick={() => setMonths(plan.months)}
            className={`pill-solid rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              months === plan.months
                ? "bg-accent text-white"
                : "bg-white/60 text-ink dark:bg-white/10"
            }`}
          >
            {plan.months}mo
          </button>
        ))}
      </div>

      <label className="mb-4 block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">
          Down Payment (₨)
        </span>
        <input
          type="number"
          min={0}
          value={downPayment}
          onChange={(e) =>
            setDownPaymentOverride(Math.max(0, Number(e.target.value) || 0))
          }
          className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none ${
            isBelowMinimum
              ? "border-red-500 bg-red-50 text-red-700 focus:border-red-500 dark:border-red-500/70 dark:bg-red-500/10 dark:text-red-300"
              : "border-black/10 bg-white/70 text-ink focus:border-accent dark:border-white/10 dark:bg-white/10"
          }`}
        />
        {isBelowMinimum ? (
          <span className="mt-1.5 block text-xs font-semibold text-red-600 dark:text-red-400">
            Down payment must be at least 30% ({formatPrice(minDownPayment)}).
          </span>
        ) : (
          <span className="mt-1.5 block text-xs text-muted">
            Minimum 30% ({formatPrice(minDownPayment)}) — you can pay more upfront if you&apos;d like.
          </span>
        )}
      </label>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="glass rounded-2xl p-3">
          <dt className="text-xs text-muted">Retail Price</dt>
          <dd className="m-0 font-bold text-ink">{formatPrice(price)}</dd>
        </div>
        <div className="glass rounded-2xl p-3">
          <dt className="text-xs text-muted">Total Payable</dt>
          <dd className="m-0 font-bold text-ink">
            {formatPrice(breakdown.totalPayable)}
          </dd>
        </div>
        <div className="glass rounded-2xl p-3">
          <dt className="text-xs text-muted">Down Payment</dt>
          <dd className="m-0 font-bold text-ink">
            {formatPrice(breakdown.downPayment)}
          </dd>
        </div>
        <div className="glass rounded-2xl p-3 ring-1 ring-accent/30">
          <dt className="text-xs text-muted">Monthly Installment</dt>
          <dd className="m-0 font-extrabold text-accent">
            {formatPrice(breakdown.monthlyInstallment)}
            <span className="ml-1 text-xs font-medium text-muted">
              × {months}mo
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );
}

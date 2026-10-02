// Real installment markup rates used by the business, as embedded in the
// live site's JS: window.installmentPlans = {"3":"0.20","6":"0.30","9":"0.40","12":"0.45"}
export const INSTALLMENT_PLANS = [
  { months: 3, rate: 0.2 },
  { months: 6, rate: 0.3 },
  { months: 9, rate: 0.4 },
  { months: 12, rate: 0.45 },
] as const;

export type InstallmentMonths = (typeof INSTALLMENT_PLANS)[number]["months"];

/** Minimum required down payment, as a fraction of the product's price. */
export const MIN_DOWN_PAYMENT_RATE = 0.3;

export function getMinDownPayment(price: number): number {
  return Math.round((price || 0) * MIN_DOWN_PAYMENT_RATE);
}

export function getRateForMonths(months: InstallmentMonths): number {
  const plan = INSTALLMENT_PLANS.find((p) => p.months === months);
  return plan ? plan.rate : 0;
}

export interface InstallmentBreakdown {
  price: number;
  months: InstallmentMonths;
  rate: number;
  totalPayable: number;
  downPayment: number;
  remaining: number;
  monthlyInstallment: number;
}

export function calculateInstallment(
  price: number,
  months: InstallmentMonths,
  downPayment: number
): InstallmentBreakdown {
  const rate = getRateForMonths(months);
  const totalPayable = price * (1 + rate);
  const safeDown = Math.max(0, Math.min(downPayment || 0, totalPayable));
  const remaining = Math.max(totalPayable - safeDown, 0);
  const monthlyInstallment = remaining / months;
  return {
    price,
    months,
    rate,
    totalPayable,
    downPayment: safeDown,
    remaining,
    monthlyInstallment,
  };
}

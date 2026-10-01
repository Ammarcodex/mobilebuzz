import type { Metadata } from "next";
import { INSTALLMENT_PLANS } from "@/lib/installment";
import { BUSINESS } from "@/lib/format";
import InstallmentProcedureCalculator from "@/components/InstallmentProcedureCalculator";

export const metadata: Metadata = { title: "Installment Procedure" };

export default function InstallmentProcedurePage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 pb-16 pt-10">
      <h1 className="m-0 mb-2 text-[32px] font-extrabold tracking-tight text-ink">
        Installment Procedure
      </h1>
      <p className="mb-8 text-[15px] text-muted">
        Buy now, pay later — easy monthly installments on any smartphone, no
        bank card required.
      </p>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {INSTALLMENT_PLANS.map((plan) => (
          <div key={plan.months} className="glass rounded-2xl p-5 text-center">
            <div className="text-2xl font-extrabold text-ink">
              {plan.months}
              <span className="text-sm font-medium text-muted"> months</span>
            </div>
            <div className="mt-1 text-sm font-bold text-accent">
              +{Math.round(plan.rate * 100)}% markup
            </div>
          </div>
        ))}
      </div>

      <div className="glass mb-10 rounded-3xl p-6 sm:p-8">
        <h2 className="m-0 mb-4 text-lg font-bold text-ink">How It Works</h2>
        <ol className="m-0 flex list-decimal flex-col gap-3 pl-5 text-[15px] leading-[1.7] text-ink">
          <li>
            Pick any smartphone and choose an installment plan — 3, 6, 9, or
            12 months.
          </li>
          <li>
            The plan&apos;s markup rate ({INSTALLMENT_PLANS.map((p) => `${p.months}mo +${Math.round(p.rate * 100)}%`).join(", ")}) is added to the retail
            price to get the total payable amount.
          </li>
          <li>
            Pay a down payment upfront (any amount you choose) — the rest is
            split evenly across your chosen number of months.
          </li>
          <li>
            Visit our store at {BUSINESS.address} or contact us via WhatsApp/
            phone at {BUSINESS.phonePrimary} to confirm your plan and complete
            the paperwork — no credit card or bank approval needed.
          </li>
          <li>Collect your device and pay your monthly installments as agreed.</li>
        </ol>
      </div>

      <div>
        <h2 className="m-0 mb-4 text-lg font-bold text-ink">
          Try the Calculator
        </h2>
        <InstallmentProcedureCalculator />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  label: string;
  value: number;
}

const STATS: Stat[] = [
  { label: "Cash Customers", value: 15666 },
  { label: "Installment Customers", value: 7000 },
];

/** Counts up from 0 to `target` once `active` flips true, easing out so it
 * settles rather than stopping abruptly. Resolves instantly for
 * prefers-reduced-motion. */
function useCountUp(target: number, active: boolean, duration = 2000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time jump to the final value on mount, not derived render state
      setValue(target);
      return;
    }
    let raf: number;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

function StatCard({ stat, active }: { stat: Stat; active: boolean }) {
  const count = useCountUp(stat.value, active);
  return (
    <div className="glass flex flex-col items-center gap-2 rounded-[28px] p-8 text-center">
      <span className="stat-count gradient-text text-5xl font-extrabold tabular-nums sm:text-6xl">
        {count.toLocaleString("en-US")}+
      </span>
      <span className="text-sm font-semibold text-muted">{stat.label}</span>
    </div>
  );
}

export default function TrustedCustomersStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {STATS.map((stat) => (
        <StatCard key={stat.label} stat={stat} active={active} />
      ))}
    </div>
  );
}

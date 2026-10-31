"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Check } from "lucide-react";

type Cycle = "monthly" | "yearly";

const PRICE: Record<Cycle, number> = { monthly: 24, yearly: 19 };
const FEATURES = ["Unlimited projects", "Offline previews", "Custom domains", "Priority support"];

/** One digit that rolls vertically to its value. */
function Digit({ value }: { value: number }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden leading-none">
      <span
        className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-500 ease-[cubic-bezier(.3,.75,.1,1)] motion-reduce:transition-none"
        style={{ transform: `translateY(${-value}em)` }}
      >
        {Array.from({ length: 10 }, (_, d) => (
          <span key={d} className="h-[1em] text-center" aria-hidden>
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function PricingCard() {
  const [cycle, setCycle] = useState<Cycle>("yearly");
  const refs = useRef<Record<Cycle, HTMLButtonElement | null>>({ monthly: null, yearly: null });
  const price = PRICE[cycle];
  const yearly = cycle === "yearly";

  const onKeyDown = (e: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const next: Cycle = yearly ? "monthly" : "yearly";
    setCycle(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="grid h-full w-full place-items-center bg-[linear-gradient(160deg,#f5f5f4,#e7e5e4)] p-5 text-stone-900 dark:bg-[linear-gradient(160deg,#1c1917,#0c0a09)] dark:text-stone-50">
      <div className="w-full max-w-[480px] rounded-3xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,.05),0_24px_48px_-20px_rgba(0,0,0,.25)] ring-1 ring-black/5 dark:bg-stone-900 dark:ring-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[17px] font-semibold">Pro</div>
            <div className="text-[13px] text-stone-500 dark:text-stone-400">For people shipping every week</div>
          </div>
          <div
            role="radiogroup"
            aria-label="Billing cycle"
            onKeyDown={onKeyDown}
            className="relative grid flex-none grid-cols-2 rounded-full bg-stone-100 p-1 text-[13px] font-medium dark:bg-stone-800"
          >
            <span
              className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 ease-[cubic-bezier(.3,.75,.1,1)] dark:bg-stone-600 dark:ring-white/10"
              style={{ transform: yearly ? "translateX(100%)" : "none" }}
              aria-hidden
            />
            {(["monthly", "yearly"] as const).map((c) => (
              <button
                key={c}
                ref={(el) => {
                  refs.current[c] = el;
                }}
                type="button"
                role="radio"
                aria-checked={cycle === c}
                tabIndex={cycle === c ? 0 : -1}
                onClick={() => setCycle(c)}
                className={`relative h-8 rounded-full px-3.5 capitalize transition-colors outline-offset-2 focus-visible:outline-2 focus-visible:outline-sky-500 ${
                  cycle === c ? "text-stone-900 dark:text-white" : "text-stone-500 dark:text-stone-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-end gap-3">
          {/* The sign hangs outside the digits so the number reads as the anchor */}
          <div className="relative pl-[0.45em] text-[52px] font-semibold tracking-tight tabular-nums">
            <span className="absolute top-[0.12em] left-0 text-[0.45em] text-stone-400">$</span>
            <span className="sr-only">${price}</span>
            <span aria-hidden className="inline-flex">
              <Digit value={Math.floor(price / 10)} />
              <Digit value={price % 10} />
            </span>
          </div>
          <div className="pb-2 text-[13px]/5 text-stone-500 dark:text-stone-400">
            per month
            <br />
            {yearly ? "billed yearly" : "billed monthly"}
          </div>
          <div
            className={`mb-2.5 ml-auto grid transition-[grid-template-columns,opacity] duration-300 ${
              yearly ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0"
            }`}
          >
            <span className="overflow-hidden">
              <span className="block rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-black/5 pt-4 text-[13px] dark:border-white/10">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <Check className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
              {f}
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="mt-5 h-11 w-full rounded-xl bg-stone-900 text-[14px] font-medium text-white transition-colors hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 active:bg-stone-950 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
        >
          Start 14-day trial
        </button>
      </div>
    </div>
  );
}

"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Check, Landmark, Zap } from "lucide-react";

const REDUCED = "(prefers-reduced-motion: reduce)";

function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(REDUCED);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}

function useLoop(holds: readonly number[], playing: boolean) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!playing) return;
    let i = 0;
    let t = 0;
    const next = () => {
      t = window.setTimeout(() => {
        i = (i + 1) % holds.length;
        setStep(i);
        next();
      }, holds[i]);
    };
    next();
    return () => {
      window.clearTimeout(t);
      setStep(0);
    };
  }, [playing, holds]);
  return playing ? step : 0;
}

const ROWS = [
  { amount: "12,400.00", bank: "Chase ···· 4821" },
  { amount: "8,915.20", bank: "Chase ···· 4821" },
  { amount: "21,060.75", bank: "Mercury ···· 0937" },
  { amount: "5,330.00", bank: "Chase ···· 4821" },
];

// poster, exit, empty, rows, card, line, sending, sent
const HOLDS = [2800, 800, 500, 1400, 1100, 1000, 1300, 700] as const;

const EASE = "ease-[cubic-bezier(.25,.8,.25,1)]";

export default function PayoutFlow() {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const step = useLoop(HOLDS, inView && !reduced);

  const rowRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState<{ x1: number; x2: number; y: number } | null>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    const row = rowRef.current;
    const card = cardRef.current;
    if (!root || !row || !card) return;
    // Layout offsets ignore transforms, so the line lands where things settle.
    const measure = () => {
      const panel = row.offsetParent as HTMLElement;
      setLine({
        x1: panel.offsetLeft + row.offsetLeft + row.offsetWidth + 8,
        x2: card.offsetLeft - 4,
        y: panel.offsetTop + row.offsetTop + row.offsetHeight / 2,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [ref]);

  const exiting = step === 1;
  const rowsIn = step === 0 || step >= 3;
  const cardIn = step === 0 || step >= 4;
  const lineIn = step === 0 || step >= 5;
  const sending = step === 6;
  const sent = step === 0 || step === 1 || step === 7;
  const noteIn = step === 0;

  return (
    <div
      ref={ref}
      className="@container relative h-full w-full overflow-hidden bg-[radial-gradient(120%_90%_at_0%_0%,#eef2ff_0%,#f4f4f5_55%)] text-zinc-900 dark:bg-[radial-gradient(120%_90%_at_0%_0%,#172036_0%,#09090b_60%)] dark:text-zinc-100"
    >
      {/* Balance and payouts */}
      <section className="absolute top-12 left-12 w-[380px] rounded-2xl bg-white p-6 @max-[480px]:top-4 @max-[480px]:left-4 @max-[480px]:w-[328px] @max-[480px]:p-5 shadow-[0_1px_2px_rgba(0,0,0,.05),0_20px_40px_-20px_rgba(0,0,0,.2)] ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
        <div className="text-[13px] text-zinc-500">Available balance</div>
        <div className="mt-1 text-[34px] font-semibold tracking-tight tabular-nums">
          <span className="text-zinc-400">$</span>84,210.50
        </div>
        <div className="mt-6 mb-2 flex items-center justify-between text-[13px]">
          <span className="font-medium">Payouts</span>
          <span className="h-1.5 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>
        {ROWS.map((r, i) => {
          const pending = i === 0 && !sent;
          return (
            <div
              key={i}
              ref={i === 0 ? rowRef : undefined}
              className={`grid h-12 grid-cols-[28px_1fr_auto_64px] items-center gap-3 ${i >= 1 ? "@max-[480px]:hidden" : ""} border-t border-black/5 transition-[opacity,translate] duration-700 dark:border-white/10 ${EASE} ${
                rowsIn && !exiting ? "translate-y-0 opacity-100" : exiting ? "opacity-0" : "translate-y-2 opacity-0"
              }`}
              style={{
                transitionDelay: rowsIn && !exiting ? `${i * 90}ms` : exiting ? `${(ROWS.length - i) * 60}ms` : "0ms",
                transitionDuration: exiting ? "350ms" : undefined,
              }}
            >
              <span className="grid size-7 place-items-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                <Landmark className="size-3.5 text-zinc-500" aria-hidden />
              </span>
              {i === 0 ? (
                <span className="text-[13px] text-zinc-600 dark:text-zinc-400">{r.bank}</span>
              ) : (
                <span className="h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700" style={{ width: `${[0, 70, 52, 64][i]}%` }} />
              )}
              <span className="text-[13px] font-medium tabular-nums">${r.amount}</span>
              <span className="grid justify-items-end text-[12px] font-medium">
                <span
                  className={`col-start-1 row-start-1 rounded-full px-2 py-0.5 text-amber-700 transition-opacity duration-300 dark:text-amber-300 ${pending ? "bg-amber-50 opacity-100 dark:bg-amber-500/15" : "opacity-0"}`}
                >
                  Pending
                </span>
                <span
                  className={`col-start-1 row-start-1 rounded-full px-2 py-0.5 text-emerald-700 transition-opacity duration-300 dark:text-emerald-300 ${pending ? "opacity-0" : "bg-emerald-50 opacity-100 dark:bg-emerald-500/15"}`}
                >
                  Paid
                </span>
              </span>
            </div>
          );
        })}
      </section>

      {/* Instant payout */}
      <section
        ref={cardRef}
        className={`absolute top-12 left-[492px] w-[264px] @max-[480px]:top-[196px] @max-[480px]:left-10 @max-[480px]:w-[280px] rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,.05),0_24px_48px_-16px_rgba(0,0,0,.28)] ring-1 ring-black/5 transition-[opacity,translate] dark:bg-zinc-800 dark:ring-white/10 ${EASE} ${
          cardIn && !exiting ? "translate-x-0 opacity-100 duration-[900ms]" : exiting ? "opacity-0 duration-300" : "translate-x-6 opacity-0 duration-0"
        }`}
        style={{ transitionDelay: exiting ? "60ms" : "0ms" }}
      >
        <div className="flex items-center gap-2 text-[14px] font-medium">
          <span className="grid size-6 place-items-center rounded-md bg-amber-400 text-amber-950">
            <Zap className="size-3.5" fill="currentColor" aria-hidden />
          </span>
          Instant payout
        </div>
        <div className="mt-4 text-[28px] font-semibold tracking-tight tabular-nums">
          <span className="text-zinc-400">$</span>12,400.00
        </div>
        <dl className="mt-3 space-y-2 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-zinc-500">To</dt>
            <dd>Chase ···· 4821</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Fee</dt>
            <dd className="tabular-nums">$124.00</dd>
          </div>
        </dl>
        <div
          className={`relative mt-5 grid h-10 place-items-center rounded-xl text-[14px] font-medium text-white transition-colors duration-300 ${
            sent ? "bg-emerald-600" : "bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900"
          }`}
        >
          <span className={`col-start-1 row-start-1 transition-opacity duration-200 ${!sending && !sent ? "opacity-100" : "opacity-0"}`}>
            Pay out now
          </span>
          <span className={`col-start-1 row-start-1 inline-flex items-center gap-2 transition-opacity duration-200 ${sending ? "opacity-100" : "opacity-0"}`}>
            <span className="size-3.5 rounded-full border-2 border-current border-t-transparent motion-safe:animate-spin" />
            Sending
          </span>
          <span className={`col-start-1 row-start-1 inline-flex items-center gap-2 text-white transition-opacity duration-200 ${sent ? "opacity-100" : "opacity-0"}`}>
            <Check className="size-4" strokeWidth={2.5} aria-hidden />
            Sent
          </span>
        </div>
      </section>

      {line && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible @max-[480px]:hidden" aria-hidden>
          <path
            d={`M ${line.x1} ${line.y} H ${line.x2}`}
            className="stroke-zinc-400 dark:stroke-zinc-500"
            strokeWidth={1.25}
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={lineIn && !exiting ? 0 : 1}
            style={{
              transition: lineIn && !exiting ? "stroke-dashoffset 900ms cubic-bezier(.45,0,.1,1)" : "opacity 200ms",
              opacity: exiting ? 0 : 1,
            }}
          />
          <circle
            cx={line.x2}
            cy={line.y}
            r={3}
            className="fill-zinc-400 transition-opacity duration-300 dark:fill-zinc-500"
            style={{ opacity: lineIn && !exiting ? 1 : 0, transitionDelay: lineIn && !exiting ? "800ms" : "0ms" }}
          />
        </svg>
      )}

      <p
        className={`absolute top-[300px] left-[492px] @max-[480px]:top-[446px] @max-[480px]:left-10 text-[13px] text-zinc-500 transition-[opacity,translate] duration-700 ${EASE} ${
          noteIn ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
        }`}
      >
        Arrives in about 30 minutes
      </p>
    </div>
  );
}

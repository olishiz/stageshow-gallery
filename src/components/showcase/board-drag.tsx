"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CircleCheck } from "lucide-react";

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

/** macOS arrow, from Benji Taylor's Stageshow kit (MIT). */
function Pointer() {
  return (
    <svg height="28" width="28" viewBox="0 0 32 32" fill="none" aria-hidden>
      <g transform="translate(10 7)">
        <path d="m6.148 18.473 1.863-1.003 1.615-.839-2.568-4.816h4.332l-11.379-11.408v16.015l3.316-3.221z" fill="#fff" />
        <path d="m6.431 17 1.765-.941-2.775-5.202h3.604l-8.025-8.043v11.188l2.53-2.442z" fill="#000" />
      </g>
    </svg>
  );
}

// Geometry lives in CSS variables so the narrow layout can redefine it with a
// container query; the script only picks which named position to use.
const SCENE =
  "[--win-x:40px] [--win-y:40px] [--col-w:220px] [--c0:20px] [--c1:256px] [--c2:492px] [--card-h:72px] [--pitch:82px] " +
  "@max-[480px]:[--win-x:12px] @max-[480px]:[--win-y:16px] @max-[480px]:[--col-w:156px] @max-[480px]:[--c1:12px] @max-[480px]:[--c2:180px] @max-[480px]:[--card-h:84px] @max-[480px]:[--pitch:94px]";
const FIRST_Y = "92px";
const FROM = {
  x: "calc(var(--win-x) + var(--c1))",
  y: `calc(var(--win-y) + ${FIRST_Y} + var(--pitch))`,
};
const TO = { x: "calc(var(--win-x) + var(--c2))", y: `calc(var(--win-y) + ${FIRST_Y})` };
const COL_X = ["var(--c0)", "var(--c1)", "var(--c2)"];

// poster, fade out, snap, fade in, reach, press, carry, drop, count
const HOLDS = [2600, 350, 60, 700, 900, 350, 1100, 450, 700] as const;

// The arrow's hotspot is 10px right and 7px down from its box.
const at = (x: string, y: string) => ({ left: `calc(${x} - 10px)`, top: `calc(${y} - 7px)` });
const CURSOR = {
  rest: at(`calc(${TO.x} + var(--col-w) * 0.76)`, "420px"),
  start: at(`calc(${FROM.x} + var(--col-w) * 0.6)`, "400px"),
  grab: at(`calc(${FROM.x} + var(--col-w) * 0.76)`, `calc(${FROM.y} + 46px)`),
  drop: at(`calc(${TO.x} + var(--col-w) * 0.76)`, `calc(${TO.y} + 46px)`),
};

function FillerCard({ widths }: { widths: [number, number] }) {
  return (
    <div className="flex h-(--card-h) flex-col justify-center gap-2.5 rounded-xl bg-white px-3.5 ring-1 ring-black/5 dark:bg-zinc-800 dark:ring-white/10">
      <span className="h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700" style={{ width: `${widths[0]}%` }} />
      <span className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-700/60" style={{ width: `${widths[1]}%` }} />
    </div>
  );
}

export default function BoardDrag() {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const step = useLoop(HOLDS, inView && !reduced);

  const veiled = step === 1 || step === 2;
  const atStart = step >= 2 && step <= 5;
  const lifted = step === 5 || step === 6;
  const moved = step === 0 || step === 1 || step >= 6;
  const sourceClosed = step === 0 || step === 1 || step >= 5;
  const slotOpen = step === 0 || step === 1 || step >= 6;
  const done = step === 0 || step === 1 || step === 8;
  const count = step === 0 || step === 1 || step === 8 ? 3 : 2;

  const cursor =
    step === 0 || step === 1 || step === 8
      ? CURSOR.rest
      : step === 2 || step === 3
        ? CURSOR.start
        : step === 4 || step === 5
          ? CURSOR.grab
          : CURSOR.drop;

  const card = moved && !atStart ? TO : FROM;
  const snap = step === 2;

  return (
    <div
      ref={ref}
      className="@container relative h-full w-full overflow-hidden bg-sky-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
    >
      <div className={`absolute inset-0 ${SCENE}`}>
        <div
          className="absolute rounded-2xl bg-zinc-50 shadow-[0_1px_2px_rgba(0,0,0,.06),0_30px_60px_-20px_rgba(15,23,42,.3)] ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10"
          style={{ left: "var(--win-x)", top: "var(--win-y)", width: 860, height: 520 }}
        >
          <div className="flex h-10 items-center gap-1.5 border-b border-black/5 px-4 dark:border-white/10">
            <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="ml-4 text-[13px] font-medium">Gallery launch</span>
          </div>

          <div className={`transition-opacity duration-300 ${veiled ? "opacity-0" : "opacity-100"}`}>
            {["To do", "In progress", "Done"].map((title, c) => (
              <div
                key={title}
                className={`absolute ${c === 0 ? "@max-[480px]:hidden" : ""}`}
                style={{ left: COL_X[c], top: 60, width: "var(--col-w)" }}
              >
                <div className="flex h-8 items-center gap-2 px-1 text-[13px] font-medium">
                  {title}
                  <span className="relative inline-grid h-5 min-w-5 place-items-center overflow-hidden rounded-full bg-zinc-200/80 px-1.5 text-[11px] tabular-nums text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {c === 2 ? (
                      <>
                        <span className={`col-start-1 row-start-1 transition-transform duration-300 ${snap ? "duration-0" : ""} ${count === 3 ? "-translate-y-4" : ""}`}>2</span>
                        <span className={`col-start-1 row-start-1 transition-transform duration-300 ${snap ? "duration-0" : ""} ${count === 3 ? "" : "translate-y-4"}`}>3</span>
                      </>
                    ) : c === 0 ? (
                      "3"
                    ) : (
                      "2"
                    )}
                  </span>
                </div>

                <div className="flex flex-col">
                  {c === 0 && (
                    <div className="space-y-2.5">
                      <FillerCard widths={[70, 40]} />
                      <FillerCard widths={[55, 35]} />
                      <FillerCard widths={[64, 44]} />
                    </div>
                  )}
                  {c === 1 && (
                    <>
                      <FillerCard widths={[60, 42]} />
                      <div
                        className={`overflow-hidden ease-[cubic-bezier(.45,0,.1,1)] ${snap ? "duration-0" : "duration-500"} transition-[height]`}
                        style={{ height: sourceClosed ? 0 : "var(--pitch)" }}
                      />
                      <div className="mt-2.5">
                        <FillerCard widths={[48, 30]} />
                      </div>
                    </>
                  )}
                  {c === 2 && (
                    <>
                      <div
                        className={`transition-[height] ease-[cubic-bezier(.45,0,.1,1)] ${snap ? "duration-0" : "duration-500"}`}
                        style={{ height: slotOpen ? "var(--pitch)" : 0 }}
                      />
                      <div className="space-y-2.5">
                        <FillerCard widths={[58, 36]} />
                        <FillerCard widths={[66, 40]} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The card being carried */}
        <div
          className={`absolute ${snap ? "" : "transition-[left,top] duration-[1000ms] ease-[cubic-bezier(.45,0,.1,1)]"} ${veiled ? "opacity-0" : "opacity-100"}`}
          style={{ left: card.x, top: card.y, width: "var(--col-w)", height: "var(--card-h)", transitionProperty: snap ? "none" : undefined }}
        >
          <div
            className={`flex h-full flex-col justify-center rounded-xl bg-white px-3.5 ring-1 ring-black/5 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.3,.75,.1,1)] dark:bg-zinc-800 dark:ring-white/10 ${
              lifted
                ? "scale-[1.03] rotate-2 shadow-[0_24px_40px_-12px_rgba(15,23,42,.35)]"
                : "shadow-[0_1px_2px_rgba(0,0,0,.06)]"
            }`}
            style={{ willChange: "transform" }}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[13px]/[1.3] font-medium">Offline fallback page</span>
              <CircleCheck
                className={`size-4 text-emerald-600 transition-[opacity,scale] duration-300 dark:text-emerald-400 ${done ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                aria-hidden
              />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-md bg-sky-100 px-1.5 py-0.5 text-[11px] font-medium text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                PWA
              </span>
              <span className="ml-auto grid size-5 place-items-center rounded-full bg-zinc-900 text-[9px] font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                OS
              </span>
            </div>
          </div>
        </div>

        {/* Cursor; its hotspot is the arrow tip */}
        <div
          className={`pointer-events-none absolute transition-[left,top,opacity] ${
            snap ? "duration-0" : step === 6 ? "duration-[1000ms]" : "duration-[800ms]"
          } ease-[cubic-bezier(.45,0,.1,1)] ${veiled ? "opacity-0" : "opacity-100"}`}
          style={cursor}
        >
          <div className={`transition-transform duration-150 ${lifted ? "scale-90" : ""}`} style={{ transformOrigin: "10px 7px" }}>
            <Pointer />
          </div>
        </div>
      </div>
    </div>
  );
}

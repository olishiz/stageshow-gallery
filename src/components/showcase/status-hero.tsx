"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";

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
  const [loops, setLoops] = useState(0);
  useEffect(() => {
    if (!playing) return;
    let i = 0;
    let t = 0;
    const next = () => {
      t = window.setTimeout(() => {
        i = (i + 1) % holds.length;
        if (i === 1) setLoops((n) => n + 1);
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
  return [playing ? step : 0, loops] as const;
}

const COMMITS = [
  { sha: "a3f9c21", msg: "feat: status hero" },
  { sha: "7be04d9", msg: "fix: offline fallback copy" },
  { sha: "c18e5a2", msg: "chore: precache icons" },
];
const LOG = [
  { text: "Installed dependencies", meta: "3.1s" },
  { text: "Built 21 static pages", meta: "9.4s" },
  { text: "Precached the app shell", meta: "0.6s" },
  { text: "Promoted to production", meta: "1.2s" },
];
const LABELS = { building: "Building", live: "Live in production" } as const;

// poster (live), new push, then each log line, then live
const HOLDS = [3200, 900, 800, 800, 800, 700] as const;

export default function StatusHero() {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const [step, loops] = useLoop(HOLDS, inView && !reduced);

  const sizer = useRef<HTMLSpanElement>(null);
  const [widths, setWidths] = useState<Record<keyof typeof LABELS, number> | null>(null);
  useLayoutEffect(() => {
    const el = sizer.current;
    if (!el) return;
    const [a, b] = Array.from(el.children) as HTMLElement[];
    setWidths({ building: a.offsetWidth, live: b.offsetWidth });
  }, []);

  const live = step === 0;
  const lines = step === 0 ? LOG.length : Math.max(0, step - 1);
  const commit = COMMITS[loops % COMMITS.length];
  const state = live ? "live" : "building";

  return (
    <div
      ref={ref}
      className="@container relative h-full w-full overflow-hidden bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(16,185,129,.14),transparent)] dark:bg-[radial-gradient(60%_60%_at_50%_0%,rgba(16,185,129,.18),transparent)]"
        aria-hidden
      />
      <div className="relative flex flex-col items-center px-6 pt-14 text-center @3xl:pt-16">
        <span
          className={`inline-flex h-8 items-center gap-2 rounded-full px-3 text-[13px] font-medium ring-1 transition-colors duration-300 ${
            live
              ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/25"
              : "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/25"
          }`}
        >
          <span className="relative grid size-2 place-items-center">
            <span className={`absolute size-2 rounded-full bg-current ${live ? "" : "motion-safe:animate-pulse"}`} />
          </span>
          <span
            className="relative inline-block h-5 overflow-hidden whitespace-nowrap transition-[width] duration-300 ease-[cubic-bezier(.3,.75,.1,1)]"
            style={{ width: widths ? widths[state] : undefined }}
          >
            <span className={`absolute left-0 transition-[opacity,translate] duration-300 ${live ? "-translate-y-2 opacity-0" : "opacity-100"}`}>
              {LABELS.building}
            </span>
            <span className={`absolute left-0 transition-[opacity,translate] duration-300 ${live ? "opacity-100" : "translate-y-2 opacity-0"}`}>
              {LABELS.live}
            </span>
            {!widths && <span className="invisible">{LABELS.live}</span>}
          </span>
        </span>
        <span ref={sizer} className="invisible absolute flex text-[13px] font-medium whitespace-nowrap" aria-hidden>
          <span>{LABELS.building}</span>
          <span>{LABELS.live}</span>
        </span>

        <h2 className="mt-6 max-w-2xl text-[40px]/[1.02] font-semibold tracking-tight text-balance @3xl:text-[60px]/[1]">
          Push a commit. Watch it go live.
        </h2>
        <p className="mt-5 max-w-lg text-[17px]/7 text-zinc-600 dark:text-zinc-400">
          Every deploy streams its build, precaches the shell and promotes itself when the checks pass.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#gallery"
            className="inline-flex h-11 items-center rounded-full bg-zinc-950 px-5 text-[15px] font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Start deploying
          </a>
          <a
            href="#gallery"
            className="inline-flex h-11 items-center rounded-full px-5 text-[15px] font-medium text-zinc-700 ring-1 ring-black/10 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:text-zinc-300 dark:ring-white/15 dark:hover:bg-zinc-900"
          >
            Read the docs
          </a>
        </div>
      </div>

      {/* Build log window, fading out at its foot */}
      <div className="relative mx-auto mt-12 w-[calc(100%-48px)] max-w-[720px] [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]">
        <div className="rounded-t-2xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,.06),0_20px_50px_-20px_rgba(0,0,0,.25)] dark:bg-zinc-900 dark:shadow-[0_0_0_1px_rgba(255,255,255,.08)]">
          <div className="flex h-11 items-center justify-between border-b border-black/5 px-5 text-[13px] dark:border-white/10">
            <span className="font-medium">
              <span className="font-mono text-zinc-500">{commit.sha}</span>
              <span className="ml-3">{commit.msg}</span>
            </span>
            <span className="text-zinc-500 tabular-nums">{live ? "15.3s" : "Running"}</span>
          </div>
          <ul className="space-y-1 px-5 py-4 font-mono text-[13px]/6">
            {LOG.map((l, i) => {
              const done = i < lines;
              return (
                <li
                  key={l.text}
                  className={`grid grid-cols-[1ch_1fr_auto] gap-x-[1.5ch] transition-opacity duration-300 ${done ? "opacity-100" : "opacity-30"}`}
                >
                  <span className={done ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}>{done ? "✓" : "·"}</span>
                  <span className={i === LOG.length - 1 && done ? "text-emerald-700 dark:text-emerald-300" : ""}>{l.text}</span>
                  <span className="text-zinc-400 dark:text-zinc-500">{done ? l.meta : ""}</span>
                </li>
              );
            })}
            {[70, 52, 64].map((w, i) => (
              <li key={`f${i}`} className="flex h-6 items-center">
                <span className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800" style={{ width: `${w}%` }} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

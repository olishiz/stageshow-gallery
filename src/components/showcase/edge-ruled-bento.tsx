"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

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

function useSeenOnce<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

const LINES = [
  { text: "Bundled 14 functions", meta: "1.2s" },
  { text: "Uploaded to 18 regions", meta: "0.8s" },
  { text: "Warmed edge caches", meta: "2.1s" },
  { text: "Live everywhere", meta: "4.1s", strong: true },
];

// A coarse dot field; lit cells stand in for regions without pretending to be a map.
const COLS = 22;
const ROWS = 9;
const LIT = new Set([24, 29, 47, 52, 58, 71, 76, 93, 101, 118, 123, 140, 147, 161, 166, 172, 185, 190]);

export default function EdgeRuledBento() {
  const reduced = useReducedMotion();
  const [ref, seen] = useSeenOnce<HTMLDivElement>();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!seen || reduced) return;
    const timers = LINES.map((_, i) =>
      window.setTimeout(() => setShown(i + 1), 500 + i * 750),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [seen, reduced]);

  const count = reduced ? LINES.length : shown;

  return (
    <div
      ref={ref}
      className="@container h-full w-full bg-zinc-100 p-3 text-zinc-900 @2xl:p-6 dark:bg-black dark:text-zinc-100"
    >
      <div className="grid h-full gap-px overflow-hidden rounded-2xl bg-zinc-300 ring-1 ring-zinc-300 @2xl:grid-cols-4 @2xl:grid-rows-[1.1fr_1fr] dark:bg-zinc-800 dark:ring-zinc-800">
        {/* Hero: the terminal */}
        <section className="flex min-h-[300px] flex-col bg-white p-6 @2xl:col-span-2 @2xl:min-h-0 dark:bg-zinc-950">
          <p className="text-lg/snug font-semibold tracking-tight @2xl:text-xl/snug">
            Push, and it is everywhere.{" "}
            <span className="text-zinc-500">One command deploys to every region.</span>
          </p>
          <div className="mt-5 flex-1 rounded-xl bg-zinc-50 px-5 py-4 font-mono text-[13px]/6 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <div className="text-zinc-500">
              <span className="text-zinc-400 dark:text-zinc-600">$ </span>
              <span className="text-zinc-900 dark:text-zinc-100">edge deploy --prod</span>
            </div>
            <ul className="mt-3 space-y-1">
              {LINES.map((line, i) => {
                const visible = i < count;
                const pending = i === count && count < LINES.length && seen && !reduced;
                return (
                  <li
                    key={line.text}
                    className={`grid grid-cols-[1ch_1fr_auto] gap-x-[1ch] transition-[opacity,translate] duration-500 ease-[cubic-bezier(.25,.8,.25,1)] ${
                      visible || pending ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                    }`}
                  >
                    <span className="relative">
                      <span
                        className={`absolute inset-0 text-emerald-600 transition-opacity duration-300 dark:text-emerald-400 ${visible ? "opacity-100" : "opacity-0"}`}
                        aria-hidden
                      >
                        ✓
                      </span>
                      <span
                        className={`absolute inset-0 text-zinc-400 transition-opacity duration-300 ${visible ? "opacity-0" : "opacity-100"}`}
                        aria-hidden
                      >
                        <span className="inline-block motion-safe:animate-spin">◌</span>
                      </span>
                    </span>
                    <span className={line.strong && visible ? "font-medium text-emerald-700 dark:text-emerald-400" : ""}>
                      {line.text}
                    </span>
                    <span className="text-zinc-400 dark:text-zinc-600">{visible ? line.meta : ""}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Stat */}
        <section className="flex flex-col bg-white p-6 dark:bg-zinc-950">
          <p className="text-[15px] text-zinc-500">Median response, worldwide</p>
          <div className="mt-auto flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-[96px]/[0.9] font-semibold tracking-tighter tabular-nums">14</span>
            <span className="text-3xl font-medium text-zinc-500">ms</span>
          </div>
        </section>

        {/* One component: keycaps */}
        <section className="flex flex-col bg-white p-6 dark:bg-zinc-950">
          <p className="text-[15px] text-zinc-500">Deploy from anywhere</p>
          <div className="mt-auto flex gap-2.5">
            {["⌘", "K"].map((k) => (
              <kbd
                key={k}
                className="grid h-20 min-w-20 place-items-center rounded-2xl bg-gradient-to-b from-white to-zinc-100 px-4 font-sans text-3xl font-medium text-zinc-700 shadow-[inset_0_-3px_0_rgba(0,0,0,.08),0_1px_2px_rgba(0,0,0,.12)] ring-1 ring-zinc-300 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-200 dark:shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_1px_2px_rgba(0,0,0,.6)] dark:ring-zinc-700"
              >
                {k}
              </kbd>
            ))}
          </div>
        </section>

        {/* Diagram */}
        <section className="relative flex min-h-[220px] flex-col overflow-hidden bg-white p-6 @2xl:col-span-2 dark:bg-zinc-950">
          <p className="relative z-10 text-[15px] text-zinc-500">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">18 regions.</span> Requests land on the nearest one.
          </p>
          <div
            className="absolute inset-x-6 bottom-5 grid gap-[9px]"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
            aria-hidden
          >
            {Array.from({ length: COLS * ROWS }, (_, i) => {
              const lit = LIT.has(i);
              const on = lit && (count >= 2 || reduced);
              return (
                <span key={i} className="grid aspect-square place-items-center">
                  <span
                    className={`rounded-full transition-all duration-700 ${
                      on
                        ? "size-2 bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.15)]"
                        : "size-1 bg-zinc-300 dark:bg-zinc-700"
                    }`}
                    style={{ transitionDelay: on ? `${(i % COLS) * 30}ms` : "0ms" }}
                  />
                </span>
              );
            })}
          </div>
        </section>

        {/* Statement */}
        <section className="flex flex-col justify-between bg-white p-6 @2xl:col-span-2 dark:bg-zinc-950">
          <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.18)]" aria-hidden />
          <p className="mt-8 max-w-sm text-[30px]/[1.1] font-semibold tracking-tight">
            No config files.{" "}
            <span className="text-zinc-400 dark:text-zinc-500">The edge reads your framework.</span>
          </p>
        </section>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";

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

const WEEKS = 26;

// Deterministic levels so server and client render the same grid.
function level(week: number, day: number) {
  const n = Math.sin(week * 12.9898 + day * 78.233) * 43758.5453;
  const r = n - Math.floor(n);
  const weekend = day === 0 || day === 6;
  const v = r * (weekend ? 0.55 : 1) + (week > 20 ? 0.15 : 0);
  return v > 0.85 ? 4 : v > 0.65 ? 3 : v > 0.42 ? 2 : v > 0.22 ? 1 : 0;
}

const LEVELS = [
  "bg-zinc-200 dark:bg-zinc-800",
  "bg-emerald-200 dark:bg-emerald-900",
  "bg-emerald-300 dark:bg-emerald-700",
  "bg-emerald-500 dark:bg-emerald-500",
  "bg-emerald-700 dark:bg-emerald-300",
];

const STACK = [
  ["TypeScript", "React", "Next.js", "Tailwind CSS"],
  ["Figma", "Motion", "Vercel", "Radix"],
  ["Node.js", "CSS", "PWA", "Playwright"],
  ["Accessibility", "Design systems", "Git"],
];

export default function ProfileBento() {
  const reduced = useReducedMotion();
  const [ref, seen] = useSeenOnce<HTMLDivElement>();
  const filled = seen || reduced;

  return (
    <div
      ref={ref}
      className="@container h-full w-full bg-stone-100 text-stone-950 dark:bg-stone-950 dark:text-stone-50"
    >
      <div className="grid h-full gap-3 p-3 @2xl:grid-cols-3 @2xl:grid-rows-2 @2xl:gap-4 @2xl:p-6">
        {/* Hero: who */}
        <section className="flex flex-col justify-between gap-8 rounded-3xl bg-white p-7 ring-1 ring-black/5 @2xl:col-span-2 dark:bg-stone-900 dark:ring-white/10">
          <div className="flex items-center gap-4">
            <span className="grid size-16 flex-none place-items-center rounded-full bg-stone-900 text-xl font-semibold text-white dark:bg-stone-100 dark:text-stone-900">
              OS
            </span>
            <div>
              <div className="text-xl font-semibold tracking-tight">Oliver Sim</div>
              <div className="text-[15px] text-stone-500 dark:text-stone-400">@olishiz</div>
            </div>
          </div>
          <div>
            <p className="max-w-lg text-[32px]/[1.1] font-semibold tracking-tight @2xl:text-[40px]/[1.05]">
              Building interfaces that are worth showing off.
            </p>
            <a
              href="https://github.com/olishiz"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex h-10 items-center gap-1.5 rounded-full bg-stone-900 px-4 text-[14px] font-medium text-white transition-colors hover:bg-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
            >
              github.com/olishiz
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
        </section>

        {/* Now building */}
        <section className="flex flex-col rounded-3xl bg-white p-7 ring-1 ring-black/5 dark:bg-stone-900 dark:ring-white/10">
          <p className="text-lg/snug font-semibold tracking-tight">Now building</p>
          <div className="mt-auto rounded-2xl bg-stone-50 p-4 ring-1 ring-black/5 dark:bg-stone-800/70 dark:ring-white/10">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[15px] font-medium">stageshow-gallery</span>
              <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 text-[12px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <span className="size-1.5 rounded-full bg-current" />
                Shipping
              </span>
            </div>
            <p className="mt-1.5 text-[13px]/5 text-stone-500 dark:text-stone-400">
              Showcase UI you can browse offline.
            </p>
            <div className="mt-4 flex items-center justify-between text-[12px] text-stone-500 dark:text-stone-400">
              <span>Launch checklist</span>
              <span className="tabular-nums">5 of 6</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
              <div
                className="h-full rounded-full bg-emerald-500 transition-[width] delay-300 duration-1000 ease-[cubic-bezier(.25,.8,.25,1)]"
                style={{ width: filled ? "83%" : "8%" }}
              />
            </div>
          </div>
        </section>

        {/* Diagram: rhythm */}
        <section className="flex flex-col overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-black/5 @2xl:col-span-2 dark:bg-stone-900 dark:ring-white/10">
          <p className="text-lg/snug font-semibold tracking-tight">
            Small commits.{" "}
            <span className="text-stone-500 dark:text-stone-400">Most days.</span>
          </p>
          <div
            className="mt-auto grid grid-flow-col grid-rows-7 gap-[5px] pt-6"
            style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}
            aria-hidden
          >
            {Array.from({ length: WEEKS * 7 }, (_, i) => {
              const week = Math.floor(i / 7);
              const day = i % 7;
              const lv = filled ? level(week, day) : 0;
              return (
                <span
                  key={i}
                  className={`aspect-square rounded-[3px] transition-colors duration-500 ${LEVELS[lv]}`}
                  style={{ transitionDelay: filled && !reduced ? `${week * 35}ms` : "0ms" }}
                />
              );
            })}
          </div>
        </section>

        {/* Collection: stack, bleeding off the right */}
        <section className="flex flex-col overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-black/5 dark:bg-stone-900 dark:ring-white/10">
          <p className="text-lg/snug font-semibold tracking-tight">Usually reaching for</p>
          <div className="mt-auto -mr-16 space-y-2 pt-6">
            {STACK.map((row, r) => (
              <div key={r} className="flex gap-2" style={{ marginLeft: r % 2 ? 28 : 0 }}>
                {row.map((t) => (
                  <span
                    key={t}
                    className="h-10 flex-none rounded-full bg-stone-100 px-4 text-[15px]/10 font-medium whitespace-nowrap text-stone-700 ring-1 ring-black/5 dark:bg-stone-800 dark:text-stone-200 dark:ring-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

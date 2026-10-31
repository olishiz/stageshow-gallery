"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, Search } from "lucide-react";

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

const QUERY = "bento";
const TILES = [
  { name: "Launch bento", tone: "bg-sky-100 dark:bg-sky-500/20", bar: "bg-sky-300 dark:bg-sky-400/50" },
  { name: "AI answer", tone: "bg-zinc-100 dark:bg-zinc-800", bar: "bg-zinc-300 dark:bg-zinc-600" },
  { name: "Profile bento", tone: "bg-emerald-100 dark:bg-emerald-500/20", bar: "bg-emerald-300 dark:bg-emerald-400/50" },
  { name: "Pricing card", tone: "bg-stone-100 dark:bg-stone-800", bar: "bg-stone-300 dark:bg-stone-600" },
  { name: "Ruled bento", tone: "bg-zinc-900 dark:bg-black", bar: "bg-zinc-600 dark:bg-zinc-700" },
  { name: "Like burst", tone: "bg-rose-100 dark:bg-rose-500/20", bar: "bg-rose-300 dark:bg-rose-400/50" },
];
const TILE_H = 132;
const GAP = 14;

// poster, select, cleared, typing
const HOLDS = [2800, 600, 900, QUERY.length * 140 + 700] as const;

export default function SplitHero() {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const step = useLoop(HOLDS, inView && !reduced);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (step !== 3) return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setTyped(n);
      if (n >= QUERY.length) window.clearInterval(id);
    }, 140);
    return () => {
      window.clearInterval(id);
      setTyped(0);
    };
  }, [step]);

  const query = step <= 1 ? QUERY : step === 3 ? QUERY.slice(0, typed) : "";
  const selected = step === 1;
  const results = TILES.filter((t) => t.name.toLowerCase().includes(query));

  return (
    <div
      ref={ref}
      className="@container relative h-full w-full overflow-hidden bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"
    >
      <div className="grid h-full @3xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col justify-center px-6 pt-12 pb-10 @3xl:py-16 @3xl:pr-4 @3xl:pl-14">
          <p className="text-[13px] font-medium tracking-wide text-sky-600 dark:text-sky-400">Stageshow Gallery</p>
          <h2 className="mt-3 text-[40px]/[1.02] font-semibold tracking-tight text-balance @3xl:text-[56px]/[1]">
            Interfaces worth showing off.
          </h2>
          <p className="mt-5 max-w-md text-[17px]/7 text-zinc-600 dark:text-zinc-400">
            Faux product UI, bento grids and micro-interactions by Oliver Sim. Browse them anywhere, even offline.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#gallery"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-zinc-950 px-5 text-[15px] font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Browse the gallery
              <ArrowRight className="size-4" aria-hidden />
            </a>
            <a
              href="https://github.com/olishiz"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-full px-5 text-[15px] font-medium text-zinc-700 ring-1 ring-black/10 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:text-zinc-200 dark:ring-white/15 dark:hover:bg-zinc-900"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Product window: inset top and left, bleeding off right and bottom */}
        <div className="relative min-h-[320px] @3xl:min-h-0">
          <div className="absolute top-0 -right-24 -bottom-16 left-6 rounded-tl-2xl bg-zinc-50 shadow-[0_0_0_1px_rgba(0,0,0,.06),0_30px_80px_-24px_rgba(2,6,23,.35)] @3xl:top-16 @3xl:left-0 dark:bg-zinc-900 dark:shadow-[0_0_0_1px_rgba(255,255,255,.08),0_30px_80px_-24px_rgba(0,0,0,.8)]">
            <div className="flex h-11 items-center gap-1.5 border-b border-black/5 px-4 dark:border-white/10">
              <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>
            <div className="p-6 pr-32">
              <div className="flex h-11 max-w-sm items-center gap-2.5 rounded-xl bg-white px-3.5 ring-1 ring-black/10 dark:bg-zinc-800 dark:ring-white/10">
                <Search className="size-4 text-zinc-400" aria-hidden />
                <span className="relative text-[15px]">
                  {query ? (
                    <span className={`rounded-[3px] transition-colors duration-150 ${selected ? "bg-sky-200 dark:bg-sky-500/40" : ""}`}>
                      {query}
                    </span>
                  ) : (
                    <span className="text-zinc-400">Search components</span>
                  )}
                  {step === 3 && <span className="absolute top-1/2 -right-1 h-5 w-px -translate-y-1/2 bg-sky-500" />}
                </span>
                <span className="ml-auto text-[12px] text-zinc-400 tabular-nums">{results.length} results</span>
              </div>

              <div className="relative mt-5" style={{ height: TILE_H * 2 + GAP }}>
                {TILES.map((t) => {
                  const idx = results.indexOf(t);
                  const shown = idx !== -1;
                  const pos = shown ? idx : TILES.indexOf(t);
                  const col = pos % 3;
                  const row = Math.floor(pos / 3);
                  return (
                    <div
                      key={t.name}
                      className={`absolute transition-[left,top,opacity,scale] duration-500 ease-[cubic-bezier(.45,0,.1,1)] ${
                        shown ? "scale-100 opacity-100" : "scale-95 opacity-0"
                      }`}
                      style={{
                        left: `calc(${col} * (100% + ${GAP}px) / 3)`,
                        top: row * (TILE_H + GAP),
                        width: `calc((100% - ${GAP * 2}px) / 3)`,
                        height: TILE_H,
                      }}
                    >
                      <div className={`flex h-[96px] flex-col justify-end gap-1.5 rounded-xl p-3 ${t.tone}`}>
                        <span className={`h-1.5 w-3/5 rounded-full ${t.bar}`} />
                        <span className={`h-1.5 w-2/5 rounded-full ${t.bar}`} />
                      </div>
                      <div className="mt-2 text-[13px] font-medium">{t.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

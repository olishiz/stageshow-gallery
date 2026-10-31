"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, GitBranch, RotateCcw } from "lucide-react";

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

/** Flips to true the first time the element is mostly on screen. */
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

const PEOPLE = [
  { initials: "OS", bg: "bg-sky-500" },
  { initials: "MA", bg: "bg-amber-500" },
  { initials: "JT", bg: "bg-emerald-500" },
  { initials: "RK", bg: "bg-rose-500" },
  { initials: "LW", bg: "bg-indigo-500" },
  { initials: "NP", bg: "bg-teal-500" },
  { initials: "HC", bg: "bg-orange-500" },
];

export default function LaunchBento() {
  const reduced = useReducedMotion();
  const [ref, seen] = useSeenOnce<HTMLDivElement>();
  const [ready, setReady] = useState(false);
  const [comments, setComments] = useState(true);

  useEffect(() => {
    if (!seen || reduced) return;
    const t = window.setTimeout(() => setReady(true), 1600);
    return () => window.clearTimeout(t);
  }, [seen, reduced]);

  const isReady = ready || reduced;

  return (
    <div
      ref={ref}
      className="@container h-full w-full bg-zinc-100 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"
    >
      <div className="grid h-full gap-3 p-3 @2xl:grid-cols-3 @2xl:grid-rows-[1.15fr_1fr] @2xl:gap-4 @2xl:p-6">
        {/* Hero: a deploy list, the only window in the grid */}
        <section className="relative flex min-h-[300px] flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-black/5 @2xl:col-span-2 @2xl:min-h-0 dark:bg-zinc-900 dark:ring-white/10">
          <p className="max-w-md p-6 pb-0 text-lg/snug font-semibold tracking-tight @2xl:text-xl/snug">
            Preview every push.{" "}
            <span className="text-zinc-500 dark:text-zinc-400">
              Each branch gets its own URL before review starts.
            </span>
          </p>
          <div className="relative mt-6 ml-6 flex-1">
            <div className="absolute inset-0 -right-24 -bottom-16 rounded-tl-xl bg-zinc-50 shadow-[0_1px_0_rgba(0,0,0,.04),0_24px_48px_-12px_rgba(0,0,0,.18)] ring-1 ring-black/5 dark:bg-zinc-800/60 dark:ring-white/10">
              <div className="flex h-9 items-center gap-1.5 border-b border-black/5 px-3 dark:border-white/10">
                <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                <span className="ml-3 h-5 w-48 rounded-md bg-zinc-200/70 dark:bg-zinc-700/60" />
              </div>
              <div className="p-3">
                <div className="grid grid-cols-[20px_1fr_auto] items-center gap-3 rounded-lg bg-white px-3 py-2.5 ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
                  <GitBranch className="size-4 text-zinc-500" aria-hidden />
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium">
                      feat: offline gallery
                    </div>
                    <div className="truncate font-mono text-[11px] text-zinc-500">
                      olishiz/stageshow-gallery
                    </div>
                  </div>
                  <span
                    className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium transition-colors duration-300 ${
                      isReady
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                    }`}
                  >
                    <span className="relative grid size-3 place-items-center">
                      <span
                        className={`absolute size-3 rounded-full border-[1.5px] border-current border-t-transparent transition-opacity duration-300 motion-safe:animate-spin ${
                          isReady ? "opacity-0" : "opacity-100"
                        }`}
                      />
                      <span
                        className={`size-1.5 rounded-full bg-current transition-transform duration-300 ${
                          isReady ? "scale-100" : "scale-0"
                        }`}
                      />
                    </span>
                    <span className="grid">
                      <span
                        className={`col-start-1 row-start-1 transition-opacity duration-300 ${isReady ? "opacity-0" : ""}`}
                      >
                        Building
                      </span>
                      <span
                        className={`col-start-1 row-start-1 transition-opacity duration-300 ${isReady ? "" : "opacity-0"}`}
                      >
                        Ready
                      </span>
                    </span>
                  </span>
                </div>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.25,.8,.25,1)] ${
                    isReady ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2 px-3 pt-2.5 pl-11 text-[12px] text-zinc-500">
                      <Check className="size-3.5 text-emerald-600" aria-hidden />
                      <span className="font-mono">offline-gallery.preview.app</span>
                    </div>
                  </div>
                </div>
                {[62, 48, 70].map((w, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[20px_1fr_auto] items-center gap-3 border-b border-black/[.04] px-3 py-3.5 last:border-0 dark:border-white/5"
                  >
                    <span className="size-3.5 rounded bg-zinc-200 dark:bg-zinc-700" />
                    <span className="h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700" style={{ width: `${w}%` }} />
                    <span className="h-1.5 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stat */}
        <section className="flex flex-col justify-between rounded-3xl bg-white p-6 ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
          <p className="text-lg/snug font-semibold tracking-tight @2xl:text-xl/snug">
            Always on.{" "}
            <span className="text-zinc-500 dark:text-zinc-400">
              Measured across every region last quarter.
            </span>
          </p>
          <div className="mt-8">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Uptime</div>
            <div className="text-6xl font-semibold tracking-tighter whitespace-nowrap tabular-nums @2xl:text-[64px]">
              99.99%
            </div>
          </div>
        </section>

        {/* One component, at larger than real size */}
        <section className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
          <p className="text-lg/snug font-semibold tracking-tight">
            Comments, in context.
          </p>
          <div className="mt-auto flex items-center justify-between gap-4 rounded-2xl bg-zinc-50 p-4 pt-6 ring-1 ring-black/5 dark:bg-zinc-800/60 dark:ring-white/10">
            <div>
              <div className="text-[15px] font-medium">Preview comments</div>
              <div className="text-[13px] text-zinc-500">
                {comments ? "On for all branches" : "Off"}
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={comments}
              aria-label="Preview comments"
              onClick={() => setComments((v) => !v)}
              className={`relative h-8 w-[52px] flex-none rounded-full transition-colors duration-200 outline-offset-2 focus-visible:outline-2 focus-visible:outline-sky-500 ${
                comments ? "bg-sky-500" : "bg-zinc-300 dark:bg-zinc-600"
              }`}
            >
              <span
                className={`absolute top-1 left-1 size-6 rounded-full bg-white shadow-sm transition-transform duration-200 ease-[cubic-bezier(.3,.75,.1,1)] ${
                  comments ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </section>

        {/* Statement, inverted as the grid's punctuation */}
        <section className="flex flex-col justify-between rounded-3xl bg-zinc-900 p-6 text-white ring-1 ring-black/5 dark:bg-zinc-50 dark:text-zinc-950">
          <RotateCcw className="size-6 text-sky-400 dark:text-sky-600" aria-hidden />
          <p className="mt-8 text-[28px]/[1.1] font-semibold tracking-tight">
            Roll back in one click.
          </p>
        </section>

        {/* Collection, bleeding off the right */}
        <section className="relative flex flex-col overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
          <p className="text-lg/snug font-semibold tracking-tight">
            Reviewed together.{" "}
            <span className="text-zinc-500 dark:text-zinc-400">Seats are free.</span>
          </p>
          <div className="mt-auto -mr-10 flex pt-6">
            {PEOPLE.map((p, i) => (
              <span
                key={p.initials}
                className={`${p.bg} -ml-3 grid size-14 flex-none place-items-center rounded-full text-[15px] font-semibold text-white ring-4 ring-white first:ml-0 dark:ring-zinc-900`}
                style={{ zIndex: PEOPLE.length - i }}
              >
                {p.initials}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ArrowUpRight, BookOpen, SquarePen } from "lucide-react";

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

/** Steps through `holds` (ms per step) in a loop. Step 0 is the poster. */
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

/** Animates its height to whatever its children measure. */
function AutoHeight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div
      className={`overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(.25,.8,.25,1)] ${className}`}
      style={{ height }}
    >
      <div ref={inner}>{children}</div>
    </div>
  );
}

const QUESTION = "How do I make my gallery work offline?";
const ANSWER =
  "Register a service worker that precaches the app shell and every page when it installs. Serve navigations from the cache first, fall back to an offline page, and rename the cache on each deploy so updates land cleanly.";
const WORDS = ANSWER.split(" ");
const SOURCES = ["Progressive Web Apps guide", "Service Worker API"];

// poster, exit, empty, question, thinking, streaming, sources
const HOLDS = [2600, 700, 500, 900, 1500, WORDS.length * 55 + 300, 700] as const;

export default function AiAnswer() {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const step = useLoop(HOLDS, inView && !reduced);
  const [streamed, setStreamed] = useState(0);

  useEffect(() => {
    if (step !== 5) return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setStreamed(n);
      if (n >= WORDS.length) window.clearInterval(id);
    }, 55);
    return () => {
      window.clearInterval(id);
      setStreamed(0);
    };
  }, [step]);

  const exiting = step === 1;
  const hasQuestion = step === 0 || step >= 3;
  const thinking = step === 4;
  const words = step <= 1 || step === 6 ? WORDS.length : step === 5 ? streamed : 0;
  const hasAnswer = words > 0;
  const hasSources = step === 0 || step === 6;
  const empty = step === 2;

  return (
    <div
      ref={ref}
      className="relative h-full w-full overflow-hidden bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
    >
      <div className="absolute top-10 right-16 -bottom-10 left-16 flex flex-col rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,.06),0_24px_60px_-16px_rgba(0,0,0,.22)] ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
        <div className="flex h-12 flex-none items-center justify-between border-b border-black/5 px-5 dark:border-white/10">
          <div className="flex items-center gap-2 text-[14px] font-medium">
            <BookOpen className="size-4 text-zinc-500" aria-hidden />
            Ask the docs
          </div>
          <span
            className={`inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-[13px] text-zinc-600 ring-1 ring-black/10 transition-[background-color,scale] duration-150 dark:text-zinc-300 dark:ring-white/15 ${
              exiting ? "scale-95 bg-zinc-100 dark:bg-zinc-800" : ""
            }`}
          >
            <SquarePen className="size-3.5" aria-hidden />
            New chat
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden px-8 pt-7">
          <p
            className={`absolute inset-x-0 top-24 text-center text-[15px] text-zinc-400 transition-opacity duration-300 ${
              empty ? "opacity-100" : "opacity-0"
            }`}
          >
            Ask anything about building for the web
          </p>

          <div className="flex justify-end">
            <div
              className={`max-w-[75%] rounded-2xl rounded-br-md bg-zinc-900 px-4 py-2.5 text-[15px]/6 text-white transition-[opacity,translate] ease-[cubic-bezier(.25,.8,.25,1)] dark:bg-zinc-100 dark:text-zinc-900 ${
                hasQuestion && !exiting
                  ? "translate-y-0 opacity-100 duration-500"
                  : exiting
                    ? "opacity-0 duration-300"
                    : "translate-y-3 opacity-0 duration-0"
              }`}
              style={{ transitionDelay: exiting ? "120ms" : "0ms" }}
            >
              {QUESTION}
            </div>
          </div>

          <div className="mt-6 max-w-[88%]">
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                thinking ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <span className="ai-thinking inline-block text-[15px] font-medium [--shimmer-base:#a1a1aa] [--shimmer-hi:#27272a] dark:[--shimmer-base:#52525b] dark:[--shimmer-hi:#f4f4f5]">
                  Thinking
                </span>
              </div>
            </div>

            <div
              className={`transition-opacity ${exiting ? "opacity-0 duration-300" : "opacity-100 duration-200"}`}
              style={{ transitionDelay: exiting ? "60ms" : "0ms" }}
            >
              <AutoHeight>
                {hasAnswer && (
                  <p className="text-[15px]/7 text-zinc-700 dark:text-zinc-300">
                    {WORDS.slice(0, words).map((w, i) => (
                      <span key={i} className="ai-word">
                        {w}{" "}
                      </span>
                    ))}
                  </p>
                )}
              </AutoHeight>
            </div>

            <div
              className={`mt-4 flex flex-wrap gap-2 transition-[opacity,translate] ease-[cubic-bezier(.25,.8,.25,1)] ${
                hasSources && !exiting
                  ? "translate-y-0 opacity-100 duration-500"
                  : exiting
                    ? "opacity-0 duration-300"
                    : "translate-y-1 opacity-0 duration-0"
              }`}
            >
              {SOURCES.map((s) => (
                <span
                  key={s}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-zinc-100 px-3 text-[13px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {s}
                  <ArrowUpRight className="size-3.5 text-zinc-400" aria-hidden />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style href="ss-ai-answer" precedence="default">{`
        .ai-thinking {
          color: transparent;
          background: linear-gradient(90deg, var(--shimmer-base) 35%, var(--shimmer-hi) 50%, var(--shimmer-base) 65%) 0 0 / 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: ai-shimmer 1.6s linear infinite;
        }
        .ai-word { animation: ai-word-in 220ms ease-out both; }
        @keyframes ai-shimmer { from { background-position: 100% 0; } to { background-position: -150% 0; } }
        @keyframes ai-word-in { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .ai-thinking, .ai-word { animation: none; }
        }
      `}</style>
    </div>
  );
}

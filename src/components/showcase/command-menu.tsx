"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  CircleCheck,
  FileText,
  FolderPlus,
  Moon,
  Search,
  Settings,
  SquarePlus,
  UserPlus,
} from "lucide-react";

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

const QUERY = "invite";
const COMMANDS = [
  { label: "Invite teammate", icon: UserPlus, hint: "Members" },
  { label: "Invite to project", icon: FolderPlus, hint: "Projects" },
  { label: "New issue", icon: SquarePlus, hint: "C" },
  { label: "Search docs", icon: FileText, hint: "/" },
  { label: "Toggle theme", icon: Moon, hint: "T" },
  { label: "Open settings", icon: Settings, hint: "," },
];
const ROW_H = 40;

// poster, enter, toast, toast out, ⌘K, open, typing
const HOLDS = [1800, 260, 2400, 700, 450, 900, QUERY.length * 120 + 500] as const;

function Key({ children, pressed }: { children: React.ReactNode; pressed: boolean }) {
  return (
    <kbd
      className={`grid h-11 min-w-11 place-items-center rounded-lg bg-gradient-to-b from-white to-zinc-100 px-2.5 font-sans text-[17px] font-medium text-zinc-700 ring-1 ring-zinc-300 transition-[translate,box-shadow] duration-100 dark:from-zinc-700 dark:to-zinc-800 dark:text-zinc-100 dark:ring-zinc-600 ${
        pressed
          ? "translate-y-0.5 shadow-[inset_0_-1px_0_rgba(0,0,0,.08)]"
          : "shadow-[inset_0_-2px_0_rgba(0,0,0,.08),0_2px_4px_rgba(0,0,0,.12)]"
      }`}
    >
      {children}
    </kbd>
  );
}

export default function CommandMenu() {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const step = useLoop(HOLDS, inView && !reduced);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (step !== 6) return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setTyped(n);
      if (n >= QUERY.length) window.clearInterval(id);
    }, 120);
    return () => {
      window.clearInterval(id);
      setTyped(0);
    };
  }, [step]);

  const open = step === 0 || step === 1 || step >= 5;
  const query = step === 0 || step === 1 ? QUERY : step === 6 ? QUERY.slice(0, typed) : "";
  const toast = step === 2;
  const keysShown = step === 1 || step === 4 || step === 5;
  const keys = step >= 1 && step <= 3 ? "enter" : "cmdk";
  const pressed = step === 1 || step === 4;
  const matches = COMMANDS.map((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div
      ref={ref}
      className="relative h-full w-full overflow-hidden bg-zinc-200/70 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
    >
      {/* The app underneath: quiet filler */}
      <div className="absolute top-10 right-10 -bottom-12 left-10 flex overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-24px_rgba(0,0,0,.35)] ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
        <aside className="w-48 flex-none space-y-3 border-r border-black/5 bg-zinc-50 p-5 dark:border-white/10 dark:bg-zinc-900">
          {[60, 72, 48, 66, 54].map((w, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="size-3.5 rounded bg-zinc-200 dark:bg-zinc-700" />
              <span className="h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700" style={{ width: `${w}%` }} />
            </div>
          ))}
        </aside>
        <div className="flex-1 space-y-4 p-7">
          <span className="block h-2.5 w-40 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          {[80, 64, 72, 58, 76, 50].map((w, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-black/[.04] pb-4 dark:border-white/5">
              <span className="size-7 rounded-full bg-zinc-100 dark:bg-zinc-800" />
              <span className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800" style={{ width: `${w * 0.6}%` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Palette, pinned by its top edge */}
      <div
        className={`absolute top-[72px] left-1/2 w-[460px] -translate-x-1/2 origin-top rounded-2xl bg-white/95 shadow-[0_0_0_1px_rgba(0,0,0,.06),0_24px_64px_-12px_rgba(0,0,0,.35)] backdrop-blur transition-[opacity,scale] dark:bg-zinc-800/95 dark:shadow-[0_0_0_1px_rgba(255,255,255,.08),0_24px_64px_-12px_rgba(0,0,0,.7)] ${
          open ? "scale-100 opacity-100 duration-200 ease-out" : "scale-[.97] opacity-0 duration-150 ease-in"
        }`}
      >
        <div className="flex h-14 items-center gap-3 border-b border-black/5 px-4 dark:border-white/10">
          <Search className="size-[18px] text-zinc-400" aria-hidden />
          <span className="relative text-[16px]">
            {query || <span className="text-zinc-400">Type a command or search…</span>}
            {step === 6 && (
              <span className="absolute top-1/2 -right-1 h-5 w-px -translate-y-1/2 bg-sky-500" />
            )}
          </span>
        </div>
        <div className="relative p-2">
          <span
            className="absolute inset-x-2 top-2 rounded-lg bg-zinc-100 transition-transform duration-200 dark:bg-zinc-700/60"
            style={{ height: ROW_H }}
          />
          {COMMANDS.map((c, i) => {
            const Icon = c.icon;
            const shown = matches[i];
            return (
              <div
                key={c.label}
                className={`relative grid items-center overflow-hidden transition-[height,opacity] duration-200 ${shown ? "opacity-100" : "opacity-0"}`}
                style={{ height: shown ? ROW_H : 0 }}
              >
                <div className="flex items-center gap-3 px-3 text-[14px]">
                  <Icon className="size-4 text-zinc-500 dark:text-zinc-400" aria-hidden />
                  <span>{c.label}</span>
                  <span className="ml-auto text-[12px] text-zinc-400">{c.hint}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast */}
      <div
        className={`absolute right-16 bottom-10 flex w-[300px] items-start gap-3 rounded-xl bg-zinc-900 p-4 text-white shadow-[0_16px_40px_-12px_rgba(0,0,0,.45)] transition-[opacity,translate] ease-[cubic-bezier(.25,.8,.25,1)] dark:bg-zinc-100 dark:text-zinc-900 ${
          toast ? "translate-y-0 opacity-100 duration-500" : "translate-y-2 opacity-0 duration-300"
        }`}
      >
        <CircleCheck className="mt-0.5 size-[18px] flex-none text-emerald-400 dark:text-emerald-600" aria-hidden />
        <div>
          <div className="text-[14px] font-medium">Invite sent to Maya</div>
          <div className="mt-0.5 text-[13px] text-zinc-400 dark:text-zinc-500">
            She can join Gallery launch from her email.
          </div>
        </div>
      </div>

      {/* Keys being pressed */}
      <div
        className={`absolute bottom-10 left-16 flex gap-1.5 transition-opacity duration-200 ${keysShown ? "opacity-100" : "opacity-0"}`}
        aria-hidden
      >
        {keys === "enter" ? (
          <Key pressed={pressed}>↵</Key>
        ) : (
          <>
            <Key pressed={pressed}>⌘</Key>
            <Key pressed={pressed}>K</Key>
          </>
        )}
      </div>
    </div>
  );
}

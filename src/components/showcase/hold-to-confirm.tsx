"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { Check, Trash2, Undo2 } from "lucide-react";

const HOLD_MS = 1200;

type Phase = "idle" | "holding" | "done";

export default function HoldToConfirm() {
  const [phase, setPhase] = useState<Phase>("idle");
  const hintId = useId();

  const start = () => {
    if (phase === "idle") setPhase("holding");
  };
  const cancel = () => {
    if (phase === "holding") setPhase("idle");
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.key === " " || e.key === "Enter") && !e.repeat) {
      e.preventDefault();
      start();
    }
  };
  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") cancel();
  };

  const holding = phase === "holding";
  const done = phase === "done";

  return (
    <div className="grid h-full w-full place-items-center bg-zinc-100 p-6 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="w-full max-w-[400px] rounded-3xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,.05),0_20px_40px_-20px_rgba(0,0,0,.2)] ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
        <div className="text-[16px] font-semibold">Delete “gallery-v1”</div>
        <p className="mt-1 text-[14px]/6 text-zinc-500 dark:text-zinc-400">
          Removes 16 previews and their offline cache. Hold the button to confirm.
        </p>

        <div className="mt-5 grid">
          <button
            type="button"
            disabled={done}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              start();
            }}
            onPointerUp={cancel}
            onPointerCancel={cancel}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onContextMenu={(e) => e.preventDefault()}
            aria-describedby={hintId}
            className={`relative col-start-1 row-start-1 h-12 touch-none overflow-hidden rounded-xl text-[15px] font-medium transition-[opacity,scale,background-color] duration-200 outline-offset-2 select-none focus-visible:outline-2 focus-visible:outline-red-500 ${
              done ? "pointer-events-none scale-95 opacity-0" : "opacity-100"
            } ${holding ? "scale-[.98]" : ""} bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300`}
          >
            <span
              className="absolute inset-0 origin-left bg-red-600 ease-linear"
              style={{
                transform: `scaleX(${holding || done ? 1 : 0})`,
                transitionProperty: "transform",
                transitionDuration: holding ? `${HOLD_MS}ms` : "300ms",
                transitionTimingFunction: holding ? "linear" : "cubic-bezier(.3,.75,.1,1)",
              }}
              onTransitionEnd={() => {
                if (phase === "holding") setPhase("done");
              }}
              aria-hidden
            />
            {/* The white label is clipped to the fill, so it reads on both colors */}
            <span className="relative inline-flex items-center gap-2">
              <Trash2 className="size-4" aria-hidden />
              Hold to delete
            </span>
            <span
              className="absolute inset-0 flex items-center justify-center gap-2 text-white"
              style={{
                clipPath: `inset(0 ${holding || done ? 0 : 100}% 0 0)`,
                transition: holding ? `clip-path ${HOLD_MS}ms linear` : "clip-path 300ms cubic-bezier(.3,.75,.1,1)",
              }}
              aria-hidden
            >
              <Trash2 className="size-4" />
              Hold to delete
            </span>
          </button>

          <div
            className={`col-start-1 row-start-1 flex h-12 items-center justify-between rounded-xl bg-zinc-100 px-4 text-[14px] transition-[opacity,translate] duration-300 dark:bg-zinc-800 ${
              done ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
            }`}
            aria-hidden={!done}
          >
            <span className="inline-flex items-center gap-2 font-medium">
              <span className="grid size-5 place-items-center rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                <Check className="size-3" strokeWidth={3} aria-hidden />
              </span>
              Project deleted
            </span>
            <button
              type="button"
              tabIndex={done ? 0 : -1}
              onClick={() => setPhase("idle")}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium text-zinc-600 outline-offset-2 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-sky-500 dark:text-zinc-300 dark:hover:text-white"
            >
              <Undo2 className="size-4" aria-hidden />
              Undo
            </button>
          </div>
        </div>
        <p id={hintId} className="sr-only">
          Press and hold for about one second. Release early to cancel.
        </p>
        <p className="sr-only" aria-live="polite">
          {done ? "Project deleted" : ""}
        </p>
      </div>
    </div>
  );
}

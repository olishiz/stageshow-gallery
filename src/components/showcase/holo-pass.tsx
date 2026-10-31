"use client";

import { useEffect, useRef, useSyncExternalStore, type PointerEvent } from "react";

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

const MAX_TILT = 9;

export default function HoloPass() {
  const reduced = useReducedMotion();
  const card = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0.5, y: 0.5, active: 0 });
  const current = useRef({ x: 0.5, y: 0.5, active: 0 });
  const frame = useRef(0);
  const reducedRef = useRef(reduced);

  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // Ease toward the target each frame so the card has a little weight; stop once settled.
  const tick = () => {
    const el = card.current;
    if (!el) return;
    const c = current.current;
    const t = target.current;
    c.x += (t.x - c.x) * 0.12;
    c.y += (t.y - c.y) * 0.12;
    c.active += (t.active - c.active) * 0.12;
    const tilt = reducedRef.current ? 0 : 1;
    el.style.setProperty("--rx", `${(0.5 - c.y) * MAX_TILT * 2 * c.active * tilt}deg`);
    el.style.setProperty("--ry", `${(c.x - 0.5) * MAX_TILT * 2 * c.active * tilt}deg`);
    el.style.setProperty("--px", `${c.x * 100}%`);
    el.style.setProperty("--py", `${c.y * 100}%`);
    el.style.setProperty("--lift", `${c.active * tilt}`);
    const settled =
      Math.abs(t.x - c.x) + Math.abs(t.y - c.y) + Math.abs(t.active - c.active) < 0.001;
    frame.current = settled ? 0 : requestAnimationFrame(tick);
  };

  const aim = (next: { x: number; y: number; active: number }) => {
    target.current = next;
    if (!frame.current) frame.current = requestAnimationFrame(tick);
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    aim({
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
      active: 1,
    });
  };
  const rest = () => aim({ x: 0.5, y: 0.5, active: 0 });
  const focus = () => aim({ x: 0.3, y: 0.25, active: 1 });

  return (
    <div className="@container grid h-full w-full place-items-center bg-zinc-200 dark:bg-[#0b0b0f]" style={{ perspective: 900 }}>
      <div
        ref={card}
        tabIndex={0}
        role="img"
        aria-label="Stageshow Pass for Oliver Sim, member number 0001"
        onPointerMove={onMove}
        onPointerLeave={rest}
        onFocus={focus}
        onBlur={rest}
        className="holo-card relative aspect-[1.586] w-[360px] @max-[480px]:w-[328px] overflow-hidden rounded-[20px] bg-[linear-gradient(140deg,#fafafa,#e4e4e7)] text-zinc-900 ring-1 ring-black/10 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-[linear-gradient(140deg,#27272a,#09090b)] dark:text-zinc-50 dark:ring-white/10"
      >
        <div className="holo-lines absolute inset-0 opacity-60 dark:opacity-40" aria-hidden />
        <div className="holo-sheen absolute inset-0" aria-hidden />
        <div className="holo-glare absolute inset-0" aria-hidden />

        <div className="relative flex h-full flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
                Stageshow
              </div>
              <div className="mt-0.5 text-[17px] font-semibold tracking-tight">Gallery Pass</div>
            </div>
            <div className="text-right font-mono text-[12px] text-zinc-500 dark:text-zinc-400">No. 0001</div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[20px] font-semibold tracking-tight">Oliver Sim</div>
              <div className="text-[13px] text-zinc-500 dark:text-zinc-400">@olishiz</div>
            </div>
            <div className="text-right text-[11px] leading-4 text-zinc-500 dark:text-zinc-400">
              Valid
              <br />
              <span className="font-mono text-[12px] text-zinc-800 dark:text-zinc-200">∞ / ∞</span>
            </div>
          </div>
        </div>
      </div>

      <style href="ss-holo-pass" precedence="default">{`
        .holo-card {
          --rx: 0deg; --ry: 0deg; --px: 50%; --py: 50%; --lift: 0;
          transform: rotateX(var(--rx)) rotateY(var(--ry)) translateZ(0) scale(calc(1 + var(--lift) * 0.03));
          box-shadow:
            0 1px 2px rgba(0,0,0,.08),
            0 calc(18px + var(--lift) * 20px) calc(40px + var(--lift) * 30px) calc(-18px) rgba(15,23,42,.45);
          will-change: transform;
        }
        .holo-lines {
          background: repeating-radial-gradient(circle at 110% -10%, transparent 0 9px, rgba(120,120,140,.18) 9px 10px);
        }
        .holo-sheen {
          background: linear-gradient(115deg,
            transparent 20%, rgba(56,189,248,.35) 36%, rgba(250,204,21,.3) 48%,
            rgba(244,114,182,.3) 60%, transparent 76%);
          background-size: 220% 220%;
          background-position: var(--px) var(--py);
          mix-blend-mode: color-dodge;
          opacity: calc(.35 + var(--lift) * .55);
        }
        .holo-glare {
          background: radial-gradient(circle at var(--px) var(--py), rgba(255,255,255,.55), transparent 45%);
          mix-blend-mode: soft-light;
          opacity: var(--lift);
        }
      `}</style>
    </div>
  );
}

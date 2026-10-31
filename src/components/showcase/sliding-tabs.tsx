"use client";

import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";

const TABS = [
  {
    id: "overview",
    label: "Overview",
    title: "16 components",
    body: "Bento grids, animated stills, cards, heroes and micro-interactions.",
  },
  {
    id: "activity",
    label: "Activity",
    title: "Last deploy 2 minutes ago",
    body: "Precached the app shell and every component page for offline use.",
  },
  {
    id: "settings",
    label: "Settings",
    title: "Reduced motion respected",
    body: "Animations rest on their poster frame when your system asks for less motion.",
  },
];

export default function SlidingTabs() {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const el = tabs.current[active];
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    tabs.current.forEach((t) => t && ro.observe(t));
    return () => ro.disconnect();
  }, [active]);

  const onKeyDown = (e: KeyboardEvent) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    let next = active;
    if (delta) next = (active + delta + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="grid h-full w-full place-items-center bg-zinc-100 p-6 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="w-full max-w-[440px]">
        <div
          role="tablist"
          aria-label="Project"
          onKeyDown={onKeyDown}
          className="relative inline-flex rounded-full bg-zinc-200/70 p-1 dark:bg-zinc-800/80"
        >
          <span
            className="absolute inset-y-1 rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-[left,width] duration-300 ease-[cubic-bezier(.3,.75,.1,1)] motion-reduce:transition-none dark:bg-zinc-600 dark:ring-white/10"
            style={pill ? { left: pill.left, width: pill.width } : { left: 4, width: 0 }}
            aria-hidden
          />
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${id}-tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-controls={`${id}-panel-${t.id}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative h-9 rounded-full px-4 text-[14px] font-medium transition-colors outline-offset-2 focus-visible:outline-2 focus-visible:outline-sky-500 ${
                active === i ? "text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Panels share one cell, so the card keeps its height while they swap */}
        <div className="mt-4 grid rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,.05),0_16px_32px_-16px_rgba(0,0,0,.18)] ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
          {TABS.map((t, i) => (
            <div
              key={t.id}
              id={`${id}-panel-${t.id}`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${t.id}`}
              aria-hidden={active !== i}
              inert={active !== i}
              className={`col-start-1 row-start-1 transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-none ${
                active === i ? "translate-y-0 opacity-100 delay-75" : "pointer-events-none translate-y-2 opacity-0"
              }`}
            >
              <div className="text-[18px] font-semibold tracking-tight">{t.title}</div>
              <p className="mt-2 text-[14px]/6 text-zinc-500 dark:text-zinc-400">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ArrowUpRight, BookMarked, Plus } from "lucide-react";

export default function ProfileCard() {
  const [following, setFollowing] = useState(false);

  return (
    <div className="@container grid h-full w-full place-items-center bg-[radial-gradient(90%_80%_at_50%_0%,#e0f2fe,#f4f4f5_70%)] p-6 @max-[480px]:p-3 text-zinc-900 dark:bg-[radial-gradient(90%_80%_at_50%_0%,#0c2235,#09090b_70%)] dark:text-zinc-100">
      <article className="w-full max-w-[440px] rounded-3xl bg-white p-6 @max-[480px]:p-5 shadow-[0_1px_2px_rgba(0,0,0,.05),0_24px_48px_-20px_rgba(2,6,23,.3)] ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
        <div className="flex items-center gap-4 @max-[480px]:gap-3">
          <span className="grid size-14 flex-none place-items-center rounded-full bg-zinc-900 @max-[480px]:size-12 text-lg font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
            OS
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[17px] font-semibold">Oliver Sim</div>
            <a
              href="https://github.com/olishiz"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[14px] text-zinc-500 underline-offset-4 hover:underline dark:text-zinc-400"
            >
              @olishiz
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          </div>
          <button
            type="button"
            aria-pressed={following}
            onClick={() => setFollowing((v) => !v)}
            className={`grid h-9 flex-none items-center rounded-full px-4 @max-[480px]:px-3.5 text-[14px] font-medium transition-colors duration-200 outline-offset-2 focus-visible:outline-2 focus-visible:outline-sky-500 ${
              following
                ? "bg-zinc-100 text-zinc-900 ring-1 ring-black/10 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-white/10 dark:hover:bg-zinc-700"
                : "bg-sky-600 text-white hover:bg-sky-700"
            }`}
          >
            {/* Both labels share one cell, so the button keeps the wider footprint */}
            <span
              className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5 transition-[opacity,translate] duration-200 ${
                following ? "-translate-y-1 opacity-0" : "opacity-100"
              }`}
              aria-hidden={following}
            >
              <Plus className="size-4" aria-hidden />
              Follow
            </span>
            <span
              className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5 transition-[opacity,translate] duration-200 ${
                following ? "opacity-100" : "translate-y-1 opacity-0"
              }`}
              aria-hidden={!following}
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path
                  d="M5 12.5 10 17.5 19 7"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={following ? 0 : 1}
                  className="transition-[stroke-dashoffset] delay-100 duration-300 ease-out motion-reduce:transition-none"
                />
              </svg>
              Following
            </span>
          </button>
        </div>

        <p className="mt-5 text-[15px]/6 text-zinc-600 dark:text-zinc-300">
          Collecting interfaces worth showing off, one careful component at a time.
        </p>

        <div className="mt-5 rounded-2xl bg-zinc-50 p-4 ring-1 ring-black/5 dark:bg-zinc-800/60 dark:ring-white/10">
          <div className="flex items-center gap-2 text-[14px] font-medium">
            <BookMarked className="size-4 text-zinc-500" aria-hidden />
            stageshow-gallery
            <span className="ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium text-zinc-500 ring-1 ring-black/10 dark:ring-white/15">
              Pinned
            </span>
          </div>
          <p className="mt-1.5 text-[13px] text-zinc-500 dark:text-zinc-400">Showcase UI you can browse offline.</p>
          <div className="mt-3 flex items-center gap-1.5 text-[12px] text-zinc-500 dark:text-zinc-400">
            <span className="size-2.5 rounded-full bg-[#3178c6]" />
            TypeScript
          </div>
        </div>
      </article>
    </div>
  );
}

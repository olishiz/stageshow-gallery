"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

const BASE = 1284;
const PARTICLES = 10;

function Digit({ value }: { value: number }) {
  return (
    <span className="relative inline-block h-[1.25em] w-[0.6em] overflow-hidden">
      <span
        className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-400 ease-[cubic-bezier(.3,.75,.1,1)] motion-reduce:transition-none"
        style={{ transform: `translateY(${-value * 1.25}em)` }}
      >
        {Array.from({ length: 10 }, (_, d) => (
          <span key={d} className="h-[1.25em] text-center leading-[1.25em]">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function LikeBurst() {
  const [liked, setLiked] = useState(false);
  const [bursts, setBursts] = useState(0);
  const count = BASE + (liked ? 1 : 0);
  const text = count.toLocaleString("en-US");

  const toggle = () => {
    setLiked((v) => !v);
    if (!liked) setBursts((b) => b + 1);
  };

  return (
    <div className="@container grid h-full w-full place-items-center bg-rose-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="flex items-center gap-5 rounded-full bg-white py-3.5 pr-9 pl-3.5 @max-[480px]:gap-4 @max-[480px]:pr-7 @max-[480px]:pl-3 shadow-[0_1px_2px_rgba(0,0,0,.05),0_16px_40px_-16px_rgba(190,18,60,.25)] ring-1 ring-black/5 dark:bg-zinc-900 dark:shadow-none dark:ring-white/10">
        <button
          type="button"
          aria-pressed={liked}
          aria-label={liked ? "Unlike" : "Like"}
          onClick={toggle}
          className="relative grid size-20 place-items-center rounded-full @max-[480px]:size-16 outline-offset-2 transition-colors duration-200 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-rose-500 dark:hover:bg-rose-500/10"
        >
          {liked && (
            <span key={bursts} className="pointer-events-none absolute inset-0 motion-reduce:hidden" aria-hidden>
              <span className="like-ring absolute inset-2 rounded-full border-2 border-rose-400" />
              {Array.from({ length: PARTICLES }, (_, i) => (
                <span
                  key={i}
                  className="like-dot absolute top-1/2 left-1/2 size-1.5 rounded-full"
                  style={{
                    ["--a" as string]: `${(360 / PARTICLES) * i}deg`,
                    background: i % 2 ? "#fb7185" : "#fbbf24",
                  }}
                />
              ))}
            </span>
          )}
          <Heart
            className={`size-10 @max-[480px]:size-8 transition-colors duration-200 ${
              liked ? "like-pop fill-rose-500 text-rose-500" : "fill-transparent text-zinc-400 dark:text-zinc-500"
            }`}
            strokeWidth={2}
            aria-hidden
          />
        </button>
        <div>
          <div className="flex text-[36px]/none font-semibold @max-[480px]:text-[32px]/none tracking-tight tabular-nums" aria-hidden>
            {text.split("").map((ch, i) =>
              /\d/.test(ch) ? <Digit key={i} value={Number(ch)} /> : <span key={i}>{ch}</span>,
            )}
          </div>
          <span className="sr-only" aria-live="polite">
            {text} likes
          </span>
          <div className="mt-1.5 text-[14px] text-zinc-500">people liked this component</div>
        </div>
      </div>

      <style href="ss-like-burst" precedence="default">{`
        .like-pop { animation: like-pop 450ms cubic-bezier(.3,1.6,.5,1); }
        .like-ring { animation: like-ring 500ms ease-out forwards; }
        .like-dot {
          margin: -3px 0 0 -3px;
          animation: like-dot 600ms cubic-bezier(.2,.8,.3,1) forwards;
        }
        @keyframes like-pop { 0% { scale: .6 } 60% { scale: 1.18 } 100% { scale: 1 } }
        @keyframes like-ring { from { scale: .4; opacity: 1 } to { scale: 1.35; opacity: 0; border-width: 0 } }
        @keyframes like-dot {
          0% { transform: rotate(var(--a)) translateY(0) scale(1); opacity: 1 }
          100% { transform: rotate(var(--a)) translateY(-50px) scale(0); opacity: 0 }
        }
        @media (prefers-reduced-motion: reduce) {
          .like-pop { animation: none; }
        }
      `}</style>
    </div>
  );
}

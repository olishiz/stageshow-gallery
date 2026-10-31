"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

const COMMAND = "npx skills add benjitaylor/skills --skill stageshow";

export default function CopyCommand() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(COMMAND);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); still confirm the press.
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="@container grid h-full w-full place-items-center bg-zinc-100 p-6 @max-[480px]:p-4 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="w-full max-w-[500px]">
        <div className="mb-3 flex items-baseline justify-between px-1 @max-[480px]:flex-col @max-[480px]:gap-0.5">
          <span className="text-[15px] font-medium">Install the Stageshow skill</span>
          <span className="text-[13px] text-zinc-500">by Benji Taylor</span>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white p-2 pl-4 shadow-[0_1px_2px_rgba(0,0,0,.05),0_12px_32px_-16px_rgba(0,0,0,.2)] ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
          <code className="min-w-0 flex-1 overflow-x-auto font-mono text-[13px] whitespace-nowrap @max-[480px]:leading-5 @max-[480px]:whitespace-normal [scrollbar-width:none]">
            <span className="text-zinc-400 select-none">$ </span>
            {COMMAND}
          </code>
          <div className="relative flex-none">
            <span
              className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-zinc-900 px-2 py-1 text-[12px] font-medium whitespace-nowrap text-white transition-[opacity,translate] duration-200 dark:bg-zinc-100 dark:text-zinc-900 ${
                copied ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              }`}
              aria-hidden
            >
              Copied
            </span>
            <button
              type="button"
              onClick={copy}
              aria-label={copied ? "Copied" : "Copy command"}
              className="grid size-10 place-items-center rounded-xl text-zinc-600 transition-[background-color,scale] duration-150 outline-offset-2 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-sky-500 active:scale-90 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Copy
                className={`col-start-1 row-start-1 size-[18px] transition-[opacity,scale,filter] duration-200 ${
                  copied ? "scale-50 opacity-0 blur-[2px]" : "scale-100 opacity-100 blur-0"
                }`}
                aria-hidden
              />
              <Check
                className={`col-start-1 row-start-1 size-[18px] text-emerald-600 transition-[opacity,scale,filter] duration-200 dark:text-emerald-400 ${
                  copied ? "scale-100 opacity-100 blur-0" : "scale-50 opacity-0 blur-[2px]"
                }`}
                strokeWidth={2.5}
                aria-hidden
              />
            </button>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {copied ? "Command copied to clipboard" : ""}
        </p>
      </div>
    </div>
  );
}

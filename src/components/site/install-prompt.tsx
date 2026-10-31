"use client";

import { useState, useSyncExternalStore } from "react";
import { Download, Share, SquarePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePwa } from "./pwa-provider";

const KEY = "install-prompt-dismissed";

function useDismissed() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("storage", cb);
      return () => window.removeEventListener("storage", cb);
    },
    () => localStorage.getItem(KEY) === "1",
    () => true,
  );
}

export function InstallPrompt() {
  const { canPrompt, isIOS, isStandalone, promptInstall } = usePwa();
  const stored = useDismissed();
  const [closed, setClosed] = useState(false);

  const dismissed = stored || closed;
  const showNative = canPrompt && !dismissed;
  const showIOS = isIOS && !isStandalone && !dismissed;
  if (!showNative && !showIOS) return null;

  const dismiss = () => {
    localStorage.setItem(KEY, "1");
    setClosed(true);
  };

  return (
    <aside
      aria-label="Install the app"
      className="fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-40 mx-auto max-w-sm animate-in rounded-2xl border bg-popover p-4 text-popover-foreground shadow-[0_20px_50px_-20px_rgba(0,0,0,.35)] duration-300 fade-in slide-in-from-bottom-4 motion-reduce:animate-none sm:right-5 sm:left-auto sm:mx-0"
    >
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon-192.png" alt="" width={40} height={40} className="size-10 flex-none rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Install Stageshow Gallery</p>
          {showNative ? (
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Keep it on your home screen and browse every component offline.
            </p>
          ) : (
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Tap <Share className="inline size-3.5 align-[-2px]" aria-label="Share" /> then{" "}
              <span className="whitespace-nowrap">
                <SquarePlus className="inline size-3.5 align-[-2px]" aria-hidden /> Add to Home Screen
              </span>
              .
            </p>
          )}
          {showNative && (
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={() => promptInstall().then(dismiss)}>
                <Download data-icon="inline-start" aria-hidden />
                Install
              </Button>
              <Button size="sm" variant="ghost" onClick={dismiss}>
                Not now
              </Button>
            </div>
          )}
        </div>
        <Button size="icon-sm" variant="ghost" aria-label="Dismiss" onClick={dismiss} className="-mt-1 -mr-1">
          <X aria-hidden />
        </Button>
      </div>
    </aside>
  );
}

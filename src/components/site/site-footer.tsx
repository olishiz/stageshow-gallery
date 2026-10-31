"use client";

import { CircleCheck } from "lucide-react";
import { usePwa } from "./pwa-provider";

export function SiteFooter() {
  const { offlineReady } = usePwa();
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          Curated by{" "}
          <a href="https://github.com/olishiz" target="_blank" rel="noreferrer" className="font-medium text-foreground underline-offset-4 hover:underline">
            Oliver Sim
          </a>
          . Crafted with Benji Taylor&rsquo;s{" "}
          <a
            href="https://github.com/benjitaylor/skills"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Stageshow skill
          </a>
          .
        </p>
        <p className="inline-flex items-center gap-1.5" aria-live="polite">
          {offlineReady ? (
            <>
              <CircleCheck className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
              Saved for offline use
            </>
          ) : (
            "Installable and offline-ready"
          )}
        </p>
      </div>
    </footer>
  );
}

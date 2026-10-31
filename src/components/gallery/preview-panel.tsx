"use client";

import { useState } from "react";
import { Moon, MousePointerClick, RotateCcw, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SHOWCASE_COMPONENTS } from "@/components/showcase";
import { useSiteTheme } from "@/components/site/theme-toggle";
import type { ShowcaseMeta } from "@/lib/registry";
import { FluidStage, ScaledStage } from "./stage";

type Theme = "light" | "dark";

export function PreviewPanel({ meta }: { meta: ShowcaseMeta }) {
  const siteTheme = useSiteTheme();
  const [override, setOverride] = useState<Theme | null>(null);
  const [runs, setRuns] = useState(0);
  const theme = override ?? siteTheme;
  const Component = SHOWCASE_COMPONENTS[meta.slug];

  return (
    <section aria-label="Live preview" className="overflow-hidden rounded-3xl border border-border/70 bg-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/70 px-3 py-2.5 sm:px-4">
        <ToggleGroup
          aria-label="Preview theme"
          value={[theme]}
          onValueChange={(v) => v[0] && setOverride(v[0] as Theme)}
          spacing={1}
          className="rounded-full bg-muted p-0.5"
        >
          <ToggleGroupItem value="light" size="sm" className="rounded-full px-3 aria-pressed:bg-background aria-pressed:shadow-sm">
            <Sun data-icon="inline-start" aria-hidden />
            Light
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" size="sm" className="rounded-full px-3 aria-pressed:bg-background aria-pressed:shadow-sm">
            <Moon data-icon="inline-start" aria-hidden />
            Dark
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          {meta.interactive && (
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <MousePointerClick className="size-4" aria-hidden />
              Interactive, try it
            </span>
          )}
          {meta.animated && (
            <Button variant="ghost" size="sm" onClick={() => setRuns((r) => r + 1)}>
              <RotateCcw data-icon="inline-start" aria-hidden />
              Replay
            </Button>
          )}
        </div>
      </div>

      <div className={theme}>
        {meta.fluid ? (
          <FluidStage width={meta.width} height={meta.height}>
            <Component key={runs} />
          </FluidStage>
        ) : (
          <div className="grid place-items-center bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] [background-size:16px_16px] p-3 sm:p-8">
            <ScaledStage
              width={meta.width}
              height={meta.height}
              capAtDesignSize
              className="rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,.06),0_20px_50px_-24px_rgba(0,0,0,.35)] ring-1 ring-black/5 dark:ring-white/10"
            >
              <Component key={runs} />
            </ScaledStage>
          </div>
        )}
      </div>
    </section>
  );
}

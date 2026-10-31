"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CATEGORIES, SHOWCASES, categoryLabel, type CategoryId } from "@/lib/registry";
import { SHOWCASE_COMPONENTS } from "@/components/showcase";
import { ScaledStage } from "./stage";

type Filter = CategoryId | "all";
const EVENT = "gallery-filter";

function readFilter(): Filter {
  const c = new URLSearchParams(window.location.search).get("category");
  return CATEGORIES.some((x) => x.id === c) ? (c as CategoryId) : "all";
}

function useFilter() {
  const filter = useSyncExternalStore(
    (cb) => {
      window.addEventListener("popstate", cb);
      window.addEventListener(EVENT, cb);
      return () => {
        window.removeEventListener("popstate", cb);
        window.removeEventListener(EVENT, cb);
      };
    },
    readFilter,
    () => "all" as Filter,
  );
  const setFilter = (next: Filter) => {
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new Event(EVENT));
  };
  return [filter, setFilter] as const;
}

export function GalleryGrid() {
  const [filter, setFilter] = useFilter();
  const items = filter === "all" ? SHOWCASES : SHOWCASES.filter((s) => s.category === filter);
  const options: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: SHOWCASES.length },
    ...CATEGORIES.map((c) => ({
      id: c.id,
      label: c.label,
      count: SHOWCASES.filter((s) => s.category === c.id).length,
    })),
  ];

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="scroll-mt-20">
      <h2 id="gallery-heading" className="sr-only">
        Components
      </h2>
      <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
        <ToggleGroup
          aria-label="Filter by category"
          value={[filter]}
          onValueChange={(v) => setFilter((v[0] as Filter | undefined) ?? "all")}
          spacing={1}
          className="w-max"
        >
          {options.map((o) => (
            <ToggleGroupItem
              key={o.id}
              value={o.id}
              size="lg"
              className="rounded-full px-3.5 text-muted-foreground aria-pressed:bg-foreground aria-pressed:text-background hover:aria-pressed:bg-foreground/90 hover:aria-pressed:text-background"
            >
              {o.label}
              <span className="ml-1 text-xs tabular-nums opacity-60">{o.count}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {items.length} {items.length === 1 ? "component" : "components"}
      </p>

      <ul className="mt-6 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => {
          const Component = SHOWCASE_COMPONENTS[s.slug];
          return (
            <li key={s.slug} className="group relative">
              <div
                inert
                aria-hidden
                className="overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-[0_1px_2px_rgba(0,0,0,.04)] transition-[box-shadow,translate] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,.35)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
              >
                <ScaledStage
                  width={s.width}
                  height={s.height}
                  compact={s.compact}
                  switchOn="viewport"
                  reflowWhenCompact={s.fluid}
                >
                  <Component />
                </ScaledStage>
              </div>
              <div className="mt-3 flex items-start justify-between gap-3 px-0.5">
                <div className="min-w-0">
                  <h3 className="font-medium tracking-tight">
                    <Link
                      href={`/components/${s.slug}`}
                      className="rounded-sm outline-offset-4 after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      {s.title}
                    </Link>
                  </h3>
                  <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{s.summary}</p>
                </div>
                <span className="mt-0.5 flex flex-none items-center gap-1 text-xs whitespace-nowrap text-muted-foreground">
                  {categoryLabel(s.category)}
                  <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

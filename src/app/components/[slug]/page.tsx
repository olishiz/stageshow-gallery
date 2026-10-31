import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CodeView } from "@/components/gallery/code-view";
import { PreviewPanel } from "@/components/gallery/preview-panel";
import { SHOWCASES, categoryLabel, getShowcase } from "@/lib/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return SHOWCASES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/components/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const meta = getShowcase(slug);
  if (!meta) return {};
  return { title: meta.title, description: meta.summary };
}

export default async function ComponentPage({ params }: PageProps<"/components/[slug]">) {
  const { slug } = await params;
  const meta = getShowcase(slug);
  if (!meta) notFound();

  const index = SHOWCASES.findIndex((s) => s.slug === slug);
  const prev = SHOWCASES[(index - 1 + SHOWCASES.length) % SHOWCASES.length];
  const next = SHOWCASES[(index + 1) % SHOWCASES.length];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 sm:pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-foreground">
              Gallery
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={`/?category=${meta.category}`} className="hover:text-foreground">
              {categoryLabel(meta.category)}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{meta.title}</h1>
          <p className="mt-3 text-base/7 text-pretty text-muted-foreground sm:text-lg/7">{meta.summary}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{categoryLabel(meta.category)}</Badge>
          {meta.animated && <Badge variant="outline">Animated</Badge>}
          {meta.interactive && <Badge variant="outline">Interactive</Badge>}
          {meta.fluid && <Badge variant="outline">Responsive</Badge>}
        </div>
      </div>

      <div className="mt-8">
        <PreviewPanel meta={meta} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside>
          <h2 className="text-sm font-semibold">Craft notes</h2>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            {meta.notes.map((n) => (
              <li key={n} className="flex gap-2.5">
                <Check className="mt-0.5 size-4 flex-none text-emerald-600 dark:text-emerald-400" aria-hidden />
                <span>{n}</span>
              </li>
            ))}
          </ul>
          <h2 className="mt-8 text-sm font-semibold">Use it</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            One self-contained client component. Needs React, Tailwind CSS v4 and{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[12px] text-foreground">lucide-react</code>. Dark styles use
            Tailwind&rsquo;s <code className="rounded bg-muted px-1 py-0.5 font-mono text-[12px] text-foreground">dark:</code> variant.
          </p>
        </aside>
        <CodeView slug={meta.slug} />
      </div>

      <nav aria-label="More components" className="mt-12 grid gap-3 border-t border-border/70 pt-6 sm:grid-cols-2">
        <Link
          href={`/components/${prev.slug}`}
          className="group flex items-center gap-3 rounded-2xl border border-border/70 p-4 transition-colors hover:bg-muted"
        >
          <ArrowLeft className="size-4 text-muted-foreground transition-transform group-hover:-translate-x-0.5" aria-hidden />
          <span>
            <span className="block text-xs text-muted-foreground">Previous</span>
            <span className="font-medium">{prev.title}</span>
          </span>
        </Link>
        <Link
          href={`/components/${next.slug}`}
          className="group flex items-center justify-end gap-3 rounded-2xl border border-border/70 p-4 text-right transition-colors hover:bg-muted"
        >
          <span>
            <span className="block text-xs text-muted-foreground">Next</span>
            <span className="font-medium">{next.title}</span>
          </span>
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </nav>
    </div>
  );
}

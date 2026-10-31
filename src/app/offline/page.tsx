import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";
import { SHOWCASES } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false },
};

export default function OfflinePage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center sm:py-28">
      <span className="grid size-14 place-items-center rounded-2xl bg-muted">
        <WifiOff className="size-6 text-muted-foreground" aria-hidden />
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">You are offline</h1>
      <p className="mt-3 text-pretty text-muted-foreground">
        This page has not been saved yet, but the gallery and every component page are stored on this device. Pick one
        below; they all open without a connection.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Back to the gallery
      </Link>
      <ul className="mt-10 flex flex-wrap justify-center gap-2">
        {SHOWCASES.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/components/${s.slug}`}
              className="inline-flex h-8 items-center rounded-full border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {s.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

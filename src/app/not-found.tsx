import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Nothing staged here</h1>
      <p className="mt-3 text-muted-foreground">That component does not exist, or it moved.</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Browse the gallery
      </Link>
    </div>
  );
}

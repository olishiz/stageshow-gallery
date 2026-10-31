import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { SHOWCASES } from "@/lib/registry";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 pb-20 sm:px-6 sm:pt-16">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">Oliver Sim · @olishiz</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Showcase UI, staged with care.
        </h1>
        <p className="mt-4 text-lg/7 text-pretty text-muted-foreground">
          {SHOWCASES.length} faux product screens, bento grids, cards, heroes and micro-interactions. Open any of them
          for a live preview in light or dark and code you can copy. Install it, and the whole gallery works offline.
        </p>
      </div>
      <div className="mt-10">
        <GalleryGrid />
      </div>
    </div>
  );
}

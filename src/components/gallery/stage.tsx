import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Size = { width: number; height: number };

type StageProps = Size & {
  children: ReactNode;
  /** A second design for narrow slots; the component restyles itself with container queries. */
  compact?: Size;
  /**
   * When to switch to the compact design: when the stage itself is narrow
   * (`container`, for detail pages) or when the viewport is phone-sized
   * (`viewport`, for the gallery grid, so desktop thumbnails stay uniform).
   */
  switchOn?: "container" | "viewport";
  /** Phone gallery only: let a responsive design reflow at full width and crop its foot. */
  reflowWhenCompact?: boolean;
  /** Never scale above the design size; the frame centers in wider slots. */
  capAtDesignSize?: boolean;
  className?: string;
  frameClassName?: string;
};

/**
 * Shows a fixed-size design scaled to its slot's width with pure CSS, so the
 * server-rendered frame is already the right size before hydration. Below the
 * switch point it shows the compact design instead, near 1:1, rather than
 * shrinking the wide one until its text is unreadable. Rules live in globals.css.
 */
export function ScaledStage({
  width,
  height,
  compact,
  switchOn = "container",
  reflowWhenCompact,
  capAtDesignSize,
  className,
  frameClassName,
  children,
}: StageProps) {
  const vars = {
    "--stage-w": width,
    "--stage-h": height,
    "--stage-cw": compact?.width ?? width,
    "--stage-ch": compact?.height ?? height,
  } as CSSProperties;
  return (
    <div
      className={cn(
        "ss-stage",
        switchOn === "viewport" ? "ss-stage--viewport" : "ss-stage--container",
        reflowWhenCompact && "ss-stage--reflow",
        capAtDesignSize && "ss-stage--capped",
        className,
      )}
      style={vars}
    >
      <div className={cn("ss-stage__frame", frameClassName)}>
        <div className="ss-stage__canvas">{children}</div>
      </div>
    </div>
  );
}

/** A design that reflows: it fills its slot and takes the design's aspect once wide enough. */
export function FluidStage({ width, height, children, className }: Size & { children: ReactNode; className?: string }) {
  return (
    <div className={cn("@container/fluid w-full", className)}>
      <div
        className="w-full @min-[1000px]/fluid:aspect-(--stage-aspect)"
        style={{ "--stage-aspect": `${width} / ${height}` } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

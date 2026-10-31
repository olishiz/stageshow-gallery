import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type StageProps = {
  width: number;
  height: number;
  children: ReactNode;
  className?: string;
  /** Never scale above the design size; the stage centers in wider slots. */
  capAtDesignSize?: boolean;
};

/**
 * Shows a fixed-size design scaled to its slot's width with pure CSS, so the
 * server-rendered frame is already the right size before hydration.
 * `tan(atan2(a, b))` yields the unitless ratio a / b.
 */
export function ScaledStage({ width, height, children, className, capAtDesignSize }: StageProps) {
  const ratio = `tan(atan2(100cqw, ${width}px))`;
  const scale = capAtDesignSize ? `min(1, ${ratio})` : ratio;
  return (
    <div
      className={cn("@container/stage relative w-full overflow-hidden", className)}
      style={{ aspectRatio: `${width} / ${height}`, maxWidth: capAtDesignSize ? width : undefined }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width, height, scale } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

/** A design that reflows: it fills its slot and takes the design's aspect once wide enough. */
export function FluidStage({ width, height, children, className }: StageProps) {
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

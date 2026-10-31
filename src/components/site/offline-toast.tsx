"use client";

import { useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

function useOnline() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("online", cb);
      window.addEventListener("offline", cb);
      return () => {
        window.removeEventListener("online", cb);
        window.removeEventListener("offline", cb);
      };
    },
    () => navigator.onLine,
    () => true,
  );
}

export function OfflineToast() {
  const online = useOnline();
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3">
      {!online && (
        <div className="inline-flex animate-in items-center gap-2 rounded-full bg-foreground px-3.5 py-2 text-[13px] font-medium text-background shadow-lg duration-300 fade-in slide-in-from-top-2 motion-reduce:animate-none">
          <WifiOff className="size-4" aria-hidden />
          You are offline. The whole gallery is still here.
        </div>
      )}
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type PwaState = {
  /** Chrome/Edge/Android captured `beforeinstallprompt`, so a native prompt can be shown. */
  canPrompt: boolean;
  /** iOS Safari never fires `beforeinstallprompt`; installation is via Share → Add to Home Screen. */
  isIOS: boolean;
  isStandalone: boolean;
  /** The service worker has precached the gallery. */
  offlineReady: boolean;
  promptInstall: () => Promise<"accepted" | "dismissed" | "unavailable">;
};

const PwaContext = createContext<PwaState>({
  canPrompt: false,
  isIOS: false,
  isStandalone: false,
  offlineReady: false,
  promptInstall: async () => "unavailable",
});

export const usePwa = () => useContext(PwaContext);

const STANDALONE = "(display-mode: standalone)";

function useStandalone() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(STANDALONE);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () =>
      window.matchMedia(STANDALONE).matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true,
    () => false,
  );
}

function useIsIOS() {
  return useSyncExternalStore(
    () => () => {},
    () =>
      /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
    () => false,
  );
}

export function PwaProvider({ children }: { children: ReactNode }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [offlineReady, setOfflineReady] = useState(false);
  const isStandalone = useStandalone();
  const isIOS = useIsIOS();

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setDeferred(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    let cancelled = false;
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === "PRECACHED") setOfflineReady(true);
    };
    navigator.serviceWorker.addEventListener("message", onMessage);
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then(async () => {
        const reg = await navigator.serviceWorker.ready;
        if (!cancelled && reg.active) setOfflineReady(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener("message", onMessage);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferred) return "unavailable" as const;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    return outcome;
  }, [deferred]);

  const value = useMemo(
    () => ({
      canPrompt: !!deferred && !isStandalone,
      isIOS,
      isStandalone,
      offlineReady,
      promptInstall,
    }),
    [deferred, isIOS, isStandalone, offlineReady, promptInstall],
  );

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
}

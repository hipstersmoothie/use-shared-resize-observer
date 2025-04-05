import { createContext } from "@radix-ui/react-context";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import type { ObserverEntry, onUpdate } from "./types.js";

interface SharedResizeObserverContext<T extends HTMLElement | null> {
  observe: (entry: ObserverEntry<T>) => void;
  unobserve: (entry: ObserverEntry<T>) => void;
}

const [ObserverContext, useObserverContext] =
  createContext<SharedResizeObserverContext<HTMLElement | null> | null>(
    "SharedResizeObserverContext"
  );

export function SharedResizeObserverProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const observer = useRef<ResizeObserver | null>(null);
  const cbMap = useRef<Map<React.RefObject<HTMLElement | null>, onUpdate>>(
    new Map()
  );

  useLayoutEffect(() => {
    observer.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const [, cb] =
          Array.from(cbMap.current.entries()).find(
            ([ref]) => ref.current === entry.target
          ) || [];

        if (cb) {
          cb(entry);
        }
      }
    });

    return () => {
      observer.current?.disconnect();
    };
  }, []);

  const observe = useCallback((entry: ObserverEntry<HTMLElement | null>) => {
    if (!entry.ref.current) {
      return;
    }

    observer.current?.observe(entry.ref.current);
    cbMap.current.set(entry.ref, entry.onUpdate);
  }, []);

  const unobserve = useCallback((entry: ObserverEntry<HTMLElement | null>) => {
    if (!entry.ref.current) {
      return;
    }

    observer.current?.unobserve(entry.ref.current);
    cbMap.current.delete(entry.ref);
  }, []);

  return (
    <ObserverContext observe={observe} unobserve={unobserve}>
      {children}
    </ObserverContext>
  );
}

export function useSharedResizeObserver<T extends HTMLElement | null>({
  ref,
  onUpdate,
  options,
}: ObserverEntry<T>) {
  const observer = useObserverContext("useSharedResizeObserver");
  const memoizedOptions = useMemo(
    (): ResizeObserverOptions => ({ box: options?.box }),
    [options?.box]
  );
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    if (!observer) {
      return;
    }

    const entry: ObserverEntry<T> = {
      ref,
      onUpdate: (...args) => {
        onUpdateRef.current(...args);
      },
      options: memoizedOptions,
    };

    observer.observe(entry);

    return () => {
      observer.unobserve(entry);
    };
  }, [ref, observer, memoizedOptions]);
}

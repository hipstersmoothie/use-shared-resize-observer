import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type { ObserverEntry, onUpdate } from "./types.js";

interface SharedResizeObserverContext<T extends HTMLElement | null> {
  observe: (entry: ObserverEntry<T>) => void;
  unobserve: (entry: ObserverEntry<T>) => void;
}

const cbMap = new Map<React.RefObject<HTMLElement | null>, onUpdate>();
let observer: ResizeObserver | undefined;
let observerContext:
  | SharedResizeObserverContext<HTMLElement | null>
  | undefined;

function createObserverContext() {
  if (observerContext) {
    return;
  }

  observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const [, cb] =
        Array.from(cbMap.entries()).find(
          ([ref]) => ref.current === entry.target
        ) || [];

      if (cb) {
        cb(entry);
      }
    }
  });

  observerContext = {
    observe: (entry) => {
      if (!entry.ref.current) {
        return;
      }

      observer?.observe(entry.ref.current);
      cbMap.set(entry.ref, entry.onUpdate);
    },
    unobserve: (entry) => {
      if (!entry.ref.current) {
        return;
      }

      observer?.unobserve(entry.ref.current);
      cbMap.delete(entry.ref);

      if (cbMap.size === 0) {
        observer?.disconnect();
        observer = undefined;
      }
    },
  };
}

export function useSharedResizeObserver<T extends HTMLElement | null>({
  ref,
  onUpdate,
  options,
}: ObserverEntry<T>) {
  const memoizedOptions = useMemo(
    (): ResizeObserverOptions => ({ box: options?.box }),
    [options?.box]
  );
  const onUpdateRef = useRef(onUpdate);
  useLayoutEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    createObserverContext();

    const entry: ObserverEntry<T> = {
      ref,
      onUpdate: (...args) => {
        onUpdateRef.current(...args);
      },
      options: memoizedOptions,
    };

    observerContext?.observe(entry);

    return () => {
      observerContext?.unobserve(entry);
    };
  }, [ref, memoizedOptions]);
}

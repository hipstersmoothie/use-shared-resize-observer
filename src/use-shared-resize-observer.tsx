import { useEffect, useMemo, useRef } from "react";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";
import type { ObserverEntry } from "./types.js";
interface SharedResizeObserverContext<T extends HTMLElement | null> {
  observe: (entry: ObserverEntry<T>) => void;
  unobserve: (entry: ObserverEntry<T>) => void;
}

const elementMap = new Map<Element, ObserverEntry<HTMLElement | null>>();
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
      const instance = Array.from(elementMap.values()).find(
        (i) => i.ref.current === entry.target
      );

      if (instance) {
        instance.onUpdate(entry);
      }
      // Else the instance is no longer in the DOM
      else {
        const instance = elementMap.get(entry.target);

        // We found an entry for the detached element
        if (instance?.ref.current) {
          // Stop observing the detached element
          observer?.unobserve(entry.target);
          elementMap.delete(entry.target);

          // Re-attach the instance with the new ref to the observer
          observer?.observe(instance.ref.current);
          elementMap.set(instance.ref.current, instance);
        }
      }
    }
  });

  observerContext = {
    observe: (entry) => {
      if (!entry.ref.current) {
        return;
      }

      observer?.observe(entry.ref.current);
      elementMap.set(entry.ref.current, entry);
    },
    unobserve: (entry) => {
      if (!entry.ref.current) {
        return;
      }

      observer?.unobserve(entry.ref.current);
      elementMap.delete(entry.ref.current);

      if (elementMap.size === 0) {
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

  useIsomorphicLayoutEffect(() => {
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

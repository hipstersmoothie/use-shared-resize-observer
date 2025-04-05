import { useCallback, useRef } from "react";
import { useSharedResizeObserver } from "./use-shared-resize-observer.js";
import type { ObserverEntry } from "./types.js";
import { getSize } from "./utils.js";

export function useSizeRef<T extends HTMLElement | null>(
  input: React.RefObject<T> | Pick<ObserverEntry<T>, "ref" | "options">
) {
  const ref = "current" in input ? input : input.ref;
  const options = "options" in input ? input.options : undefined;
  const sizeRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const onUpdate = useCallback(
    (entry: ResizeObserverEntry) => {
      sizeRef.current = getSize(entry, options?.box);
    },
    [options?.box]
  );

  useSharedResizeObserver({
    ref,
    onUpdate,
    options,
  });

  return sizeRef;
}

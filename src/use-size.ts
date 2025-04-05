import { useCallback, useState } from "react";
import { useSharedResizeObserver } from "./use-shared-resize-observer.js";
import type { ObserverEntry } from "./types.js";
import { getSize } from "./utils.js";

export function useSize<T extends HTMLElement | null>(
  input: React.RefObject<T> | Pick<ObserverEntry<T>, "ref" | "options">
) {
  const ref = "current" in input ? input : input.ref;
  const options = "options" in input ? input.options : undefined;
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const onUpdate = useCallback(
    (entry: ResizeObserverEntry) => {
      setSize(getSize(entry, options?.box));
    },
    [options?.box]
  );

  useSharedResizeObserver({
    ref,
    onUpdate,
    options,
  });

  return size;
}

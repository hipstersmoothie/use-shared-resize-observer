# `use-shared-resize-observer`

A React hook that allows you to observe the size of an element.

This library manages a single `ResizeObserver` instance to reduce the number of DOM API calls and memory allocations.
This provides a performance benefit when observing many elements on the page at once.

## Installation

```bash
npm install use-shared-resize-observer
```

## Usage

Then in a component that needs to know the size of an element, you can use the `useSize` hook.

```tsx
import { useSize } from "use-shared-resize-observer";

function SizeAwareComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  return <div ref={ref}>{JSON.stringify(size)}</div>;
}
```

That's it! The `useSize` hook will return the size of the element whenever it changes.

## API

### `useSize`

A hook that returns the size of an element as a React state.

```tsx
const ref = useRef<HTMLDivElement>(null);
const size = useSize(ref);

// Or with ResizeObserverOptions
const contentBox = useSize({
  ref,
  options: { box: "device-pixel-content-box" },
});
```

### `useSizeRef`

A hook that returns the size of an element as a React ref.

```tsx
const ref = useRef<HTMLDivElement>(null);
const sizeRef = useSizeRef(ref);

// Or with ResizeObserverOptions
const contentBox = useSizeRef({
  ref,
  options: { box: "device-pixel-content-box" },
});

useEffect(() => {
  console.log(sizeRef.current);
}, [sizeRef.current]);
```

### `useSharedResizeObserver`

A hook that observes the size of an element.
Both `useSize` and `useSizeRef` are convenience hooks that use this under the hood.

```tsx
const ref = useRef<HTMLDivElement>(null);
const onUpdate = useCallback((entry: ResizeObserverEntry) => {
  console.log(entry);
}, []);

useSharedResizeObserver({ ref, onUpdate });

// Or with ResizeObserverOptions
useSharedResizeObserver({
  ref,
  onUpdate,
  options: { box: "device-pixel-content-box" },
});
```

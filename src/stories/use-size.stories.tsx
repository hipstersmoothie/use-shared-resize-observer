import React, { useRef, useState } from "react";
import { useSize } from "../use-size.js";
import { useSharedResizeObserver } from "../use-shared-resize-observer.js";
import { useSizeRef } from "../use-size-ref.js";

export const Size = () => {
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  return (
    <div
      ref={ref}
      style={{
        width: "100px",
        height: "100px",
        border: "1px solid red",
        resize: "both",
        overflow: "auto",
      }}
    >
      {size.width} x {size.height}
    </div>
  );
};

export const SizeRef = () => {
  const ref = useRef<HTMLDivElement>(null);
  const size = useSizeRef(ref);

  return (
    <div
      ref={ref}
      style={{
        width: "100px",
        height: "100px",
        border: "1px solid red",
        resize: "both",
        overflow: "auto",
      }}
    >
      <button
        type="button"
        onClick={() => alert(`${size.current.width} x ${size.current.height}`)}
      >
        Report size
      </button>
    </div>
  );
};

export const ResizeObserver = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<"blue" | "red" | "green">("green");

  useSharedResizeObserver({
    ref,
    onUpdate: (entry) => {
      if (entry.contentRect.width > 400) {
        setVariant("blue");
      } else if (entry.contentRect.width < 100) {
        setVariant("red");
      } else {
        setVariant("green");
      }
    },
  });

  return (
    <div
      ref={ref}
      style={{
        width: "150px",
        height: "150px",
        border: "1px solid red",
        resize: "both",
        overflow: "auto",
        backgroundColor: variant,
      }}
    />
  );
};

export const ConditonalElement = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<"blue" | "red" | "green">("green");
  const [toggle, setToggle] = useState(false);

  useSharedResizeObserver({
    ref,
    onUpdate: (entry) => {
      if (entry.contentRect.width > 400) {
        setVariant("blue");
      } else if (entry.contentRect.width < 100) {
        setVariant("red");
      } else {
        setVariant("green");
      }
    },
  });

  const content = (
    <div
      ref={ref}
      style={{
        width: "150px",
        height: "150px",
        resize: "both",
        overflow: "auto",
        backgroundColor: variant,
      }}
    />
  );

  return (
    <>
      <button type="button" onClick={() => setToggle(!toggle)}>
        Toggle
      </button>

      {toggle ? (
        <div style={{ border: "1px solid red", padding: 8 }}>{content}</div>
      ) : (
        content
      )}
    </>
  );
};

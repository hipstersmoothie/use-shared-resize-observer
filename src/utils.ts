export function getSize(
  entry: ResizeObserverEntry,
  box: ResizeObserverOptions["box"] = "content-box"
) {
  const width =
    box === "border-box"
      ? entry.borderBoxSize?.[0]?.inlineSize
      : box === "device-pixel-content-box"
      ? entry.devicePixelContentBoxSize?.[0]?.inlineSize
      : entry.contentRect.width;
  const height =
    box === "border-box"
      ? entry.borderBoxSize?.[0]?.blockSize
      : box === "device-pixel-content-box"
      ? entry.devicePixelContentBoxSize?.[0]?.blockSize
      : entry.contentRect.height;

  return { width: width ?? 0, height: height ?? 0 };
}

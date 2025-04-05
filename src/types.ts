export type onUpdate = (entry: ResizeObserverEntry) => void;

export interface ObserverEntry<T extends HTMLElement | null> {
  ref: React.RefObject<T>;
  onUpdate: onUpdate;
  options?: ResizeObserverOptions;
}

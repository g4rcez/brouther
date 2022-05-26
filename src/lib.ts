import React from "react";

export const modifiedEvent = (e: React.MouseEvent) =>
  !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);

export const preventLinkDefault = (
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) => {
  const el = event.currentTarget;
  const target = el.target || "_self";
  if (event.button === 0 && target === "_self" && !modifiedEvent(event))
    return event.preventDefault();
};

export const isFragment = (Component: any) => Component === React.Fragment;

export function usePrevious<T>(value: T) {
  const ref = React.useRef(value);
  React.useEffect(() => void (ref.current = value), [value]);
  return ref.current;
}

export const createSafeUrl = (pathname: string) =>
  new URL(pathname, window.location.origin);

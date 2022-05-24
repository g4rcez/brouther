import React from "react";
import { useRouter } from "./router";
import { preventLinkDefault } from "./lib";

type Anchor = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & { href: string; replaceState?: boolean };

export const Link = React.forwardRef<HTMLAnchorElement, Anchor>(
  (
    { onClick, replaceState, href, children, ...props }: Anchor,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    const { go, replace } = useRouter();
    const _onClick = React.useCallback(
      (event: React.MouseEvent<HTMLAnchorElement>) => {
        preventLinkDefault(event);
        onClick?.(event);
        return replaceState ? replace(href) : go(href);
      },
      [go, href, onClick, replace, replaceState]
    );
    return (
      <a {...props} href={href} onClick={_onClick} ref={ref}>
        {children}
      </a>
    );
  }
);

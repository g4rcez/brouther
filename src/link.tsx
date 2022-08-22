import React, { useMemo } from "react";
import { useRouter } from "./router";
import { createSafeUrl, preventLinkDefault, stringifyQueryString } from "./lib";

type Anchor = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & { href: string; replaceState?: boolean; queryString?: object | string };

export const Link = React.forwardRef<HTMLAnchorElement, Anchor>(
  (
    { onClick, replaceState, href, children, queryString, ...props }: Anchor,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    const { go, replace, path } = useRouter();
    const _href = useMemo(() => {
      const url = createSafeUrl(href === "" ? path : href);
      url.search =
        typeof queryString === "object"
          ? stringifyQueryString(queryString)
          : queryString ?? "";
      return url.href;
    }, [href, path, queryString]);

    const _onClick = React.useCallback(
      (event: React.MouseEvent<HTMLAnchorElement>) => {
        preventLinkDefault(event);
        onClick?.(event);
        return replaceState ? replace(_href) : go(_href);
      },
      [_href, go, onClick, replace, replaceState]
    );
    return (
      <a {...props} href={_href} onClick={_onClick} ref={ref}>
        {children}
      </a>
    );
  }
);

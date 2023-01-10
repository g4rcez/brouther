import React from "react";
import { ExtractPathname, QueryString, QueryStringExists, UrlParams } from "./types";
import { mergeUrlEntities } from "./utils";
import { useHistory, useRouter } from "./brouther";

const isLeftClick = (e: React.MouseEvent) => e.button === 0;

const isMod = (event: React.MouseEvent): boolean => event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

export type LinkProps<Path extends string> = Omit<
    React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
    "href"
> & {
    href: Path;
    replace?: boolean;
} & (UrlParams<ExtractPathname<Path>> extends null
        ? { params?: undefined }
        : {
              params: UrlParams<ExtractPathname<Path>>;
          }) &
    (QueryStringExists<Path> extends false
        ? { query?: undefined }
        : {
              query: QueryString<Path>;
          });

export const Link = <Props extends string>({ href, replace = false, onClick, query, params, ...props }: LinkProps<Props>) => {
    const { href: contextHref } = useRouter();
    const { push, replace: _replace } = useHistory();
    const _href = mergeUrlEntities(href, params, query);

    const _onClick: NonNullable<typeof onClick> = (event) => {
        event.preventDefault();
        if (_href === contextHref) return;
        if (!isLeftClick(event)) return;
        if (isMod(event)) return;
        onClick?.(event);
        return replace ? _replace(_href) : push(_href);
    };

    return <a {...props} href={_href} onClick={_onClick} />;
};

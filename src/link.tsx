import React from "react";
import { join, mergeUrlEntities } from "./utils";
import { useBasename, useHref, useNavigation } from "./brouther";
import type { Paths } from "./types/paths";
import type { QueryString } from "./types/query-string";

const isLeftClick = (e: React.MouseEvent) => e.button === 0;

const isMod = (event: React.MouseEvent): boolean => event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

export type LinkProps<Path extends string> = Omit<
    React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
    "href"
> & {
    href: Path;
    replace?: boolean;
} & (Paths.Variables<Paths.Pathname<Path>> extends null
        ? { paths?: undefined }
        : {
              paths: Paths.Variables<Paths.Pathname<Path>>;
          }) &
    (QueryString.Has<Path> extends false
        ? { query?: undefined }
        : {
              query: QueryString.Parse<Path>;
          });

export const Link = <Props extends string>({ href, replace = false, onClick, query, paths, ...props }: LinkProps<Props>) => {
    const { push, replace: _replace } = useNavigation();
    const contextHref = useHref();
    const basename = useBasename();
    const _href = join(basename, mergeUrlEntities(href, paths, query));

    const _onClick: NonNullable<typeof onClick> = (event) => {
        if (props.target === undefined && props.target !== "_self") event.preventDefault();
        if (_href === contextHref) return;
        if (!isLeftClick(event)) return;
        if (isMod(event)) return;
        onClick?.(event);
        return replace ? _replace(_href) : push(_href);
    };

    return <a {...props} href={_href} onClick={_onClick} />;
};

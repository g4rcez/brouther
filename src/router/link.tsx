import React from "react";
import { join, mergeUrlEntities } from "../utils/utils";
import { useBasename, useHref, useNavigation } from "../brouther/brouther";
import type { Paths } from "../types/paths";
import type { QueryString } from "../types/query-string";
import { AnyJson } from "../types";
import { X } from "../types/x";

const isLeftClick = (e: React.MouseEvent) => e.button === 0;

const isMod = (event: React.MouseEvent): boolean => event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

export type LinkProps<Path extends string> = Omit<
    React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
    "href"
> & { href: Path; state?: AnyJson; replace?: boolean } & (Paths.Variables<Paths.Pathname<Path>> extends null
        ? { paths?: undefined }
        : Omit<Path, string> extends string
        ? { paths: Paths.Variables<Paths.Pathname<Path>> }
        : { paths?: Paths.Variables<Paths.Pathname<Path>> }) &
    (QueryString.Has<Path> extends false
        ? { query?: undefined }
        : X.AtLeastOne<QueryString.Parse<Path>> extends true
        ? { query: QueryString.Parse<Path> }
        : { query?: QueryString.Parse<Path> });

export const Link = <TPath extends string>({ href, state, replace = false, onClick, query, paths, ...props }: LinkProps<TPath>) => {
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
        return replace ? _replace(_href, state) : push(_href, state);
    };

    return <a {...props} href={_href} onClick={_onClick} />;
};

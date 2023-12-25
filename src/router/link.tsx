import React, { forwardRef } from "react";
import { fetchTarget, join, mergeUrlEntities } from "../utils/utils";
import { useBasename, useFlags, useHref, useNavigation } from "../brouther/brouther";
import type { QueryString } from "../types/query-string";
import { AnyJson } from "../types";
import { Paths } from "../types/paths";
import { TextFragment } from "../utils/text-fragment";
import { QueryStringMapper } from "../utils/mappers";

const isLeftClick = (e: React.MouseEvent) => e.button === 0;

const isMod = (event: React.MouseEvent): boolean => event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

type AnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

type QueryAndPaths<Path extends string> = (Paths.Has<Path> extends true ? { paths: Paths.Parse<Path> } : { paths?: never }) &
    (QueryString.Has<Path> extends true ? { query: NonNullable<QueryString.Parse<Path>> } : { query?: never });

export type LinkProps<Path extends string> = Omit<AnchorProps, "href" | "onClick"> & {
    fragments?: TextFragment[];
    href: Path;
    onClick?: (event: Parameters<NonNullable<AnchorProps["onClick"]>>[0], pathAndQuery: QueryAndPaths<Path>) => void;
    parsers?: Partial<QueryStringMapper<string>>;
    replace?: boolean;
    state?: AnyJson;
} & QueryAndPaths<Path>;

const httpRegex = /^https?:\/\//;

export const Link: <TPath extends string>(props: LinkProps<TPath>) => React.ReactElement = forwardRef(
    <TPath extends string>(
        { href, state, replace = false, onClick, parsers, query, paths, fragments, ...props }: LinkProps<TPath>,
        ref: React.Ref<HTMLAnchorElement>
    ) => {
        const { push, replace: _replace } = useNavigation();
        const contextHref = useHref();
        const basename = useBasename();
        const _href = httpRegex.test(href) ? href : join(basename, mergeUrlEntities(href, paths, query, parsers, fragments));
        const flags = useFlags();
        const openInExternalTab = !!flags?.openExternalLinksInNewTab;
        const target = props.target ?? fetchTarget(openInExternalTab, href);
        const rel = props.rel ?? target === "_blank" ? "noopener noreferrer" : undefined;
        const _onClick: NonNullable<AnchorProps["onClick"]> = (event) => {
            if (target === "_blank") return event.persist();
            if (target === undefined && target !== "_self") event.preventDefault();
            if (_href === contextHref) return;
            if (!isLeftClick(event)) return;
            if (isMod(event)) return;
            onClick?.(event, { query, paths } as QueryAndPaths<TPath>);
            return replace ? _replace(_href, state) : push(_href, state);
        };

        return <a {...props} target={target} rel={rel} href={_href} onClick={_onClick} ref={ref} />;
    }
) as any;

import React, { forwardRef } from "react";
import { useBasename } from "../hooks/use-basename";
import { useFlags } from "../hooks/use-flags";
import { useHref } from "../hooks/use-href";
import { useNavigation } from "../hooks/use-navigation";
import { usePageStats } from "../hooks/use-page-stats";
import { type AnyJson } from "../types";
import { type Paths } from "../types/paths";
import type { QueryString } from "../types/query-string";
import { type QueryStringMapper } from "../utils/mappers";
import { type TextFragment } from "../utils/text-fragment";
import { fetchTarget, join, mergeUrlEntities } from "../utils/utils";

type MouseEvents = Pick<MouseEvent, "button" | "metaKey" | "altKey" | "ctrlKey" | "shiftKey">;

const isLeftClick = (e: MouseEvents) => e.button === 0;

const isMod = (event: MouseEvents): boolean => !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

type AnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

type QueryAndPaths<Path extends string> = (Paths.Has<Path> extends true
    ? { paths: Paths.Parse<Path> }
    : { paths?: never }) &
    (QueryString.Has<Path> extends true
        ? QueryString.HasMandatory<Path> extends true
        ? { query: NonNullable<QueryString.Parse<Path>> }
        : { query?: NonNullable<QueryString.Parse<Path>> }
        : { query?: any });

export type LinkProps<Path extends string> = Omit<AnchorProps, "href" | "onClick"> & {
    fragments?: TextFragment[];
    href?: Path;
    back?: boolean;
    onClick?: (event: Parameters<NonNullable<AnchorProps["onClick"]>>[0], pathAndQuery: QueryAndPaths<Path>) => void;
    parsers?: Partial<QueryStringMapper<string>>;
    replace?: boolean;
    state?: AnyJson;
} & QueryAndPaths<Path>;

const httpRegex = /^https?:\/\//;

const allowClick = (event: MouseEvents, target?: string) =>
    isLeftClick(event) && (!target || target === "_self") && !isMod(event);

export const Link: <TPath extends string>(props: LinkProps<TPath>) => React.ReactElement = forwardRef(
    <TPath extends string>(
        {
            href,
            state,
            onClick,
            parsers,
            query,
            paths,
            fragments,
            back = false,
            replace = false,
            ...props
        }: LinkProps<TPath>,
        ref: React.Ref<HTMLAnchorElement>
    ) => {
        const flags = useFlags();
        const page = usePageStats();
        const navigation = useNavigation();
        const contextHref = useHref();
        const basename = useBasename();
        const _href = href
            ? httpRegex.test(href)
                ? href
                : paths || query
                    ? join(basename || "/", mergeUrlEntities(href, paths, query, parsers, fragments))
                    : href
            : undefined;
        const openInExternalTab = !!flags?.openExternalLinksInNewTab;
        const target = props.target && href ? fetchTarget(openInExternalTab, href) : undefined;
        const rel = (props.rel ?? target === "_blank") ? "noopener noreferrer" : undefined;
        const currentLink = _href ? page?.regex.test(_href) : undefined;

        const _onClick: NonNullable<AnchorProps["onClick"]> = (event) => {
            onClick?.(event, { query, paths } as QueryAndPaths<TPath>);
            if (allowClick(event, target)) {
                event.preventDefault();
                if (back) return void navigation.back();
                if (_href) return replace ? navigation.replace(_href, state) : navigation.push(_href, state);
            }
        };

        return (
            <a
                {...props}
                ref={ref}
                rel={rel}
                href={_href}
                target={target}
                onClick={_onClick}
                draggable={props.draggable ?? false}
                data-current={currentLink || undefined}
            />
        );
    }
) as any;

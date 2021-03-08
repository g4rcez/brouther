import { BrowserHistory, HashHistory, MemoryHistory, To } from "history";
import React, { FC } from "react";
declare type HistoryType = BrowserHistory | HashHistory | MemoryHistory;
export declare const HistoryContext: React.Context<HistoryType & {
    params: object;
}>;
declare type RouteProps = {
    path: string;
    component: FC;
};
export declare const Route: (props: RouteProps) => JSX.Element;
declare type RouterProps = {
    notFound: FC;
    history: HistoryType;
};
export declare const Router: FC<RouterProps>;
declare type A = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & Readonly<{
    href: To;
    state?: any;
}>;
export declare const Link: React.FC<A>;
export declare const Redirect: ({ href }: {
    href: To;
}) => JSX.Element;
export {};

import React, { useEffect, useMemo } from "react";
import { router } from "../router";
import { Link, useHref } from "brouther";
import { Anchor } from "./anchor";

type CursorProps = { title: string; link: string; type: "previous" | "next" };

const Cursor = (props: CursorProps) => {
    const isPrevious = props.type === "previous";
    return (
        <Link className={`flex flex-col gap-2 ${isPrevious ? "text-left" : "text-right"}`} href={props.link}>
            <p className="text-sm">{isPrevious ? "Previous" : "Next"}</p>
            <h3 className="text-transparent text-lg font-extrabold tracking-wide bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500 inline-block">
                {props.title}
            </h3>
        </Link>
    );
};

type Props = { title: string };

type PageItems = Array<{ title: string; link: string }>;

type Pages = Array<{ title: string; items: PageItems }>;

export const DocumentPage = (props: React.PropsWithChildren<Props>) => {
    const pages: Pages = [
        {
            title: "Get Started",
            items: [
                { title: "How to install?", link: router.links.install },
                {
                    title: "Basic Setup",
                    link: router.links.basicSetup,
                },
            ],
        },
        {
            title: "Create your routes",
            items: [
                { title: "createRouter", link: router.links.createRouter },
                { title: "createMappedRouter", link: router.links.createMappedRouter },
            ],
        },
        {
            title: "Components",
            items: [
                { title: "Brouther", link: "" },
                { title: "Link", link: "" },
            ],
        },
        {
            title: "Hooks",
            items: [
                { title: "useErrorPage", link: "" },
                { title: "useHref", link: "" },
                { title: "useNavigation", link: "" },
                { title: "usePage", link: "" },
                { title: "usePaths", link: "" },
                { title: "useQueryString", link: "" },
                { title: "useUrlSearchParams", link: "" },
            ],
        },
    ];

    const allLinks: PageItems = pages.flatMap((x) => x.items);

    const currentPage = useHref();

    const nav = useMemo(() => {
        const current = allLinks.findIndex((x) => x.link === currentPage);
        if (current === -1) return null;
        return { previous: allLinks[current - 1], next: allLinks[current + 1] };
    }, [currentPage]);

    useEffect(() => {
        document.title = `Brouther - ${props.title}`;
    }, [props.title]);

    return (
        <div className="flex flex-row gap-x-8 mt-10 flex-wrap w-full container mx-auto">
            <aside className="max-w-[250px] border-r-slate-400">
                <ul>
                    {pages.map((x) => (
                        <li key={x.title} className="mb-2">
                            <ul>
                                <h3 className="font-extrabold text-xl">{x.title}</h3>
                                {x.items.map((y) => (
                                    <li key={y.title} className="my-1 ml-4">
                                        {y.link === currentPage ? (
                                            <Anchor as={Link} href={y.link}>
                                                {y.title}
                                            </Anchor>
                                        ) : (
                                            <Link className="link:underline" href={y.link}>
                                                {y.title}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </aside>
            <div className="mx-auto gap-8 items-baseline flex flex-col">
                <header className="w-full">
                    <h1 className="text-5xl font-extrabold">{props.title}</h1>
                </header>
                <main className="w-full px-2 md:px-0 container max-w-4xl mx-auto items-baseline gap-4 flex flex-wrap">{props.children}</main>
                {nav === null ? null : (
                    <nav className="min-w-full my-8">
                        <div className="px-2 md:px-6 container flex justify-between max-w-4xl mx-auto gap-8 items-baseline">
                            {!nav.previous ? <div /> : <Cursor {...nav.previous} type="previous" />}
                            {!nav.next ? <div /> : <Cursor {...nav.next} type="next" />}
                        </div>
                    </nav>
                )}
            </div>
        </div>
    );
};

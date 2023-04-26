import React, { useEffect, useMemo, useState } from "react";
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
    const [menu, setMenu] = useState("open");
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
                { title: "Brouther", link: router.links.brouther },
                { title: "Link", link: router.links.linkComponent },
                { title: "Form", link: router.links.form },
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
        return { previous: allLinks[current - 1], next: allLinks[current + 1], current: allLinks[current] };
    }, [currentPage]);

    useEffect(() => {
        document.title = `Brouther - ${props.title}`;
    }, [props.title]);

    return (
        <div className="flex flex-row gap-4 mt-6 md:mt-10 w-full container flex-wrap md:flex-nowrap mx-auto px-4 md:px-0 relative">
            <button onClick={() => setMenu((p) => (p === "closed" ? "open" : "closed"))} className="w-full block border-b md:hidden">
                <h3 className="font-extrabold text-2xl mb-4">{nav?.current.title} +</h3>
            </button>
            <aside className="w-full max-w-[220px] border-r-slate-400 block sticky top-20">
                <ul
                    data-state={menu}
                    className="transition-transform data-[state=closed]:h-0 data-[state=closed]:scale-0 data-[state=closed]:opacity-0 data-[state=open]:scale-100 origin-top duration-300 data-[state=open]:h-auto data-[state=open]:opacity-100 md:h-auto md-scale-100 md:opacity-100"
                >
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
            <div className="gap-8 flex flex-col flex-nowrap w-full flex-shrink max-w-5xl container">
                <header className="w-full">
                    <h1 className="text-5xl font-extrabold">{props.title}</h1>
                </header>
                <main className="w-full w-min-full container prose max-w-5xl prose-slate prose-p:text-left prose-h2:text-slate-700 prose-h3:text-slate-700">
                    {props.children}
                </main>
                {nav === null ? null : (
                    <nav className="min-w-full my-8">
                        <div className="container flex justify-between mx-auto items-center">
                            {!nav.previous ? <div /> : <Cursor {...nav.previous} type="previous" />}
                            {!nav.next ? <div /> : <Cursor {...nav.next} type="next" />}
                        </div>
                    </nav>
                )}
            </div>
        </div>
    );
};

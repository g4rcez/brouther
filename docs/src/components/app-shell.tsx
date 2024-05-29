import React, { PropsWithChildren } from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { links } from "../lib";
import { Link } from "../exports";
import { Footer } from "./footer";
import { router } from "../router";
import { dependencies } from "../../package.json";

export const AppShell: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="w-full h-screen flex flex-col">
            <header className="w-full bg-slate-900 py-4 text-white fixed top-0 isolate z-20">
                <nav className="w-full flex flex-row container mx-auto text-xl gap-4 items-center justify-between px-4 md:px-0">
                    <a href="/">
                        <h2 className="font-extrabold">brouther@v{dependencies.brouther}</h2>
                    </a>
                    <div className="flex-row items-center gap-6 text-base hidden md:flex">
                        <Link href={router.links.install} className="link:underline text-base">
                            <span>Get Started</span>
                        </Link>
                        <Link href={router.links.playground} className="link:underline text-base">
                            <span>Playground</span>
                        </Link>
                        <a href={links.github} className="link:underline gap-x-1 flex items-center">
                            <GitHubLogoIcon aria-describedby="github-icon" />
                            Github
                            <span id="github-icon" className="sr-only">
                                Github Icon
                            </span>
                        </a>
                    </div>
                </nav>
            </header>
            <div className="flex flex-1 mt-10">{children}</div>
            <Footer />
        </div>
    );
};

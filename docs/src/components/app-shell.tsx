import React, { PropsWithChildren } from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { links } from "../lib";
import { Link } from "brouther";
import { Footer } from "./footer";
import { router } from "../router";
import { dependencies } from "../../package.json";

export const AppShell: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="w-full h-screen flex flex-col">
            <header className="w-full bg-slate-900 py-4 text-white sticky top-0">
                <nav className="w-full flex flex-row container mx-auto text-xl gap-4 items-center justify-between">
                    <a href="/">
                        <h2 className="font-extrabold">Brouther@v{dependencies.brouther}</h2>
                    </a>
                    <div className="flex flex-row items-center gap-6 text-base">
                        <Link href={router.links.install} className="link:underline text-base">
                            <span>Get Started</span>
                        </Link>
                        <Link href={router.links.examples} className="link:underline text-base">
                            <span>Examples</span>
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
            {children}
            <Footer />
        </div>
    );
};

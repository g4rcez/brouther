import React from "react";
import { Anchor } from "./anchor";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link } from "../../../src";

export const Footer = () => {
    return (
        <footer className="w-full bg-slate-950 py-8 text-white text-center mt-auto">
            <section className="flex justify-center items-center">
                <Anchor href="https://github.com/g4rcez/brouther" target="_blank" as={Link}>
                    <GitHubLogoIcon className="text-white inline-block mr-1 mb-0.5" />
                    Github
                </Anchor>
            </section>
        </footer>
    );
};

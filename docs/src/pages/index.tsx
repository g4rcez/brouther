import { Button } from "../components/button";
import { Card } from "../components/card";
import { MagicWandIcon, MagnifyingGlassIcon, MixIcon, RocketIcon } from "@radix-ui/react-icons";
import React, { Fragment } from "react";
import { Anchor } from "../components/anchor";
import { Link } from "brouther";
import { router } from "../router";

const features = [
    <Fragment>
        Familiar API using <Anchor href="https://github.com/remix-run/history">history</Anchor>
    </Fragment>,
    <Fragment>Typescript out of the box 📦</Fragment>,
    <Fragment>
        1<sup className="italic">st</sup> class Dynamic paths or params
    </Fragment>,
    <Fragment>Query String support using URL Search Params</Fragment>,
    <Fragment>Or using plain old Javascript objects</Fragment>,
    <Fragment>Route Alias to avoid magic strings in your code</Fragment>,
    <Fragment>Error Boundary</Fragment>,
    <Fragment>Utility to create URLs</Fragment>,
    <Fragment>Simple API, less effort to remember things</Fragment>,
    <Fragment>
        Lightweight - <Anchor href="https://bundlephobia.com/package/brouther@latest">Less than 8Kb</Anchor>
    </Fragment>,
];

export default function IndexPage() {
    return (
        <main className="w-full px-2 md:px-0 gap-y-24 flex flex-col flex-wrap">
            <section className="w-full flex flex-col gap-4 p-12 items-center justify-center py-36 bg-slate-900 text-white">
                <h1 className="text-7xl md:text-9xl font-extrabold text-transparent bg-clip-text leading-1 bg-gradient-to-r from-indigo-400 to-violet-600">
                    Brouther
                </h1>
                <h3 className="text-2xl font-medium px-2 md:max-w-xl text-center">
                    Lightweight and fully <span className="text-[#4476C0]">typed</span> router for React applications
                </h3>
                <Link href={router.links.install}>
                    <Button className="bg-gradient-to-r font-medium from-indigo-400 to-violet-600 block mt-2 text-white">Get started</Button>
                </Link>
            </section>
            <section className="grid grid-cols-1 md:grid-cols-2 container max-w-5xl mx-auto gap-12 items-baseline">
                <Card title="Typesafe" Icon={RocketIcon}>
                    <p>
                        Lightweight and fully type-safe router for React. Supports dynamic paths and query string types. You can choose between plain
                        JavaScript objects or use browser <i>APIs</i> like{" "}
                        <Anchor href="https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams">URL Search Params</Anchor>
                    </p>
                </Card>
                <Card title="Next Level DX" Icon={MagicWandIcon}>
                    <p>
                        Using a fully connected type system, you can track all of your{" "}
                        <Anchor href={router.links.aliases} as={Link}>
                            routes using aliases
                        </Anchor>
                        . You will never need to write strings in your code, just use the alias and see the magic of your new router
                    </p>
                </Card>
                <Card title="Easy Config" Icon={MixIcon}>
                    <p>
                        You need to change basename? Easy. You have feature flags feature on your app? Brouther can take care. You need full control
                        of your routes? Just use{" "}
                        <Anchor href={router.links.hooks} as={Link}>
                            Brouther hooks
                        </Anchor>{" "}
                        and you will have full power over pages, errors and URL state.
                    </p>
                </Card>
                <Card title="Want more?" Icon={MagnifyingGlassIcon}>
                    <p>
                        Just this? You can check all features and benefits of Brouther. You can read at{" "}
                        <Anchor href={router.links.hooks} as={Link}>
                            Brouther features
                        </Anchor>{" "}
                        or you can do your own app using Brouther. Don't know how? Check on{" "}
                        <Anchor href={router.links.examples} as={Link}>
                            Examples section
                        </Anchor>
                        .
                    </p>
                </Card>
            </section>
            <section className="w-full bg-slate-950 py-12 text-white">
                <h2 className="text-6xl font-extrabold text-center">All features</h2>
                <p className="text-center text-slate-300">Brouther it's a simple router with a very powerful DX.</p>
                <ul className="container max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 text-center mt-6">
                    {features.map((x, i) => (
                        <li className="my-2" key={`${i}-brouther-features`}>
                            {x}
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}

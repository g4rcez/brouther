import { MagicWandIcon, MagnifyingGlassIcon, MixIcon, RocketIcon } from "@radix-ui/react-icons";
import { Fragment } from "react";
import { Anchor } from "../components/anchor";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Link } from "../exports";
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
    <Fragment>Scroll control and restoration</Fragment>,
];

export default function IndexPage() {
    return (
        <main className="flex flex-col flex-wrap gap-y-24 w-full md:px-0">
            <section className="flex flex-col gap-4 justify-center items-center p-12 py-36 w-full text-white bg-slate-900">
                <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-400 md:text-9xl">
                    Brouther
                </h1>
                <h3 className="px-2 text-2xl font-medium text-center md:max-w-xl">
                    Lightweight and fully <span className="text-[#4476C0]">typed</span> router for React applications
                </h3>
                <Link href={router.links.install}>
                    <Button className="block mt-2 font-medium text-white bg-gradient-to-r from-indigo-400 to-violet-600">
                        Get started
                    </Button>
                </Link>
            </section>
            <section className="container grid grid-cols-1 gap-12 items-baseline px-2 mx-auto max-w-5xl md:grid-cols-2">
                <Card title="Typesafe" Icon={RocketIcon}>
                    <p>
                        Lightweight and fully type-safe router for React. Supports dynamic paths and query string types.
                        You can choose between plain JavaScript objects or use browser <i>APIs</i> like{" "}
                        <Anchor href="https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams">
                            URL Search Params
                        </Anchor>
                    </p>
                </Card>
                <Card title="Next Level DX" Icon={MagicWandIcon}>
                    <p>
                        Using a fully connected type system, you can track all of your{" "}
                        <Anchor href={router.links.aliases}>routes using aliases</Anchor>. You will never need to write
                        strings in your code, just use the alias and see the magic of your new router
                    </p>
                </Card>
                <Card title="Easy Config" Icon={MixIcon}>
                    <p>
                        You need to change basename? Easy. You have feature flags feature on your app? Brouther can take
                        care. You need full control of your routes? Just use{" "}
                        <Anchor href={router.links.hooks}>Brouther hooks</Anchor> and you will have full power over
                        pages, errors and URL state.
                    </p>
                </Card>
                <Card title="Want more?" Icon={MagnifyingGlassIcon}>
                    <p>
                        Just this? You can check all features and benefits of Brouther. You can read at{" "}
                        <Anchor href={router.links.hooks}>Brouther features</Anchor> or you can do your own app using
                        Brouther. Don't know how? Check on{" "}
                        <Anchor href={router.links.playground}>Examples section</Anchor>.
                    </p>
                </Card>
            </section>
            <section className="py-12 w-full text-white bg-slate-950">
                <h2 className="text-6xl font-extrabold text-center">All features</h2>
                <p className="text-center text-slate-300">Brouther it's a simple router with a very powerful DX.</p>
                <ul className="container grid grid-cols-1 mx-auto mt-6 max-w-5xl text-center md:grid-cols-2">
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

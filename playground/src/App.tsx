import { Link, NotFoundRoute, Outlet, useErrorPage, usePaths, useQueryString } from "../../src";
import { router } from "./routes";
import { NotFound } from "./not-found";

function App() {
    const error = useErrorPage<NotFoundRoute>();
    const queryString = useQueryString();
    const paths = usePaths();

    return (
        <div className="min-w-full min-h-screen flex flex-col">
            <header className="w-full bg-black text-white mb-10 fixed top-0 left-0">
                <nav className="max-w-md container mx-auto py-4 flex flex-row gap-8 justify-between">
                    <h1 className="font-extrabold">
                        <Link href="https://github.com/g4rcez/brouther">Brouther</Link>
                    </h1>
                    <ul className="inline-flex gap-4">
                        <li>
                            <Link className="link:underline" href={router.links.index}>
                                Index Page
                            </Link>
                        </li>
                        <li>
                            <Link className="link:underline" href={router.links.users} query={{ sort: "desc" }}>
                                Users
                            </Link>
                        </li>

                        <li>
                            <Link className="link:underline" href={router.links.blog}>
                                Blog
                            </Link>
                        </li>
                        <li>
                            <Link className="link:underline" href="/404">
                                404
                            </Link>
                        </li>
                        <li>
                            <button onClick={() => alert(JSON.stringify(queryString, null, 4))}>Print QS</button>
                        </li>
                        <li>
                            <button onClick={() => alert(JSON.stringify(paths, null, 4))}>Print Paths</button>
                        </li>
                    </ul>
                </nav>
            </header>
            <div className="w-full container max-w-lg mx-auto mt-20 px-4 md:px-0">
                <main className="page">
                    <Outlet />
                </main>
                <NotFound error={error} />
            </div>
        </div>
    );
}

export default App;

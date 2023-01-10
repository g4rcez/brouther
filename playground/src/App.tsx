import "./App.css";
import { usePage, Link, useQueryString, useParams, useErrorPage, NotFoundRoute } from "../../src";
import { router } from "./routes";
import { NotFound } from "./not-found";

function App() {
    const page = usePage();
    const error = useErrorPage<NotFoundRoute>();
    const queryString = useQueryString();
    const params = useParams();
    console.log(page, queryString, params);

    return (
        <div className="App">
            <h1>Brouther demo</h1>
            <nav>
                <ul className="nav">
                    <li>
                        <Link href={router.links.index}>Index Page</Link>
                    </li>
                    <li>
                        <Link href={router.links.addressList} params={{ id: "TRY_TO_CHANGE_URL" }} query={{ sort: "asc" }}>
                            User foo with sort=asc
                        </Link>
                    </li>
                    <li>
                        <Link href={router.links.users} query={{ id: 1 }}>
                            Users with ?id=1
                        </Link>
                    </li>
                    <li>
                        <Link href="/404">Not Exist</Link>
                    </li>
                </ul>
            </nav>
            <div>
                <h3>Params</h3>
                <pre>
                    <code>{JSON.stringify(params)}</code>
                </pre>
            </div>
            <div>
                <h3>QueryString</h3>
                <pre>
                    <code>{JSON.stringify(queryString)}</code>
                </pre>
            </div>
            {page !== null ? <div className="page">{page as any}</div> : null}
            <NotFound error={error} />
        </div>
    );
}

export default App;

import "./App.css";
import { usePage, Link, useQueryString, useParams } from "brouther";
import { router } from "./routes";

function App() {
    const page = usePage();
    const queryString = useQueryString();
    const params = useParams();

    return (
        <div className="App">
            <h1>Brouther demo</h1>
            <nav>
                <ul className="nav">
                    <li>
                        <Link href={router.links.index}>Index Page</Link>
                    </li>
                    <li>
                        <Link href={router.links.users} query={{ id: 1 }}>
                            Users with ?id=1
                        </Link>
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
            <div className="page">{page as any}</div>
        </div>
    );
}

export default App;

import { useEffect } from "react";
import "./App.css";
import { Link, useHistory } from "./brouther/router";
import { useQueryString } from "./brouther/use-qs";
import logo from "./logo.svg";
import { useParams } from "./brouther/use-params";

function App() {
  const qs = useQueryString();
  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    console.log({ params, qs });
  }, [qs, params]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Link className="App-link" href="/root" rel="noopener noreferrer">
          Sem Params
        </Link>
        <Link
          className="App-link"
          href="/root/1?qs=aaa"
          rel="noopener noreferrer"
        >
          Com params
        </Link>
        <button onClick={() => history.push({ pathname: "/", search: "" })}>
          CLEAR SEARCH
        </button>
      </header>
    </div>
  );
}

export default App;

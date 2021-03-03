import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import { Route, Router } from "./brouther/router";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const AsyncApp = lazy(() => import("./App"));
const AsyncRoot = lazy(() => import("./Root"));

const Route404 = () => <h1>Not Found</h1>;

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<h1>Loading...</h1>}>
      <Router notFound={Route404}>
        <Route path="/" component={AsyncApp} />
        <Route
          path="/:root/:id"
          component={() => <AsyncRoot title="Com Params" />}
        />
        <Route
          path="/root"
          component={() => <AsyncRoot title="Sem Params" />}
        />
      </Router>
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

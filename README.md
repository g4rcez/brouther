# brouther

The brother router to help in React apps


## Install

Nothing for now. Just wait to install on your projects

## Using

Brother it's a simple implementation of React Router, using the browser history as base. So your use is very similar to [React Router](https://reactrouter.com/).


Here an example using Brouther and [React Suspense/Lazy](https://reactjs.org/docs/code-splitting.html). Brouther supports Code Splitting :D

```tsx
// index.jsx
import { Router, Route } from "brouther" // in future

const AsyncApp = lazy(() => import("./App"));

<React.StrictMode>
    <Suspense fallback={<h1>Loading...</h1>}>
        <Router notFound={Route404}>
        <Route path="/" component={AsyncApp} />
        <Route path="/:root/:id" component={() => <AsyncRoot title="With route Params" />} />
        <Route path="/root" component={() => <AsyncRoot title="Without Params" />} />
        </Router>
    </Suspense>
</React.StrictMode>
```

Using `<Link />` to navigate between pages:

```tsx
<Link className="App-link" href="/order/42?operation=new">
    Com params
</Link>
```

Link is the exactly same of `<a />`, you can use `<Link />` instead of `<a />`. *If your `href` value starts with `http` or `https`, the default behavior it's assumed, otherwise use the `history` to push browser state.


## Advice

**This project is extremely experimental, do not use it in production yet**

Feel free to help or to use hooks in your personal projects
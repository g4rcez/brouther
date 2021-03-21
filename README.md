# brouther

The brother router to help in React apps

![Version](https://img.shields.io/npm/v/brouther?style=flat-square)
![Downloads](https://img.shields.io/npm/dm/brouther?style=flat-square)

- Typescript out of the box
- Easy configure NotFound routes
- Simple API

## Table of content

- [Install](#install)
- [Using](#using)
- [Imports](#imports)
  - [Hooks](#hooks)
  - [Components](#components)
- [Brother x React Router](#brother-x-react-router)

## Install

```bash
yarn add brouther
```

## Using

Brother it's a simple implementation of React Router, using the browser history as base. So your use is very similar to [React Router](https://reactrouter.com/).

Here an example using Brouther and [React Suspense/Lazy](https://reactjs.org/docs/code-splitting.html). Brouther supports Code Splitting :D

```tsx
// index.jsx
import { Router, Route } from "brouther";
import { createBrowserHistory } from "history"

const AsyncApp = lazy(() => import("./App"));
const history = createBrowserHistory();

<React.StrictMode>
  <Suspense fallback={<h1>Loading...</h1>}>
    <Router history={history} notFound={Route404}>
      <Route path="/" component={AsyncApp} />
      <Route
        path="/:root/:id"
        component={() => <AsyncRoot title="With route Params" />}
      />
      <Route
        path="/root"
        component={() => <AsyncRoot title="Without Params" />}
      />
    </Router>
  </Suspense>
</React.StrictMode>;
```

Using `<Link />` to navigate between pages:

```tsx
<Link className="App-link" href="/order/42?operation=new">
  Com params
</Link>
```

Link is the exactly same of `<a />`, you can use `<Link />` instead of `<a />`. \*If your `href` value starts with `http` or `https`, the default behavior it's assumed, otherwise use the `history` to push browser state.

## Imports

### Components

- Router

| Property |                               Value                               |
| -------- | :---------------------------------------------------------------: |
| notFound |                          React Component                          |
| history  | Instance of [`history`](https://github.com/ReactTraining/history) |

Context to share props with brouther components. Provide history, location and params.
Use HTML5 history API, provide from [`history`](https://github.com/ReactTraining/history).

- Route

| Property  |            Value             |
| --------- | :--------------------------: |
| path      | String. Path to access route |
| component |       React Component        |

Component to create routes in brouther

- Link

A simple href to redirect to pages, using `history` to preserve the router state.
This component is `<a />` with custom property `href`.

```typescript
href = string | {
    pathname?: string;
    search?: string;
    hash?: string;
}
```

- Redirect

Empty component with `history.push` on mount to redirect to the target. Same property `href` of `<Link />`

```typescript
href = string | {
    pathname?: string;
    search?: string;
    hash?: string;
}
```


### Hooks

- useHistory

Get current history state

- useLocation

Get current location state from history

- useQueryString

Get current [query string](https://en.wikipedia.org/wiki/Query_string) as object.

- useParams

Get route params as object `/route/:name` -> `{ name: string }`

## Brother x React Router

React Router is very tested and used, but has many features that you may not use. Prefer brouther if you:

- Use one component per route
- Need query string tools
- Code Splitting support (react-router has too)
- Easy configure NotFound page
- Strong type functions and components
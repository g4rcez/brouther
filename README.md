# brouther

The brother router to help in React apps

![Version](https://img.shields.io/npm/v/brouther?style=flat-square)
![Downloads](https://img.shields.io/npm/dm/brouther?style=flat-square)

- Strongly typed ecosystem (based in your routes)
- Easy configure NotFound route
- Use error boundary to catch NotFound errors
- Simple API (using by `history`)

The main idea of brouther is connecting your URLs in your system, to grant the correct types and records to avoid code
duplication and grant security with the type system.

Brouther can extract the correct dynamic paths (or params) from your URL and infer the correct type for them. The same
for query-string, but with a more features for this.

# Table of content

<!-- TOC -->

* [brouther](#brouther)
* [Table of content](#table-of-content)
* [Install](#install)
* [Using](#using)
* [How brouther works?](#how-brouther-works)
* [Hooks](#hooks)
    * [Strongly typed hooks](#strongly-typed-hooks)
        * [useQueryString](#usequerystring)

<!-- TOC -->

# Install

```bash
# using npm
npm i brouther
# using yarn
yarn add brouther
# using pnpm
pnpm add brouther
```

# Using

You can find the example in [playground](./playground) or just clone local

```typescript jsx
// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {Brouther, createRouter} from "brouther";
import Root from "./pages/root";
import UserIdAddress from "./pages/user-id-address";

const Users = React.lazy(() => import("./pages/users"));

export const router = createRouter([
    {
        path: "/",
        id: "index",
        element: <Root/>,
    },
    {
        path: "/user/:id/address/?sort=string",
        id: "addressList",
        element: <UserIdAddress/>,
    },
    {
        path: "/users?id=number!",
        id: "users",
        element: <Users/>,
    },
    {
        path: "/posts/:title?language=string[]!",
        id: "post",
        element: <Users/>,
    },
] as const); // use "as const" grant the immutability in array

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <React.Suspense fallback={<div>Loading...</div>}>
            <Brouther config={config}>
                <App/>
            </Brouther>
        </React.Suspense>
    </React.StrictMode>
);
```

# How brouther works?

When you create your router configuration, the method `createRouter` return a bunch of things:

- links: Brouther transform your routes array in an object, using the `id` as key and the `path` as value, to avoid you
  to copy and paste or create object with all your paths. The `id` is an alias for the route
- link: A method that takes and register route (used in your routes array) and required the query string and dynamic
  paths to create a URL
- usePaths: Takes the path and return an object with the dynamic paths with the correct keys. All values in this object
  are string
- useQueryString: The same of `usePaths`, but extract the query-string and transform the values by according your values
- config: The configured routes to use in `<Brouther />`, the basename and the history object using
  the `createBrowserHistory` of [history](https://npmjs.com/package/history)

# Components

## Link

The component `<Link />` is an abstraction of the `<a />`. Just with a little changes, one of these is the connection to
brouther history and the other is the properties to help you to build a very strongly typed route.

```typescript jsx
// use the main.tsx of the previous example
<Link href={router.links.post} paths={{title: "typescript-101"}} query={{language: ["pt-BR"]}}>
    Typescript 101
</Link>
```

Based on your route, the Link component will mount the correct properties to improve the DX and you will never forget
the parameters of the route.

# Hooks

Brouther two classes of hooks, the strongly typed and the "normal" hooks.

The strongly typed hooks are connected to your routes and can provide autocompletion for query-string, and dynamic
paths. Otherwise, the normal hooks do the same thing, but you need to provide your own types.

## Strongly typed hooks

### useQueryString

This hook extract the current query-string from the URL and apply a transformation using the URL as map. You need to
provide a path for, because the hook will extract the values from specific path. To save your time, you can use
the `router.links` object

```typescript
// use the main.tsx of the previous example
const route = "/posts/:title?language=string[]!";
useQueryString(router.links.post);
```

This route use a query-string language as array, and say "this is required" because has the `!`. In Brouther, you can
type your query-strings using the mapped transformers. These transformers are very powerful, because you don't need to
convert the query-string or parse the URLSearchParams. You can use the primitives of Javascript and the Date:

- string
- number
- null
- boolean
- date

For any of transformer you can use the version of array. Just put the `[]` at the end of your transformer.

By default, all values in the query string are optional. If you need to turn any value as required, just use the
operator `!`.

A little list of how these transformers works:

- `/users?sort=string!&from=date&to=date`: `sort` is a required string, `from` and `to` are Date and optional, this
  means you can have undefined or `Invalid Date` at this values
- `/users?languages=string[]!`: `languages` is a required array of string

### usePaths

Extract the dynamic paths from URL, so you need to provide a pathname. Different of react-router, all dynamic paths in
brouther are required, and you cannot have optional dynamic paths.

```typescript jsx
// use the main.tsx of the previous example
const route = "/posts/:title?language=string[]!";
usePaths(router.links.post);
```

This hook will extract the title from URL and return an object `{ title: string }`. In this case, you have the
URL `/posts/typescript-101` you have the result `{ title: "typescript-101" }`

## Normal hooks

These hooks aren't connected to the type system, because they work without the need of your configuration.

### usePage

This hook enable you to get the element that match with the current route. So, you just need to use the component in
your system. This hook return a nullable element, because if no one element match with the route, brouther will put at
the state a NotFoundRoute.

### useErrorPage

This hook get the state of error in Brouther ecosystem. If you have a not found route, this hook will return the
NotFoundRoute error, and you can build a 404 component using the data.
# brouther

The brother router to help in React apps

![Version](https://img.shields.io/npm/v/brouther?style=flat-square)
![Downloads](https://img.shields.io/npm/dm/brouther?style=flat-square)

- Strongly typed ecosystem (based in your routes)
- Easy configure NotFound route
- Use error boundary to catch NotFound errors
- Simple API (inspired by `history`)

## Table of content

- [Install](#install)
- [Using](#using)

## Install

```bash
# using npm
npm i brouther
# using yarn
yarn add brouther
# using pnpm
pnpm add brouther
```

## Using

```typescript
// routes.tsx
import React from "react";
import { createRoute, ExtractRouteProps } from "brouther";

export const routes = {
  root: createRoute(
    "/",
    React.lazy(() => import("./root"))
  ),
  coordinates: createRoute(
    "/coordinates/:lat,:long",
    React.lazy(() => import("./double-params"))
  ),
  qs: createRoute(
    "/query-string/?offset&?limit&?page",
    React.lazy(() => import("./query-string"))
  ),
};

type Routes = typeof Routes;

export type PropsOfPath<K extends keyof Routes> = ExtractRouteProps<Routes, K>;

type RootPageProps = PropsOfPath<"root">;
type CoordinatesPageProps = PropsOfPath<"coordinates">;
type QsPageProps = PropsOfPath<"qs">;
```

```typescript
// index.tsx
import React, { Fragment } from "react";
import { createRoot } from "react-dom/client";
import { Brouther, Link, useComponentRoute } from "brouther";
import { routes } from "routes";

const container = document.getElementById("root")!;
const root = createRoot(container);

const App = () => {
  const route = useComponentRoute();
  return (
    <Fragment>
      <header>Header here</header>
      <main>{route}</main>
      <footer>Footer here</footer>
    </Fragment>
  );
};

root.render(
  <React.StrictMode>
    <Brouther static routes={routes}>
      <App />
    </Brouther>
  </React.StrictMode>
);
```

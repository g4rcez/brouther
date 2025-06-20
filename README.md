# Brouther

A type-safe router for React applications that puts TypeScript first, ensuring your routes, parameters, and query strings are always in sync with your code.

![Version](https://img.shields.io/npm/v/brouther?style=flat-square)
![Downloads](https://img.shields.io/npm/dm/brouther?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square)
![License](https://img.shields.io/npm/l/brouther?style=flat-square)

## Why Brouther?

When building React applications, keeping your routing configuration in sync with your components can be challenging. URLs change, parameters get renamed, and query strings evolve - but your TypeScript compiler doesn't know about any of it. Until now.

Brouther solves this by creating a **single source of truth** for your routes that TypeScript understands deeply. This means:

- **No more broken links**: If you delete or change a route, TypeScript will show errors everywhere it's used
- **Automatic parameter validation**: Dynamic path parameters like `/user/:id` are type-checked at compile time
- **Type-safe query strings**: Define expected query parameters and their types right in your route definition
- **Zero runtime overhead**: All type checking happens at compile time
- **Incredible developer experience**: Full IntelliSense support for routes, parameters, and query strings

## Installation

```bash
npm install brouther
# or
yarn add brouther
# or
pnpm add brouther
```

## Quick Start

Let's build a simple application to understand how Brouther works:

```typescript
// router.ts
import { createRouter } from 'brouther';
import HomePage from './pages/HomePage';
import UserProfile from './pages/UserProfile';
import ProductList from './pages/ProductList';

// Define your routes with full type information
export const router = createRouter([
  {
    id: 'home',
    path: '/',
    element: <HomePage />
  },
  {
    id: 'userProfile',
    path: '/user/:userId',
    element: <UserProfile />
  },
  {
    id: 'products',
    path: '/products?category=string&sort=string&page=number',
    element: <ProductList />
  }
] as const); // The 'as const' is crucial for type inference!
```

Now, let's use it in your application:

```typescript
// App.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Brouther, Outlet } from 'brouther';
import { router } from './router';

function App() {
  return (
    <Brouther config={router.config}>
      <div className="app">
        <Navigation />
        <main>
          <Outlet />
        </main>
      </div>
    </Brouther>
  );
}

// Navigation.tsx
import { Link } from 'brouther';
import { router } from './router';

function Navigation() {
  return (
    <nav>
      {/* Simple link - no parameters needed */}
      <Link href={router.links.home}>Home</Link>

      {/* Link with path parameter - TypeScript knows userId is required! */}
      <Link
        href={router.links.userProfile}
        paths={{ userId: '123' }}
      >
        View Profile
      </Link>

      {/* Link with query parameters - all typed! */}
      <Link
        href={router.links.products}
        query={{
          category: 'electronics',
          sort: 'price',
          page: 1
        }}
      >
        Electronics
      </Link>
    </nav>
  );
}
```

## Core Concepts

### Understanding Route Definitions

Brouther uses a special syntax in route paths to define parameters and query strings:

```typescript
// Dynamic path parameters use :paramName
"/user/:userId"; // userId will be a required string parameter

// Query strings are defined after ?
"/products?category=string"; // category is an optional string

// Required query parameters use !
"/products?category=string!"; // category is now required

// Array query parameters use []
"/products?tags=string[]"; // tags is an optional string array

// Combine multiple query parameters with &
"/products?category=string&tags=string[]&inStock=boolean";

// You can even type your parameters
"/post/:postId?published=date&author=string";
```

### Type Safety in Action

Here's where Brouther really shines. Let's look at how TypeScript helps you:

```typescript
// ❌ This will cause a TypeScript error - missing required path
<Link href={router.links.userProfile}>Profile</Link>

// ❌ This will also error - wrong parameter name
<Link
  href={router.links.userProfile}
  paths={{ id: '123' }} // Should be userId!
>

// ❌ TypeScript catches type mismatches too
<Link
  href={router.links.products}
  query={{ page: '1' }} // Should be a number!
>

// ✅ This is correct - TypeScript is happy!
<Link
  href={router.links.userProfile}
  paths={{ userId: '123' }}
>
```

### Accessing Route Data in Components

Brouther provides hooks to access route information with full type safety:

```typescript
// UserProfile.tsx
import { usePaths, useQueryString } from 'brouther';
import { router } from './router';

function UserProfile() {
  // Get typed path parameters
  const paths = usePaths(router.links.userProfile);
  // paths.userId is typed as string

  // For the products page, you'd get typed query parameters
  const query = useQueryString(router.links.products);
  // query.category is string | undefined
  // query.page is number | undefined
  // query.sort is string | undefined

  return <div>User ID: {paths.userId}</div>;
}
```

## Advanced Features

### Loaders and Actions

Brouther supports data loading and form actions, similar to modern routing libraries but with full type safety:

```typescript
const router = createRouter([
  {
    id: 'userProfile',
    path: '/user/:userId',
    element: <UserProfile />,
    // Loader runs before the component renders
    loader: async ({ paths, queryString }) => {
      // paths.userId is typed!
      const user = await fetchUser(paths.userId);
      return jsonResponse(user);
    },
    // Actions handle form submissions
    actions: async () => ({
      post: async ({ form, paths }) => {
        const formData = formToJson(form);
        await updateUser(paths.userId, formData);
        return redirectResponse('/success');
      }
    })
  }
]);

// In your component
function UserProfile() {
  const data = useDataLoader<typeof loader>();
  // data is fully typed based on your loader!
}
```

### Error Handling

Brouther provides elegant error handling with error boundaries:

```typescript
const router = createRouter([
  {
    id: 'userProfile',
    path: '/user/:userId',
    element: <UserProfile />,
    errorElement: <UserErrorPage />, // Shown if loader fails
    loadingElement: <UserSkeleton /> // Shown while loading
  }
]);

// Global error handling
<Brouther
  config={router.config}
  ErrorElement={<NotFoundPage />} // For 404s
>
  <App />
</Brouther>
```

### Form Integration

Brouther includes a type-safe Form component that integrates with your routes:

```typescript
import { Form } from 'brouther';

function EditProfile() {
  const actions = useFormActions();

  return (
    <Form method="post">
      <input name="name" />
      <input name="email" type="email" />
      <button type="submit">
        {actions.loading ? 'Saving...' : 'Save'}
      </button>
    </Form>
  );
}
```

### Programmatic Navigation

Navigate programmatically with full type safety:

```typescript
function SomeComponent() {
  const navigation = useNavigation();

  const handleClick = () => {
    // Type-safe navigation
    navigation.push(
      router.link(
        router.links.userProfile,
        { userId: '123' } // Required!
      )
    );
  };

  return <button onClick={handleClick}>Go to Profile</button>;
}
```

## API Reference

### Creating Routes

#### `createRouter(routes, basename?, options?)`

Creates a router configuration with type-safe routes.

```typescript
const router = createRouter(
    [...routes],
    "/app", // optional basename
    {
        sensitiveCase: false, // optional: case-sensitive matching
        history: createBrowserHistory, // optional: custom history
    }
);
```

#### `createMappedRouter(routeMap, basename?, options?)`

Alternative API using an object instead of array:

```typescript
const router = createMappedRouter({
  home: {
    path: '/',
    element: <HomePage />
  },
  userProfile: {
    path: '/user/:userId',
    element: <UserProfile />
  }
} as const);
```

### Hooks

#### `usePaths(routePath)`

Get typed path parameters from the current route.

#### `useQueryString(routePath)`

Get typed query string parameters from the current route.

#### `useNavigation()`

Get navigation methods (push, replace, back, forward).

#### `useDataLoader()`

Get data from the route loader with full type inference.

#### `useFormActions()`

Get form action state (loading, result, etc.).

#### `useErrorPage()`

Get any route errors that occurred.

#### `useLoadingState()`

Check if route is currently loading.

### Components

#### `<Brouther>`

The main provider component that enables routing.

#### `<Outlet>`

Renders the matched route element.

#### `<Link>`

Type-safe link component with automatic parameter validation.

#### `<Form>`

Type-safe form component that integrates with route actions.

#### `<Redirect>`

Declarative redirect component.

## Best Practices

### 1. Always Use `as const`

This is crucial for TypeScript to infer literal types:

```typescript
// ✅ Good
const router = createRouter([...] as const);

// ❌ Bad - loses type information
const router = createRouter([...]);
```

### 2. Centralize Your Router

Keep your router definition in a single file and export it:

```typescript
// router.ts
export const router = createRouter([...] as const);
export const { links, link, useQueryString, usePaths } = router;
```

### 3. Use Type-Safe Query Strings

Define query string types in your routes for better safety:

```typescript
// Instead of handling raw strings
const searchParams = new URLSearchParams(location.search);
const page = parseInt(searchParams.get("page") || "1");

// Use Brouther's typed approach
const { page = 1 } = useQueryString(router.links.products);
// page is already a number!
```

### 4. Leverage IntelliSense

Your IDE will autocomplete route names, parameters, and query strings. Use this to explore available options and catch errors early.

## Migration Guide

### From React Router

```typescript
// React Router
<Route path="/user/:id" element={<User />} />
<Link to={`/user/${userId}`}>Profile</Link>

// Brouther
{
  id: 'user',
  path: '/user/:id',
  element: <User />
}
<Link href={router.links.user} paths={{ id: userId }}>Profile</Link>
```

### From Next.js

```typescript
// Next.js
<Link href={`/user/${userId}?tab=posts`}>Posts</Link>

// Brouther
<Link
  href={router.links.user}
  paths={{ userId }}
  query={{ tab: 'posts' }}
>Posts</Link>
```

## Examples

Check out our [examples directory](./examples) for complete applications:

- **Basic Blog**: Simple blog with posts and comments
- **E-commerce**: Product catalog with filtering and search
- **Dashboard**: Admin panel with authentication and guards
- **Real-world App**: Full-featured application with all Brouther features

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Brouther Contributors](LICENSE)

---

## Need Help?

- 📚 [Full Documentation](https://brouther.dev)
- 💬 [Discord Community](https://discord.gg/brouther)
- 🐛 [Issue Tracker](https://github.com/brouther/brouther/issues)
- ✨ [Feature Requests](https://github.com/brouther/brouther/discussions)

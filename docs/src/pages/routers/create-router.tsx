import { DocumentPage } from "../../components/document-page";
import React from "react";
import { Code } from "../../components/code";
import { InlineCode } from "../../components/inline-code";
import { SubTitle } from "../../components/subtitle";
import { Anchor } from "../../components/anchor";
import { Link } from "brouther";
import { router } from "../../router";
import { Callout } from "../../components/callout";

const input = `import { createMappedRouter, usePage } from "brouther";

export const router = createRouter([
  // loader and action like in react-router/remix
  { id: "root", path: "/", element: <RootPage />, loader: undefined, actions: undefined },
  { id: "users", path: "/users?id=number", element: <UsersPage /> },
  { id: "usersId", path: "/users/:id", element: <UsersIdPage /> },
  { id: "usersIdOrder", path: "/users/:id/orders?orderId=string!", element: <UsersIdPage /> },
  { id: "contactUs", path: "/contact-us", element: <ContactPage /> },
] as const);`;

const createRouterProps = `import { createMappedRouter, usePage } from "brouther";

export const router = createRouter([
  { id: "root", path: "/", element: <RootPage /> },
  { id: "users", path: "/users?id=number", element: <UsersPage /> },
  { id: "usersId", path: "/users/:id", element: <UsersIdPage /> },
  { id: "usersIdOrder", path: "/users/:id/orders?orderId=string!", element: <UsersIdPage /> },
  { id: "contactUs", path: "/contact-us", element: <ContactPage /> },
] as const);`;

const code = `type Params = { id: string }`;

const linksCode = `const sameRoute = router.links.users === "/users"`;

const linkCode = `const userWithId = route.link(router.links.usersId, { id: 1 }); // id is required
const filterUsersById = route.link(router.links.users, { id: 15 }); // id is optional;
const filterUserOrders = route.link(
  router.links.usersIdOrder, 
  { id: 15 }, 
  { orderId: "xpto-id" }
); // orderId is required`;

export default function CreateRouterPage() {
    return (
        <DocumentPage title="createRouter">
            <p>
                For this example, we will recreate routes using <InlineCode>createRouter</InlineCode>.
            </p>
            <Code code={input} />
            <ul>
                <li>
                    <b>id:</b> the alias of your path. This property is required and this alias will be used for brouther features like automatic
                    route aliases.
                </li>
                <li>
                    <b>path:</b> your route path, like in react-router or express. All parameters using <i>:</i> will be parse and the values as{" "}
                    <InlineCode>string</InlineCode>.
                </li>
                <li>
                    <b>Element</b>: Your component. You can use normal elements or make an instance using{" "}
                    <Anchor href="https://react.dev/reference/react/lazy">lazy</Anchor> to use all benefits of Code Splitting.
                </li>
                <li>
                    <b>loader:</b> like in remix/react-router, brouther supports loaders too. With this you can drop the logic inside your{" "}
                    <InlineCode>useEffect</InlineCode> and put all logic in your loader. This method runs before brouther loads your component in the
                    state.
                </li>
                <li>
                    <b>actions:</b> different of remix/react-router, brouther use the same logic of{" "}
                    <Anchor target="blank" href="nextjs.org">
                        NextJS
                    </Anchor>{" "}
                    and split the actions in http methods. You can export an object with <i>post</i>,<i>put</i>, <i>patch</i> and <i>delete</i> with
                    the specific logic. This is just possible because our{" "}
                    <Anchor as={Link} href={router.links.form}>
                        Form
                    </Anchor>{" "}
                    component and your special behaviour.
                </li>
            </ul>
            <Code code={createRouterProps} />
            <p>The entrypoint of any config for Brouther. This method takes an array and return some object and methods like:</p>
            <ul>
                <li>
                    <b>config</b>: All necessary data to Brouther parse and create the routing logic
                </li>
                <li>
                    <b>navigation</b>: useful methods to control your state without React tree
                </li>
                <li>
                    <b>links</b>: object with all alias:routes to avoid type strings in your code
                </li>
                <li>
                    <b>link</b>: a method that takes the route and extract other two arguments by according your route, maybe required dynamic paths
                    and query string
                </li>
                <li>
                    <b>useQueryString</b>: this method takes the route alias and return the typed query string.
                </li>
                <li>
                    <b>usePaths</b>: this method takes the route alias and return the correct typed dynamic paths. Considering route usersId the type
                    will be:
                </li>
            </ul>
            <Code code={code} />
            <SubTitle as="h3">config</SubTitle>
            <p>
                This is an internal object for brouther. You shouldn't use this object in any place, except for{" "}
                <Anchor href={router.links.brouther} as={Link}>
                    Brouther
                </Anchor>
                . It's won't cover the semver and will be only for internal configuration.
            </p>
            <SubTitle as="h3">navigation</SubTitle>
            <p>
                If you need to manipulate your history outside of React, you need to use <InlineCode>navigation</InlineCode>. This method return an
                useful methods to manipulate history using a familiar API, the <Anchor href="https://www.npmjs.com/package/history">history</Anchor>.
            </p>
            <ul>
                <li>
                    <b>back</b>: Back in history. Same behavior of browser.
                </li>
                <li>
                    <b>forward</b>: Go forward history. Same behavior of browser.
                </li>
                <li>
                    <b>go</b>: Go N times in browser. You can jump N steps using positive (go forward) or negative (go backward)
                </li>
                <li>
                    <b>push</b>: Go to path using history api.
                </li>
                <li>
                    <b>replace</b>: Go to path using history api, but replace the current route in stack for the new one.
                </li>
            </ul>
            <SubTitle as="h3">links</SubTitle>
            <p>
                When you build your applications, you need to write the paths when make a redirect ou push to a route. This it's not good, if you need
                to change your routes probably you will use <b>Find and Replace</b>. <b className="text-red-500">Bad DX</b>.
            </p>
            <p>
                Brouther provide an object with all routes for you. When you register a route, you need to provide an <i>id</i> and this <i>id</i>{" "}
                it's route <b>alias</b>. You can use this alias to replace your magic strings and grant consistency for your code.
            </p>
            <p>
                Using <InlineCode>.links</InlineCode> you're covered by Brouther with typesafe routes.
            </p>
            <Code code={linksCode} />
            <SubTitle as="h3">link</SubTitle>
            <p>
                A special function that takes a <InlineCode>router.links</InlineCode> property and create your URL. If you need to pass{" "}
                <Anchor as={Link} href={router.links.queryString}>
                    query-string
                </Anchor>{" "}
                or{" "}
                <Anchor as={Link} href={router.links.paths}>
                    dynamic paths
                </Anchor>
                . By according your routes, this function will require different parameters. Check it out.
            </p>
            <Code code={linkCode} />
            <SubTitle as="h3">useQueryString</SubTitle>
            <p>
                You don't need to use <i>useState</i> or any type of state manager. Try to use URL and preserve the history for your users. Query
                string is an amazing state manager.
            </p>
            <p>
                Using Brouther you can type your query-string in a simple way, just declare the properties at string. Like in{" "}
                <InlineCode>usersIdOrder</InlineCode> you can provide the type of your values, declare as required, array or both.
            </p>
            <ul>
                <li>
                    <b>string!</b>: required string
                </li>
                <li>
                    <b>string[]!</b>: required string array
                </li>
                <li>
                    <b>number</b>: optional number
                </li>
                <li>
                    You can use: <b>number</b>, <b>string</b>, <b>boolean</b>, <b>null</b> or <b>Date</b>
                </li>
            </ul>
            <SubTitle as="h3">usePaths</SubTitle>
            <p>
                If you need to specify an <i>id</i> as mandatory for your route, you will use dynamic paths (or params in other libraries). Every time
                when you use an <InlineCode>/:word</InlineCode> pattern, Brouther will infer <InlineCode> word</InlineCode> as dynamic path and turn
                into an object as <InlineCode>{`{ word: string }`}</InlineCode>. All dynamic paths are string by default. You need to convert them.
            </p>
            <Callout title="Disclaimer">
                Brouther use <b>dynamic path</b> instead of <b>params</b> to avoid miss conception with browser APIs like{" "}
                <Anchor href="https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams">URLSearchParams</Anchor>. URLSearchParams are called
                as <Anchor href="https://en.wikipedia.org/wiki/Query_string">query string</Anchor>.
            </Callout>
        </DocumentPage>
    );
}

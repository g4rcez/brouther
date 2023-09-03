import { DocumentPage } from "../../components/document-page";
import { Anchor } from "../../components/anchor";
import { router } from "../../router";
import { Link } from "brouther";
import { Code } from "../../components/code";
import { SubTitle } from "../../components/subtitle";
import { InlineCode } from "../../components/inline-code";

const code = `import { 
  asyncActions, 
  GetPaths, 
  asyncComponent, 
  asyncLoader, 
  createMappedRouter, 
  createPaths, 
  createRoute
} from "brouther";
import BlogPage from "./pages/blog";

const paths = createPaths({
    index: "/?firstName=string&lastName=string&date=Date",
});

type Paths = GetPaths<typeof paths>;

type IndexRoute = Paths["index"];

export const router = createMappedRouter({
    [paths.index.name]: createRoute(paths.index.value, {
        element: asyncComponent(() => import("./pages/root")),
        loader: asyncLoader<IndexRoute>(() => import("./pages/root")),
        actions: asyncActions<IndexRoute>(() => import("./pages/root")),
    }),
    blog: createRoute("/blog?sort=string", { 
      element: <BlogPage />, 
      loader: asyncLoader(() => import("./pages/blog")) 
    }),
    users: createRoute("/users?sort=string", { 
      element: asyncComponent(() => import("./pages/users")) 
    }),
    user: createRoute("/user/<id:string>?sort=string", {
        loader: asyncLoader(() => import("./pages/user")),
        element: asyncComponent(() => import("./pages/user")),
    }),
} as const);
`;

export default function TricksPage() {
    return (
        <DocumentPage title="Tricks and Tips">
            <p>
                When you using{" "}
                <Anchor  href={router.links.actions}>
                    actions
                </Anchor>{" "}
                and{" "}
                <Anchor  href={router.links.loaders}>
                    loaders
                </Anchor>
                , you may need to apply a code splitting properly. To help you, brouther has some utility functions. These utility functions help you
                to identify the correct types for your action/loader. Check the following code:
            </p>
            <Code code={code} />
            <p>At this code we have some utility functions</p>
            <ul>
                <li>createPaths</li>
                <li>GetPaths</li>
                <li>createRoute</li>
                <li>asyncActions</li>
                <li>asyncLoader</li>
                <li>asyncComponent</li>
            </ul>
            <SubTitle as="h3">createPaths</SubTitle>
            <p>
                This method helps you to create a map of your routes to use in any place. This exists because you cannot use the router object to
                build the router object. A little trick to avoid circular dependencies in brouther.
            </p>
            <SubTitle as="h3">GetPaths</SubTitle>
            <p>
                Extract the return of <InlineCode>createPaths</InlineCode> based in their aliases.
            </p>
            <SubTitle as="h3">createRoute</SubTitle>
            <p>
                Enforce the your route types using <InlineCode>createRoute</InlineCode>. This will help you to create a code splitting routes with{" "}
                <InlineCode>asyncActions</InlineCode>, <InlineCode>asyncLoader</InlineCode> and <InlineCode>asyncComponent</InlineCode>
            </p>
            <SubTitle as="h3">asyncActions</SubTitle>
            <p>A simple way to import your actions using code splitting, without any trouble</p>
            <SubTitle as="h3">asyncLoader</SubTitle>
            <p>
                The same as <InlineCode>asyncActions</InlineCode> but for loader. These functions enforce the type based in their routes. Remember to
                use <InlineCode>links</InlineCode> object from brouther to enforce the URLs.
            </p>
            <SubTitle as="h3">asyncComponent</SubTitle>
            <p>
                Import your component directly using the <InlineCode>asyncComponent</InlineCode>. This method return a ReactElement and you don't need
                to import using the lazy+import and create as JSX.
            </p>
        </DocumentPage>
    );
}

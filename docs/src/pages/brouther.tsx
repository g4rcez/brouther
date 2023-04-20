import { DocumentPage } from "../components/document-page";
import { InlineCode } from "../components/inline-code";
import { Anchor } from "../components/anchor";
import { Link } from "brouther";
import { router } from "../router";
import { Code } from "../components/code";

const code = `import { createMappedRouter, usePage } from "brouther";

export const router = createMappedRouter({
    index: { path: "/", element: <App /> }
} as const);


const Root = () => {
    const page = usePage();
    return <div> {page} </div>;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <React.Suspense fallback={<React.Fragment />}>
            <Brouther config={router.config}>
                <Root />
            </Brouther>
        </React.Suspense>
    </React.StrictMode>
);`;

const withFilter = `import { createMappedRouter, usePage } from "brouther";

export const router = createMappedRouter({
    index: { path: "/", element: <App /> }
} as const);


const Root = () => {
    const page = usePage();
    return <div>{page}</div>;
};

const Entry = () => {
      const config = useBackendConfig();
      
      const filter = useCallback((route: ConfiguredRoute) => {
        const result = config.validate(route.data.feature);
        return result === "approved";
      }, [response]);
      
      return (
        <React.StrictMode>
            <React.Suspense fallback={<React.Fragment />}>
                <Brouther config={router.config} filter={filter}>
                    <Root />
                </Brouther>
            </React.Suspense>
        </React.StrictMode>
      );

};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
  .render(<Entry />);`;

export default function BroutherPage() {
    return (
        <DocumentPage title="Brouther">
            <p>
                <InlineCode>{"<Brouther />"}</InlineCode> it's the entrypoint for your config. This is the library{" "}
                <Anchor href="https://react.dev/learn/passing-data-deeply-with-context#step-3-provide-the-context">context provider</Anchor> and using
                this enable all brouther features, like{" "}
                <Anchor as={Link} href={router.links.linkComponent}>
                    Link
                </Anchor>{" "}
                component and hooks. You just need to provide the <InlineCode>router.config</InlineCode> from your createRouter or createMappedRouter.
            </p>
            <Code code={code} />
            <p>With this you will be able to use Brouther without any other configuration.</p>
            <p>
                You can provide a <InlineCode>filter</InlineCode> function to filter your router in runtime. This is very useful if you need to deny
                some paths by according a configuration from your backend or in cases of Feature Flags.
            </p>
            <Code code={withFilter} />
        </DocumentPage>
    );
}

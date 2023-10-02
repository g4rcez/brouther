import { DocumentPage } from "../components/document-page";
import { InlineCode } from "../components/inline-code";
import { Anchor } from "../components/anchor";
import { router } from "../router";
import { Code } from "../components/code";

const code = `import { createMappedRouter, Outlet, Brouther } from "brouther";

export const router = createMappedRouter({
    index: { path: "/", element: <App /> }
} as const);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <React.Suspense fallback={<React.Fragment />}>
            <Brouther config={router.config}>
                <Outlet notFound={<p>Page not found</p>} />
            </Brouther>
        </React.Suspense>
    </React.StrictMode>
);`;

export default function OutletPage() {
    return (
        <DocumentPage title="Brouther">
            <p>
                This component take the current route that match with the URL. If not, you can render the <InlineCode>notFound</InlineCode> property.
                This component make the save behavior of <Anchor href={router.links.usePage}>usePage</Anchor> hook. With the addition of{" "}
                <InlineCode>notFound</InlineCode> property as element.
            </p>
            <Code code={code} />
        </DocumentPage>
    );
}

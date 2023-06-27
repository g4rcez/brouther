import { DocumentPage } from "../../components/document-page";
import { InlineCode } from "../../components/inline-code";
import { Code } from "../../components/code";
import { useRouteError } from "brouther/dist/brouther/brouther";

export const ErrorElementExample = () => {
    const [error] = useRouteError();
    return <DocumentPage title="Error element">Error name {error?.name}</DocumentPage>;
};

const code = `import { createMappedRouter } from "brouther";

const ErrorElement = () => <h2>Error</h2>

const router = createMappedRouter({
  index: { path: "/", element: <Fragment />, errorElement: <ErrorElement /> }
});`;

export default function ErrorElementPage() {
    return (
        <DocumentPage title="Error element">
            <p>
                You can catch all route errors using the property <InlineCode>errorElement</InlineCode>.
            </p>
            <Code code={code} />

            <p>You can try the error element on the button bellow</p>
            <button
                onClick={() => {
                    throw new Error("Kaboom");
                }}
            >
                Kaboom!!
            </button>
        </DocumentPage>
    );
}

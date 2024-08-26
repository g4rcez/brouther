import { useState } from "react";
import { Code } from "../../components/code";
import { DocumentPage } from "../../components/document-page";
import { InlineCode } from "../../components/inline-code";
import { BroutherError, Link, useRouteError } from "../../exports";
import { router } from "../../router";

export const ErrorElementExample = () => {
    const [error, x] = useRouteError();
    console.log(error, x);
    return (
        <DocumentPage title="Error element">
            <p>Error name {error?.name}</p>
            <p>
                <Link href={router.links.index}>Back to root</Link>
            </p>
        </DocumentPage>
    );
};

const code = `import { createMappedRouter } from "brouther";

const ErrorElement = () => <h2>Error</h2>

const router = createMappedRouter({
  index: { path: "/", element: <Fragment />, errorElement: <ErrorElement /> }
});`;

class Kaboom extends BroutherError {
    public constructor() {
        super();
        this.name = "Kaboom";
    }
}

export default function ErrorElementPage() {
    const [error, setError] = useState<Error | null>(null);
    if (error) {
        throw error;
    }
    return (
        <DocumentPage title="Error element">
            <p>
                You can catch all route errors using the property <InlineCode>errorElement</InlineCode>.
            </p>
            <Code code={code} />

            <p>You can try the error element on the button bellow</p>
            <button className="bg-red-600 text-white font-medium text-lg rounded-lg px-4 py-1" onClick={() => setError(new Kaboom())}>
                Kaboom!!
            </button>
        </DocumentPage>
    );
}

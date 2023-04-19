import { DocumentPage } from "../components/document-page";
import { Code } from "../components/code";
import { SubTitle } from "../components/subtitle";
import { Anchor } from "../components/anchor";
import { Link } from "../../../src";
import { router } from "../router";

const code = `import { createMappedRouter, usePage } from "brouther";

export const router = createMappedRouter({
    index: { path: "/", element: <App /> },
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
);
`;

export default function BasicSetup() {
    return (
        <DocumentPage title="Basic Setup">
            <p>
                The primary goals of Brouther are to provide a full TypeScript ecosystem and to offer an amazing Developer Experience by providing a
                simple way to achieve anything.
            </p>
            <p>
                With this goals in mind, our first example it's very simple and a <i>boilerplate</i> to initiate your projects.
            </p>
            <Code code={code} />
            <SubTitle>Brouther API</SubTitle>
            <div>
                <p>
                    A simple API to help you to build amazing UI's. Using these methods, you will create your routes with a full type safe system and
                    you never make mistakes with strings and routes again.
                </p>
                <ul className="my-4">
                    <li className="my-2">
                        <Anchor href={router.links.createRouter} as={Link}>
                            createRouter
                        </Anchor>
                    </li>
                    <li className="my-2">
                        <Anchor href={router.links.createMappedRouter} as={Link}>
                            createMappedRouter
                        </Anchor>
                    </li>
                </ul>
                <p>You will see more about API's at this document, but first you need to focus on routers.</p>
            </div>
        </DocumentPage>
    );
}

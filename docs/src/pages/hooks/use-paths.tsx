import { DocumentPage } from "../../components/document-page";
import { Code } from "../../components/code";
import { Callout } from "../../components/callout";
import { InlineCode } from "../../components/inline-code";

const code = `import { usePaths } from "brouther";

export const App = () => {
    // access example.com/users/18
    const paths = usePaths();
    console.log(paths); // { id: 18 }
};`;

export default function HookUsePage() {
    return (
        <DocumentPage title="usePaths">
            <p>
              usePaths it's the same of useParams in react-router ou tankstack-router. This hook will return the dynamic paths at your URL, like the pattern <InlineCode>/users/:id</InlineCode>.
            </p>
            <Code code={code} />
            <Callout type="info" title="Tips and tricks">
                Brouther adopt <InlineCode>usePaths</InlineCode> instead <InlineCode>useParams</InlineCode> to avoid confusion with{" "}
                <InlineCode>URLSearchParams</InlineCode>, that is a query string (part of URL after the ?).
            </Callout>
        </DocumentPage>
    );
}

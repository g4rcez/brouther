import { Link } from "../../exports";
import { Anchor } from "../../components/anchor";
import { Code } from "../../components/code";
import { DocumentPage } from "../../components/document-page";
import { InlineCode } from "../../components/inline-code";
import { SubTitle } from "../../components/subtitle";

const code = `type P = "/users/:id?sort=string";
export const loader = async (args: LoaderProps<P, {}>) => {
    const user = await getUserById(paths.id, { sorter: args.queryString.sort });
    return jsonResponse({ user, id: args.paths.id });
}`;

export default function FormPage() {
    return (
        <DocumentPage title="Loader">
            <p>
                This function provide logic/data to your current router element. With <InlineCode>loader</InlineCode> you can rewrite your{" "}
                <InlineCode>useEffect</InlineCode> code. Loaders are the first thing that run in Brouther. This concept is similar of{" "}
                <Anchor href="https://reactrouter.com/en/main/route/loader">react-router loaders</Anchor>.
            </p>
            <SubTitle>Params</SubTitle>
            <p>
                Loader receive just one parameter, an object with the{" "}
                <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Request">Request</Link> and some other properties.
            </p>
            <ul>
                <li>
                    <InlineCode>data</InlineCode>: The static data of your current route.
                </li>
                <li>
                    <InlineCode>path</InlineCode>: The current path, same of <InlineCode>window.location.pathname</InlineCode>
                </li>
                <li>
                    <InlineCode>request</InlineCode>: Browser request object from{" "}
                    <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Request">RequestAPI</Link>
                </li>
                <li>
                    <InlineCode>queryString</InlineCode>: Current query string converted as object
                </li>
                <li>
                    <InlineCode>paths</InlineCode>: Dynamic paths of your current path
                </li>
            </ul>
            <Code code={code} />
            <SubTitle>Return Type</SubTitle>
            <p>
                Loader need to return a <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Response">Response</Link>. Do your stuff using
                async with Promise or do as sync mode without Promise.
            </p>
        </DocumentPage>
    );
}

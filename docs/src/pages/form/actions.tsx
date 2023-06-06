import { DocumentPage } from "../../components/document-page";
import { Anchor } from "../../components/anchor";
import { InlineCode } from "../../components/inline-code";
import { SubTitle } from "../../components/subtitle";
import { Code } from "../../components/code";
import { Link } from "brouther";
import { router } from "../../router";

const code = `const actions: Actions<"/users/:id?sort=string", {}> = 
  async () => ({
    post: (args) => {
      const user = await getUserById(paths.id, { sorter: queryString.sort });
      return jsonResponse({ user, id: paths.id });
    }
  })`;

export default function FormPage() {
    return (
        <DocumentPage title="Actions">
            <p>
                If <Anchor href={router.links.loaders}>loaders</Anchor> are the fetch for your data,{" "}
                <Anchor href={router.links.actions}>actions</Anchor> are the mutation for data. You can use the super power of{" "}
                <Anchor href={router.links.form}>{"<Form />"}</Anchor> to create the actions response. This concept is similar of{" "}
                <Anchor href="https://reactrouter.com/en/main/route/action">react-router actions</Anchor>.
            </p>
            <SubTitle>Params</SubTitle>
            <p>
                Actions receive just one parameter, an object with the{" "}
                <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Request">Request</Link> and some other properties. The same of{" "}
                <Anchor href={router.links.loaders}>loaders</Anchor>.
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

import { DocumentPage } from "../components/document-page";
import { InlineCode } from "../components/inline-code";
import { Callout } from "../components/callout";
import { Code } from "../components/code";

const code = `import { Link } from "brouther";

// router.link.users === "/users/"
const users = <Link href={router.link.users}>Users</Link>; 

// router.link.userId === "/user/:id"
const users = <Link href={router.link.users} paths={{ id: "long-uuid" }}>User</Link>; 

// router.link.orders === "/orders?status=string!&createdBy=string&limit=number"
// status: required
// createdBy and limit: optional
const users = <Link href={router.link.orders} queryString={{ status: "active" }}>Orders</Link>;`;

export default function LinkPage() {
    return (
        <DocumentPage title="Link">
            <p>
                Link component is the new <InlineCode>{"<a />"}</InlineCode>. This component is connected to brouther store and emit events to notify
                when the state of URL change.
            </p>
            <p>
                The API is the same as <InlineCode>{"<a />"}</InlineCode> but this component require <InlineCode>paths</InlineCode> and/or{" "}
                <InlineCode>queryString</InlineCode> when your <InlineCode>href</InlineCode> attribute matches with certain conditions.
            </p>
            <ul>
                <li>
                    <b>paths</b>: If your <InlineCode>href</InlineCode> attribute have dynamic path, the Link component will require this. It's
                    improve the DX and make the dynamic paths explicit in your code.
                </li>
                <li>
                    <b>queryString:</b> Unlike paths, query string it's optional when you have all properties as optional. But if at least one
                    property is required, queryString attribute will be mandatory just for the required parameter and the other parameters will be
                    optional.
                </li>
            </ul>
            <Callout type="info" title="Remember">
                <p>
                    All types of Brouther are in your URL. Brouther use his own route alises for ensure your paths are connected with router config.
                    But Link component accept different strings outside of router, use this in your favour.
                </p>
            </Callout>
          <p>
            Check some examples about Link
          </p>
          <Code code={code}/>
        </DocumentPage>
    );
}

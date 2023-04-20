import { DocumentPage } from "../../components/document-page";
import React from "react";
import { Code } from "../../components/code";
import { InlineCode } from "../../components/inline-code";
import { Anchor } from "../../components/anchor";
import { router } from "../../router";
import { Link } from "brouther";

const code = `type Params = Record<string, { path: string; element: <App /> }>`;

export default function CreateRouterPage() {
    return (
        <DocumentPage title="createMappedRouter">
            <p>
                This method abstract the <InlineCode>createRouter</InlineCode> method. If createRouter takes an array, createMappedRouter takes an
                object. This can be useful to create your routes using the same key of configure object in your <InlineCode>links</InlineCode> object
                to use your routes.
            </p>
            <Code code={code} />
            <p>
                The{" "}
                <Anchor as={Link} href={router.links.createRouter}>
                    return type
                </Anchor>{" "}
                is the same of createRouter. This method was create just as an alternative to choose array or object in your config. You can also use{" "}
                <InlineCode>createRecordRouter</InlineCode>.
            </p>
        </DocumentPage>
    );
}

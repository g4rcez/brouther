import { DocumentPage } from "../../components/document-page";
import React from "react";
import { Code } from "../../components/code";
import { InlineCode } from "../../components/inline-code";
import { SubTitle } from "../../components/subtitle";
import { Anchor } from "../../components/anchor";
import { Link } from "brouther";
import { router } from "../../router";

const code = `type Params = { id: string }`;

export default function CreateRouterPage() {
    return (
        <DocumentPage title="createRouter">
            <p>The entrypoint of any config for Brouther. This method takes an array and return some object and methods like:</p>
            <ul>
                <li>
                    <b>config</b>: All necessary data to Brouther parse and create the routing logic
                </li>
                <li>
                    <b>navigation</b>: useful methods to control your state without React tree
                </li>
                <li>
                    <b>links</b>: object with all alias:routes to avoid type strings in your code
                </li>
                <li>
                    <b>link</b>: a method that takes the route and extract other two arguments by according your route, maybe required dynamic paths
                    and query string
                </li>
                <li>
                    <b>usePaths</b>: this method takes the route alias and return the correct typed dynamic paths. Considering route usersId is{" "}
                    <InlineCode>/users/:id</InlineCode> and the type will be:
                    <Code code={code} />
                </li>
            </ul>
            {/*<Callout title="Remember">All variables in a dynamic path are string</Callout>*/}
            <SubTitle as="h3">config</SubTitle>
            <p>
                This is an internal object for brouther. You shouldn't use this object in any place, except for{" "}
                <Anchor href={router.links.brouther} as={Link}>
                    Brouther
                </Anchor>
                . It's won't cover the semver and will be only for internal configuration.
            </p>
            <SubTitle as="h3">navigation</SubTitle>
            <p>
                If you need to manipulate your history outside of React, you need to use <InlineCode>navigation</InlineCode>. This method return an
                useful methods to manipulate history using a familiar API, the <Anchor href="https://www.npmjs.com/package/history">history</Anchor>.
            </p>
            <ul>
                <li>
                    <b>back</b>: Back in history. Same behavior of browser.
                </li>
                <li>
                    <b>forward</b>: Go forward history. Same behavior of browser.
                </li>
                <li>
                    <b>go</b>: Go N times in browser. You can jump N steps using positive (go forward) or negative (go backward)
                </li>
                <li>
                    <b>push</b>: Go to path using history api.
                </li>
                <li>
                    <b>replace</b>: Go to path using history api, but replace the current route in stack for the new one.
                </li>
            </ul>
        </DocumentPage>
    );
}

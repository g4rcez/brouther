import React, { Fragment } from "react";
import { SubTitle } from "../subtitle";
import { InlineCode } from "../inline-code";
import { Anchor } from "../anchor";

export const NavigationDocument = () => (
    <Fragment>
        <SubTitle as="h3">navigation</SubTitle>
        <p>
            If you need to manipulate your history outside of React, you need to use <InlineCode>navigation</InlineCode>. This method return an useful
            methods to manipulate history using a familiar API, the <Anchor href="https://www.npmjs.com/package/history">history</Anchor>.
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
    </Fragment>
);

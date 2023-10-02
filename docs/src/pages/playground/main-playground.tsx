import { DocumentPage } from "../../components/document-page";
import { router } from "../../router";
import { SubTitle } from "../../components/subtitle";
import { InlineCode } from "../../components/inline-code";
import { useEffect } from "react";
import { Code } from "../../components/code";
import { Callout } from "../../components/callout";
import { Anchor } from "../../components/anchor";

declare global {
    interface Window {
        brouther: typeof router;
    }
}

export default function MainPlayground() {
    useEffect(() => {
        window.brouther = router;
    }, []);

    return (
        <DocumentPage title="Playground">
            <p>
                At this page you can interact with brouther <InlineCode>router</InlineCode> object.
            </p>
            <Callout title="Tips and hints">
                You can use <InlineCode>window.brouther</InlineCode> to interact with global router
            </Callout>
            <SubTitle>Navigate</SubTitle>
            <p>
                Move between pages with a simple API. You can use the <Anchor href={router.links.useNavigation}>useNavigation</Anchor> hook or just
                use the router object
            </p>
            <Code code={`window.brouther.navigation.push("/")`} />
            <SubTitle>Router object</SubTitle>
            <pre className="my-2">
                <code>{JSON.stringify(router, null, 4)}</code>
            </pre>
        </DocumentPage>
    );
}

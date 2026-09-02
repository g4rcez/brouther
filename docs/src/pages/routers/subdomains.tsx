import { Code } from "../../components/code";
import { DocumentPage } from "../../components/document-page";
import { InlineCode } from "../../components/inline-code";
import { Callout } from "../../components/callout";

const code = `const router = createRouter({
    subdomains: {
        path: "/routers/subdomains",
        element: <SubdomainsPage />,
        domains: ["docs.localhost"],
    },
});

// A function is also supported:
const domains = () => ["docs.localhost"];`;

export default function SubdomainsPage() {
    return (
        <DocumentPage title="Subdomain routing">
            <p>
                A route can be limited to one or more hostnames with <InlineCode>domains</InlineCode>. Routes without
                this property remain available on every hostname.
            </p>
            <Code code={code} language="typescript" />
            <Callout title="Try it">
                <p>
                    Start the docs with <InlineCode>pnpm run dev:portless</InlineCode> from the{" "}
                    <InlineCode>docs</InlineCode> directory.
                </p>
                <p>
                    Portless serves this page at <InlineCode>https://docs.localhost/routers/subdomains</InlineCode>.
                </p>
            </Callout>
            <p>
                This page only matches <InlineCode>docs.localhost</InlineCode>. The current hostname is{" "}
                <InlineCode>{window.location.hostname}</InlineCode>.
            </p>
            <p>
                Open the same path on another hostname, such as <InlineCode>localhost</InlineCode>, to see the not-found
                route.
            </p>
            <p>
                Change <InlineCode>domains</InlineCode> to <InlineCode>{'() => ["docs.localhost"]'}</InlineCode> to test
                the function form.
            </p>
        </DocumentPage>
    );
}

import { DocumentPage } from "../components/document-page";
import { SubTitle } from "../components/subtitle";
import { Code } from "../components/code";
import { router } from "../router";
import { Anchor } from "../components/anchor";
import { InlineCode } from "../components/inline-code";

const code = `import { Link } from "brouther";

type YourQuery = { text: string[] };

const Component = <Link href="/?text=string[]" query={{ text: ["first line"] }}>Link</Link>;`;

export default function DecisionRecords() {
    return (
        <DocumentPage title="Decision Records">
            <p>
                At this page, all decision records will be documented. Here you can find the motivation of some decisions, like "Why types at
                query-string?" or "usePaths vs useParams".
            </p>
            <SubTitle>Why types at query string?</SubTitle>
            <p>
                If you need to use the URL as state, you will use query string. But without types you're lost. And brouther will recover you on that
                with URL types at query-string using Typescript primitives and Arrays.
            </p>
            <p>Look at this code below</p>
            <Code code={code} />
            <p>
                Every query string defined at your <Anchor href={router.links.linkComponent}>href</Anchor> or at{" "}
                <Anchor href={router.links.createRouter}>brouther config</Anchor> will be transformed into a type using the brouther{" "}
                <Anchor href="https://github.com/g4rcez/brouther/blob/6a44d3db1f6bca256d7989ddd6946bea5926066a/src/types/index.ts#L62">
                    string parser
                </Anchor>
                . You can play with this type parser at <Anchor href="https://tsplay.dev/WPMKew">this playground</Anchor>
            </p>
            <SubTitle>Why usePaths instead useParams?</SubTitle>
            <p>
                You're familiar with <Anchor href="https://reactrouter.com/en/main">react-router</Anchor> or{" "}
                <Anchor href="https://tanstack.com/router">tanstack-router</Anchor> you should know the hook <InlineCode>useParams</InlineCode>.
            </p>
            <p>
                But why brouther doesn't have this hook? Ops...brouther does have. But the name is{" "}
                <Anchor href={router.links.usePaths}>usePaths</Anchor>. We have the{" "}
                <Anchor href="https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams">URL Search Params</Anchor> and this can cause
                confusion. To avoid this, brouther use paths.
            </p>
        </DocumentPage>
    );
}

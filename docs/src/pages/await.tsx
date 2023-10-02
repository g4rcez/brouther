import { DocumentPage } from "../components/document-page";
import { InlineCode } from "../components/inline-code";
import { Code } from "../components/code";

const code = `import { Await } from "brouther";

const createPromise = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function Component() {
  return (
    <Fragment>
      <Await promise={createPromise(2000)} loadingElement={<p>Loading...</p>} />
    </Fragment>
  );
}`

export default function AwaitComponentPage() {
    return (
        <DocumentPage title="Await component">
            <p>
                If you need to resolve a promise inside of your component, you can use <InlineCode>{"<Await />"}</InlineCode> component. This
                component can help you on loading the promise, showing a <InlineCode>loadingElement</InlineCode> while the promise isn't resolved.
            </p>
          <Code code={code}/>
        </DocumentPage>
    );
}

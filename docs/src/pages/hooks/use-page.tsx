import { DocumentPage } from "../../components/document-page";
import { Code } from "../../components/code";
import { Callout } from "../../components/callout";

const code = `import { usePage } from "brouther";

export const App = () => {
    const page = usePage();
    return (
      <AppShell>{page === null ? <NotFound /> : page}</AppShell>
    )
};`;

export default function HookUsePage() {
    return (
        <DocumentPage title="usePage">
            <p>
                Use this hook to retrieve the current page and then render it. This approach has been chosen to offer enhanced control when rendering
                your current route component.
            </p>
            <p>
                This hook streamlines your app development process, enabling you to easily employ the returned value for creating the <i>Not Found</i>
                route. Here is an example of how to implement it:
            </p>
            <Code code={code} />
            <Callout type="info" title="Tips and tricks">
                Instead of complicated component notation to catch route fallback, you can just drop this snippet and your <i>Not Found</i> component
                will work.
            </Callout>
        </DocumentPage>
    );
}

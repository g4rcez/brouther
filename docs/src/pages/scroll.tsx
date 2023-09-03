import { DocumentPage } from "../components/document-page";
import { InlineCode } from "../components/inline-code";

const code = `import { createMappedRouter, usePage, Scroll, useScroll } from "brouther";

export const router = createMappedRouter({
    index: { path: "/", element: <App /> }
} as const);


const Root = () => {
    const page = usePage();
    return <div> {page} </div>;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <React.Suspense fallback={<React.Fragment />}>
            <Brouther config={router.config}>
                <Root />
            </Brouther>
        </React.Suspense>
    </React.StrictMode>
);`;

const withFilter = `import { createMappedRouter, usePage } from "brouther";

export const router = createMappedRouter({
    index: { path: "/", element: <App /> }
} as const);


const Root = () => {
    const page = usePage();
    return <div>{page}</div>;
};

const Entry = () => {
      const config = useBackendConfig();
      
      const filter = useCallback((route: ConfiguredRoute) => {
        const result = config.validate(route.data.feature);
        return result === "approved";
      }, [response]);
      
      return (
        <React.StrictMode>
            <React.Suspense fallback={<React.Fragment />}>
                <Brouther config={router.config} filter={filter}>
                    <Root />
                </Brouther>
            </React.Suspense>
        </React.StrictMode>
      );

};

ReactDOM
  .createRoot(document.getElementById("root") as HTMLElement)
  .render(<Entry />);`;

export default function BroutherPage() {
    return (
        <DocumentPage title="Brouther">
            <p>
                If you need to restore the scroll between page transitions, you can use the <InlineCode>{"<Scroll />"}</InlineCode> component. This
                component enable you to restore the scroll position, based in the last position of screen.
            </p>
            <p>This component also enable the scroll based in anchors.</p>
        </DocumentPage>
    );
}

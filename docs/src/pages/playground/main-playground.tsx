import { Fragment, useEffect, useState } from "react";
import { Anchor } from "../../components/anchor";
import { Button } from "../../components/button";
import { Callout } from "../../components/callout";
import { Code } from "../../components/code";
import { DocumentPage } from "../../components/document-page";
import { InlineCode } from "../../components/inline-code";
import { SubTitle } from "../../components/subtitle";
import { Actions, Form, jsonResponse, LoaderProps, redirectResponse, useDataLoader, useNavigation, usePaths } from "../../exports";
import { router } from "../../router";

declare global {
    interface Window {
        brouther: typeof router;
    }
}

const request = () => {
    console.log("REQUEST OK");
    return Array.from({ length: 200 }).map((_, i) => i);
};

export const loader = async (args: LoaderProps) => {
    const prev = args.alreadyRendered ? await args.cache?.json() : null;
    console.log("prev", args.prev);
    const response = prev?.response || request();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return jsonResponse({ response: args.alreadyRendered ? ["COOL", ...response] : response });
};

export const actions: Actions<"/playground?type=status"> = async () => ({
    post: async (args) => {
        const body = await args.request.json();
        const url = args.link(args.path, { type: body.type }, { type: body.type });
        console.log(url, body);
        return redirectResponse(url);
    },
});

type Match = { name: string; value: string };

const parseParams = (txt: string): Match[] => {
    const regex = /(\/:\w+|\/<\w+:\w+>)/gm;
    const result = txt.match(regex);
    if (!result) return [];
    return result.map((x) => {
        if (x.includes("<")) {
            const [name, value] = x
                .replace(/([<>])/g, "")
                .replace(/^\//, "")
                .split(":");
            return { name, value };
        }
        return { name: x.split(":")[1], value: "string" };
    });
};

const PathParser = () => {
    const data = useDataLoader<typeof loader>();
    const [state, setState] = useState("/users/<id:number>/orders/:uuid");

    return (
        <Fragment>
            <SubTitle>Parse URLs</SubTitle>
            <p>
                You can check the JSON from an URL with brouther parsers. At playground below you can test how your types at the URL will be parsed as
                types.
            </p>
            <div className="flex flex-col gap-4">
                <label>
                    <span className="cursor-text">Your URL</span>
                    <input
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="/users/<id:number>"
                        className="border p-2 border-slate-400 rounded-md bg-white w-full"
                    />
                </label>
                <Button className="bg-indigo-600 w-fit link:bg-indigo-500 text-white" onClick={() => setState("/users/<id:number>/orders/:uuid")}>
                    Reset example
                </Button>
            </div>
            <pre>
                <code>
                    "{state}"
                    <br />
                    {JSON.stringify(parseParams(state), null, 4)}
                </code>
            </pre>
        </Fragment>
    );
};

export default function MainPlayground() {
    const navigation = useNavigation();
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
            <nav className="grid grid-cols-2 gap-8 my-4 justify-center">
                <Anchor className="w-fit" href={router.links.index}>
                    Go to root ({router.links.index})
                </Anchor>
                <Anchor className="w-fit" href={router.links.decisions}>
                    Go to decisions ({router.links.decisions})
                </Anchor>
                <Anchor className="w-fit" href={router.links.tricksAndTips}>
                    Go to hints ({router.links.tricksAndTips})
                </Anchor>
                <Anchor className="w-fit" href={router.links.brouther}>
                    Go to {"<Brouther />"} ({router.links.brouther})
                </Anchor>
            </nav>
            <button
                onClick={() => {
                    navigation.back();
                }}
            >
                Back in history
            </button>
            <PathParser />
            <Form method="post" encType="json">
                <input name="type" placeholder="Type to QueryString" />
                <button type="submit">Submit</button>
            </Form>
            <pre>
                <code>{JSON.stringify(usePaths(), null, 4)}</code>
            </pre>
            <SubTitle>Router object</SubTitle>
            <pre className="my-2">
                <code>{JSON.stringify(router, null, 4)}</code>
            </pre>
        </DocumentPage>
    );


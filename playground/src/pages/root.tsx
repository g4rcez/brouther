import { ActionProps, AnyJson, createFormPath, Form, jsonResponse, Link, LoaderProps, redirectResponse, useDataLoader } from "../../../src";
import { useEffect } from "react";
import { router } from "../routes";
import { FromLoader } from "../../../src/brouther/brouther-response";

type Route = "/?number=number";

export const loader = async (args: LoaderProps<Route>) => {
    return jsonResponse({
        url: args.path,
        paths: args.paths,
        data: args.data as AnyJson,
        queryString: args.queryString,
    });
};

const path = createFormPath<{ person: { name: string; surname: string; birthday: Date } }>();

export default function Root() {
    const queryString = router.useQueryString(router.links.index);
    const params = router.usePaths(router.links.index);
    const data = useDataLoader<FromLoader<typeof loader>>();

    useEffect(() => {
        console.log("data loader", data);
    }, [data]);

    return (
        <div>
            <h2>index page</h2>
            <Link href={router.links.index} query={{ number: 1 }}>
                Link - Root
            </Link>
            <section>
                <h2>Form post action - json</h2>
                <Form encType="json" method="post">
                    <input name={path("person.name")} placeholder="First Name" />
                    <input name={path("person.surname")} placeholder="Last Name" />
                    <input name={path("person.birthday")} type="date" placeholder="Birthday" />
                    <button type="submit">Submit</button>
                </Form>
            </section>
        </div>
    );
}

export const actions = () => ({
    post: async (args: ActionProps<Route>) => {
        const url = new URL(args.request.url);
        const json = await args.request.json();
        url.searchParams.set("firstName", json.person.name);
        url.searchParams.set("lastName", json.person.surname);
        return redirectResponse(url.href);
    },
});

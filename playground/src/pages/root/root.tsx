import {
    Actions,
    AnyJson,
    Form,
    jsonResponse,
    jsonToURLSearchParams,
    Link,
    Loader,
    redirectResponse,
    urlSearchParamsToJson,
    useDataLoader,
} from "../../../../src";
import { useEffect } from "react";
import { router } from "../../routes";

export default function Root() {
    const queryString = router.useQueryString(router.links.index);
    const params = router.usePaths(router.links.index);
    const loaderData = useDataLoader();

    useEffect(() => {
        console.log("data loader", loaderData);
    }, [loaderData]);

    return (
        <div>
            <h2>Users pages</h2>
            <Link state={{ language: 10 }} href={router.links.double} paths={{ id: "status", status: "id" }} query={{ language: 10 }}>
                Link - Root
            </Link>
            <Form encType="json" method="post">
                <input name="person.name" placeholder="name" />
                <input name="person.surname" placeholder="name" />
                <input name="person.birthday" type="date" placeholder="name" />
                <button type={"submit"}>Submit</button>
            </Form>
        </div>
    );
}

type Route = "/?number=number";

export const loader: Loader<Route> = async (args) =>
    jsonResponse({
        paths: args.paths,
        data: args.data as AnyJson,
        queryString: args.queryString,
    });

export const actions: Actions<Route> = () => ({
    post: async (args) => {
        const url = new URL(args.request.url);
        const json = await args.request.json();
        const search = jsonToURLSearchParams(json);
        const searchEntries = search.entries();
        console.log({
            json,
            entries: [...searchEntries],
            searchAsJson: urlSearchParamsToJson(search),
        });
        url.searchParams.set("numbers", Math.random().toString());
        return redirectResponse(url.href);
    },
});

import { ActionProps, createFormPath, Form, jsonResponse, LoaderProps, redirectResponse, useDataLoader, useLoadingState } from "../../../src";
import { useEffect, useState } from "react";
import { Input } from "../components/input";

type Route = "/?firstName=string&lastName=string&date=Date";

export const loader = async (args: LoaderProps<Route>) => jsonResponse({ qs: args.queryString });

export const actions = () => ({
    post: async (args: ActionProps<Route>) => {
        const url = new URL(args.request.url);
        const json = await args.request.json();
        console.log(args.request);
        url.searchParams.set("firstName", json.person.name);
        url.searchParams.set("lastName", json.person.surname);
        url.searchParams.set("date", json.person.birthday);
        await new Promise((res) => setTimeout(res, 3000));
        return redirectResponse(url.href);
    },
});

type State = { person: { name: string; surname: string; birthday: Date } };

const path = createFormPath<State>();

export default function Root() {
    const data = useDataLoader<typeof loader>();
    const qs = data?.qs;
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        console.log("data loader", data?.qs);
    }, [data]);

    const loading = useLoadingState();

    return (
        <section className="flex flex-col gap-12">
            <h2 className="font-bold text-3xl">Form post action - json</h2>
            <button
                className="duration-300 transition-colors ease-in-out bg-red-500 text-white font-semibold text-lg rounded-lg w-fit px-4 py-1 link:bg-red-600"
                onClick={() => setError(new Error("BOOM"))}
            >
                Throw error
            </button>
            <Form encType="json" method="post">
                <fieldset className="flex gap-8 items-end disabled:opacity-40 disabled:bg-gray-400">
                    <Input defaultValue={qs?.firstName} name={path("person.name")} placeholder="First Name" />
                    <Input defaultValue={qs?.lastName} name={path("person.surname")} placeholder="Last Name" />
                    <Input defaultValue={qs?.date} name={path("person.birthday")} type="date" placeholder="Birthday" />
                    <button className="py-2 px-4 rounded bg-blue-500 text-white font-medium" type="submit">
                        {loading ? "Saving..." : "Submit"}
                    </button>
                </fieldset>
            </Form>
        </section>
    );
}

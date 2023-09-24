import { jsonResponse, LoaderProps, useDataLoader } from "../../../src";
import Data from "../data/users.json";

export const loader = async (args: LoaderProps<"/user/<id:string>?sort=string">) => {
    const hero = Data.users.find((user) => user.id === args.paths.id);
    return jsonResponse({ hero: hero ?? null });
};

export default function UserPage() {
    const data = useDataLoader<typeof loader>();
    return (
        <div>
            <h1>Hero: {data?.hero?.name}</h1>
            <p>Universe: {data?.hero?.universe}</p>
        </div>
    );
}

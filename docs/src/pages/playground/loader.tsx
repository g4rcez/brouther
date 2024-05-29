import { jsonResponse, useDataLoader } from "../../exports";

export const loader = async () => {
    const response = await fetch("https://api.postmon.com.br/v1/cep/30260-070");
    console.log(await response.json());
    return jsonResponse({});
};

export const actions = async () => ({
    post: async () => {
        const response = await fetch("https://api.postmon.com.br/v1/cep/30260-070");
        console.log(await response.json());
        return jsonResponse({});
    },
});

export default function LoaderPage() {
    const data = useDataLoader<typeof loader>();
    return <div>{JSON.stringify(data, null, 4)}</div>;
}

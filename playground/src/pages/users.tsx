import { router } from "../routes";

export default function Users() {
    const queryString = router.useQueryString(router.links.users);
    const params = router.usePaths(router.links.users);

    console.log({
        // try to edit this
        qs: queryString.id,
        // route without params
        params: params,
    });

    return (
        <div>
            <h2>Users pages</h2>
        </div>
    );
}

import { router } from "../routes";

export default function Root() {
    const queryString = router.useQueryString(router.links.index);
    const params = router.useParams(router.links.index);

    console.log({
        // both are {}
        qs: queryString,
        params: params,
    });

    return (
        <div>
            <h2>Users pages</h2>
        </div>
    );
}

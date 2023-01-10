import { router } from "../routes";

export default function UserIdAddress() {
    const queryString = router.useQueryString(router.links.addressList);
    const params = router.useParams(router.links.addressList);

    console.log({
        // autocomplete works for both
        qs: queryString.sort,
        params: params.id,
    });

    return (
        <div>
            <h2>
                User <i style={{ textDecoration: "underline" }}>{params.id}</i> address
            </h2>
        </div>
    );
}

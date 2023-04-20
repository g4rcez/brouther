import { router } from "../routes";
import { useDataLoader } from "../../../src/brouther";
import { useEffect } from "react";
import { Form } from "../../../src/form";
import { Link } from "../../../src";

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

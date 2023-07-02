import Data from "../data/users.json";
import { Link, useQueryString } from "../../../src";
import { router } from "../routes";

export default function UsersPage() {
    const qs = useQueryString(router.links.users);
    const sortedList =
        qs.sort === "asc" ? Data.users.sort((a, b) => a.name.localeCompare(b.name)) : Data.users.sort((a, b) => b.name.localeCompare(a.name));

    return (
        <div>
            <ul id="users">
                {sortedList.map((user) => (
                    <li key={user.id}>
                        <Link href={router.link(router.links.user, { id: user.id })}>
                            {user.name} - {user.universe}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

import { jsonResponse, Link, LoaderProps, useDataLoader, useQueryString } from "../../../src";
import { router } from "../routes";

const posts = [
    "How Brouther Works?",
    "React Router vs Brouther",
    "Actions and Loaders",
    "Type safe at routing level",
    "Tanstack vs Brouther",
    "1router to rule them all",
    "Can I use Brouther in production?",
];

type Router = "/blog?sort=string";

export const loader = (props: LoaderProps<Router>) => {
    const qs = props.queryString;
    const sortedPosts = qs.sort === "asc" ? posts.sort((a, b) => a.localeCompare(b)) : posts.sort((a, b) => b.localeCompare(a));
    return jsonResponse({ posts: sortedPosts });
};

export default function BlogPage() {
    const sortedPosts = useDataLoader<typeof loader>()?.posts ?? [];
    return (
        <div>
            <h1 className="text-3xl font-extrabold">Blog</h1>
            <nav className="flex flex-row gap-4 my-4">
                <Link className="link:underline transition-colors duration-300 link:text-blue-500" href={router.links.blog} query={{ sort: "asc" }}>
                    Sort Asc
                </Link>
                <Link className="link:underline transition-colors duration-300 link:text-blue-500" href={router.links.blog} query={{ sort: "desc" }}>
                    Sort Desc
                </Link>
            </nav>
            <ul>
                {sortedPosts.map((x) => (
                    <li key={x}>{x}</li>
                ))}
            </ul>
        </div>
    );
}

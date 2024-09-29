import { Link, LinkProps } from "../exports";

export const Anchor = <TPath extends string>(props: LinkProps<TPath>) => (
    <Link
        {...props}
        className={`text-transparent m-0 p-0 font-extrabold tracking-wide bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500 inline-block border-b border-transparent link:border-b-indigo-400 transition-colors duration-300 ${
            props.className ?? ""
        }`}
    />
);

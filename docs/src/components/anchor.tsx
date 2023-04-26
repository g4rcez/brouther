type Props<C extends React.ElementType> = {
    as?: C;
    children: React.ReactNode;
} & React.ComponentPropsWithoutRef<C>;

export const Anchor = <AS extends React.ElementType = "a">({ as, ...props }: Props<AS>) => {
    const Component = as || "a";
    return (
        <Component
            {...props}
            className={`text-transparent m-0 p-0 font-extrabold tracking-wide bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500 inline-block border-b border-transparent link:border-b-indigo-400 transition-colors duration-300 ${
                props.className ?? ""
            }`}
        />
    );
};

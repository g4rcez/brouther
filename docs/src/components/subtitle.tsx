import React from "react";

type Props<C extends React.ElementType> = {
    as?: C;
    children: React.ReactNode;
} & React.ComponentPropsWithoutRef<C>;

export const SubTitle = <A extends React.ElementType = "h2">({ as, ...props }: Props<A>) => {
    const Component = as || "h2";
    return <Component className="min-w-full leading-loose text-3xl font-extrabold mt-2">{props.children}</Component>;
};

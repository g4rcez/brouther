import React from "react";
import { IconProps } from "@radix-ui/react-icons/dist/types";

type SVGProps = React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;

type Props = { title: string; Icon: SVGProps; className?: string };

const size = "40px";

export const Card = (props: React.PropsWithChildren<Props>) => {
    return (
        <div className={`w-full flex flex-col ${props.className ?? ""}`}>
            <header className="flex flex-col gap-4 items-center">
                <props.Icon height={size} width={size} aria-hidden="true" fontSize="500px" />
                <h3 className="text-3xl font-extrabold">{props.title}</h3>
            </header>
            <section className="flex flex-col text-center">{props.children}</section>
        </div>
    );
};

import React from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";

const setup = {
    warning: {
        icon: <InfoCircledIcon />,
        className: "bg-amber-100 text-amber-800",
    },
    info: {
        icon: <InfoCircledIcon />,
        className: "bg-sky-100 text-cyan-800",
    },
    danger: {
        icon: <InfoCircledIcon />,
        className: "bg-amber-100 text-amber-600",
    },
} as const;

type Types = keyof typeof setup;

type Props = { title: string; type?: Types };

export const Callout = (props: React.PropsWithChildren<Props>) => {
    const theme = setup[props.type ?? "warning"];
    return (
        <div role="alert" className={`w-full not-prose my-4 rounded-xl p-6 flex items-baseline gap-4 ${theme.className}`}>
            <div>{theme.icon}</div>
            <div>
                <h3 className="font-bold leading-loose text-lg">{props.title}</h3>
                <section>{props.children}</section>
            </div>
        </div>
    );
};

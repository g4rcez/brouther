import React from "react";

export const InlineCode = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => (
    <code {...props} className={`rounded-lg text-sm bg-indigo-900 text-white px-2 py-1 leading-loose ${props.className ?? ""}`} />
);

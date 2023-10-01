export type TextFragment = {
    text: string;
    prefix?: string;
    suffix?: string;
};

const regex = /(?<prefix>\w+-,)?.*?(?<suffix>,-\w+)?/;

const specialText = (str: string): TextFragment => {
    const groups = (regex.exec(str) as any)?.groups;
    if (!groups) return { text: str };
    const text = str.replace(groups.prefix || "", "").replace(groups.suffix || "", "");
    const prefix = groups.prefix?.replace(/-$/, "");
    const suffix = groups.suffix?.replace(/^-/, "");
    return { text, prefix, suffix };
};

export const TEXT_FRAGMENT_ID = ":~:";

const hasTextIdentifier = (url: string) => url.includes(TEXT_FRAGMENT_ID);

export const stringifyTextFragment = (textFragments: TextFragment[]) =>
    textFragments
        .map((x) => {
            let text = "text=";
            if (x.prefix) text += `${x.prefix}-,`;
            text += `${x.text}`;
            if (x.suffix) text += `,-${x.suffix}`;
            return text;
        })
        .join("&");

export const parseTextFragment = (url: string): TextFragment[] | null => {
    if (!("fragmentDirective" in document)) {
        return null;
    }
    const u = new URL(url);
    const hash = u.hash;
    const textFragment = hash.split(TEXT_FRAGMENT_ID)[1];
    if (!textFragment) return null;
    return textFragment.split("&").reduce<TextFragment[]>((acc, el) => {
        const v = el.split("=")[1] || "";
        const text = decodeURIComponent(v);
        return [...acc, v.includes(",") ? specialText(text) : { text }];
    }, []);
};

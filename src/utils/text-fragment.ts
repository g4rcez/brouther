export type TextFragment = {
    text: string;
    prefix?: string;
    suffix?: string;
};

// WICG syntax: text=[prefix-,]textStart[,textEnd][,-suffix]. Split before decoding: an encoded comma (%2C) belongs to the text.
const parseDirective = (value: string): TextFragment => {
    const parts = value.split(",");
    const fragment: TextFragment = { text: "" };
    if (parts.length > 1 && parts[0].endsWith("-")) fragment.prefix = decodeURIComponent(parts.shift()!.slice(0, -1));
    if (parts.length > 1 && parts[parts.length - 1].startsWith("-")) fragment.suffix = decodeURIComponent(parts.pop()!.slice(1));
    fragment.text = parts.map(decodeURIComponent).join(",");
    return fragment;
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
        return [...acc, parseDirective(v)];
    }, []);
};

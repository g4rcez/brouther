import { Highlight } from "prism-react-renderer";
import { themes } from "prism-react-renderer";
import { useId } from "react";

type Props = { code: string; language?: "jsx" | "typescript" | "bash" };

export const Code = (props: Props) => {
    const id = useId();
    return (
        <div className="max-w-full container block overflow-auto">
            <Highlight theme={themes.dracula} code={props.code} language={props.language ?? "jsx"}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                        className={`${className} rounded-lg p-4 my-2 w-full whitespace-pre overflow-x-auto`}
                        style={{
                            ...style,
                            width: "100%",
                            overflowX: "auto",
                            whiteSpace: "pre",
                            wordSpacing: "normal",
                            wordBreak: "normal",
                            wordWrap: "normal",
                            lineHeight: "1.5",
                        }}
                    >
                        {tokens.map((line, i) => (
                            <div {...getLineProps({ line, key: i })} key={`${id}-${i}`}>
                                <div className="w-[3ch] inline-block mr-2">{i + 1}</div>
                                {line.map((token, key) => (
                                    <span {...getTokenProps({ token, key })} key={`${key}-${token.content}`} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </div>
    );
};

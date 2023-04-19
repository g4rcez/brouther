import Highlight, { defaultProps as defaults } from "prism-react-renderer";

type Props = { code: string; language?: "jsx" | "typescript" | "bash" };

export const Code = (props: Props) => {
    return (
        <Highlight {...defaults} code={props.code} language={props.language ?? "jsx"}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={`${className} rounded-lg p-4 my-2 min-w-full`} style={style}>
                    {tokens.map((line, i) => (
                        <div {...getLineProps({ line, key: i })}>
                            <div className="w-[3ch] inline-block mr-2">{i + 1}</div>
                            {line.map((token, key) => (
                                <span {...getTokenProps({ token, key })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    );
};

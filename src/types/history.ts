// all types extracted from history
export enum Action {
    Pop = "POP",
    Push = "PUSH",
    Replace = "REPLACE",
}

type Path = { pathname: string; search: string; hash: string };

type Location = Path & { state: unknown; key: string };

type Href = string | Partial<Path>;

type Listener = (args: { action: Action; location: Location }) => void;

export type BrowserHistory = {
    readonly action: Action;
    readonly location: Location;
    createHref(to: Href): string;
    push(to: Href, state?: any): void;
    replace(to: Href, state?: any): void;
    go(delta: number): void;
    back(): void;
    forward(): void;
    listen(listener: Listener): () => void;
    block(blocker: any): () => void;
};

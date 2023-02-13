import type { BrowserHistory } from "history";

export class RouterNavigator {
    public back: () => void;
    public forward: () => void;
    public go: (jumps: number) => void;
    public push: (path: string) => void;
    public replace: (path: string) => void;

    public constructor(h: BrowserHistory) {
        this.go = (jumps) => h.go(jumps);
        this.forward = () => h.forward();
        this.back = () => h.back();
        this.push = (path) => h.push(path);
        this.replace = (path) => h.replace(path);
    }
}

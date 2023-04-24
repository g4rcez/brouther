import type { BrowserHistory } from "history";

type Push = (path: string, state?: any) => void;

export class RouterNavigator {
    public back: () => void;
    public forward: () => void;
    public go: (jumps: number) => void;
    public push: Push;
    public replace: Push;

    public constructor(h: BrowserHistory) {
        this.go = (jumps) => h.go(jumps);
        this.forward = () => h.forward();
        this.back = () => h.back();
        this.push = (path, state) => void h.push(path, state);
        this.replace = (path, state) => void h.replace(path, state);
    }
}

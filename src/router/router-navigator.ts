import type { BrowserHistory } from "history";

type Push = (path: string, state?: any) => void;

export class RouterNavigator {
    public back: () => void;
    public forward: () => void;
    public go: (jumps: number) => void;
    public push: Push;
    public replace: Push;

    public constructor(h: BrowserHistory) {
        this.back = () => void h.back();
        this.forward = () => void h.forward();
        this.go = (jumps) => void h.go(jumps);
        this.push = (path, state) => void h.push(path, state);
        this.replace = (path, state) => void h.replace(path, state);
    }
}

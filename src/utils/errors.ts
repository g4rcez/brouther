import { ContextState } from "../context";

export abstract class BroutherError extends Error {
    protected constructor() {
        super();
        this.name = "BroutherError";
    }
}

export class UncaughtDataLoader extends BroutherError {
    public constructor(public error: Error) {
        super();
        this.name = "UncaughtDataLoader ";
    }
}

export class NotFoundRoute extends BroutherError {
    constructor(public readonly pathname: string) {
        super();
        this.name = "NotFoundRoute";
    }
}

export class UnmountTimeout extends BroutherError {
    constructor(public readonly context: ContextState) {
        super();
        this.name = "UnmountTimeout";
    }
}

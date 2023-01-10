export abstract class BroutherError extends Error {}

export class NotFoundRoute extends BroutherError {
  constructor(public readonly pathname: string) {
    super();
    this.name = "NotFoundRoute";
  }
}

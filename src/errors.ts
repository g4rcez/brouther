export class NotFoundRoute extends Error {
  constructor(message: string) {
    super("[@Brouther/NotFound]" + message);
  }
}

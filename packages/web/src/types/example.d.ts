declare module '@webcomponents/webcomponentsjs' {}

declare module '@vaadin/router' {
  export class Router {
    static NavigationTrigger: {
      POPSTATE: unknown;
    };
    static setTriggers(trigger: unknown): unknown;

    setRoutes(routes: readonly Record<string, unknown>[]): unknown;

    constructor(outlet: HTMLElement | null);
  }
}

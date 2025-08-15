type CompiledRoute = Route & {
  regex: RegExp;
  paramNames: string[];
};

export class Router {
  private compiledRoutes: CompiledRoute[] = [];
  private prefix: string;

  constructor(routes: Route[], prefix: string = "") {
    this.prefix = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
    this.compiledRoutes = this.compileRoutes(routes);
  }

  private compileRoutes(routes: Route[]): CompiledRoute[] {
    return routes.map((route) => {
      const paramNames = (route.path.match(/:[^/]+/g) || []).map((param) =>
        param.slice(1)
      );

      const fullPath = route.skipPrefix ? route.path : this.prefix + route.path;
      const regexPattern = fullPath.replace(/:[^/]+/g, "([^/]+)");
      const regex = new RegExp(`^${regexPattern}$`);
      return { ...route, regex, paramNames };
    });
  }

  private findMatchingRoute(method: string, pathname: string) {
    for (const route of this.compiledRoutes) {
      if (route.method !== method) continue;

      const match = pathname.match(route.regex);
      if (match) {
        const params = Object.fromEntries(
          route.paramNames.map((name, i) => [name, match[i + 1]])
        );
        return { route, params };
      }
    }
    return null;
  }

  public handle({ req, res }: Http): void {
    const requestedUrl = new URL(req.url || "", `http://${req.headers.host}`);
    const matchResult = this.findMatchingRoute(
      req.method!,
      requestedUrl.pathname
    );

    if (matchResult) {
      const ctx: Http = { req, res, params: matchResult.params };
      try {
        matchResult.route.handler(ctx);
      } catch (error) {
        console.error("Route handler error:", error);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: "Internal Server Error" }));
        }
      }
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Not Found" }));
    }
  }
}

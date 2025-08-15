import http from "http";

declare global {
  type Http = {
    req: http.IncomingMessage;
    res: http.ServerResponse;
    params?: Record<string, string>;
  };

  type Route<T extends string = ""> = {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    path: T;
    handler: (ctx: Http) => void;
  };
}

export {};

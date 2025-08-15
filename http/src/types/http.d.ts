import http from "http";

declare global {
  type Http = {
    req: http.IncomingMessage;
    res: http.ServerResponse;
    params?: Record<string, string>;
  };

  type Route = {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    path: string;
    handler: (ctx: Http) => void;
    skipPrefix?: boolean;
  };
}

export {};

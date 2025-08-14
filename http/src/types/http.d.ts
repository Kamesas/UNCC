import http from "http";

declare global {
  type Http = {
    req: http.IncomingMessage;
    res: http.ServerResponse;
    params?: Record<string, string>;
  };

  type Route = {
    method: string;
    path: string;
    handler: (ctx: Http) => void;
  };
}

export {};

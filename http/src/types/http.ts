import http from "http";

declare global {
  type Http = {
    req: http.IncomingMessage;
    res: http.ServerResponse;
  };
}

export {};

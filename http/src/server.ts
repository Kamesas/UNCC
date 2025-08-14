import http from "http";
import { homeRoutes } from "./features/home/home-routes.js";
import { booksRoutes } from "./features/books/books.routes.js";

const PORT = 3000;

export type Server = {
  req: http.IncomingMessage;
  res: http.ServerResponse;
};

const httpServer = http.createServer((req, res) => {
  const url = req.url;

  if (url === "/") {
    homeRoutes({ req, res });
    return;
  }

  const requestUrl = new URL(req.url || "", `http://${req.headers.host}`);

  if (requestUrl?.pathname === "/book") {
    booksRoutes({ req, res });
    return;
  }

  res.statusCode = 404;
  res.end("Not Found");
});

httpServer.listen(3000, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});

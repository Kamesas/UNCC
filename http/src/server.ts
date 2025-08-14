import http from "http";
import hostListener from "./helpers/hostListener.js";
import { homeRoutes } from "./features/home/home-routes.js";
import { booksRoutes } from "./features/books/books.routes.js";
import { profileRotes } from "./features/profile/profile.routes.js";

const PORT = 3000;

export type Server = {
  req: http.IncomingMessage;
  res: http.ServerResponse;
};

const routes: Record<string, (server: Server) => void> = {
  "/": homeRoutes,
  "/books": booksRoutes,
  "/profile": profileRotes,
};

const httpServer = http.createServer((req, res) => {
  const requestUrl = new URL(req.url || "", `http://${req.headers.host}`);
  const route = routes[requestUrl?.pathname || ""];
  route({ req, res });

  if (!route) {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

httpServer
  .listen(PORT, "0.0.0.0", () => hostListener(PORT))
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${PORT} is already in use`);
      process.exit(1);
    }
  });

import http from "http";
import hostListener from "./helpers/hostListener.js";
import { homeRoutes } from "./features/home/home.routes.js";
import { booksRoutes } from "./features/books/books.routes.js";
import { profileRoutes } from "./features/profile/profile.routes.js";

const PORT = 3000;

const routes: Record<string, (server: Http) => void> = {
  "/": homeRoutes,
  "/books": booksRoutes,
  "/profile": profileRoutes,
};

const httpServer = http.createServer((req, res) => {
  const requestUrl = new URL(req.url || "", `http://${req.headers.host}`);
  const route = routes[requestUrl?.pathname || ""];

  if (!route) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Found");
  }

  route({ req, res });
});

httpServer
  .listen(PORT, "0.0.0.0", () => hostListener(PORT))
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${PORT} is already in use`);
      process.exit(1);
    }
  });

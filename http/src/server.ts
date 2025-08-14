import http from "http";
import hostListener from "./helpers/hostListener.js";
import { loadRoutes } from "./router-loader.js";
import { Router } from "./router.js";

const PORT = 3000;

async function startServer() {
  const allRoutes = await loadRoutes();
  const router = new Router(allRoutes);

  const httpServer = http.createServer((req, res) => {
    router.handle({ req, res });
  });

  httpServer
    .listen(PORT, "0.0.0.0", () => hostListener(PORT))
    .on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${PORT} is already in use`);
        process.exit(1);
      }
    });
}

startServer();

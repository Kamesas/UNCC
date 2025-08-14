import { Server } from "../../server.js";
import fs from "fs";
import path from "path";

export function homeRoutes({ res }: Server) {
  const htmlPath = path.join(process.cwd(), "src", "views", "index.html");
  const html = fs.readFileSync(htmlPath, "utf-8");

  res.setHeader("Content-Type", "text/html");
  res.statusCode = 200;
  res.end(html);
}

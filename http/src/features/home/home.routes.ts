import fs from "fs";
import path from "path";

export function homeRoutes({ res }: Http) {
  const htmlPath = path.join(process.cwd(), "src", "views", "index.html");
  const html = fs.readFileSync(htmlPath, "utf-8");

  res.setHeader("Content-Type", "text/html");
  res.statusCode = 200;
  res.end(html);
}

export const routes: Route<"/">[] = [
  {
    method: "GET",
    path: "/",
    handler: homeRoutes,
  },
];

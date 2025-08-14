import { Server } from "../../server";

export function profileRotes({ res }: Server) {
  res.setHeader("Content-Type", "text/html");
  res.statusCode = 200;
  res.end("<h1>Profile</h1>");
}

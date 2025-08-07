import fs from "node:fs/promises";
import { info } from "../helpers/info.js";

// writeFile-write-time: 36.442s
// Performance.now(): 36471.47 ms

export async function asyncWrite(fileName = "./files/async.txt") {
  console.time("writeFile-write-time");

  const file = await fs.open(fileName, "w");

  for (let i = 0; i <= 1e6; i++) {
    await file.write(`line: ${i} \n`);
  }

  await file.close();

  console.timeEnd("writeFile-write-time");
  info();
}

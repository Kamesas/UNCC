import fs from "node:fs/promises";
import { info } from "../helpers/info.js";

async function writeFile(fileName) {
  const file = await fs.open(fileName, "w");

  for (let i = 0; i <= 1e6; i++) {
    await file.write(`line: ${i} \n`);
  }

  await file.close();
}

export async function asyncWrite(fileName = "./files/async.txt") {
  console.time("writeFile-write-time");

  await writeFile(fileName);

  console.timeEnd("writeFile-write-time");
  info();
}
// writeFile-write-time: 36.442s
// Performance.now(): 36471.47 ms

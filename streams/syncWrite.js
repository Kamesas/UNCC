import fs from "node:fs";
import { info } from "../helpers/info.js";

// syncWriteFile-time: 1.898s
// Performance.now() 1928.21 ms
export function syncWriteFile(fileName = "./files/sync.txt") {
  console.time("syncWriteFile-write-time");
  const file = fs.openSync(fileName, "w");

  let i = 0;
  while (i <= 1e6) {
    i++;

    fs.writeSync(file, `line ${i} \n`);
  }

  fs.closeSync(file);
  console.timeEnd("syncWriteFile-write-time");
  info();
}

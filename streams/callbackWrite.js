import fs from "node:fs";
import { info } from "../helpers/info.js";

export async function callbackWrite(fileName = "./files/callback.txt") {
  console.time("callbackWrite-write-time");

  fs.open(fileName, "w", (err, fd) => {
    for (let i = 0; i <= 1e6; i++) {
      const buff = Buffer.from(`line ${i} \n`, "utf-8");

      fs.writeSync(fd, buff);
    }

    console.timeEnd("callbackWrite-write-time");
    info();
  });
}

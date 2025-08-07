import fs from "node:fs/promises";
import { info } from "../helpers/info.js";

export async function stream(fileName = "./files/stream.txt") {
  console.time("stream-write-time");

  const file = await fs.open(fileName, "w");
  const stream = file.createWriteStream();

  let i = 0;

  function writeStream() {
    while (i <= 1e6) {
      const buff = Buffer.from(`line  ${i} \n`, "utf-8");
      const canContinue = stream.write(buff);
      i++;

      if (!canContinue) break;
    }

    if (i >= 1e6) {
      stream.end();
    }
  }

  stream.on("drain", () => {
    writeStream();
  });

  stream.on("finish", async () => {
    console.timeEnd("stream-write-time");
    info();
    await file.close();
  });

  writeStream();
}

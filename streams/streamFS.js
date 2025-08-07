import fs from "node:fs/promises";
import { info } from "../helpers/info.js";

export async function streamFS(fileName = "./files/streamFS.txt") {
  console.time("streamFS-write-time");

  const file = await fs.open(fileName, "w");
  const stream = file.createWriteStream();

  for (let i = 0; i <= 1e6; i++) {
    const buff = Buffer.from(`line  ${i} \n`, "utf-8");
    stream.write(buff);
    // await file.write(buff);
  }

  await file.close();

  console.timeEnd("streamFS-write-time");
  info();
}

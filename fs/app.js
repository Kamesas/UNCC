import fs from "node:fs/promises";
import {
  createFile,
  deleteFile,
  renameFile,
  addToFile,
} from "./fileActions.js";

(async (fileName) => {
  const file = await fs.open(fileName, "r");

  file.on("change", async () => {
    const stat = await file?.stat();
    const size = stat?.size;
    const buff = Buffer.alloc(stat?.size);

    const content = buff?.toString("utf-8");
    await file?.read(buff, 0, size, 0);
    console.log("content -->", content);

    createFile({ content });
    deleteFile({ content });
    renameFile({ content });
    addToFile({ content });
  });

  const watcher = fs.watch(fileName);
  for await (const event of watcher) {
    if (event?.eventType === "change") {
      file?.emit("change");
    }
  }
})("./command.txt");

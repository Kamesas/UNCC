import fs from "node:fs/promises";

(async (fileName) => {
  const file = await fs.open(fileName, "r");
  const watcher = fs.watch(fileName);

  file.on("change", async () => {
    const stat = await file?.stat();
    const size = stat?.size;
    const buff = Buffer.alloc(stat?.size);

    const content = await file?.read(buff, 0, size, 0);

    console.log("content -->", content?.buffer?.toString("utf-8"));
  });

  for await (const event of watcher) {
    if (event?.eventType === "change") {
      file?.emit("change");
    }
  }
})("./command.txt");

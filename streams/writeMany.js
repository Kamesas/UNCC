// import fs from "node:fs/promises";
import fsSync from "node:fs";

function syncWriteFile(fileName) {
  console.time("actual-time");
  const file = fsSync.openSync(fileName, "w");
  console.log("file", file);

  let i = 0;
  while (i <= 1e6) {
    i++;

    fsSync.writeSync(file, `line ${i} \n`);
  }

  fsSync.closeSync(file);
  console.timeEnd("actual-time");
  console.log("Performance.now()", performance.now()?.toFixed(2), "ms");
  // actual-time: 1.898s
  // Performance.now() 1928.21 ms
}

syncWriteFile("sync.txt");

// async function writeFile(fileName) {
//   const file = await fs.open(fileName, "w");

//   for (let i = 0; i <= 1e6; i++) {
//     await file.write(`line: ${i} \n`);
//   }

//   await file.close();
// }

// async function main() {
//   console.time("actual-write-time");
//   console.log("Starting file write...");

//   await writeFile("test.txt");

//   console.log("✅ File write finished.");
//   console.timeEnd("actual-write-time");
//   console.log("Performance.now():", performance.now().toFixed(2), "ms");
// }
// // actual-write-time: 36.442s
// // Performance.now(): 36471.47 ms

// console.log("main thread");

// main();

#!/usr/bin/env node
import commands from "./src/commands.ts";

// const note = process.argv[2];
commands();

const waite = (time: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

console.log("yup");

(async () => {
  await waite(1000);
  console.log("finish");
  await waite(5000);
  console.log("finish 2");
})();

console.log("yup 2");

import { nextTick } from "process";
import { asyncWrite } from "./asyncWrite.js";
import { callbackWrite } from "./callbackWrite.js";

// asyncWrite();
// actual-write-time: 33.670s
// Performance.now(): 33697.79 ms

callbackWrite();
setImmediate(() => {
  console.log("setImmediate");
});

setTimeout(() => {
  console.log("timeout");
}, 10);

nextTick(() => {
  console.log("nextTick");
});

console.log("finish");

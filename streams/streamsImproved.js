// streams/streamsImproved.js
// Improvements over streams/stream.js:
// - Exact line count: write exactly `totalLines` (fixes off-by-one from <= 1e6).
// - Batched writes: build chunks of many lines per write to reduce syscalls
//   and Buffer allocations (faster and lower CPU).
// - Tuned buffering: larger `highWaterMark` (default 1 MB) reduces backpressure stalls.
// - Proper backpressure handling: writes pause on false and resume on 'drain'.
// - Robust completion: await 'finish' and surface 'error' so the function resolves
//   when work is truly done.
// - Cleaner structure and comments explaining how it all works.

import { createWriteStream } from "node:fs";
import { once } from "node:events";
import { info } from "../helpers/info.js";

/**
 * Stream out many lines to a file efficiently.
 *
 * @param {string} fileName - Output path (default mirrors original).
 * @param {number} totalLines - How many lines to write.
 * @param {number} batchSize - How many lines to combine per write.
 * @param {number} highWaterMark - Internal buffer size for the write stream.
 *
 * Notes on performance:
 * - Writing in batches drastically reduces the number of `.write()` calls.
 * - A higher `highWaterMark` means the stream can buffer more before applying
 *   backpressure, which often improves throughput for large, sequential writes.
 */
export async function streamImproved(
  fileName = "./files/stream.txt",
  totalLines = 1e6,
  batchSize = 1000,
  highWaterMark = 1024 * 1024 // 1 MB
  // You can tune batchSize and highWaterMark for your machine/workload.
  // Larger values usually mean fewer syscalls and better throughput,
  // at the cost of a bit more memory within reasonable limits.
) {
  console.time("stream-write-time");

  // Create a regular fs.WriteStream directly (simpler, no separate handle).
  const stream = createWriteStream(fileName, {
    flags: "w",
    highWaterMark,
  });

  let i = 0;

  // Build a string chunk with up to `batchSize` lines.
  // Using an array + join avoids creating many intermediary strings.
  function buildChunk() {
    const lines = [];
    let count = 0;
    while (i < totalLines && count < batchSize) {
      // Preserve original line shape: "line  ${i} \n" (two spaces after 'line')
      lines.push(`line  ${i} \n`);
      i++;
      count++;
    }
    return lines.join("");
  }

  // Attempt to write chunks until backpressure is signaled.
  function writeUntilBackpressure() {
    let canContinue = true;
    while (i < totalLines && canContinue) {
      const chunk = buildChunk();
      // Pass a string to avoid an explicit Buffer.from per line.
      canContinue = stream.write(chunk, "utf8");
    }

    // If we've produced all lines, end the stream to flush and emit 'finish'.
    if (i >= totalLines) {
      stream.end();
    }
  }

  // Backpressure: when internal buffer drains, resume writing.
  stream.on("drain", writeUntilBackpressure);

  // Start pumping data immediately.
  writeUntilBackpressure();

  // Wait for completion or surface any error as a rejected promise.
  try {
    await Promise.race([
      once(stream, "finish"),
      once(stream, "error").then(([err]) => Promise.reject(err)),
    ]);
  } finally {
    // Measure and show memory/cpu info similarly to the original.
    console.timeEnd("stream-write-time");
    info();
  }
}

// Optional default export if you prefer `import streamImproved from ...`
export default streamImproved;


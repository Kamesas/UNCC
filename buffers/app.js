const { Buffer } = require("node:buffer");

const memoryContainer = Buffer.alloc(4);

// This line is no longer needed if your goal is just to modify the buffer.
// let bite = memoryContainer[0];

console.log("Initial memoryContainer:", memoryContainer);
//> Initial memoryContainer: <Buffer 00 00 00 00>

// Correct way to modify the buffer:
// Assign the new value directly to the desired index.
memoryContainer[0] = 0xf4;

console.log("Modified memoryContainer:", memoryContainer);
//> Modified memoryContainer: <Buffer f4 00 00 00>

const challenge = Buffer.alloc(3);

challenge[0] = 0x48;
challenge[1] = 0x69;
challenge[2] = 0x21;

console.log("challenge", challenge);
console.log("challenge formatted", challenge.toString("utf-8"));

const char = Buffer.from("E299A5", "hex");
console.log("char --->", char);
console.log("char decoded --->", char.toString("utf8"));

console.log(20 << 1);

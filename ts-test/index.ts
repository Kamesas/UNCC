// node --experimental-transform-types another-example.ts

function test(num: number) {
  console.log("num --->", num);
  console.log("proccess --->", process);
  return num;
}

test(3);

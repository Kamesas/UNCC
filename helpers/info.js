export function info(msg = "Performance.now():") {
  console.log(msg, performance.now().toFixed(2), "ms");
}

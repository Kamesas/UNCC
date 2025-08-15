export function searchBooks({ req, res }: Http) {
  const url = new URL(req.url || "", "http://localhost");
  const query = url.searchParams.get("q") || "";

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.end(
    JSON.stringify({
      message: `Searching books with query: "${query}"`,
      results: [],
    })
  );
}

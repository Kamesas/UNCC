export function withErrorHandler(callback: (http: Http) => Promise<void>) {
  return async (http: Http) => {
    try {
      await callback(http);
    } catch (error) {
      console.error("\x1b[31m\x1b[1mwithErrorHandler error --->\x1b[0m", error);

      http.res.statusCode = 500;
      http.res.setHeader("Content-Type", "application/json");
      http.res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
  };
}

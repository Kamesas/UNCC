import { sendResponse } from "./httpHelpers.js";

export async function errorHandler(
  http: Http,
  callback: (http: Http) => Promise<void>
) {
  try {
    await callback(http);
  } catch (error) {
    console.error("error", error);
    sendResponse(http.res, 500, { message: "Internal Server Error" });
  }
}

export function withErrorHandler(callback: (http: Http) => Promise<void>) {
  return async (http: Http) => {
    try {
      await callback(http);
    } catch (error) {
      console.error("error", error);
      sendResponse(http.res, 500, { message: "Internal Server Error" });
    }
  };
}

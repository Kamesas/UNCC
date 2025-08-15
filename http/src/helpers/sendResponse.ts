export function sendResponse<T>({
  res,
  status,
  data,
  contentType = "application/json",
}: {
  res: Http["res"];
  status: number;
  data: T;
  contentType?: string;
}) {
  res.statusCode = status;
  res.setHeader("Content-Type", contentType);

  if (contentType === "application/json") {
    res.end(JSON.stringify(data));
  } else {
    res.end(data as any);
  }
}

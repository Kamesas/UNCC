import { buffer } from "stream/consumers";

export async function parseJsonBody<T = unknown>(
  req: NodeJS.ReadableStream
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const bodyBuffer = await buffer(req);
    const bodyString = bodyBuffer.toString();

    if (!bodyString) {
      return { success: false, error: "Empty body" };
    }

    return { success: true, data: JSON.parse(bodyString) as T };
  } catch {
    return { success: false, error: "Invalid JSON" };
  }
}

export function sendResponse<T>(
  res: Http["res"],
  status: number,
  data: T,
  opt?: {
    contentType?: string;
  }
) {
  const contentType = opt?.contentType || "application/json";

  res.statusCode = status;
  res.setHeader("Content-Type", contentType);

  if (contentType === "application/json") {
    res.end(JSON.stringify(data));
  } else {
    res.end(data as any);
  }
}

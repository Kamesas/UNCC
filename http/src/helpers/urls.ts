export function extractParamsFromUrl<T>(url: string, path: string): T {
  const urlParts = url.split("/");
  const pathParts = path.split("/");

  return pathParts.reduce<Record<string, string>>((acc, part, i) => {
    if (part.startsWith(":") && urlParts[i]) {
      acc[part.slice(1)] = urlParts[i];
    }
    return acc;
  }, {}) as T;
}

const BACKEND_SERVER = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(
  "/api",
  ""
);

export function resolveImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BACKEND_SERVER}${path}`;
}

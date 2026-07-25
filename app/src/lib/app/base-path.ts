export const normalizeServerBasePath = (value: string | undefined) => {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "/") return "";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
};

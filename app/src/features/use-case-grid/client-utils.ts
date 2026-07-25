export const fileToBase64 = async (file: File) => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
};

export const track = (event: string, detail: Record<string, string | number> = {}) => {
  if (import.meta.env.DEV || typeof navigator === "undefined") return;
  const body = JSON.stringify({ event, detail, occurredAt: new Date().toISOString() });
  navigator.sendBeacon?.("/api/events", new Blob([body], { type: "application/json" }));
};

export const postJson = async <T>(
  url: string,
  input: unknown,
): Promise<{ ok: true; data: T } | { ok: false; error: string }> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    const result = await response.json() as
      | { ok: true; data: T }
      | { ok: false; error: string };
    if (!response.ok && result.ok) {
      return { ok: false, error: `Request failed with status ${response.status}.` };
    }
    return result;
  } catch {
    return {
      ok: false,
      error: "The request could not be completed. Check your connection and try again.",
    };
  }
};

import type { UseCase } from "./domain";

export const savedIdeasKey = "ai-use-case-grid:saved-ideas";

export const fileToBase64 = async (file: File) => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
};

export const loadSavedIdeas = () => {
  const stored = localStorage.getItem(savedIdeasKey);
  if (!stored) return [];
  const parsed: unknown = JSON.parse(stored);
  return Array.isArray(parsed) ? (parsed as UseCase[]).slice(0, 30) : [];
};

export const storeSavedIdeas = (ideas: UseCase[]) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(savedIdeasKey, JSON.stringify(ideas));
  }
};

export const track = (event: string, detail: Record<string, string | number> = {}) => {
  if (typeof navigator === "undefined") return;
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
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    return await response.json() as { ok: true; data: T } | { ok: false; error: string };
  } catch {
    return { ok: false, error: "The AI request could not be completed. Your profile was not saved. Please try again." };
  }
};

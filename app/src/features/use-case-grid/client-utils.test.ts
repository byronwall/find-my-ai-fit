import { describe, expect, it, vi } from "vitest";
import { deliverAnalyticsEvent } from "./client-utils";

describe("deliverAnalyticsEvent", () => {
  it("does not send analytics during development", () => {
    const fetch = vi.fn();
    const sendBeacon = vi.fn();

    deliverAnalyticsEvent("suggestion_selected", { id: "example" }, {
      development: true,
      fetch,
      navigator: { sendBeacon },
    });

    expect(fetch).not.toHaveBeenCalled();
    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it("uses a keepalive request for production events", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const sendBeacon = vi.fn();

    deliverAnalyticsEvent("brief_generated", { selected: 2 }, {
      development: false,
      fetch,
      navigator: { sendBeacon },
    });
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledOnce());

    expect(fetch).toHaveBeenCalledWith(
      "/api/usage",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
        keepalive: true,
      }),
    );
    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it("falls back to a beacon when the request is blocked", async () => {
    const fetch = vi.fn().mockRejectedValue(new Error("blocked"));
    const sendBeacon = vi.fn().mockReturnValue(true);

    deliverAnalyticsEvent("grid_generated", { ideas: 9 }, {
      development: false,
      fetch,
      navigator: { sendBeacon },
    });
    await vi.waitFor(() => expect(sendBeacon).toHaveBeenCalledOnce());

    expect(sendBeacon).toHaveBeenCalledWith("/api/usage", expect.any(Blob));
  });
});

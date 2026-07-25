import { afterEach, describe, expect, it, vi } from "vitest";
import { track } from "./client-utils";

describe("track", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not send analytics beacons during development", () => {
    const sendBeacon = vi.fn();
    vi.stubGlobal("navigator", { sendBeacon });

    track("suggestion_selected", { id: "example" });

    expect(sendBeacon).not.toHaveBeenCalled();
  });
});

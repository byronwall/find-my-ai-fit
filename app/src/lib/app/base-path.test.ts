import { describe, expect, it } from "vitest";
import { normalizeServerBasePath } from "./base-path";

describe("normalizeServerBasePath", () => {
  it.each([undefined, "", " ", "/"])(
    "uses an empty server base for a root deployment (%s)",
    (value) => {
      expect(normalizeServerBasePath(value)).toBe("");
    },
  );

  it.each([
    ["tools", "/tools"],
    ["/tools", "/tools"],
    ["tools/", "/tools"],
    ["/tools/", "/tools"],
  ])("normalizes a deployment subpath (%s)", (value, expected) => {
    expect(normalizeServerBasePath(value)).toBe(expected);
  });
});

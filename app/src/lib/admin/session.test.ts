import { afterEach, describe, expect, it } from "vitest";
import {
  createAdminSessionToken,
  verifyAdminPassword,
  verifyAdminSessionToken,
} from "./session";

const originalPassword = process.env.ADMIN_PASSWORD;

afterEach(() => {
  if (originalPassword === undefined) delete process.env.ADMIN_PASSWORD;
  else process.env.ADMIN_PASSWORD = originalPassword;
});

describe("admin session", () => {
  it("accepts only the configured password", () => {
    process.env.ADMIN_PASSWORD = "correct horse battery staple";
    expect(verifyAdminPassword("correct horse battery staple")).toBe(true);
    expect(verifyAdminPassword("incorrect")).toBe(false);
  });

  it("issues a signed token that changes when the password rotates", () => {
    process.env.ADMIN_PASSWORD = "first secret";
    const token = createAdminSessionToken();
    expect(verifyAdminSessionToken(token)).toBe(true);
    process.env.ADMIN_PASSWORD = "second secret";
    expect(verifyAdminSessionToken(token)).toBe(false);
  });

  it("rejects malformed tokens", () => {
    process.env.ADMIN_PASSWORD = "configured";
    expect(verifyAdminSessionToken("v1.invalid.value.signature")).toBe(false);
    expect(verifyAdminSessionToken(undefined)).toBe(false);
  });
});

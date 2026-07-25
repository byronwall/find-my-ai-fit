import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { isConfiguredAppBaseUrlSecure } from "~/lib/app/base-url";
import { parseCookies } from "~/lib/account/session";

export const ADMIN_SESSION_COOKIE = "find_my_ai_fit_admin";

const sessionLifetimeSeconds = 60 * 60 * 24 * 30;
const tokenVersion = "v1";

const getAdminPassword = () => process.env.ADMIN_PASSWORD?.trim() ?? "";

const digest = (value: string) =>
  createHmac("sha256", "find-my-ai-fit-admin-password-check").update(value).digest();

const sign = (value: string, password: string) =>
  createHmac("sha256", password).update(value).digest("base64url");

const constantTimeEqual = (left: string, right: string) =>
  timingSafeEqual(digest(left), digest(right));

export const isAdminPasswordConfigured = () => getAdminPassword().length > 0;

export const verifyAdminPassword = (candidate: string) => {
  const configured = getAdminPassword();
  return configured.length > 0 && constantTimeEqual(candidate, configured);
};

export const createAdminSessionToken = () => {
  const password = getAdminPassword();
  if (!password) throw new Error("ADMIN_PASSWORD is not configured.");
  const expiresAt = Math.floor(Date.now() / 1000) + sessionLifetimeSeconds;
  const payload = `${tokenVersion}.${expiresAt}.${randomBytes(18).toString("base64url")}`;
  return `${payload}.${sign(payload, password)}`;
};

export const verifyAdminSessionToken = (token: string | undefined) => {
  if (!token) return false;
  const password = getAdminPassword();
  if (!password) return false;
  const parts = token.split(".");
  if (parts.length !== 4) return false;
  const [version, rawExpiresAt, nonce, signature] = parts;
  const expiresAt = Number(rawExpiresAt);
  if (
    version !== tokenVersion ||
    !nonce ||
    !signature ||
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= Math.floor(Date.now() / 1000)
  ) {
    return false;
  }
  const payload = `${version}.${rawExpiresAt}.${nonce}`;
  return constantTimeEqual(signature, sign(payload, password));
};

export const hasValidAdminSession = (request: Request) =>
  verifyAdminSessionToken(
    parseCookies(request.headers.get("cookie")).get(ADMIN_SESSION_COOKIE),
  );

const cookieSecurityParts = () =>
  isConfiguredAppBaseUrlSecure() ? ["Secure"] : [];

export const createAdminSessionCookie = () =>
  [
    `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(createAdminSessionToken())}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${sessionLifetimeSeconds}`,
    ...cookieSecurityParts(),
  ].join("; ");

export const clearAdminSessionCookie = () =>
  [
    `${ADMIN_SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0",
    ...cookieSecurityParts(),
  ].join("; ");

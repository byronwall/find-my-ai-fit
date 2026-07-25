import { POST as postAnalyticsEvent } from "./events";

export const POST: typeof postAnalyticsEvent = (event) =>
  postAnalyticsEvent(event);

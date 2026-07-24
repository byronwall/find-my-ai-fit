import { Link, Meta, Title } from "@solidjs/meta";
import { getRequestEvent } from "solid-js/web";
import { UseCaseGridApp } from "~/features/use-case-grid/UseCaseGridApp";
import { UseCaseGridProvider } from "~/features/use-case-grid/context";

export default function HomeRoute() {
  const requestUrl = getRequestEvent()?.request.url;
  const origin = requestUrl
    ? new URL(requestUrl).origin
    : typeof window !== "undefined"
      ? window.location.origin
      : "https://findmyaifit.com";
  const canonicalUrl = `${origin}/`;
  const socialImage = `${origin}/og.png?v=20260724`;
  const title = "Find My AI Fit — Practical AI ideas for your work";
  const description =
    "Turn your experience into a tailored map of practical AI opportunities, then leave with one useful next step.";

  return (
    <>
      <Title>{title}</Title>
      <Link rel="canonical" href={canonicalUrl} />
      <Meta name="description" content={description} />
      <Meta property="og:site_name" content="Find My AI Fit" />
      <Meta property="og:title" content="Find My AI Fit" />
      <Meta property="og:description" content={description} />
      <Meta property="og:type" content="website" />
      <Meta property="og:url" content={canonicalUrl} />
      <Meta property="og:image" content={socialImage} />
      <Meta property="og:image:type" content="image/png" />
      <Meta property="og:image:width" content="1200" />
      <Meta property="og:image:height" content="630" />
      <Meta
        property="og:image:alt"
        content="Find My AI Fit turns your experience into a tailored 3 by 3 map of practical AI opportunities."
      />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content="Find My AI Fit" />
      <Meta name="twitter:description" content={description} />
      <Meta name="twitter:image" content={socialImage} />
      <Meta
        name="twitter:image:alt"
        content="Find My AI Fit turns your experience into a tailored 3 by 3 map of practical AI opportunities."
      />
      <UseCaseGridProvider>
        <UseCaseGridApp />
      </UseCaseGridProvider>
    </>
  );
}

import { Meta, Title } from "@solidjs/meta";
import { getRequestEvent } from "solid-js/web";
import { UseCaseGridApp } from "~/features/use-case-grid/UseCaseGridApp";
import { UseCaseGridProvider } from "~/features/use-case-grid/context";

export default function HomeRoute() {
  const requestUrl = getRequestEvent()?.request.url;
  const origin = requestUrl
    ? new URL(requestUrl).origin
    : typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";
  const socialImage = `${origin}/og.png`;

  return (
    <>
      <Title>Find My AI Fit — Find practical AI opportunities in your work</Title>
      <Meta
        name="description"
        content="Upload your LinkedIn profile (or any other resume) and get a structured map of practical AI use cases tailored to your role and goals."
      />
      <Meta property="og:title" content="Find My AI Fit" />
      <Meta property="og:description" content="Find the practical AI opportunities hiding in your work." />
      <Meta property="og:type" content="website" />
      <Meta property="og:image" content={socialImage} />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:image" content={socialImage} />
      <UseCaseGridProvider>
        <UseCaseGridApp />
      </UseCaseGridProvider>
    </>
  );
}

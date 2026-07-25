import { Meta, Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import {
  createEffect,
  createResource,
  onCleanup,
  onMount,
  Show,
  Suspense,
} from "solid-js";
import { Box, Container, Stack } from "styled-system/jsx";
import { Heading, Text } from "~/components/ui";
import { UseCaseGridApp } from "./UseCaseGridApp";
import { UseCaseGridProvider } from "./context";
import { getUseCaseSession } from "./session-data";
import type { SessionRouteView } from "./session-domain";

type SessionWorkflowRouteProps = {
  sessionId: string;
  view: SessionRouteView;
  roundId?: string;
};

const routeTitles: Record<SessionRouteView, string> = {
  review: "Review your profile — Find My AI Fit",
  ideas: "Your AI opportunity map — Find My AI Fit",
  brief: "Your practical AI plan — Find My AI Fit",
};

export function SessionWorkflowRoute(props: SessionWorkflowRouteProps) {
  const [session, { refetch }] = createResource(() =>
    getUseCaseSession(props.sessionId),
  );

  onMount(() => {
    createEffect(() => {
      if (!session.latest?.pending) return;
      const interval = window.setInterval(() => {
        void refetch();
      }, 1200);
      onCleanup(() => window.clearInterval(interval));
    });
  });

  return (
    <>
      <Title>{routeTitles[props.view]}</Title>
      <Meta name="robots" content="noindex,nofollow" />
      <Suspense fallback={<Box p="8">Loading your saved session…</Box>}>
        <Show
          when={session.latest}
          fallback={
            <Show when={!session.loading}>
              <Container maxW="3xl" py="16">
                <Stack gap="3">
                  <Heading as="h1" textStyle="3xl">Session not found</Heading>
                  <Text color="fg.muted">
                    This saved session does not exist or is no longer available.
                  </Text>
                  <A href="/">Start a new AI fit session</A>
                </Stack>
              </Container>
            </Show>
          }
        >
          {(savedSession) => (
            <UseCaseGridProvider
              session={savedSession()}
              sessionView={props.view}
              routeRoundId={props.roundId}
            >
              <UseCaseGridApp />
            </UseCaseGridProvider>
          )}
        </Show>
      </Suspense>
    </>
  );
}

/*
 * THESIS: A usage desk organized around the traffic timeline and event ledger,
 * refusing a decorative grid of disconnected metric cards.
 * OWN-WORLD: Cool paper canvas, white ruled panels, visible borders, electric
 * periwinkle actions, and one citrus admin signal.
 * STORY: The owner authenticates once, scans reach and reliability, then traces
 * specific behavior through captured events, paths, and visitors.
 * FIRST VIEWPORT: Compact identity/actions, period switcher, one metric strip,
 * then a wide dual-line activity plot.
 * FORM: Event-led operations desk, combining the strongest timeline and ledger
 * structures from the composition study; surface seed 25806588.
 */
import { Title } from "@solidjs/meta";
import { createResource, Show, Suspense } from "solid-js";
import { Box, Container, Stack } from "styled-system/jsx";
import { Button, Heading, Spinner, Text } from "~/components/ui";
import { AdminLogin } from "~/features/admin-analytics/AdminLogin";
import { AnalyticsDashboard } from "~/features/admin-analytics/AnalyticsDashboard";
import { getAdminDashboard } from "~/features/admin-analytics/data";

function AdminLoadState(props: { error?: boolean }) {
  return (
    <Box minH="100vh" bg="brand.canvas" color="brand.ink" display="grid" placeItems="center">
      <Container maxW="md" width="full" py="12">
        <Stack
          gap="4"
          bg="brand.panel"
          borderWidth="1px"
          borderColor="brand.border"
          borderRadius="l3"
          p="7"
          boxShadow="4px 4px 0 token(colors.brand.sageStrong)"
        >
          {props.error ? null : <Spinner size="lg" />}
          <Heading as="h1" textStyle="xl">
            {props.error ? "Usage desk could not load" : "Opening usage desk…"}
          </Heading>
          <Text color="brand.muted">
            {props.error
              ? "The analytics snapshot was unavailable. Nothing was changed."
              : "Checking the admin session and preparing the latest analytics."}
          </Text>
          {props.error ? (
            <Button alignSelf="start" onClick={() => window.location.reload()}>
              Try again
            </Button>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}

export default function AdminRoute() {
  const [dashboard] = createResource(() => getAdminDashboard());

  return (
    <>
      <Title>Usage desk — Admin</Title>
      <Suspense fallback={<AdminLoadState />}>
        <Show
          when={!dashboard.error}
          fallback={<AdminLoadState error />}
        >
          <Show when={dashboard.latest}>
            {(result) => (
              <Show
                when={result().status === "authenticated" ? result() : undefined}
                fallback={
                  <AdminLogin
                    configured={
                      result().status === "signed-out" ? result().configured : true
                    }
                  />
                }
              >
                {(authenticated) => (
                  authenticated().status === "authenticated"
                    ? <AnalyticsDashboard snapshot={authenticated().snapshot} />
                    : null
                )}
              </Show>
            )}
          </Show>
        </Show>
      </Suspense>
    </>
  );
}
